import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, nativeTheme } from "electron";
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'

// 配置remote模块
const remote = require('@electron/remote/main')
remote.initialize()

export const windowsCfg = {
    id: '', //唯一id
    title: '', //窗口标题
    width: '', //宽度
    height: '', //高度
    minWidth: '', //最小宽度
    minHeight: '', //最小高度
    route: '', // 页面路由URL '/manage?id=123'
    resizable: true, //是否支持调整窗口大小
    maximize: false, //是否最大化
    backgroundColor: '#eee', //窗口背景色
    data: null, //数据
    isMultiWindow: false, //是否支持多开窗口 (如果为false，当窗体存在，再次创建不会新建一个窗体 只focus显示即可，，如果为true，即使窗体存在，也可以新建一个)
    isMainWin: false, //是否主窗口(当为true时会替代当前主窗口)
    parentId: '', //父窗口id  创建父子窗口 -- 子窗口永远显示在父窗口顶部 【父窗口可以操作】
    modal: false, //模态窗口 -- 模态窗口是禁用父窗口的子窗口，创建模态窗口必须设置 parent 和 modal 选项 【父窗口不能操作】
    openDevTools: false,//打开浏览器开发者工具【仅在开发环境生效】
}

/**
 * 窗口配置
 */
export class Window {
    constructor() {
        this.main = null; //当前页
        this.group = {}; //窗口组
        this.tray = null; //托盘
        this.thumbarButtons = []//缩略图按钮
    }

    // 窗口配置
    winOpts(wh = []) {
        return {
            width: wh[0],
            height: wh[1],
            backgroundColor: '#f00',
            autoHideMenuBar: true, //自动隐藏菜单栏
            titleBarStyle: "hidden",//隐藏的标题栏
            resizable: true,
            minimizable: true,
            maximizable: true,
            frame: false,//设置为 false 时可以创建一个无边框窗口 默认值为 true
            show: false,
            webPreferences: {
                contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION, //上下文隔离
                nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,//启用Node集成（是否完整的支持 node）
                webSecurity: false,
                enableRemoteModule: true
            }
        }
    }

    // 获取窗口
    getWindow(id) {
        return BrowserWindow.fromId(id)
    }

    // 获取全部窗口
    getAllWindows() {
        return BrowserWindow.getAllWindows()
    }

    // 创建窗口
    createWindows(options) {
        // console.log('------------开始创建窗口...')

        // console.log(options)

        let args = Object.assign({}, windowsCfg, options)
        // console.log(args)

        // 判断窗口是否存在
        for (let i in this.group) {
            if (this.getWindow(Number(i)) && this.group[i].route === args.route && !this.group[i].isMultiWindow) {
                this.getWindow(Number(i)).focus()
                return
            }
        }

        let opt = this.winOpts([args.width || 800, args.height || 600])
        if (args.parentId) {
            // console.log('parentId：' + args.parentId)
            opt.parent = this.getWindow(args.parentId)
        } else if (this.main) {

        }

        if (typeof args.modal === 'boolean') opt.modal = args.modal
        if (typeof args.resizable === 'boolean') opt.resizable = args.resizable
        if (args.backgroundColor) opt.backgroundColor = args.backgroundColor
        if (args.minWidth) opt.minWidth = args.minWidth
        if (args.minHeight) opt.minHeight = args.minHeight

        // console.log(opt)
        let win = new BrowserWindow(opt)
        // console.log('窗口id：' + win.id)

        this.group[win.id] = {
            route: args.route,
            isMultiWindow: args.isMultiWindow,
        }
        // 是否最大化
        if (args.maximize && args.resizable) {
            win.maximize()
        }
        // 是否主窗口
        if (args.isMainWin) {
            if (this.main) {
                // console.log('主窗口存在')
                delete this.group[this.main.id]
                this.main.close()
            }
            this.main = win
        }
        args.id = win.id
        win.on('close', () => win.setOpacity(0))

        // 打开网址（加载页面）
        /**
         * 开发环境: http://localhost:8002/electron-vue-music/main.html#
         * 正式环境: app://./main.html#
         */
        if (!process.env.WEBPACK_DEV_SERVER_URL) {
            createProtocol('app')
        }

        let winURL = process.env.VUE_APP_DEV_URL

        if (args.route) {
            winURL += args.route
        }

        // console.log(winURL)

        win.loadURL(winURL)
        if (process.env.NODE_ENV === 'development' && args.openDevTools) win.webContents.openDevTools()

        win.once('ready-to-show', () => {
            win.show()
        })

        // 屏蔽窗口系统右键菜单（-webkit-app-region: drag）
        win.hookWindowMessage(278, function (e) {
            win.setEnabled(false)
            setTimeout(() => {
                win.setEnabled(true)
            }, 100)

            return true
        })

        // 配置remote模块
        remote.enable(win.webContents)

        // 向渲染进程传参
        if (args.data) {
            // console.log(args.data)
            console.log(win.id)
            win.webContents.on('did-finish-load', () => {
                win.webContents.send('get-data', args.data)
            })
        }

        //监听窗口最大化、最小化事件
        win.on('maximize', () => {
            win.webContents.send('mainWin-max', true)
        })

        win.on('unmaximize', () => {
            win.webContents.send('mainWin-max', false)
        })

        // 监听窗口全屏事件
        win.on('enter-full-screen', function () {
            win.webContents.send('mainWin-full-screen', true)
        });

        win.on('leave-full-screen', function () {
            win.webContents.send('mainWin-full-screen', false)
        });

        // 监听窗口显示事件
        win.on('show', () => {
            this.createThumbarButtons()
        })
    }

