import device from 'current-device'

class Video {
  constructor(options) {
    //Видео показываем только десктопам
    if (!device.desktop()) return

    this.elem = options.elem
    this.nativeElem = this.elem[0]
    this.videoBlockElem = this.elem.closest('.video-scroll-block')
    this.duration = +this.elem.data('duration')
    this.loaded = false
    this.played = false
    this.playVideoCallback = this.playVideo.bind(this)
    this.observer = new IntersectionObserver(this.load.bind(this), {
      threshold: 1
    })
    this.observer.observe(this.elem[0])
  }

  load(entries) {
    if (this.loaded) return
    if (!entries[0].isIntersecting) return
    //При переходим к действию только при прямом скроле, не обратном
    if (entries[0].boundingClientRect.top < 0) return
    this.loaded = true
    //Когда крутим колесико мышки над контейнером, в котором находится видео, проигрываем видео
    //Почему над контейнером? Потому что само видео имеет z-index: -1 и на нем события не генерируются
    this.videoBlockElem.on('wheel', this.playVideoCallback)
  }

  playVideo(e) {
    if (this.played) return
    let delta = e.originalEvent.deltaY / 1000
    //Реагируем на прокрутку только в прямом направлении
    if (delta < 0) return
    e.preventDefault()
    requestAnimationFrame(() => {
      let currentTime = this.nativeElem.currentTime
      if (currentTime >= this.duration) {
        //Если все видео проиграли, то все, заканчиваем
        this.videoBlockElem.unbind('wheel', this.playVideoCallback)
        this.played = true
        return
      }
      this.nativeElem.currentTime += delta
    })
  }
}

$(document).ready(() => {
  $('section.main.index video').each((index, elem) => {
    new Video({elem: $(elem)})
  })
})