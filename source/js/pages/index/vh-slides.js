import 'jquery.scrollto'
import device from 'current-device'
import _debounce from 'lodash.debounce'
import queryString from 'query-string'
import supportsVideoType from '@/components/supports_video_type'

class Slides {
  constructor(options) {
    //return

    this.elem = options.elem
    this.busy = false
    //Отматываем страницу наверх и ставим первый слайд и первое видео
    //TODO доделать в боевом режиме
    //TODO в конце - полный тест во всех браузерах и системах
    if (device.desktop()) {
      window.scrollTo(0, 0)
      this.currentSlideElem = this.elem.find('.vh-slide').first()
      this.setCurrentVideo()
    } else {
      $('html, body').removeClass('no-scroll')
    }

    //Блокируем управление скролом с помощью клавиш
    $(document).on('keydown', (e) => {
      if ([32, 38, 40].indexOf(e.keyCode) !== -1) {
        e.preventDefault()
      }
    })

    //Управление скролом
    if (device.desktop()) {
      //Пагинация
      this.initPagination()
      //Десктопы
      if (device.macos()) {
        $(document).on('wheel', this.wheelListener.bind(this))
      } else {
        $(document).on('wheel', this.fallbackWheelListener.bind(this))
      }
    } else {
      //this.initMobile()
      this.initMobile2()
    }


    //При ресайзе нужно подкрутить прокрутку к текущему слайду
    $(window).resize(_debounce(this.resizeAdjust.bind(this), 400))
  }

  initPagination() {
    this.elem.click(e => {
      if(this.busy) return
      let pagElem = $(e.target).closest('.pagination svg:not(.__active)')
      if(!pagElem.length) return
      this.move('next', $(pagElem.data('slide')))
    })
  }

  //TODO нужен рефакторинг метода
  initMobile2() {
    //После воспроизведения
    this.elem.find('video').on('ended', e => {
      let video = $(e.target)
      let preloader = video
        .closest('.video-container, .video-block')
        .find('.preloader')
      video
        .data('playing', false)
        .data('paused', false)
        .data('played', true)
      preloader.removeClass('__pause __loading').addClass('__play')
    })

    //Начало воспроизведения (после паузы или первично или заново)
    this.elem.find('video').on('playing', e => {
      let video = $(e.target)
      let preloader = video
        .closest('.video-container, .video-block')
        .find('.preloader')
      preloader.removeClass('__play __loading').addClass('__pause')
      video
        .data('playing', true)
        .data('paused', false)
        .data('loading', false)
    })

    //Воспроизведение видео
    this.elem.click(e => {
      let video = $()
      if($(e.target).is('video')) {
        video = $(e.target)
      }
      if($(e.target).closest('.video-container, .video-block').length) {
        video = $(e.target).closest('.video-container, .video-block').find('video')
      }

      if(!video.length) return
      if(video.data('loading')) return

      let preloader = video
        .closest('.video-container, .video-block')
        .find('.preloader')

      //Первичная инициализация видео
      if(!video.data('inited')) {
        //Safari - mp4
        let ext = '.mp4'
        if (supportsVideoType('webm') === 'probably') {
          //Chrome, FF
          //TODO добавить webm когда будут новые исходники
          //ext = '.webm'
        }
        //Ставим исходник
        video
          .attr('src', `${video.data('src')}${ext}?ver=6`)
          .data('inited', true)
          .data('loading', true)
        //Запускаем
        video[0].play()
        //Прелоадер - лоадинг
        preloader.removeClass('__play __pause').addClass('__loading')
        return
      }

      //Видео проигрывается
      if(video.data('playing')) {
        video[0].pause()
        video
          .data('playing', false)
          .data('paused', true)
        preloader.removeClass('__pause __loading').addClass('__play')
        return
      }

      //Видео на паузе
      if(video.data('paused')) {
        video[0].play()
        video
          .data('playing', true)
          .data('paused', false)
        preloader.removeClass('__play __loading').addClass('__pause')
        return
      }

      //Видео проиграно до конца
      if(video.data('played')) {
        video[0].currentTime = 0
        video[0].play()
        video
          .data('played', false)
          .data('playing', true)
        preloader.removeClass('__play __loading').addClass('__pause')
      }
    })

    //Переход ко второму слайду
    this.elem.find('.top-block .arrow').click(e => {
      $.scrollTo(this.elem.find('.frame-block'), 800)
    })
  }

