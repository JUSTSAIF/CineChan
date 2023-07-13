process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const {
  app,
  Tray,
  Menu,
  nativeImage,
  BrowserWindow,
  ipcMain,
  dialog,
  globalShortcut
} = require('electron')
const path = require('path')
const axios = require('axios');
const express = require('express')
const DiscordRPC = require('discord-rpc');
const bodyParser = require('body-parser');
const { DownloaderHelper } = require('node-downloader-helper');

const clientId = '980347810123759617'
let RPC;
const gotTheLock = app.requestSingleInstanceLock()
const jsonParser = bodyParser.json()
const expressApp = express()
let lastRequestTime = Date.now();
let tray
let DownloadWindows = {};
let DownloaderFiles = {};
let LastActivity = {
  name: null,
  epsAndSeason: null,
  title: null,
  onlyTitle: null,
  startTimestamp: null
};
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

const updatePresence = presenceData => RPC.setActivity(presenceData).catch(console.error);
const clearPresence = () => {
  RPC.clearActivity().catch(console.error)
  LastActivity = {
    name: null,
    epsAndSeason: null,
    title: null,
    onlyTitle: null,
    startTimestamp: null
  };
};
const connectToDiscordRPC = () => {
  DiscordRPC.register(clientId);
  RPC = new DiscordRPC.Client({ transport: 'ipc' });

  RPC.on('ready', () => {
    console.log('Discord RPC client is ready!');
  });

  RPC.on('disconnected', (err) => {
    console.warn('- Discord RPC client disconnected');
    setTimeout(connectToDiscordRPC, 10000);
  });


  RPC.login({ clientId })
    .catch(() => {
      console.log('Failed to connect to Discord RPC');
      setTimeout(connectToDiscordRPC, 10000);
      RPC.clearActivity().catch(() => { });
      Object.keys(LastActivity).forEach(key => LastActivity[key] = null);
    });
}

const HttpReq = (url, callback = () => { }) => {
  return axios.get(url, {}, { headers: { "Content-Type": "application/json" } })
    .then(response => {
      const responseData = response.data;
      callback(responseData);
      return responseData;
    })
    .catch(error => {
      console.error(error);
    });
}

const GetSavePath = () => {
  const options = { properties: ['openDirectory'] };
  const result = dialog.showOpenDialogSync(options);
  return result && result.length > 0 ? result[0] : null
}

function VidownloadWin() {
  const VID_WIN = new BrowserWindow({
    width: 605,
    height: 390,
    backgroundColor: '#000000',
    resizable: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets/icons/logo.png'),
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
    },
  });

  VID_WIN.loadFile(path.join(__dirname, 'vidownload.html'));

  VID_WIN.on('close', function (evt) {
    evt.preventDefault();
    VID_WIN.hide();
  });

  VID_WIN.once('show', () => {
    // Show Win on Top Once When Call Show action
    VID_WIN.setAlwaysOnTop(true);
    VID_WIN.setAlwaysOnTop(false);
  });

  // VID_WIN.webContents.openDevTools();
  VID_WIN.removeMenu();
  return VID_WIN
}


