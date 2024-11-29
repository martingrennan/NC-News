const { getTopicsMod, postTopicsMod } = require('../models/topics.model')

exports.getTopicsCon = (req, res, next) => {
    getTopicsMod().then((topics) => {
        res.status(200).send({topics})
    })
    .catch((next))
}

exports.postTopicsCon = (req, res, next) => {
    const topic = req.body
    postTopicsMod(topic).then((topic) => {
        res.status(201).send({topic})
    })
    .catch((next))
}