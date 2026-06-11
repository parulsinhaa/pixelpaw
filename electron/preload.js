const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pixelpaw', {
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setLaunchAtStartup: (enabled) => ipcRenderer.invoke('settings:set-launch-at-startup', enabled),
  sendMood: (mood) => ipcRenderer.send('pet:mood', mood),
  onPetMood: (callback) => ipcRenderer.on('pet:mood', (_event, mood) => callback(mood)),
  onFocus: (callback) => ipcRenderer.on('pet:focus', callback)
});
