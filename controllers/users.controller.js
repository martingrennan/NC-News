const { getUsersMod, getUserByUsernameMod } = require("../models/users.models")

exports.getUsersCon = (req, res, next) => {
    getUsersMod().then((users) => {
        res.status(200).send({users})
    })
    .catch((next))
}

exports.getUserByUsernameCon = (req, res, next) => {
    const {username} = req.params
    getUserByUsernameMod(username).then((user) => {
        res.status(200).send({user})
    })
    .catch((next))
}