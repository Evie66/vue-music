<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
// import {createRecommendListSong} from 'common/js/song'
import {ERR_OK} from 'common/js/config'
import {createSong} from 'common/js/song'

export default {
  data() {
    return {
      listDetail: [],
      songs: []
    }
  },
  computed: {
    title() {
      return this.disc.name
    },
    bgImage() {
      return this.disc.coverImgUrl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created() {
    this._getSongList(this.disc.id)
  },
  methods: {
    _getSongList(id) {
      getSongList(this.disc.id).then((res) => {
        if (res.status === ERR_OK) {
          console.log(res.data.playlist.tracks)
          this.songs = this._normalizeSongs(res.data.playlist.tracks)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((music) => {
        if (music.id) {
          ret.push(createSong(music))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>