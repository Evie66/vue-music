<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest">
    <ul>
      <li @click="selectItem(item)" v-for="item in result" class="suggest-item" :key="item.id">
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <span class="desc">{{item.singer}}</span><span class="desc"> - {{item.album}}</span>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {mapActions} from 'vuex'
import {createSong} from 'common/js/song'
import NoResult from 'base/no-result/no-result'

const limit = 10

export default {
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      result: [],
      pullup: true,
      beforeScroll: true,
      hasMore: true,
      offset: 1
    }
  },
  methods: {
    search() {
      this.offset = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, limit, this.offset).then((res) => {
        if (res.status === ERR_OK) {
          this.result = this._normalizeSongs(res.data.result.songs)
          console.log(this.result)
          this._checkMore(res.data.result.songs)
        }
      })
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.offset++
      search(this.query, limit, this.offset).then((res) => {
        if (res.status === ERR_OK) {
          this.result = this.result.concat(this._normalizeSongs(res.data.result.songs))
          console.log(res.data.result)
          this._checkMore(res.data.result)
        }
      })
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    listScroll() {
      this.$emit('listScroll')
    },
    _checkMore(data) {
      if (limit * this.offset > data.songCount) {
        this.hasMore = false
      }
    },
    _genResult(data) {
      let ret = []
      if (data) {
        ret = ret.concat(createSong(data))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((music) => {
        if (music.id) {
          ret = ret.concat(createSong(music))
        }
      })
      return ret
    },
    selectItem(item) {
      this.insertSong(item)
      console.log(item)
      this.$emit('select')
    },
    singerName (arr) {
      let name = []
      name = arr.map((item) => {
        return item.ar.name
      })
      return name.join('/')
    },
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query() {
      this.search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height 100%
    overflow hidden
    .search-suggest-item
      display: flex
      align-items: center
      padding: 8px 20px
      border-bottom: 1px solid rgb(228, 228, 228)
      font-size: $font-size-medium
    .suggest-item
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        position relative
        width 100%
        text-align: center
        .icon
          position absolute
          left 0
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px

        .text
          position absolute
          left 0
          color: $color-theme
          font-size: $font-size-large
      .content
        margin-left 30px
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
    .no-result-wrapper
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>