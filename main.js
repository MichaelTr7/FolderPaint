// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs');
// const { loadavg } = require('node:os');
const isDev = !app.isPackaged;
const scriptPath = isDev
  ? path.join(__dirname, 'assets', 'script.sh')
  : path.join(process.resourcesPath, 'assets', 'script.sh');

console.log('Bash script path:', scriptPath);


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 450,
    height: 312,
    transparent:false,
    fullscreen: false,
    show: false,
    resizable: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: true, 
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      // webSecurity: false,
      // preload: path.join(__dirname, 'preload.js')
    }
  })


  // and load the index.html of the app.
  mainWindow.loadFile('./index.html')
  ipcMain.on('files-dropped', (event, fileDetails) => {

    // You can also use the dialog to get absolute paths if needed
    // const options = {
    //     properties: ['openFile', 'multiSelections'],
    //     filters: [{ name: 'All Files', extensions: ['*'] }]
    // };

    const folderPaths = dialog.showOpenDialogSync(mainWindow, {
      properties: ['openDirectory', 'multiSelections']  // Only allow folder selection
  });
folderPaths
    console.log();
    var Folder_Path = folderPaths;
if (folderPaths && folderPaths.length > 0) {
        // Send the folderPaths to the renderer process
        mainWindow.webContents.send('folder-paths', folderPaths);
    } else {
        console.log('No folders selected.');
        var No_Folder = null;
        mainWindow.webContents.send('folder-paths', No_Folder);
    }

});
  // Open the DevTools.
  // Building the menu bar
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // mainWindow.webContents.openDevTools()
  mainWindow.webContents.on('did-finish-load', function() {
    setTimeout(() => {mainWindow.show();},500);
});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.handle('get-app-path', () => process.execPath);


// MacOS menu bar template
const isMac = process.platform === 'darwin'

const template = [


  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },

    ]
  }] : []),
  // { role: 'fileMenu' }
   {
     label: 'Window',
     submenu: [
       isMac ? { role: 'close' } : { role: 'quit' },  { role: 'minimize' }
     ]
   }

]
