const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

module.exports.verifyJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) return res.sendStatus(401)

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(401)
        }
        req.userId = user.userId
        next()
    })
}