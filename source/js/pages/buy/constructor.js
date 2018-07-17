import BikesCart from '@/components/cart/bikes'

class Index {
  constructor(options) {
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
    this.orderModalElem = $('.modal-component.__order')

    this.frameControlElem.on('change', (event) => {
      let rowElem = $(event.target).closest('.row')
      this.frameNameElem.data('id', $(event.target).val())
      this.frameNameElem.data('default', !!$(event.target).data('default'))
      this.frameNameElem.text(rowElem.find('.title').text())
      this.framePriceElem.text(rowElem.find('.price').text())
      this.setTotal()
    })

    this.batteryControlElem.on('change', (event) => {
      let rowElem = $(event.target).closest('.row')
      this.batteryNameElem.data('id', $(event.target).val())
      this.batteryNameElem.data('default', !!$(event.target).data('default'))
      this.batteryNameElem.text(rowElem.find('.title').text())
      this.batteryPriceElem.text(rowElem.find('.price').text())
      this.setTotal()
    })

    this.motorControlElem.on('change', (event) => {
      let rowElem = $(event.target).closest('.row')
      this.motorNameElem.data('id', $(event.target).val())
      this.motorNameElem.data('default', !!$(event.target).data('default'))
      this.motorNameElem.text(rowElem.find('.title').text())
      this.motorPriceElem.text(rowElem.find('.price').text())
      this.setTotal()
    })

    this.tyresControlElem.on('change', (event) => {
      let rowElem = $(event.target).closest('.row')
      this.tyresNameElem.data('id', $(event.target).val())
      this.tyresNameElem.data('default', !!$(event.target).data('default'))
      this.tyresNameElem.text(rowElem.find('.title').text())
      this.tyresPriceElem.text(rowElem.find('.price').text())
      this.setTotal()
    })

    //Для первичной инициализации
    this.elem.find('.options-block input[type=radio]:checked')
      .trigger('change')

    this.elem.click(e => {
      if($(e.target).closest('.__buy-button').length &&
      this.elem[0].contains(e.target)) {
        this.showOrderModal()
      }
    })
  }

  showOrderModal() {
    let colorRadioElem = this.elem.find('.color-block input[type=radio]:checked')
    let bike = {
      num: 1,
      colorId: +colorRadioElem.val(),
      colorName: colorRadioElem.data('name'),
      colorPrice: +colorRadioElem.data('price'),
      colorFill: colorRadioElem.data('fill'),
      colorDefault: !!colorRadioElem.data('default'),
      frameId: +this.frameNameElem.data('id'),
      frameDefault: this.frameNameElem.data('default'),
      frameName: this.frameNameElem.text(),
      framePrice: this.getNumPrice(this.framePriceElem.text()),
      batteryId: +this.batteryNameElem.data('id'),
      batteryDefault: !!this.batteryNameElem.data('default'),
      batteryName: this.batteryNameElem.text(),
      batteryPrice: this.getNumPrice(this.batteryPriceElem.text()),
      motorId: +this.motorNameElem.data('id'),
      motorDefault: !!this.motorNameElem.data('default'),
      motorName: this.motorNameElem.text(),
      motorPrice: this.getNumPrice(this.motorPriceElem.text()),
      tyresId: +this.tyresNameElem.data('id'),
      tyresDefault: !!this.tyresNameElem.data('default'),
      tyresName: this.tyresNameElem.text(),
      tyresPrice: this.getNumPrice(this.tyresPriceElem.text()),
    }
    BikesCart.addBike(bike)

    //$.deleteCookie('bikes_cart')
    //console.log($.getCookie('bikes_cart'))
    //console.log(bike)
    this.orderModalElem.trigger('mc:bikes_update')
    $('.modal-component.__order').trigger('mc:show')
  }

  getNumPrice(price) {
    price = price.replace(/\D/g, '')
    return +price
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