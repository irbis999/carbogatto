import _debounce from 'lodash.debounce'
import device from 'current-device'
import supportsVideoType from '@/components/supports_video_type'

//TODO удалить коммонент в будущем

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


    //ios
    /*
    $('.top-block.vh-slide.__first .icon-play').click(() => {
      let video = $('.top-block.vh-slide.__first video')[0]
      video.currentTime = 0
      video.play()
    })

    //Андроид
    $('.top-block.vh-slide.__first video').click(e => {
      //alert('play')
      //e.target.play()
    })

    this.videoElems.click(e => {
      //alert('play')
      //console.log()
      //e.target.currentTime = 0
      //e.target.play()
    })
    */

  }

  checkVideo() {
    if (this.inited) return
    if (window.innerWidth < this.mup) return
    this.videoElems.each((index, elem) => {
      //На всех широких устройствах покажем постер
      //$(elem).attr('poster', $(elem).data('poster') + '?ver=2')
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


      /*
      //Safari - mp4
      let ext = '.mp4'
      if (supportsVideoType('webm') === 'probably') {
        //Chrome, FF
        ext = '.webm'
      }


      $(elem).attr('src', `${$(elem).data('src')}${ext}`)
      //$(elem).attr('preload', 'auto')
      //$(elem)[0].play()
      //$(elem).attr('controls', 'controls')
      $(elem).attr('playsinline', 'playsinline')
      //$(elem).attr('loop', 'loop')
      //$(elem).attr('autoplay', 'autoplay')
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