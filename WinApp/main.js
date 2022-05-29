const {app, Tray, Menu, nativeImage} = require('electron')
const path = require('path')
require('./server')
let tray

app.whenReady().then(() => {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'logo.png'))
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Exit', click: () => app.quit()}
  ])
  tray.setToolTip('Cinemana') 
  tray.setContextMenu(contextMenu)
})
