const mongoose = require("mongoose")

const RequestLogSchema = new mongoose.Schema({
    ip : String,
    timestamp : Date,
    reason : String,
});

module.exports = mongoose.model('RequestLog', RequestLogSchema);