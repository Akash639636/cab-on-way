const jwt = require('jsonwebtoken');


const generateJWT = (data) => {
    return jwt.sign(data, process.env.SECRET_KEY)
}
const verifyJWT = token => {
    try {
        return  jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = { generateJWT, verifyJWT }