import _debounce from 'lodash.debounce'
import AccCart from '@/components/cart/acc'

class ModalTrigger {
  constructor(options) {
    this.elem = options.elem
    this.modalElem = $(this.elem.data('modal'))
    this.elem.click(this.showModal.bind(this))
  }

  showModal() {
    this.modalElem
      .removeClass('__bg-transparent')
      .fadeIn()
    //Для пересетапа галереи
    setTimeout(() => {
      this.modalElem.trigger('mc:show')
    }, 100)
  }
}

class Modal {
  constructor(options) {
    this.elem = options.elem
    this.orderModalElem = $('.modal-component.__order')
    this.cartButtonElem = this.elem.find('.button-component.__cart-button')
    this.carouselElem = this.elem.find('.slides')
    this.carouselElem.slick({
      arrow: true,
      appendArrows: this.elem.find('.gallery-block'),
      prevArrow: this.elem.find('.prev'),
      nextArrow: this.elem.find('.next'),
      dots: true,
      appendDots: this.elem.find('.pager'),
      dotsClass: 'pager-inner',
      adaptiveHeight: true
    })

    this.elem.click(e => {
      if ($(e.target).closest('.close').length &&
      this.elem[0].contains(e.target)) {
        this.hideModalRegular()
      }
    })

    this.cartButtonElem.click(e => {
      AccCart.addAcc({
        id: this.cartButtonElem.data('id'),
        name: this.cartButtonElem.data('name'),
        num: 1,
        price: this.cartButtonElem.data('price'),
      })

      this.orderModalElem.trigger('mc:acc_update')
      this.showOrderModal()
    })

    this.elem.on('mc:show', this.setPosition.bind(this))
    $(window).on('resize', _debounce(this.setPosition.bind(this), 200))
  }

  showOrderModal() {
    this.hideModal()
    this.orderModalElem.trigger('mc:show')
  }

  hideModal() {
    this.elem.addClass('__bg-transparent')
    setTimeout(() => {
      this.elem.fadeOut('fast')
    }, 800)
  }

  hideModalRegular() {
    this.elem.fadeOut()
  }

  setPosition() {
    this.carouselElem.slick('setPosition')
  }
}

$(document).ready(() => {
  $('.accessories-modal').each((index, elem) => {
    new Modal({elem: $(elem)})
  })
})


$(document).ready(() => {
  $('section.main.accessories .modal-trigger').each((index, elem) => {
    new ModalTrigger({elem: $(elem)})
  })
})