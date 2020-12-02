// app is for controlling lifecycle events
// BrowserWindow is for creating and controlling browser windows
const { app, BrowserWindow } = require('electron');

// Create a window with node integration
function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // load index.html into the window
    window.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Listens for all windows closed status
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Creates a window only if the app is running and has no visible windows
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});