import 'jquery.scrollto'
import device from 'current-device'
import _debounce from 'lodash.debounce'

class Slides {
  constructor(options) {
    //Управление осуществляем только на десктопах
    if (!device.desktop()) {
      $('html, body').removeClass('no-scroll')
      return
    }


    this.elem = options.elem
    this.busy = false
    this.mup = $('body').data('mup')
    this.inited = false

    //Инициализируем, только если окно достаточно широкое для десктопной версии
    this.checkScreenSize()
    $(window).on('resize', _debounce(this.checkScreenSize.bind(this), 400))
  }

  checkScreenSize() {
    if (this.inited) return
    if (window.innerWidth < this.mup) return
    this.init()
    this.inited = true
  }

  init() {
    //Отматываем страницу наверх и ставим первый слайд и первое видео
    window.scrollTo(0,0)
    this.currentSlideElem = this.elem.find('.vh-slide').first()
    this.setCurrentVideo()

    //Управление скролом
    $(document).on('wheel', (e) => {
      e.preventDefault()
      if (this.busy) return

      let delta = e.originalEvent.deltaY
      if (delta === 0) return
      let direction = 'next'
      if (delta < 0) {
        direction = 'prev'
      }

      //Если внутри элемента есть не просмотренное видео и мы скролим внуз
      //то смотрим видео
      if (direction === 'next' &&
        this.currentVideoElem.length &&
        !this.currentVideoElem.data('played')) {
        this.playVideo(delta)
        return
      }

      //Переходим к следующему слайду
      this.move(direction)
    })

    //Блокируем управление скролом с помощью клавиш
    $(document).on('keydown', (e) => {
      if([32,38,40].indexOf(e.keyCode) !== -1) {
        e.preventDefault()
      }
    })
  }

  setCurrentVideo() {
    this.currentVideoElem = this.currentSlideElem.find('video')

    if (!this.currentVideoElem.length) return
    if (this.currentVideoElem.data('inited')) return

    //Safari - mp4
    let ext = '.mp4'
    if (supportsVideoType('webm') === 'probably') {
      //Chrome, FF
      ext = '.webm'
    }

    this.currentVideoElem.attr('src', `${this.currentVideoElem.data('src')}${ext}`)
    this.currentVideoElem.attr('preload', 'auto')
    this.currentVideoElem.data('inited', true)
  }

  playVideo(delta) {
    requestAnimationFrame(() => {
      let currentTime = this.currentVideoElem[0].currentTime
      if (currentTime >= this.currentVideoElem.data('duration')) {
        //Если все видео проиграли, то все, заканчиваем
        this.currentVideoElem.data('played', true)
        return
      }
      this.currentVideoElem[0].currentTime += delta / 2000

    })
  }

  move(direction = 'next') {
    //Включаем скролл на документе при переходе в след слайду (изначально выключен)
    $('html, body').removeClass('no-scroll')

    let nextSlide = this.currentSlideElem.next('.vh-slide')
    if (direction === 'prev') {
      nextSlide = this.currentSlideElem.prev('.vh-slide')
    }
    //После последнейго слайда идем к футеру
    if (this.currentSlideElem.is('.__last') && direction === 'next') {
      nextSlide = $('footer.main')
    }
    //От футера идем к последнему слайду
    if (this.currentSlideElem.is('footer.main') && direction === 'prev') {
      nextSlide = this.elem.find('.vh-slide.__last')
    }
    let offset = 0
    //Если первый слайд, то прокручиваем до верха страницы
    //т.е. делаем отступ равный высоте навигации
    if (nextSlide.is('.__first')) {
      offset = -1 * $('nav.main').outerHeight()
    }

    if (!nextSlide.length) return

    this.busy = true
    $(window).scrollTo(nextSlide, 700, {
      offset,
      onAfter: () => {
        this.currentSlideElem = nextSlide
        this.setCurrentVideo()
        //Даем скролу остановится
        setTimeout(() => {
          this.busy = false
        }, 800)
      }
    })
  }
}

$(document).ready(() => {
  $('section.main.index').each((index, elem) => {
    new Slides({elem: $(elem)})
  })
})


function supportsVideoType(type) {
  let video

  // Allow user to create shortcuts, i.e. just "webm"
  let formats = {
    ogg: 'video/ogg; codecs="theora"',
    h264: 'video/mp4; codecs="avc1.42E01E"',
    webm: 'video/webm; codecs="vp8, vorbis"',
    vp9: 'video/webm; codecs="vp9"',
    hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
  }

  if (!video) {
    video = document.createElement('video')
  }

  return video.canPlayType(formats[type] || type)
}
