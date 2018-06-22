import _debounce from 'lodash.debounce'

class ModalTrigger {
  constructor(options) {
    this.elem = options.elem
    this.modalElem = $(this.elem.data('modal'))

    this.elem.click(event => {
      if ($(event.target).closest('a').length) return
      this.showModal()
    })
  }

  showModal() {
    this.modalElem.fadeIn()
    setTimeout(() => {
      this.modalElem.trigger('mc:show')
    }, 100)
  }
}

class Modal {
  constructor(options) {
    this.elem = options.elem
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

    this.elem.click(event => {
      if ($(event.target).closest('.close').length) {
        this.hideModal()
      }
    })

    this.elem.on('mc:show', this.setPosition.bind(this))
    $(window).on('resize', _debounce(this.setPosition.bind(this), 200))
  }

  hideModal() {
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