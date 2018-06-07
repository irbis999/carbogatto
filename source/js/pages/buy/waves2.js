class Waves {
	constructor(options) {
		//return
		this.elem = options.elem
		this.couter = +this.elem.data('start')
		this.setDotPosition()
	}

	setDotPosition() {
		//top : 0-100
		let top = 100 * Math.sin(Math.PI * this.couter) / 2 + 50
		this.couter += .01
		//Изменять top не получается - не работает в сафари
		//this.elem.css('top', `${top}%`)
		this.elem.css('margin-top', `${top}em`)
		requestAnimationFrame(this.setDotPosition.bind(this))
	}
}

$(document).ready(() => {
	$('section.main.buy .top-block .waves .dot').each((index, elem) => {
		new Waves({elem: $(elem)})
	})
})