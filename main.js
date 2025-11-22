const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const si = require('systeminformation');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    resizable: false,
    icon: path.join(__dirname, 'cpu.icns'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1e1e1e'
  });

  mainWindow.loadFile('index.html');
  
  // Uncomment để mở DevTools
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers để lấy system info
ipcMain.handle('get-cpu-usage', async () => {
  try {
    const cpu = await si.currentLoad();
    return {
      usage: cpu.currentLoad.toFixed(1),
      cores: cpu.cpus.length
    };
  } catch (error) {
    console.error('Error getting CPU:', error);
    return { usage: 0, cores: 0 };
  }
});

ipcMain.handle('get-memory-usage', async () => {
  try {
    const mem = await si.mem();
    const used = (mem.used / 1024 / 1024 / 1024).toFixed(2);
    const free = (mem.free / 1024 / 1024 / 1024).toFixed(2);
    const total = (mem.total / 1024 / 1024 / 1024).toFixed(2);
    const percentage = ((mem.used / mem.total) * 100).toFixed(1);
    
    return {
      used: used,
      free: free,
      total: total,
      percentage: percentage
    };
  } catch (error) {
    console.error('Error getting Memory:', error);
    return { used: 0, free: 0, total: 0, percentage: 0 };
  }
});