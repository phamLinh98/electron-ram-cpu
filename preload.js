const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getCPUUsage: () => ipcRenderer.invoke('get-cpu-usage'),
  getMemoryUsage: () => ipcRenderer.invoke('get-memory-usage')
});