const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'secret' // store it somewhere else

module.exports.signUp = async (req, res) => {
    const { username, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    try {
        await db.query(db.users.createOne, [
            username,
            hashedPassword
        ])

        const result = await db.query(db.users.getIdByName, [username])
        const newUserId = result.rows[0].id
        const token = jwt.sign({ userId: newUserId, username: username }, SECRET_KEY, { expiresIn: '360 days' })
        res.json(token)
    } catch (e) {
        if (e.code === '23505') {
            res.status(500).send('The name already exists :(')
        } else {
            console.log('error while sign up: ', e.code)
            res.status(500).send('something went wrong :(')
        }
    }
}

module.exports.logIn = async (req, res) => {
    const { username, password } = req.body
    try {
        const result = await db.query(db.users.getOneByName, [username])
        if (!result.rowCount) {
            res.status(401).send('name or password are incorrect')
        } else {
            const id = result.rows[0].id
            const success = await bcrypt.compare(password, result.rows[0].password)
            if (success) {
                const token = jwt.sign({ userId: id, username: username }, SECRET_KEY, { expiresIn: '360 days' })
                res.json(token)
            } else {
                res.status(401).send('name or password are incorrect')
            }
        }
    } catch (e) {
        console.log('error while log in: ', e.code)
        res.status(500).send('something went wrong :(')
    }

}