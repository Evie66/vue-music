import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getSingerList() {
  const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: '1518306572',
    sign: 'zza3agttcj7ex2f3fef04bda3a286eeb40136f6b80f4a',
    loginUin: '2207239667',
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf - 8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  })

  return jsonp(url, data, options)
}

export function getSingerDetail (singerId) {
  const url = `/artists?id=${singerId}`

  return axios.get(url)
}