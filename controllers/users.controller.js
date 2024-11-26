const { getUsersMod } = require("../models/users.models")

exports.getUsersCon = (req, res, next) => {
    getUsersMod().then((users) => {
        res.status(200).send({users})
    })
    .catch((next))
}