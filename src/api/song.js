import axios from 'axios'
// import {HOST} from 'common/js/config'

export function getSong (id) {
  const url = `/song/url?id=${id}`
  return axios.get(url)
}

export function getLyric(id) {
  const url = `/lyric?id=${id}`
  return axios.get(url)
}

export function getSongDetail(id) {
  const url = `/song/detail?ids=${id}`
  return axios.get(url)
}