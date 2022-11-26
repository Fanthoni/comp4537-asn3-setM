const apiRecordModel = require("../schema/apiRecord")
const {getUserIdByToken} = require("../utility/auth")
const mongoose = require("mongoose")

const recordAPI = async (statusCode, req, res, next) => {
    if (typeof statusCode !== "number") {
        return next(statusCode)
    }

    await mongoose.connect(process.env.DB_STRING)
    let apiRecord = {
        endpoint: req._parsedUrl.pathname,
        date: Date.now(),
        statusCode: statusCode,
        method: req.method,
    }

    if (req.query.authToken) {
        const userId = await getUserIdByToken(req.query.authToken)
        apiRecord["userId"] = userId
    }

    await apiRecordModel.create(apiRecord)   
}

module.exports = recordAPI