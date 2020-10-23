export default class Song {
  constructor({id, singer, name, album, image, url}) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.image = image
    this.url = url
  }
}

export function createRecommendListSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    // aliaName: music.song.alias.join('-'),
    album: music.album.name,
    image: music.album.picUrl
  })
}

export function singerName (arr) {
  let name = []
  name = arr.map((item) => {
    return item.name
  })
  return name.join('/')
}

export function createSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl
  })
}