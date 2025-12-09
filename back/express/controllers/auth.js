import db from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const SECRET_KEY = process.env.SECRET_KEY
const COOKIE_EXPIRATION = '100 days'

export async function signUp(req, res) {
    const { username, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    await db.query(db.users.createOne, [
        username,
        hashedPassword
    ])

    const result = await db.query(db.users.getIdByName, [username])
    const newUserId = result.rows[0].id
    const token = jwt.sign({ userId: newUserId, username: username }, SECRET_KEY, { expiresIn: COOKIE_EXPIRATION })
    res.json(token)
}

export async function logIn(req, res) {
    const { username, password } = req.body
    const result = await db.query(db.users.getOneByName, [username])
    if (!result.rowCount) {
        res.status(401).send('name or password are incorrect')
    } else {
        const id = result.rows[0].id
        const success = await bcrypt.compare(password, result.rows[0].password)
        if (success) {
            const token = jwt.sign({ userId: id, username: username }, SECRET_KEY, { expiresIn: COOKIE_EXPIRATION })
            res.json(token)
        } else {
            res.status(401).send('name or password are incorrect')
        }
    }
}