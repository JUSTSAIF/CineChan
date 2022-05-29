const express = require('express')
const client = require('discord-rich-presence')('980347810123759617');
const app = express()
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()


app.use(function (req, res, next) {
    express.json()
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});



app.post('/set', jsonParser, function (request, res) {
    const data = request.body;
    try {
        if (data?.onlyTitle === true) {
            client.updatePresence({
                state: data?.title.toString(),
                startTimestamp: Date.now(),
                largeImageKey: 'cin',
                instance: true,
            });
        } else {
            let DATA = {
                state: data?.name.toString(),
                startTimestamp: Date.now(),
                largeImageKey: 'cin',
                instance: true,
            }
            if (data.epsAndSeason !== null) {
                DATA.details = data.epsAndSeason.toString()
            }
            client.updatePresence();
        }
        res.send({ status: "ok" })
    } catch (e) {
        res.status(400).json({ status: 'Invalid data' });
    }
})

app.listen(2828)
