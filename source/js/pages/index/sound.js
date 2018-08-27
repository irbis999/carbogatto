class Index {
  constructor(options) {
    this.elem = options.elem
    this.soundElem = this.elem.find('.sound')
    this.audioElem = this.soundElem.find('audio')
    this.iconElem = this.soundElem.find('.icon')

    this.iconElem.click(this.toggleSound.bind(this))
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