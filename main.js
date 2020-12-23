
const electron = require('electron') //look for electron in node package

const {app,BrowserWindow,ipcMain,dialog,Menu} = electron //we get a reference to the main chromium engine
const fs = require('fs')
const { webContents, TouchBarColorPicker } = require("electron");
let win
let filepath

//add a listener for the app ready event from chromium to tell us the app is available
app.on('ready', ()=>{ 
    console.log('App is Ready!')
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile('index.html')
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
    console.log(" Electron Version: " + electronVerion)
})

function saveFile(filename,text)
{
        fs.writeFile(filename, text, (err) => {
        if (err)
        {
            console.log('An error occured! ',err);
            throw err;
        }
        else{
            console.log('The file has been saved, sending saved!');
            
            win.webContents.send('saved','success');
              
            
        } 
        
      });
}

function focusAndPerform(methodName) {
    return function(menuItem, window) {
      window.webContents.focus()
      window.webContents[methodName]()
    }
  }

  function sendMenuCommand(command) {
   // app.once('did-finish-load', () => {
        win.webContents.send(command)
   //  })
        
  }

ipcMain.on('save', (event,text)=>{
    //save the text to a file
    if(filepath === undefined)
    {   
        dialog.showSaveDialog(win,{defaultPath: "filename.txt"},(fullpath)=>{
            if(fullpath)
            {
                filepath = fullpath
                console.log(fullpath);
                saveFile(fullpath,text)
            }

    });
    }
    else
    {
        saveFile(filepath,text)
    }
}
)

const isMac = process.platform === 'darwin'
const isWindows = process.platform === "win32"
const isLinux = process.platform === "linux"
const electronVerion = process.version



const menuTemplate = [
    //Spread syntax can be used when all elements from an object or array need to be included in a list of some kind. 
    ...(isMac ? [{ // ...spread operator, return the contents of the enclosed array
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
    }] : []), // equates to nothing on expansion
    {
       label:  "File",
       submenu: [
             { label: "Save",  click() { sendMenuCommand("save_clicked")},  accelerator: "Ctrl+S"        },
             { label: "Save As",  click() { sendMenuCommand("saveas_clicked")},  accelerator: "Ctrl+Shift+S"        },
             { label: "Save All",  click() { sendMenuCommand("saveall_clicked")},         },

             
            // {
            //    label: "Save As",
            //    click(){ 
            //     filepath = undefined
            //     win.webContents.send('saveas_clicked')
            //    },
            // }   

       ]
    },
    {
        label: "Edit",
        submenu: isLinux ? [
          { label: "Undo",  click: focusAndPerform("undo"),  accelerator: "Ctrl+Z"       },
          { label: "Redo",  click: focusAndPerform("redo"),  accelerator: "Ctrl+Shift+Z" },
          { label: "Cut",   click: focusAndPerform("cut"),   accelerator: "Ctrl+X"       },
          { label: "Copy",  click: focusAndPerform("copy"),  accelerator: "Ctrl+C"       },
          { label: "Paste", click: focusAndPerform("paste"), accelerator: "Ctrl+V"       },
        ] : [
          { role: "undo"  },
          { role: "redo"  },
          { role: "cut"   },
          { role: "copy"  },
          { role: "paste" },
        ]
      }
    //{ role: 'editMenu'}
]
//All access to resources of the underlying machine must be done in the main process.
