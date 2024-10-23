const bcrypt = require('bcryptjs');


const generateBcrypt = (password) => {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}
const compareBcrypt = ( userPassword, dbPassword) => {
    return bcrypt.compareSync(userPassword, dbPassword)
}

module.exports = {
    generateBcrypt,
    compareBcrypt
}