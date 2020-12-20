
const electron = require('electron') //look for electron in node package
const {app,BrowserWindow} = electron //we get a reference to the main chromium engine

//add a listener for the app ready event from chromium to tell us the app is available
app.on('ready', ()=>{ 
    console.log('App is Ready!')
    let win = new BrowserWindow({})
    win.loadFile('index.html')
})