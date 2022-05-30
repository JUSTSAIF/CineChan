const { app, Tray, Menu, nativeImage, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
let tray
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

app.whenReady().then(() => {
  // const mainWindow = new BrowserWindow({
  //   // width: 0,
  //   // height: 0,
  //   // autoHideMenuBar: true,
  //   // frame: false,
  //   // show: false,
  //   webPreferences: {
  //     nodeIntegration: true,
  //     contextIsolation: true,
  //     enableRemoteModule: true,
  //     preload: path.join(__dirname, 'server.js')
  //   }
  // })
  // mainWindow.loadFile('index.html')
  const icon = nativeImage.createFromPath(path.join(__dirname, 'logo.png'))
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Exit', click: () => app.quit() }
  ])
  tray.setToolTip('Cinemana')
  tray.setContextMenu(contextMenu)

  // start server
  const express = require('express')
  const client = require('discord-rich-presence')('980347810123759617');
  const expressApp = express()
  const bodyParser = require('body-parser');
  const jsonParser = bodyParser.json()

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
          app.relaunch();
          app.exit();
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
})

ipcMain.on("restart", function (event, data) {
  console.log("Restarting...");
  app.relaunch();
  app.exit();
});