  //Телефоны/планшеты
  initMobile() {
    let y0 = 0

    //фиксируем где приложили палец
    document.addEventListener('touchstart', e => {
      if (this.busy) return
      y0 = e.changedTouches[0].clientY
    }, {passive: false})

    //Предотвращаем скролл. Если превентить start и end то не будет работать click
    document.addEventListener('touchmove', e => {
      e.preventDefault()
    }, {passive: false})

    //Определяем направление скрола и выполяем переход между слайдами
    document.addEventListener('touchend', e => {
      if (this.busy) return

      let delta = e.changedTouches[0].clientY - y0
      if (Math.abs(delta) < 30) return
      let direction = 'next'
      if (delta > 0) {
        direction = 'prev'
      }

      //Если мы скролим вниз и внутри элемента
      // есть не просмотренное видео то смотрим видео
      if (direction === 'next' &&
        this.currentVideoElem.length &&
        !this.currentVideoElem.data('playing') &&
        !this.currentVideoElem.data('played')) {
        this.mobilePlayVideo()
        return
      }

      //Переходим к следующему слайду
      this.move(direction)
    }, {passive: false})
  }

  mobilePlayVideo() {
    if (this.busy) return
    this.fallbackPlayVideo()
  }

  playHpantomVideo() {
    let newVideo = this.currentVideoElem.clone(true)
    newVideo[0].currentTime = 0

    newVideo
      .addClass('__phantom')
      //.attr('autoplay', 'autoplay')
      .data('playing', true)
      .on('ended', () => {
        newVideo
          .data('playing', false)
          .data('played', true)
        this.busy = false
      })
    this.currentVideoElem.before(newVideo)
    //newVideo[0].autoplay = true
    newVideo[0].play()
    //Чтобы не было мерцаний
    setTimeout(() => {
      this.currentVideoElem.remove()
      newVideo.removeClass('__phantom')
      this.currentVideoElem = newVideo
    }, 500)

    this.busy = true
  }

  move(direction = 'next', nextSlideElem = null) {
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
    //Если однозначно передали к какому слайду идем
    if(nextSlideElem) {
      nextSlide = nextSlideElem
    }

    let offset = 0
    //Если первый слайд, то прокручиваем до верха страницы
    //т.е. делаем отступ равный высоте навигации
    if (nextSlide.is('.__first')) {
      offset = -1 * $('nav.main').outerHeight()
    }

    if (!nextSlide.length) return

    this.busy = true
    //Снимаем флаг просмотренности для видео на слайде с которого ушли
    //актуально для винды и мобайла
    this.currentVideoElem.data('played', false)
    //Инерция у скрола большая на мак ос и маленькая у всех остальных
    let delay = 100
    if (device.macos()) {
      delay = 800
    }
    $(window).scrollTo(nextSlide, 1100, {
      offset,
      onAfter: () => {
        this.currentSlideElem = nextSlide
        this.setCurrentPagElem()
        this.setCurrentVideo()
        //Даем скролу остановится
        setTimeout(() => {
          this.busy = false
        }, delay)
      }
    })
  }

  resizeAdjust() {
    if(device.desktop()) {
      $.scrollTo(this.currentSlideElem, 400)
    }
  }

  fallbackWheelListener(e) {
    e.preventDefault()
    //Если переход в процессе, то ничего не делаем
    if (this.busy) return

    //Направление скрола
    let delta = e.originalEvent.deltaY
    if (delta === 0) return
    let direction = 'next'
    if (delta < 0) {
      direction = 'prev'
    }

    //Если внутри элемента есть не просмотренное видео то смотрим видео
    //и мы скролим вниз
    //Если мы скролим вниз и внутри элемента
    // есть не просмотренное видео то смотрим видео
    if (direction === 'next' &&
      this.currentVideoElem.length &&
      !this.currentVideoElem.data('playing') &&
      !this.currentVideoElem.data('played')) {
      this.fallbackPlayVideo()
      return
    }

    //Переходим к следующему слайду
    this.move(direction)
  }

