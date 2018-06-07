import 'slick-carousel'
import 'slick-carousel/slick/slick.css'
import _debounce from 'lodash.debounce'

class Gallery {
	constructor(options) {
		this.elem = options.elem
		this.modalElem = $('.gallery-modal')
		this.carouselElem = this.modalElem.find('.slides')
		this.itemElems = this.elem.find('.item')

		this.carouselElem.slick({
			arrow: true,
			appendArrows: this.modalElem.find('.container'),
			prevArrow: this.modalElem.find('.prev'),
			nextArrow: this.modalElem.find('.next'),
			dots: true,
			appendDots: this.modalElem.find('.pager'),
			dotsClass: 'pager-inner',
			adaptiveHeight: true
		})

		$(window).on('resize', _debounce(this.setPosition.bind(this), 200))

		this.elem.click((event) => {
			let itemElem = $(event.target).closest('.item')
			if (itemElem.length && this.elem[0].contains(event.target)) {
				this.showModal(itemElem)
			}
		})

		this.modalElem.click((event) => {
			let closeElem = $(event.target).closest('.close')
			if (closeElem.length && this.modalElem[0].contains(event.target)) {
				this.closeModal()
			}
		})
	}

	setPosition() {
		this.carouselElem.slick('setPosition')
	}

	showModal(itemElem) {
		this.modalElem.fadeIn()
		let index = this.itemElems.index(itemElem)
		this.carouselElem.slick('slickGoTo', index, true)
		setTimeout(() => {
			this.setPosition()
		}, 100)
	}

	closeModal() {
		this.modalElem.fadeOut()
	}
}

$(document).ready(() => {
	$('section.main.gallery').each((index, elem) => {
		new Gallery({elem: $(elem)})
	})
})