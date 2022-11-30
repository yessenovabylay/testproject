const { body } = require('express-validator');

const registerValidator = [
    body('phoneNumber', 'Неверный формат номера телефона').isLength({min:11, max:12}),
    body('password', 'Пароль должен быть минимум 8 символов').isLength({min:8}),
    body('firstName', 'Укажите имя').isLength({min:3}),
    body('lastName', 'Укажите фамилию').isLength({min:3}),
    body('fatherName', 'Укажите отчество').optional().isLength({min:3}),
    body('avatar', 'Неверная ссылка на аватарку').optional().isURL(),
    body('IIN', 'Укажите ИИН').isLength({min:12,max:12}),
];

const AnketaValidator = [
    body('address', "Укажите адрес").isLength({min:3,max:30}),
];


module.exports = { registerValidator };
