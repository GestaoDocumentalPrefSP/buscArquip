// main.js
const { app, BrowserWindow, Menu, ipcMain, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');


function createWindow() {
  const icon = nativeImage.createFromPath(`${app.getAppPath()}/build/Logo.png`);
  if (app.dock) {
    app.dock.setIcon(icon);
  }


  const win = new BrowserWindow({
    width: 760,
    height: 520,
    icon: path.join(__dirname, 'assets', 'Logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,   // manter false por segurança
      contextIsolation: true,   // deve estar true para funcionar o contextBridge
      webSecurity: false
    }
  });
/*
  Menu.setApplicationMenu(null);
  win.setMenuBarVisibility(false);
  win.setAutoHideMenuBar(true);
*/
  win.loadFile('index.html');
}

// função de leitura da planilha via IPC
ipcMain.handle('ler-planilha', () => {
  try {
    const filePath = app.isPackaged
      ? path.join(process.resourcesPath, 'data', 'processos.xlsx')
      : path.join(__dirname, 'data', 'processos.xlsx');

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const dados = XLSX.utils.sheet_to_json(sheet);
    return dados;
  } catch (err) {
    console.error('Erro ao ler a planilha:', err);
    return null;
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