if (!gotTheLock) {
  app.quit()
} else {
  app.whenReady().then(() => {
    // Disable reload shortcuts
    globalShortcut.register('F5', () => { });
    globalShortcut.register('CommandOrControl+R', () => { });

    // Connect to Discord RPC
    connectToDiscordRPC();

    // Add Menu Tray buttons & Icon ... 
    const icon = nativeImage.createFromPath(path.join(__dirname, 'assets/icons/logo.png'))
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([{ label: 'Exit', click: () => app.exit() }])
    tray.setToolTip('CineChan')
    tray.setContextMenu(contextMenu)

    // Start :: Express App
    expressApp.use(function (req, res, next) {
      express.json()
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      next();
    });

    expressApp.post('/vidownload', jsonParser, function (request, res) {
      try {
        const data = request.body;
        if (data?.id) {
          if (DownloadWindows[`${data.id}`]) {
            DownloadWindows[`${data.id}`].show()
            console.log("Re-Opened")
          } else {
            HttpReq(
              "https://cinemana.shabakaty.com/api/android/transcoddedFiles/id/" + data.id,
              vid => {
                HttpReq(
                  "https://cinemana.shabakaty.com/api/android/translationFiles/id/" + data.id,
                  tran => {
                    HttpReq(
                      "https://cinemana.shabakaty.com/api/android/allVideoInfo/id/" + data.id,
                      info => {
                        _VidownloadWin = VidownloadWin()
                        DownloadWindows[`${data.id}`] = _VidownloadWin
                        _VidownloadWin.webContents.send('vidownloader-options', {
                          vid,
                          tran: tran?.translations,
                          id: data.id,
                          icon: info?.imgMediumThumbObjUrl,
                          title: info?.en_title,
                          ep: info?.episodeNummer
                        });
                        _VidownloadWin.show()
                      }
                    )
                  }
                )
              }
            )
          }
        }
        res.send({ status: "ok" })
      } catch (e) {
        res.status(400).json({ status: 'Invalid data' });
      }
    })
    expressApp.post('/set', jsonParser, function (request, res) {
      try {
        const data = request.body;
        lastRequestTime = Date.now();

        if (data?.onlyTitle === true) {
          if (data?.title !== LastActivity?.title) {
            LastActivity = data;
            updatePresence({
              state: `${data?.title}`,
              largeImageKey: 'cin',
              instance: false,
              startTimestamp: Date.now()
            });
          }
        } else {
          if (data?.name !== LastActivity?.name || data?.epsAndSeason !== LastActivity?.epsAndSeason) {
            let DATA = {
              state: `${data?.name}`,
              startTimestamp: Date.now(),
              largeImageKey: 'cin',
              instance: false,
            }
            if (data.epsAndSeason !== null) {
              DATA.details = data.epsAndSeason.toString()
            }
            LastActivity = data;
            updatePresence(DATA);
          }
        }
        res.send({ status: "ok" })
      } catch (e) {
        res.status(400).json({ status: 'Invalid data' });
      }
    })
    expressApp.listen(2828)
  })
  // END :: Express App


  const DlOptions = fileName => ({
    resumeOnIncompleteMaxRetry: 15,
    fileName: fileName,
    retry: { maxRetries: 15, delay: 5000 },
    forceResume: true,
    removeOnStop: true
  });
  const Reg = e => `${e}`.replace(/\s/g, "").split("-")


  const tranDownloader = async (folderPath, data) => {
    const TranFileName = `${data?.title}_${Reg(data.tranName)[0]}.${Reg(data.tranName)[1]}`

    const TranDownloader = data.tran != null ? new DownloaderHelper(data?.tran, folderPath, DlOptions(TranFileName)) : null;
    if (TranDownloader) {
      TranDownloader.start();
    }

    return TranDownloader;
  }


  ipcMain.on('download-path-dialog', async (event, data) => {
    const VideoFileName = `${data?.title}_${Reg(data.vidName)[0]}.${Reg(data.vidName)[1]}`
    const folderPath = GetSavePath();

    if (folderPath == null) {
      DownloadWindows[`${data.id}`].webContents.send('dwn-path-exit', false);
      return;
    }

    const downloadTran = tranDownloader(folderPath, data);

    const VidDownloader = data.vid != null ? new DownloaderHelper(data.vid, folderPath, DlOptions(VideoFileName)) : null;
    if (VidDownloader) {
      var isSendedSize = false;
      DownloaderFiles[`${data.id}`] = VidDownloader;
      VidDownloader.on('progress', e => {
        if (!isSendedSize) {
          DownloadWindows[`${data.id}`].webContents.send('downloadSize', e.total);
          isSendedSize = true
        };

        DownloadWindows[`${data.id}`].webContents.send('downloadProgress', e.progress);
        DownloadWindows[`${data.id}`].webContents.send('downloadSpeed', e.speed);
      })

      VidDownloader.on('error', () => DownloadWindows[`${data.id}`].webContents.send('downloadErr'));
      VidDownloader.on('stateChanged', e => DownloadWindows[`${data.id}`].webContents.send('downloadState', e));
      VidDownloader.on('stop', () => downloadTran.then(h => h.stop()));

      VidDownloader.start();
    }
  });

  ipcMain.on('cancel-download', async (event, id) => {
    await DownloaderFiles[`${id}`]?.stop()
  })

  ipcMain.on('resume-download', async (event, id) => {
    DownloaderFiles[`${id}`]?.resume()
    console.log('resume')
  })

  ipcMain.on('pause-download', async (event, id) => {
    await DownloaderFiles[`${id}`]?.pause()
    console.log('pause')
  })

  ipcMain.on("restart", function (event, data) {
    console.log("Restarting...");
    app.relaunch();
    app.exit();
  });
}


// Remove Discord Status if no req has been received from browser *ext
setInterval(() => {
  const currentTime = Date.now();
  const elapsedTime = currentTime - lastRequestTime;

  if (elapsedTime > 10 * 60 * 1000) {
    console.log("Clear Discord Status ...");
    clearPresence()
  }
}, 1 * 60 * 1000);