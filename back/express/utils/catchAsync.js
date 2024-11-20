module.exports = func => {
    return (req, res, next) => {
        func(req, res).catch(e => {
            console.error(e)
            res.status(e.status ? e.status : 500).send(e.status ? e.message : 'something went wrong : (')
            next(e)
        })
    }
}