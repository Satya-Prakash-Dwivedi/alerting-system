const express = require("express")
const nodemailer = require("nodemailer")
const RequestLog = require("../models/RequestLog")
require('dotenv').config

const router = express.Router()

const THRESHOLD = 5;
const TIME_WINDOW = 10 * 60 * 1000;
const failedRequests = {};

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL,
        pass : process.env.EMAIL_PASSWORD,
    },
});

router.post('/submit', async(req, res) => {
    const ip = req.ip;
    const now = Date.now();

    // Validate Headers (example validation)
    const token = req.headers['authorizatoin'];
    if (!token || token !== 'valid-token'){
        failedRequests[ip] = (failedRequests[ip] || []).filter((t) => now - t < TIME_WINDOW);
        failedRequests[ip].push(now);

        const log = new RequestLog({ip, timestamp: new Date(), reason: 'Invalid token'});
        await log.save();

        if(failedRequests[ip].length > THRESHOLD){
            await transporter.sendMail({
                from : process.env.mail,
                to : 'dwivedisp62@gmail.com',
                subject : 'Alert : Too many failed requests',
                text : `IP ${ip} has exceeded the threshold`,
            });
        }

        return res.status(400).json({error : "Invalid request"});

    }

    res.status(200).json({message : "success"});
});

router.get('/metrics', async(req, res) => {
    const logs = await RequestLog.find();
    res.json(logs);
})

module.exports = router;