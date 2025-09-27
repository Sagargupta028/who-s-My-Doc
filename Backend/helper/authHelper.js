const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassowrd = await bcrypt.hash(password, saltRounds);
        return hashedPassowrd;
    } catch (error) {
        console.log(error);
    }

}

const comparePassword = async (password, hashedPassowrd) => {
    return bcrypt.compare(password, hashedPassowrd);
}

module.exports = { hashPassword, comparePassword };