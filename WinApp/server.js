const express = require('express')
const client = require('discord-rich-presence')('980347810123759617');
const expressApp = express()
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const { ipcRenderer } = require('electron')

let LastActivity = {
    name: null,
    epsAndSeason: null,
    title: null,
    onlyTitle: null
};
let timer = null;
expressApp.use(function (req, res, next) {
    express.json()
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

expressApp.post('/set', jsonParser, function (request, res) {
    try {
        const data = request.body;
        clearInterval(timer);
        timer = setInterval(() => {
            try {
                console.log("Reset");
                ipcRenderer.send('restart');
            } catch (e) { }
        }, 10000);
        if (data?.onlyTitle === true) {
            if (data?.title !== LastActivity?.title) {
                LastActivity = data;
                client.updatePresence({
                    state: data?.title.toString(),
                    startTimestamp: Date.now(),
                    largeImageKey: 'cin',
                    instance: false,
                });
            }
        } else {
            if (data?.name !== LastActivity?.name || data?.epsAndSeason !== LastActivity?.epsAndSeason) {
                let DATA = {
                    state: data?.name.toString(),
                    startTimestamp: Date.now(),
                    largeImageKey: 'cin',
                    instance: true,
                }
                if (data.epsAndSeason !== null) {
                    DATA.details = data.epsAndSeason.toString()
                }
                LastActivity = data;
                client.updatePresence(DATA);
            }
        }
        res.send({ status: "ok" })
    } catch (e) {
        res.status(400).json({ status: 'Invalid data' });
    }
})
expressApp.listen(2828)
