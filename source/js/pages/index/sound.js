import isSafari from '@/components/is_safari'

class Index {
  constructor(options) {
    //return
    this.elem = options.elem
    this.soundElem = this.elem.find('.sound')
    this.audioElem = this.soundElem.find('audio')
    this.iconElem = this.soundElem.find('.icon')

    this.iconElem.click(this.toggleSound.bind(this))
    //Все браузеры кроме сафари могут запустить звук сразу без пользовательского клика
    //у элемента audio стоит атрибут autoplay
    //сафари не может этого сделать, меняем значок поэтому
    if(!isSafari()) {
      this.audioElem.attr('autoplay', 'autoplay')
      //Бывает, что все же автоматически аудио не запускается
      setTimeout(() => {
        if(this.audioElem[0].paused) return
        this.soundElem.addClass('__on')
      }, 500)
    }
  }

  toggleSound() {
    if(this.audioElem[0].paused) {
      this.audioElem[0].play()
      this.soundElem.addClass('__on')
      return
    }

    this.audioElem[0].pause()
    this.soundElem.removeClass('__on')
  }
}

$(document).ready(() => {
  $('section.main.index').each((index, elem) => {
    new Index({elem: $(elem)})
  })
})