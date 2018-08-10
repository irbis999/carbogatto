import _debounce from 'lodash.debounce'

class Waves {
  constructor(options) {
    this.elem = options.elem
    this.mup = $('body').data('mup')
    this.device = 'desktop'
    if (window.innerWidth < this.mup) {
      this.device = 'mobile'
    }
    this.setSrc()
    $(window).on('resize', _debounce(this.checkElems.bind(this), 200))
  }

  checkElems() {
    let width = window.innerWidth
    let device = 'desktop'
    if (width < this.mup) {
      device = 'mobile'
    }
    if (this.device === device) {
      return
    }
    this.device = device
    this.setSrc()
  }

  setSrc() {
    let src = this.elem.data('desktop-src')
    if(this.device === 'mobile') {
      src = this.elem.data('mob-src')
    }
    this.elem.attr('src', src)
  }
}

$(document).ready(() => {
  $('section.main.buy .top-block video.dots').each((index, elem) => {
    new Waves({elem: $(elem)})
  })
})