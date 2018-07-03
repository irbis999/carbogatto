import _debounce from 'lodash.debounce'
import device from 'current-device'


class Video {
  constructor(options) {
    //return
    this.elem = options.elem
    this.videoElems = this.elem.find('video')
    //mup = medium up - число пикселов когда мобильная версия превращатеся в десктопную
    this.mup = $('body').data('mup')
    this.inited = false
    //Изначально у видео нет атрибута src, чтобы они не грузились на моб версии, есть атрибут data-src
    //когда
    this.checkVideo()
    $(window).on('resize', _debounce(this.checkVideo.bind(this), 400))
  }

  checkVideo() {
    if (this.inited) return
    if (window.innerWidth < this.mup) return
    this.videoElems.each((index, elem) => {
      //На всех широких устройствах покажем постер
      $(elem).attr('poster', $(elem).data('poster'))
      //На широких десктопах покажем само видео
      //Компонент актуален только для главной. Сейчас на главной только постеры от комопнента нужны
      //src контролируется в другом месте
      /*
      if (device.desktop()) {
        $(elem).find('source').each((index, sourceElem) => {
          $(sourceElem).attr('src', $(sourceElem).data('src'))
        })
      }
      */
    })
    this.inited = true
  }
}

$(document).ready(() => {
  $(document).each((index, elem) => {
    new Video({elem: $(elem)})
  })
})