import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getRecommend() {
  const url = 'http://localhost:3000'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 166
  })
  return jsonp(url, data, options)
}

export function getSongList(id) {
  const url = `/playlist/detail?id=${id}&cookie=MUSIC_U=0695b10a75690b769fa26b44c5952a6ad387cb3477124ac7b15201818e59defe33a649814e309366;%20Expires=Tue,%2027-Oct-2020%2010:41:20%20GMT;%20Path=/;__remember_me=true;%20Expires=Tue,%2027-Oct-2020%2010:41:20%20GMT;%20Path=/;__csrf=6091367a212edf88f5efca87db85f5d3;%20Expires=Tue,%2027-Oct-2020%2010:41:30%20GMT;%20Path=/`
  return axios.get(url)
}