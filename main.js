const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1150,
    height: 850,
    minWidth: 900,
    minHeight: 650,
    autoHideMenuBar: true,
    title: 'نظام حساب الكنترول التراكمي',
    backgroundColor: '#FAF7F0',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

// دالة الحفظ: بتفتح نافذة اختيار مكان الحفظ الـ Windows الأصلية
ipcMain.handle('save-file', async (event, { name, data }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    defaultPath: name,
    filters: [
      { name: 'ملفات Excel', extensions: ['xlsx'] },
      { name: 'ملفات مضغوطة', extensions: ['zip'] },
      { name: 'كل الملفات', extensions: ['*'] }
    ]
  });
  if (canceled || !filePath) return { saved: false };
  await fs.promises.writeFile(filePath, Buffer.from(data));
  return { saved: true, path: filePath };
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
