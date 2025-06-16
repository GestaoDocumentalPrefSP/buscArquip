// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    icon: path.join(__dirname, 'assets', 'Logo.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,  // ⚠️ cuidado com segurança
      contextIsolation: false,
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});