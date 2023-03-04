const {ipcRenderer} = require('electron')
const open = require('open');
const $ = require('jquery')
const path = require('path')
const fs = require('fs')

let memory
const configFile = path.join(process.env.HOMEDRIVE, process.env.HOMEPATH, '.skynightclient', 'settings', 'settings.json')

document.querySelector('#close-btn').addEventListener('click', () => {
    ipcRenderer.send('close')
})

document.querySelector('#info1').addEventListener('click', () => {
    open('https://skynightclient.ga')
})

document.querySelector('#info2').addEventListener('click', () => {
    open('https://skynightclient.ga/discord')
})

document.querySelector('#info3').addEventListener('click', () => {
    open('https://skynightclient.ga/github')
})

document.querySelector('#info4').addEventListener('click', () => {
    open('https://www.tiktok.com/@skynightclient')
})

document.querySelector('#home').addEventListener('click', () => {
    ipcRenderer.send('home')
})

document.querySelector('#setting').addEventListener('click', () => {
    ipcRenderer.send('setting')
})

//setting
jsonReader(configFile, (err, config) => {
    if (err) {
        console.log(err);
        return;
    }
    memory = config.ram
    $( "#memory-slider" ).val(memory)
    $('#amount_memory').text(memory/10 + "GB Allocated")
})

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

$('#memory-slider').on('input', () => {
    memory = $('#memory-slider').val()
    $('#amount_memory').text(memory/10 + "GB Allocated")
    jsonReader(configFile, (err, config) => {
        if (err) {
            console.log(err);
            return;
        }
        config.ram = memory
        fs.writeFile(configFile, JSON.stringify(config), err => {
            if (err) console.log("Error writing file:", err);
        });
    })
})

$('#launch-btn').on('click', () => {
    ipcRenderer.send('startClient')
})