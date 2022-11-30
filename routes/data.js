const express = require("express");
const router = express.Router();
const user = require('../controllers/user').findUserMany
const {isAuth, isAdmin} = require('../middlewares/auth')
const Excel = require('exceljs');


router.get("/", async(req,res) => {
    // console.log(await user())
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("My Sheet");
  
  worksheet.columns = [
    {header: 'ID', key: 'id', width: 10},
    {header: 'Имя', key: 'firstname', width: 15}, 
    {header: 'Фамилия', key: 'lastname', width: 15,},
    {header: 'Отчество', key: 'fathername', width: 15,},
    {header: 'Телефон номер', key: 'phonenumber', width: 20,},
    {header: 'ИИН', key: 'iin', width: 20,},
    {header: 'Дата рождения', key: 'dr', width: 15,},
  ];
  
  const users = await user();

  for(let user of users){
    worksheet.addRow({id: user.id, firstname: user.firstName, lastname: user.lastName, fathername: user.fatherName, phonenumber: user.phoneNumber, iin: user.IIN, dr: user?.Anketa?.birthDay});
  }
  
//   // save under export.xlsx
//   await workbook.xlsx.writeFile('export.xlsx');
  
  res.attachment("otchet.xlsx")
  workbook.xlsx.write(res).then(()=>{
    res.end()
  })
  });



module.exports = router;