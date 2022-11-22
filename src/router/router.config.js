import pages from './pages'

// manage
const Manage = () => import('@/views/Manage')

// music
const Music = () => import('@/views/music/Music')

// picked
const Picked = () => import('@/views/music/picked/Picked')

// discover
const Discover = () => import('@/views/discover/Discover')

// toplist
const TopList = () => import('@/views/music/toplist/TopList')

// artist
const Artist = () => import('@/views/music/artist/Artist')

// category
const Category = () => import('@/views/music/category/Category')

// playlist
const PlayList = () => import('@/views/playlist/PlayList')

// artistDetail
const ArtistDetail = () => import('@/views/artist/ArtistDetail')

// album
const Album = () => import('@/views/album/Album')

// video
const VideoList = () => import('@/views/video/VideoList.vue')

//dj
const Dj = () => import('@/views/dj/DJ.vue')

// mvDetail
const MvDetail = () => import('@/views/mv/MvDetail')

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
    {
        path: '/',
        name: pages.MANAGE,
        component: Manage,
        redirect: { name: pages.DISCOVER },
        children: [
            {
                path: 'discover',
                name: pages.DISCOVER,
                component: Discover,
                meta: {
                    menu: pages.DISCOVER,
                    keepAlive: true,
                },
            },
            {
                path: 'music',
                name: pages.MUSIC,
                component: Music,
                redirect: { name: pages.PICKED },
                meta: {
                    menu: pages.MUSIC
                },
                children: [
                    {
                        path: 'picked',
                        name: pages.PICKED,
                        component: Picked,
                        meta: {
                            menu: pages.MUSIC,
                            keepAlive: true,
                        },
                    },
                    {
                        path: 'toplist',
                        name: pages.TOP_LIST,
                        component: TopList,
                        meta: {
                            menu: pages.MUSIC,
                            keepAlive: true,
                        }
                    },
                    {
                        path: 'artist',
                        name: pages.ARTIST,
                        component: Artist,
                        meta: {
                            menu: pages.MUSIC,
                            title: '歌手',
                            keepAlive: true,
                        }
                    },
                    {
                        path: 'category',
                        name: pages.CATEGORY,
                        component: Category,
                        meta: {
                            menu: pages.MUSIC,
                            title: '分类歌单',
                            keepAlive: true,
                        }
                    }
                ]
            },
            {
                path: 'playlist',
                name: pages.PLAY_LIST,
                component: PlayList,
            },
            {
                path: 'artistDetail',
                name: pages.ARTIST_DETAIL,
                component: ArtistDetail,
            },
            {
                path: 'album',
                name: pages.ALBUM,
                component: Album,
            },
            {
                path: 'video',
                name: pages.VIDEO,
                component: VideoList,
                meta: {
                    menu: pages.VIDEO,
                    title: '视频',
                    keepAlive: true,
                }
            },
            {
                path: 'dj',
                name: pages.DJ,
                component: Dj,
                meta: {
                    menu: pages.DJ,
                    title: '电台',
                    keepAlive: true,
                }
            },
            {
                path: 'mvDetail',
                name: pages.MV_DETAIL,
                component: MvDetail,
            }
        ]
    },
]
