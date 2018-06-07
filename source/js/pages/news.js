class News {
	constructor(options) {
		this.elem = options.elem
		this.bgElems = this.elem.find('article .site-container')
		this.mup = $('body').data('mup')
		this.device = 'desktop'
		if(window.innerWidth < this.mup) {
			this.device = 'mobile'
		}
		this.setBg()
		$(window).on('resize', this.checkElems.bind(this))
	}

	checkElems() {
		let width = window.innerWidth
		let device = 'desktop'
		if(width < this.mup) {
			device = 'mobile'
		}
		if(this.device === device) {
			return
		}
		this.device = device
		this.setBg()
	}

	setBg() {
		this.bgElems.each((index, elem) => {
			let src = ''
			if(this.device === 'mobile') {
				src = $(elem).data('src-mobile')
			} else {
				src = $(elem).data('src-desktop')
			}
			$(elem).css('background-image', `url(${src})`)
		})
	}
}

$(document).ready(() => {
	$('section.main.news').each((index, elem) => {
		new News({elem: $(elem)})
	})
})