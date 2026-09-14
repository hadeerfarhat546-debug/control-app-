const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronSave', {
  saveFile: (name, data) => ipcRenderer.invoke('save-file', { name, data })
});
