const cache = {}
const readyListeners = []
const progressListeners = []

let completed = false
let remaining = 0
let total = 0

function onAssetLoad(e) {
  if (completed) {
    console.warn('Warning: asset defined after preload.', e.target)
  }

  remaining--;
  progressListeners.forEach(cb => cb(total - remaining, total))
  if (remaining === 0) {
    done()
  }
}

function done() {
  completed = true
  readyListeners.forEach(cb => cb())
}

function load(url, maker) {
  let cacheKey = url
  while (cacheKey.startsWith('../')) {
    cacheKey = url.slice(3)
  }
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }
  const asset = maker(url, onAssetLoad)
  remaining++
  total++

  cache[cacheKey] = asset
  return asset
}

class Assets {
  static completed() {
    return completed
  }

  static onReady(cb) {
    if (completed) {
      return cb()
    }

    readyListeners.push(cb)
    if (remaining === 0) {
      done()
    }
  }

  static onProgress(cb) {
    progressListeners.push(cb)
  }

  static image(url) {
    return load(url, (url, onAssetLoad) => {
      const img = new Image()
      img.src = url
      img.addEventListener('load', onAssetLoad, false)
      return img
    })
  }

  static sound(url) {
    return load(url, (url, onAssetLoad) => {
      const audio = new Audio()
      audio.src = url
      const onLoad = e => {
        audio.removeEventListener('canplay', onLoad, false)
        onAssetLoad(e)
      }
      audio.addEventListener('canplay', onLoad, false)
      return audio
    }).cloneNode()
  }
}

export default Assets