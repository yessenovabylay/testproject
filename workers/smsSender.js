const { SmsCommandContext } = require("twilio/lib/rest/supersim/v1/smsCommand");
const { workerData, parentPort } = require("worker_threads");
const { booking } = require("../prisma");
const prisma = require("../prisma");
const send = require("../utils/sms");

async function sms () {
    let morning = new Date(Date.now() + (24 * 60 * 60 * 1000));
    morning.setHours(6,1,0)
    let night = new Date(Date.now() + (24 * 60 * 60 * 1000));
    night.setHours(29,59,0)
    console.log({morning, night})
    const findByExp = await prisma.booking.findMany({
        where: {
            return_date: null,
            expiration_date: {
                gte: morning,
                lte: night
            }
        }, include: {
            User: true,
            Book: true,
        },
        orderBy: {
            userId: "desc"
        }
    });
    for(let i = 0; i < findByExp.length; i++) {
            try {
                send(`Здравствуйте, вы должны вернуть книгу ${findByExp[i].Book.title}`, findByExp[i].User.phoneNumber);
            }
            catch (e) {
                console.warn(e)
                          parentPort.postMessage(`ERROR, ${findByExp[i].expiration_date}`);
            }
          parentPort.postMessage(`Message sended ${findByExp[i].User.phoneNumber} ${findByExp[i].expiration_date}`);
        }

            
  }
sms();
setInterval(sms, 24 * 60 * 60 * 1000);
