import { useIpcRendererOn, useIpcRendererInvoke, useIpcRenderer } from '@vueuse/electron'

/**
 * 创建窗口
 */
export function windowCreate(args) {
    // console.log(args)
    useIpcRenderer().send('window-new', args)
}

/**
 * 关闭窗口
 */
export function windowClose(id) {
    // console.log('窗口id：' + id)
    useIpcRenderer().send('window-closed', id)
}

/**
 * 最小化
 */
export function windowMini(id) {
    // console.log('窗口id：' + id)
    useIpcRenderer().send('window-mini', id)
}

/**
 * 最大化
 */
export function windowMax(id) {
    // console.log('窗口id：' + id)
    useIpcRenderer().send('window-max', id)
}

/**
 * 最大化/最小化
 */
export function windowMaxMin(id) {
    // console.log('窗口id：' + id)
    useIpcRenderer().send('window-max-min-size', id)
}

/**
 * 隐藏
 */
export function windowHide(id) {
    // console.log('窗口id：' + id)
    useIpcRenderer().send('window-hide', id)
}

/**
 * 接收数据
 */
export function windowGetData(callback) {
    useIpcRendererOn('get-data', callback)
}

/** 
 * 切换主题
 */

export function windowChangeTHemeColor() {
    return useIpcRendererInvoke('dark-mode-change')
}

/**
 * 监听最大/最小化
 */
export function listenWindowMaxMin(cb) {
    useIpcRendererOn('mainWin-max', (e, data) => {
        return cb(data)
    })
}

/**
 * 全屏切换
 */
export function windowFullScreen(id) {
    // console.log('窗口id：' + id)
    useIpcRenderer().send('window-full-screen', id)
}

/**
 * 监听全屏切换
 */
export function listenWindowFullScreen(cb) {
    useIpcRendererOn('mainWin-full-screen', (e, data) => {
        return cb(data)
    })
}

/**
 * 任务栏播放图标控制
 */
export function toggleThumbarPlayButton(playing) {
    useIpcRenderer().send('window-toggle-play', playing)
}

/**
 * 监听任务栏上一首图标控制
 */
export function listenThumbarPrevButton(cb) {
    useIpcRendererOn('prev', () => {
        cb()
    })
}

/**
 * 监听任务栏播放图标控制
 */
export function listenThumbarTogglePlayButton(cb) {
    useIpcRendererOn('toggle-play', () => {
        cb()
    })
}

/**
 * 监听任务栏上一首图标控制
 */
export function listenThumbarNextButton(cb) {
    useIpcRendererOn('next', () => {
        cb()
    })
}

