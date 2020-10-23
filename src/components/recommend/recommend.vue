<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="(item, index) of recommends" :key="index">
              <a :href="item.url">
                <img class="needsclick" @load="loadImage" :src="item.imageUrl"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="(item, index) in discList" :key="index" class="item">
              <div class="icon">
                <img height="60" width="60" v-lazy="item.coverImgUrl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.name"></h2>
                <p class="desc" v-html="item.copywriter"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import axios from '@/api/axios.js' /* 引入封装的axios */
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.id}`
      })
      this.setDisc(item)
    },
    getRecommend () {
      axios({
        url: '/banner', /* 热门歌单接口地址 */
        method: 'get'
      }).then(res => {
        console.log('我拿到的数据：', res.data)
        this.recommends = res.data.banners.splice(0, 5)
        console.log('我拿到的数据：', this.recommends)
      }).catch(err => {
        console.log(err)
      })
    },
    // getRecommend () {
    //   axios({
    //     url: '/recommend/banner', /* 热门歌单接口地址 */
    //     method: 'get'
    //   }).then(res => {
    //     console.log('我拿到的数据：', res.data)
    //     this.recommends = res.data
    //     console.log('我拿到的数据：', this.recommends)
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    getDiscList () {
      axios({
        url: '/top/playlist', /* 热门歌单接口地址 */
        method: 'get'
      }).then(res => {
        console.log('我拿到的数据：', res.data)
        this.discList = res.data.playlists
        console.log('我拿到的数据：', this.discList)
      }).catch(err => {
        console.log(err)
      })
    },
    loadImage () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll
  },
  created () {
    this.getRecommend()
    this.getDiscList()
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.recommend
  position fixed
  width 100%
  top 88px
  bottom 0
  .recommend-content
    height 100%
    overflow hidden
    .slider-wrapper
      position relative
      width 100%
      overflow hidden
    .recommend-list
      .list-title
        height 65px
        line-height 65px
        text-align center
        font-size $font-size-medium
        color $color-theme
      .item
        display flex
        box-sizing border-box
        align-items center
        padding 0 20px 20px 20px
        .icon
          flex 0 0 60px
          width 60px
          padding-right 20px
        .text
          display flex
          flex-direction column
          justify-content center
          flex 1
          line-height 20px
          overflow hidden
          font-size $font-size-medium
          .name
            margin-bottom 10px
            color $color-text
          .desc
            color $color-text-d
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>