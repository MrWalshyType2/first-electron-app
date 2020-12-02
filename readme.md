# main.js
This file is the entry point to a Electron app, this will run the Main process. The script running the Main process typically controls the application lifecycle, displays the GUI and its elements,  performs native OS interactions and creates Renderer processes within web pages.

# index.html
This web page represents a Renderer process. Multiple browser windows can be created where each windows will use its own Renderer process.

Windows can optionally be granted full access to the Node.js API through the nodeIntegration preference in the main script.

# package.json
The main script of the app is 'main.js' rather than 'index.js', so the package.json file needs modifying.

The default 'npm start' command will run 'main.js' using Node.js, running the script with Electron will require another modification.

```
{
    "name": "my-electron-app",
    "version": "0.1.0",
    "main": "main.js",
    "scripts": {
        "start": "electron ."
    }
}
```

# Packaging and Distribution
The simplest, and fastest way, is to use Electron Forge.

1. Import Electron Forge to the app folder:
```
npx @electron-forge/cli import
```

2. Create a distributable:
Electron-forge creates an 'out' folder where the package is located.
```
npm run make
```

# Application architecture
Electron has three main pillars:
- Chromium: displays web content
- Node.js: working with the local filesystem and OS
- Custom APIs: working with often-needed OS native functions

# Main and Renderer Processes
## The Main Process
Creates web pages by creating 'BrowserWindow' instances. Each BrowserWindow instances runs the web page in its Renderer process.

Manages all web pages and their corresponding Renderer process.

## The Renderer Process
Manages only the corresponding web page, a crash in one Renderer process will not affect other Renderer processes.

Communicates with the Main process via IPC (Inter-Process Communication) for performing GUI operations in a web page. Calling native GUI-related APIs from the Renderer process directly is restricted due to security concerns and potential resource leakage.

### IPC Modules
- _ipcMain_
- _ipcRenderer_

# APIs
## Electron API
Electron APIs are assigned based on the process type, which means some modules may be used in either the Main or Renderer process, or sometimes both. See the Electron API docs to indicate which process each module can be used from.

- Accessing the Electron API in both processes requires its included module:
```
const electron = require('electron');
```

- Create a window by calling the BrowserWindow class, only available in the Main process:
```
const { BrowserWindow } require('electron');
const window = new BrowserWindow();
```

- Call the Main process from the Renderer process with the IPC module:
```
// In Main Process
const { ipcMain } = require('electron');

ipcMain.handle('perform-action', (event, ...args) => {
    // do actions on behalf of the Renderer
});
```

- Call the Renderer process from the Main process with the IPC module:
    - Renderer processes can run untrusted code, carefully validate any request that come to the main process.
```
// In Renderer Process
const { ipcRenderer } = require('electron');

ipcRenderer.invoke('perform-action', ...args);
```

## Node.js API
- Accessing the Node.js API from the Renderer process requires the 'nodeIntegration' preference to be 'true'.

Electron exposes full access to the Node.js API and its modules both in the Main and the Renderer processes.

- Reading all files from the root directory:
```
const fs = require('fs');

const root = fs.readdirSync('/');

console.log(root);
```

### How to use a Node.js module
1. Install the dependency
```
npm install --save aws-sdk
```

2. Require the module in the Electron app
```
const S3 = require('aws-sdk/clients/s3');
```