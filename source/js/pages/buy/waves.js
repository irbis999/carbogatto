class Waves {
  constructor(options) {
    //return
    this.elem = options.elem
    //Блоки начинают с разных значений, чтобы не выглядело плоско - рассинхрон
    this.couter = +this.elem.data('start')
    this.delta = .01
    if (this.elem.hasClass('__back')) {
      this.delta = .005
    }
    this.setDotPosition()
  }

  setDotPosition() {
    //top : 0-100
    //Какачем вверх-вниз блок .waves
    let top = 100 * Math.sin(Math.PI * this.couter) / 2 + 50
    this.couter += this.delta
    this.elem.css('transform', `translateY(${top}%)`)
    requestAnimationFrame(this.setDotPosition.bind(this))
  }
}

$(document).ready(() => {
  $('section.main.buy .top-block .waves').each((index, elem) => {
    new Waves({elem: $(elem)})
  })
})

