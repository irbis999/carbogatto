import AccCart from '@/components/cart/acc'
import BikesCart from '@/components/cart/bikes'
import 'jquery-form'

class OrderModal {
  constructor(options) {
    this.elem = options.elem
    this.accTable = this.elem.find('.__acc-table')
    this.accTr = require('./acc_tr.pug')
    this.bikesTable = this.elem.find('.__bikes-table')
    this.bikeTbory = require('./bike_tbody.pug')
    this.bikeBasePrice = this.bikesTable.data('bike-base-price')

    //Заполняем таблицу аксессуарами
    this.fillAccTable()
    this.checkAccVisibility()
    this.setAccTotal()
    //Удаление аксессуара
    this.elem.click(e => {
      if ($(e.target).closest('.__delete-acc').length &&
        this.elem[0].contains(e.target) &&
        confirm('Remove item from shopping list?')) {
        this.deleteAcc($(e.target).closest('tr'))
      }
    })
    //Изменение кол-ва аксессуаров
    this.accTable.change(this.changeAccAmount.bind(this))
    //Обновление списка аксессуаров
    this.elem.on('mc:acc_update', this.accListUpdate.bind(this))

    //Заполнение таблицы байками
    this.fillBikesTable()
    this.checkBikesVisibility()
    this.setBikesTotal()
    //Удаление байка
    this.elem.click(e => {
      if ($(e.target).closest('.__delete-bike').length &&
        this.elem[0].contains(e.target) &&
        confirm('Remove item from shopping list?')) {
        this.deleteBike($(e.target).closest('tbody'))
      }
    })
    //Изменение кол-ва байков
    this.bikesTable.change(this.changeBikesAmount.bind(this))
    //Обновление списка байков
    this.elem.on('mc:bikes_update', this.bikesListUpdate.bind(this))

    //Общая сумма
    this.setTotal()

    //Отправка формы
    this.elem.find('form').ajaxForm({
      beforeSubmit: () => {
        if (!AccCart.getCart().length && !BikesCart.getCart().length) {
          alert('Your shopping list is empty')
          return false
        }
      },
      success: () => {
        AccCart.clearCart()
        BikesCart.clearCart()
        let contentElem = this.elem.find('.ct-mc-content')
        contentElem
          .addClass('__after-order')
          .css('height', contentElem.outerHeight())
        setTimeout(() => {
          contentElem.animate({height: '11em'}, 1000)
        }, 1000)
        this.elem.find('.order-content').fadeOut(200, () => {
          this.elem.find('.after-order-content').fadeIn(200)
        })
      }
    })

    //Зарытие окна
    this.elem.click((e) => {
      if ($(e.target).closest('.ct-mc-close').length &&
        this.elem[0].contains(e.target)) {
        this.hideModal()
      }
    })
    //Показ окна
    this.elem.on('mc:show', this.showModal.bind(this))


    //Для тестов
    //this.showModal()
  }

  fillBikesTable() {
    this.bikesTable.find('tr:not(.__title)').remove()
    let cart = BikesCart.getCart()
    for (let item of cart) {
      item.bikeBasePrice = this.bikeBasePrice
      this.bikesTable.append(this.bikeTbory(item))
    }
  }

  checkBikesVisibility() {
    if (BikesCart.getCart().length) {
      this.bikesTable.show()
      return
    }

    this.bikesTable.hide()
  }

  setBikesTotal() {
    let total = 0
    for (let item of BikesCart.getCart()) {
      let price = this.bikeBasePrice + item.framePrice + item.batteryPrice +
        item.motorPrice + item.tyresPrice + item.colorPrice +
        item.detailsPrice + item.linksPrice
      total += price * item.num
    }
    this.elem.find('.__bikes-total').text(`${total} €`)
    return total
  }

  deleteBike(bikeElem) {
    BikesCart.deleteBike({
      frameId: bikeElem.data('frame-id'),
      batteryId: bikeElem.data('battery-id'),
      motorId: bikeElem.data('motor-id'),
      tyresId: bikeElem.data('tyres-id'),
      colorId: bikeElem.data('color-id'),
      detailsId: bikeElem.data('details-id'),
      linksId: bikeElem.data('links-id'),
    })
    bikeElem.remove()
    this.checkBikesVisibility()
    this.setBikesTotal()
    this.setTotal()
  }

  changeBikesAmount(e) {
    let tbodyElem = $(e.target).closest('tbody')
    let cart = BikesCart.getCart()
    let index = BikesCart.bikeIndex({
      frameId: tbodyElem.data('frame-id'),
      batteryId: tbodyElem.data('battery-id'),
      motorId: tbodyElem.data('motor-id'),
      tyresId: tbodyElem.data('tyres-id'),
      colorId: tbodyElem.data('color-id'),
      detailsId: tbodyElem.data('details-id'),
      linksId: tbodyElem.data('links-id'),
    })
    let item = cart[index]
    item.num = +$(e.target).val()
    BikesCart.addBike(item, true)
    this.setBikesTotal()
    this.setTotal()
    this.fillBikesTable()
  }

  bikesListUpdate() {
    this.fillBikesTable()
    this.setBikesTotal()
    this.setTotal()
    this.checkBikesVisibility()
  }

  accListUpdate() {
    this.fillAccTable()
    this.setAccTotal()
    this.setTotal()
    this.checkAccVisibility()
  }

  changeAccAmount(e) {
    let id = $(e.target).closest('tr').data('id')
    let cart = AccCart.getCart()
    let index = cart.findIndex(elem => elem.id == id)
    let acc = cart[index]
    acc.num = +$(e.target).val()
    AccCart.addAcc(cart[index], true)
    this.setAccTotal()
    this.setTotal()
    this.fillAccTable()
  }

  fillAccTable() {
    this.accTable.find('tr:not(.__title)').remove()
    let cart = AccCart.getCart()
    for (let acc of cart) {
      this.accTable.append(this.accTr(acc))
    }
  }

  setAccTotal() {
    let total = 0
    for (let acc of AccCart.getCart()) {
      total += acc.num * acc.price
    }
    this.elem.find('.__acc-total').text(`${total} €`)
  }

  checkAccVisibility() {
    if (AccCart.getCart().length) {
      this.accTable.show()
      return
    }

    this.accTable.hide()
  }

  deleteAcc(accElem) {
    AccCart.deleteAcc(accElem.data('id'))
    accElem.remove()
    this.checkAccVisibility()
    this.setAccTotal()
    this.setTotal()
  }

  setTotal() {
    let total = +this.elem.find('.__acc-total').text().replace(/\D/g, '') +
      +this.elem.find('.__bikes-total').text().replace(/\D/g, '')
    this.elem.find('.__total-price').text(`${total} €`)
  }

  showModal() {
    let contentElem = this.elem.find('.ct-mc-content')
    this.elem.fadeIn('fast')
    contentElem.css('transform', 'translateY(0)')
  }

  hideModal() {
    let contentElem = this.elem.find('.ct-mc-content')
    contentElem
      .css('transform', 'translateY(100vh)')
      .one('transitionend', () => this.elem.fadeOut('fast'))
  }
}

$(document).ready(() => {
  $('.modal-component.__order').each((index, elem) => {
    new OrderModal({elem: $(elem)})
  })
})