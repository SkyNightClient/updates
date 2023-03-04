const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater")
const path = require('path');
const ipc = ipcMain
const { Client, Authenticator } = require('minecraft-launcher-core');
const fs = require('fs')

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let win;
let memory
const configFile = path.join(process.env.HOMEDRIVE, process.env.HOMEPATH, '.skynightclient', 'settings', 'settings.json')

var ASSEST = '/assets/'
var APP = '/apps/'

var GAMEDIREC = path.join(process.env.APPDATA,'.minecraft')
var CLIENTPATH = path.join(process.env.HOMEDRIVE, process.env.HOMEPATH, '.skynightclient', 'jars')
var JAVAPATH = path.join(process.env.HOMEDRIVE, process.env.HOMEPATH, '.skynightclient', 'runtime', 'bin', 'javaw.exe')

function createWindow() {
    win = new BrowserWindow({
        width:925,
        height:530,
        frame:false,
        icon: path.join(__dirname, ASSEST, 'icon.ico'),
        title: 'SkyNight Launcher',
        resizable:false,
        backgroundColor: '#1e1e1e',
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            webSecurity:true,
            devTools:false
        }
    });

    win.loadURL(path.join(__dirname, APP, 'home.html'));

    ipc.on('startClient', () => {
        let RAM = memory/10*1024
        let ver = '1.8.9'
        const launcher = new Client();
        let opts = {
            clientPackage: null,
            authorization: Authenticator.getAuth("Player"),
            root: GAMEDIREC,
            version: {
                number: ver,
                type: "release"
            },
            memory: {
                max: RAM,
                min: RAM
            },
            forge: path.join(CLIENTPATH, ver, ver + '.jar'),
            javapath: JAVAPATH + "/zulu8.66.0.15-ca-fx-jre8.0.352-win_x64/",
        }
        launcher.launch(opts);
        launcher.on('data', () => app.quit());
    })

}

ipc.on('close', () => {
    app.quit()
})

ipc.on('home', () => {
    win.loadURL(path.join(__dirname, APP, 'home.html'))
    jsonReader(configFile, (err, config) => {
        if (err) {
            console.log(err);
            return;
        }
        memory = config.ram
    })
})

ipc.on('setting', () => {
    win.loadURL(path.join(__dirname, APP, 'setting.html'))
})

ipc.on('close', () => {
    app.quit()
})

app.on('ready', () => {
    jsonReader(configFile, (err, config) => {
        if (err) {
            console.log(err);
            return;
        }
        memory = config.ram
    })
    createWindow()
});

app.on('quit', () => autoUpdater.checkForUpdates())

autoUpdater.on("update-available", () => {
    autoUpdater.downloadUpdate()    
});

app.on('window-all-closed', () => {
    if(process.platform !== "darwin"){
        app.quit();
    }
});

function jsonReader(filePath , cb) {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        return cb && cb(err);
      }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {
        return cb && cb(err);
      }
    });
}