    // 关闭所有窗口
    closeAllWindow() {
        for (let i in this.group) {
            if (this.group[i]) {
                if (this.getWindow(Number(i))) {
                    this.getWindow(Number(i)).close()
                } else {
                    console.log('---------------------------')
                    app.quit()
                }
            }
        }
    }

    // 创建托盘
    createTray() {
        // console.log('创建托盘')
        const contextMenu = Menu.buildFromTemplate([
            {
                label: '显示',
                click: () => {
                    for (let i in this.group) {
                        if (this.group[i]) {
                            // this.getWindow(Number(i)).show()
                            let win = this.getWindow(Number(i))
                            if (!win) return
                            if (win.isMinimized()) win.restore()
                            win.show()
                        }
                    }
                }
            }, {
                label: '退出',
                click: () => {
                    app.quit()
                }
            }
        ])
        // console.log(__static)
        const trayIco = nativeImage.createFromPath(path.join(__static, '/static/images/tray/logo.png'));
        // console.log(trayIco)
        this.tray = new Tray(trayIco)
        this.tray.setContextMenu(contextMenu)
        this.tray.setToolTip(app.name)
    }

    // 创建任务栏窗口图标
    createThumbarButtons() {
        this.thumbarButtons = [{
            icon: nativeImage.createFromPath(path.join(__static, '/static/images/thumbar/prev.png')),
            tooltip: '上一首',
            click: () => {
                this.main.webContents.send('prev')
            }
        },
        {
            icon: nativeImage.createFromPath(path.join(__static, '/static/images/thumbar/play.png')),
            tooltip: '播放',
            click: () => {
                this.main.webContents.send('toggle-play')
            }
        },
        {
            icon: nativeImage.createFromPath(path.join(__static, '/static/images/thumbar/next.png')),
            tooltip: '下一首',
            click: () => {
                this.main.webContents.send('next')
            }
        }]

        this.main.setThumbarButtons(this.thumbarButtons)
    }

    // 任务栏窗口播放图标控制
    toggleThumbarPlayButton(playing) {
        let icon = playing ? 'pause.png' : 'play.png';
        this.thumbarButtons[1].icon = nativeImage.createFromPath(path.join(__static, `/static/images/thumbar/${icon}`));
        this.thumbarButtons[1].tooltip = playing ? '暂停' : '播放';
        this.main.setThumbarButtons(this.thumbarButtons);
    }


    // 开启监听
    listen() {
        // 关闭
        ipcMain.on('window-closed', (event, winId) => {
            if (winId) {
                this.getWindow(Number(winId)).close()
                if (this.group[Number(winId)]) delete this.group[Number(winId)]
            } else {
                this.closeAllWindow()
            }
        })

        // 隐藏
        ipcMain.on('window-hide', (event, winId) => {
            if (winId) {
                this.getWindow(Number(winId)).hide()
            } else {
                for (let i in this.group) if (this.group[i]) this.getWindow(Number(i)).hide()
            }
        })

        // 显示
        ipcMain.on('window-show', (event, winId) => {
            if (winId) {
                this.getWindow(Number(winId)).show()
            } else {
                for (let i in this.group) if (this.group[i]) this.getWindow(Number(i)).show()
            }
        })

        // 最小化
        ipcMain.on('window-mini', (event, winId) => {
            if (winId) {
                this.getWindow(Number(winId)).minimize()
            } else {
                for (let i in this.group) if (this.group[i]) this.getWindow(Number(i)).minimize()
            }
        })

        // 最大化
        ipcMain.on('window-max', (event, winId) => {
            if (winId) {
                this.getWindow(Number(winId)).maximize()
            } else {
                for (let i in this.group) if (this.group[i]) this.getWindow(Number(i)).maximize()
            }
        })

        // 最大化/最小化
        ipcMain.on('window-max-min-size', (event, winId) => {
            if (winId) {
                if (this.getWindow(winId).isMaximized()) {
                    this.getWindow(winId).unmaximize()
                } else {
                    this.getWindow(winId).maximize()
                }
            }
        })

        // 还原
        ipcMain.on('window-restore', (event, winId) => {
            if (winId) {
                this.getWindow(Number(winId)).restore()
            } else {
                for (let i in this.group) if (this.group[i]) this.getWindow(Number(i)).restore()
            }
        })

        // 重新加载
        ipcMain.on('window-reload', (event, winId) => {
            if (winId) {
                this.getWindow(Number(winId)).reload()
            } else {
                for (let i in this.group) if (this.group[i]) this.getWindow(Number(i)).reload()
            }
        })

        // 创建窗口
        ipcMain.on('window-new', (event, args) => this.createWindows(args))

        // 切换主题
        ipcMain.handle('dark-mode-change', () => {
            const darkTheme = nativeTheme.shouldUseDarkColors

            // dark:true ,light:false
            nativeTheme.themeSource = darkTheme ? 'light' : 'dark'

            return !darkTheme
        })

        // 全屏切换
        ipcMain.on('window-full-screen', (event, winId) => {
            if (winId) {
                const isFullScreen = this.getWindow(winId).isFullScreen()
                this.getWindow(winId).setFullScreen(!isFullScreen)
            }
        })

        // 播放控制
        ipcMain.on('window-toggle-play', (event, playing) => {
            this.toggleThumbarPlayButton(playing)
        })
    }

    // initStore() {
    //     const Store = require("electron-store");

    //     const schema = {
    //         logoutTip: {
    //             type: "boolean",
    //             default: true,
    //         },
    //     };

    //     const store = new Store({ schema });
    // }
}