  fallbackPlayVideo() {
    this.currentVideoElem[0].currentTime = 0
    this.currentVideoElem[0].play()
    this.currentVideoElem.data('playing', true)
    this.currentVideoElem.on('ended', () => {
      this.currentVideoElem.data('played', true)
      this.currentVideoElem.data('playing', false)
      this.busy = false
    })
    this.busy = true
  }

  wheelListener(e) {
    e.preventDefault()
    if (this.busy) return

    //Направление скрола
    let delta = e.originalEvent.deltaY
    if (delta === 0) return
    let direction = 'next'
    if (delta < 0) {
      direction = 'prev'
    }

    //Если внутри элемента есть видео
    if (this.currentVideoElem.length) {
      this.playVideo(delta)

      //Если видео на середине
      if (this.currentVideoElem.data('playing')) {
        return
      }

      //Если видео на старте и мы крутим вниз
      if (this.currentVideoElem[0].currentTime <= 0
        && direction === 'next') {
        return
      }

      //Если видео в конце и мы крутим вверх
      if (this.currentVideoElem[0].currentTime >= this.currentVideoElem.data('duration')
        && direction === 'prev') {
        return
      }
    }

    //Переходим к следующему слайду
    this.move(direction)
  }

  playVideo(delta) {
    requestAnimationFrame(() => {
      let currentTime = this.currentVideoElem[0].currentTime
      let duration = this.currentVideoElem.data('duration')
      //43 - speed, 12 - duration - top video
      //при таких параметрах на маке видео проигрывается полностью за 1 длинный скрол
      let koef = 43 / 12 * duration
      let time = currentTime + delta / 2000 * koef

      if (time > 0 && time < duration) {
        //Смотрим видео
        this.currentVideoElem[0].currentTime = time
        if (!this.currentVideoElem.data('playing')) {
          this.currentVideoElem.data('playing', true)
        }
      }
      else if (time <= 0) {
        //Просмотрели до начала (в обратном порядке)
        time = 0
        this.currentVideoElem[0].currentTime = time
        this.currentVideoElem.data('playing', false)
      } else {
        //Просмотрели до конца
        time = duration
        this.currentVideoElem[0].currentTime = time
        this.currentVideoElem.data('playing', false)
      }
    })
  }

  setCurrentPagElem() {
    let currentPagElem
    this.elem.find('.pagination svg').each((index, elem) => {
      let selector = $(elem).data('slide')
      if(this.currentSlideElem.is(selector)) {
        currentPagElem = $(elem)
      }
    })

    if(currentPagElem) {
      this.elem.find('.pagination svg').removeClass('__active')
      currentPagElem.addClass('__active')
    }
  }

  setCurrentVideo() {
    this.currentVideoElem = this.currentSlideElem.find('video')

    if (!this.currentVideoElem.length) return
    if (this.currentVideoElem.data('inited')) return

    //Safari - mp4
    let ext = '.mp4'
    if (supportsVideoType('webm') === 'probably') {
      //Chrome, FF
      //TODO добавить webm когда будут новые исходники
      //ext = '.webm'
    }

    this.currentVideoElem
      .attr('src', `${this.currentVideoElem.data('src')}${ext}?ver=6`)
      .attr('preload', 'auto')
      .prop('preload', 'auto')
      .data('inited', true)

    //Отслеживаем загрузку видео
    this.currentVideoElem.on('progress', e => {
      if(!e.target.buffered.length) return
      if($(e.target).data('duration') <= e.target.buffered.end(0)) {
        console.log('loaded')
      }
    })
  }
}

$(document).ready(() => {
  $('section.main.index').each((index, elem) => {
    new Slides({elem: $(elem)})
  })
})


