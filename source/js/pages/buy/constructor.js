class Index {
  constructor(options) {
    //TODO после того как будет сверстано модальное окно нужно реализовать его тут
    this.elem = options.elem
    this.totalPriceElem = this.elem.find('.total-price')
    this.frameNameElem = this.elem.find('.frame-name')
    this.framePriceElem = this.elem.find('.frame-price')
    this.frameControlElem = this.elem.find('.frame-control')
    this.batteryNameElem = this.elem.find('.battery-name')
    this.batteryPriceElem = this.elem.find('.battery-price')
    this.batteryControlElem = this.elem.find('.battery-control')
    this.motorNameElem = this.elem.find('.motor-name')
    this.motorPriceElem = this.elem.find('.motor-price')
    this.motorControlElem = this.elem.find('.motor-control')
    this.tyresNameElem = this.elem.find('.tyres-name')
    this.tyresPriceElem = this.elem.find('.tyres-price')
    this.tyresControlElem = this.elem.find('.tyres-control')

    this.frameControlElem.on('change', (event) => {
      let rowElem = $(event.target).closest('.row')
      this.frameNameElem.text(rowElem.find('.title').text())
      this.framePriceElem.text(rowElem.find('.price').text())
      this.setTotal()
    })

    this.batteryControlElem.on('change', (event) => {
      let rowElem = $(event.target).closest('.row')
      this.batteryNameElem.text(rowElem.find('.title').text())
      this.batteryPriceElem.text(rowElem.find('.price').text())
      this.setTotal()
    })

    this.motorControlElem.on('change', (event) => {
      let rowElem = $(event.target).closest('.row')
      this.motorNameElem.text(rowElem.find('.title').text())
      this.motorPriceElem.text(rowElem.find('.price').text())
      this.setTotal()
    })

    this.tyresControlElem.on('change', (event) => {
      let rowElem = $(event.target).closest('.row')
      this.tyresNameElem.text(rowElem.find('.title').text())
      this.tyresPriceElem.text(rowElem.find('.price').text())
      this.setTotal()
    })
  }

  setTotal() {
    let total = parseInt(this.framePriceElem.text().replace(/\s/g, ''))
    total += parseInt(this.batteryPriceElem.text().replace(/\s/g, ''))
    total += parseInt(this.motorPriceElem.text().replace(/\s/g, ''))
    total += parseInt(this.tyresPriceElem.text().replace(/\s/g, ''))

    let totalText = total.toString().replace(/./g, (c, i, a) => {
      return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c
    })

    this.totalPriceElem.text(totalText)
  }
}

$(document).ready(() => {
  $('section.main.buy').each((index, elem) => {
    new Index({elem: $(elem)})
  })
})