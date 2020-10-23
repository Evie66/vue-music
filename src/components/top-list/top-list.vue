<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bgImage="bgImage" :songs="songs" @click="selectItem(songs)"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
export default {
  computed: {
    title() {
      return this.topList.name
    },
    bgImage() {
    //   return this.topList.coverImgUrl
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  created() {
    this._getMusicList()
  },
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.status === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.playlist.tracks)
          console.log(res.data.playlist.tracks)
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
    },
    selectItem() {
      this.$emit('select', 'songs')
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>