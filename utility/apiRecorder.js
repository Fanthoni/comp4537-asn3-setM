const apiRecordModel = require("../schema/apiRecord")
const {getUserIdByToken} = require("../utility/auth")
const mongoose = require("mongoose")

const recordAPI = async (statusCode, req, res, next) => {

    if (typeof statusCode !== "number") {
        console.log(typeof statusCode, "statusCode here 3")
        return next(statusCode)
    }

    await mongoose.connect(process.env.DB_STRING)
    let apiRecord = {
        endpoint: req._parsedUrl.pathname,
        date: Date.now(),
        statusCode: statusCode
    }

    if (req.query.authToken) {
        const userId = await getUserIdByToken(req.query.authToken)
        apiRecord["userId"] = userId
    }

    // console.log('apiRecord', apiRecord)
    await apiRecordModel.create(apiRecord)   
}

module.exports = recordAPI