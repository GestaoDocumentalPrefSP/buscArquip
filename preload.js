// preload.js
const { contextBridge, ipcRenderer } = require('electron');

console.log('preload carregado')

contextBridge.exposeInMainWorld('electronAPI', {
  lerPlanilha: () => ipcRenderer.invoke('ler-planilha')
});