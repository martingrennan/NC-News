const { getTopicsMod } = require('../models/topics.model')

exports.getTopicsCon = (req, res, next) => {
    getTopicsMod().then((topics) => {
        res.status(200).send({topics})
    })
    .catch((next))
}


