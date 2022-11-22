# electron-vue-music
基于 electron+vue3 开发的音乐播放器，项目借鉴了大神 SmallRuralDog 的开源项目 [vue3-music](https://github.com/SmallRuralDog/vue3-music  "vue3-music")，其实就是直接搬了过来，我对 TS 不熟，然后我就按照自己的习惯的写法重头临摹了一遍源码，在原有功能的基础上新增了歌词详情和任务栏缩略图播放功能（获取还存在些bug）。通过这个项目，我也学习了 vue3 的强大，以及electron如何结合vue3开发桌面应用。共勉！！！

# 本地安装
```
git clone https://github.com/dongcx-com/electron-vue-music.git
cd electron-vue-music
npm install
npm run electron:serve
```
# 网易云音乐API
需要运行API服务才能正常体验  

[开发文档](https://binaryify.github.io/NeteaseCloudMusicApi/#/)

# UI
![歌词详情](https://github.com/dongcx-com/electron-vue-music/blob/main/extraUI/lyric_detail.png)  
![缩略图](https://github.com/dongcx-com/electron-vue-music/blob/main/extraUI/lyric_detail.png)


