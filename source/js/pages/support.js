import 'jquery-form'

class Support {
  constructor(options) {
    this.elem = options.elem
    let formElem = this.elem.find('form.partners-block ')
    formElem.ajaxForm(() => {
      formElem.find('.form-content').slideUp(400, () => {
        formElem.find('.thanx').fadeIn()
      })
    })
  }
}

$(document).ready(() => {
  $('section.main.support').each((index, elem) => {
    new Support({elem: $(elem)})
  })
})