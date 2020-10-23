<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import axios from '@/api/axios.js'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const pinyin = require('pinyin')
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  mixins: [playlistMixin],
  data() {
    return {
      singers: []
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    getSingerList() {
      axios({
        url: '/top/artists?limit=100', /* 热门歌单接口地址 */
        method: 'get'
        // referer: 'http://192.168.31.18:8080'
      }).then(res => {
        let s = res.data.artists
        s.map((item) => {
          let py = pinyin(item.name[0], {
            style: pinyin.STYLE_FIRST_LETTER
          })
          item.initial = py[0][0].toUpperCase()
        })
        this.singers = this._normalizeSinger(s)
        console.log('我拿到的数据：', this.singers)
      }).catch(err => {
        console.log(err)
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias.join(' / ')
          }))
        }
        const key = item.initial
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.id,
          name: item.name,
          avatar: item.img1v1Url,
          aliaName: item.alias[0]
        }))
      })
      console.log(map)
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  },
  created() {
    this.getSingerList()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>