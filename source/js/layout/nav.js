class Nav {
  constructor(options) {
    this.elem = options.elem
    this.menuContainerElem = this.elem.find('.menu-container')
    this.mup = $('body').data('mup')

    this.elem.click((event) => {
      let triggerElem = $(event.target).closest('.logo').add($(event.target).closest('.close'))
      //Именно так определяется ширина окна, чтобы она была такой же, как в медиа-запросах css
      let width = window.innerWidth
      if (triggerElem.length && width < this.mup) {
        event.preventDefault()
        this.toggleMenu()
      }
    })
  }

  toggleMenu() {
    this.elem.toggleClass('__open')
    this.menuContainerElem.slideToggle()
  }
}

$(document).ready(() => {
  $('nav.main').each((index, elem) => {
    new Nav({elem: $(elem)})
  })
})