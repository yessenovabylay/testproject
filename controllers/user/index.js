const config = require("../../config/config.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("../../cache-storage/redisClient")
const sms = require('../../utils/sms')
const methods = {
	registration: null,
	login: null, 
	findUser: null,
	verification: null,
	recend: null,
	vostonavlenie: null,
	findUserMany: null,
};
const prisma = require("../../prisma");

methods.verification = async function({code, userId}){
	const user = await prisma.user.findFirst({
		where: {
			id: BigInt(userId)
		}
	})
	let savedCode = await redis.get(user.phoneNumber)
	let attemps = parseInt(await redis.get(`attemps_${user.phoneNumber}`))
	console.log(savedCode)
	if(!user.phoneNumberConfirmation){
		if(attemps>=3) {
			redis.del(`attemps_${user.phoneNumber}`)
			redis.del(user.phoneNumber)
			redis.set(`time_${user.phoneNumber}`, "1", "EX", 60*10)
			throw new Error("To many attemps 3 try again")
		
		} 
		if(code!==savedCode){ 
			redis.set(`attemps_${user.phoneNumber}`, `${attemps+1}`)
			throw new Error("Code is not valid")}

		await prisma.user.update({
			where: {
				id: BigInt(userId)
			},
			data: {
				phoneNumberConfirmation: true
			}
		})
	}
	redis.del(user.phoneNumber)
	return true;
};

methods.recend = async function(userId){
	const user = await prisma.user.findFirst({
		where: {
			id: BigInt(userId)
		}
	})
	let recend = await redis.get(`time_${user.phoneNumber}`)

	if(!user.phoneNumberConfirmation){
		if(!recend) {
			send(user.phoneNumber);
			await redis.set(`time_${user.phoneNumber}`, "1", "EX", 60*10)
			
			return "Code sended"
	}
		throw new Error(`You can recend after ${parseInt(await redis.ttl(`time_${user.phoneNumber}`)/60)}min`)
	}throw new Error('You are already verified')
};

methods.registration = async function ({phoneNumber, firstName, lastName,fatherName, avatar, password, IIN,  role = "USER"}) {
	const user = await prisma.user.findFirst({
		where: {
			phoneNumber
		}
	});
	if (user) {
		throw new Error("User already exist");
	}
	password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
	const result = await prisma.User.create({
		data: {
			phoneNumber,firstName, lastName, fatherName, avatar, IIN,password, role
		}
	});
	const token = jwt.sign(JSON.parse(JSON.stringify({ id: result.id, role: result.role })), config.secret_key, { expiresIn: 86400 * 30 });
	jwt.verify(token, config.secret_key, function (err, data) {
		console.log(err, data);
	});
	result.password = null;

	send(phoneNumber);
	
	return { token, user: result };
};

methods.login = async function ({password, phoneNumber}) {
	const user = await prisma.User
		.findFirst({
			where: {
				phoneNumber: phoneNumber
			}
		});
	if (!user) {
		throw new Error("Authentication failed. User not found.");
	}
	
	
	const passwordIsValid = bcrypt.compareSync(
		password,
		user.password
	);
	if (passwordIsValid) {
		// if(!user.phoneNumberConfirmation){
		// 	try{
		// 	 await send(phoneNumber)
		// 	}catch(e){
		// 		throw e;
		// 	}
		// }
		const token = jwt.sign(JSON.parse(JSON.stringify({ id: user.id, role: user.role })), config.secret_key, { expiresIn: 86400 * 30 });
		jwt.verify(token, config.secret_key, function (err, data) {
			console.log(err, data);
		});
		user.password = null;
		return { token, user };
	} else {
		throw new Error("Authentication failed. Wrong password.");
	}
};

methods.findUser = async function({ firstName, lastName, IIN }) {
	const user = await prisma.user.findFirst({
		where: {
			firstName: firstName,
			lastName: lastName,
			IIN: IIN
		},
		include: {
			Booking: true,
			Comment: true,
			Response: true,
			Anketa: true
		}
	})

	return user;
}

methods.vostonavlenie = async function(phoneNumber){
	const user = await prisma.user.findUnique({
		where:{
			phoneNumber: phoneNumber
		}
	})
	if(user) {
	}
	else{
		throw new Error("Phone Number is not found!")
}



};

methods.findUserMany = async function(){
	const users = await prisma.user.findMany({
		include: {
			Anketa: true,
		}
	})
	return users;
}

async function send(phoneNumber){
		if(await redis.get(phoneNumber)){
			throw new Error("Code already sent")
		}
		const code = Math.floor(1000 + Math.random() * 9000);
		console.log(code); 
		redis.set(phoneNumber, code, "EX", 1800)
		redis.set(`attemps_${phoneNumber}`, "0", "EX", 1800)
		sms(`Your code for verification is ${code}`, phoneNumber)
}

module.exports = methods;
