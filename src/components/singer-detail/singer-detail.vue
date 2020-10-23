<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import singer from '../singer/singer'
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
  data() {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  methods: {
    // getSongList () {
    //   axios({
    //     url: `artists?id=${singer.id}`, /* 热门歌单接口地址 */
    //     method: 'get'
    //   }).then(res => {
    //     console.log('我拿到的数据：', res.data)
    //     this.songList = res.data
    //     console.log('我拿到的数据：', this.songList)
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // }
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.status === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.hotSongs)
          // console.log(this.songs)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      if (!list) {
        return
      }
      list.forEach((item) => {
        ret.push(createSong(item))
      })
      return ret
    }
  },
  created() {
    console.log(singer)
    this._getDetail()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>