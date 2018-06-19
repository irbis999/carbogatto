import lozad from 'lozad'

class Index {
	constructor(options) {
		this.elem = options.elem
		lozad('.lozad', {
			threshold: .7,
			load: elem => {
				if ($(elem).hasClass('__battery')) {
					this.animateBattery($(elem))
					return
				}

				if ($(elem).hasClass('__motor')) {
					this.animateMotor($(elem))
					return
				}

				if ($(elem).hasClass('__frame')) {
					this.animateFrame($(elem))
					return
				}

				if ($(elem).hasClass('__sus-bike')) {
					this.animateSusBike($(elem))
					return
				}

				if ($(elem).hasClass('__sus-logos')) {
					this.animateSusLogos($(elem))
					return
				}

				if ($(elem).hasClass('__stand')) {
					this.animateStand($(elem))
					return
				}

				if ($(elem).hasClass('__tyres-logos')) {
					this.animateTyresLogos($(elem))
					return
				}

				if ($(elem).hasClass('__create')) {
					this.animateCreate($(elem))
					return
				}
			}
		}).observe()

		this.setSusBikeStyles()
		this.setStandStyles()
		this.setCreateStyles()
	}

	animateCreate(elem) {
		elem.find('.bike-icon .bike path').css('animation', 'dash 2s forwards')
		elem.find('.bike-icon .lines path').each((index, elem) => {
			let time = (.3 + Math.random()) * 2.2
			$(elem).css('animation', `dash ${time}s 2s forwards`)
		})
	}

	setCreateStyles() {
		this.elem.find('.create-block .bike-icon path').each((index, elem) => {
			this.setDashLength(elem)
		})
	}

	animateTyresLogos(elem) {
		elem.css('animation', 'appear 1.5s forwards')
	}

	setStandStyles() {
		this.elem.find('.stand-block .bike-icon path').each((index, elem) => {
			//У ножки обводки нет. Ее фейдом выведем
			if($(elem).is('.stand-stick')) {
				$(elem).css('opacity', 0)
				return
			}
			this.setDashLength(elem)
		})
	}

	animateStand(elem) {
		elem.find('.bike-icon path').css('animation', 'dash 2s forwards')
		elem.find('.bike-icon .stand-stick').css('animation', 'appear 2s forwards')
	}

	animateSusLogos(elem) {
		elem.css('animation', 'appear 1.5s forwards')
	}

	setDashLength(elem) {
		let length = elem.getTotalLength()
		$(elem).css({
			'stroke-dasharray': length,
			'stroke-dashoffset': length,
		})
	}

	setSusBikeStyles() {
		this.elem.find('.suspension-block .bike-icon path').each((index, elem) => {
			this.setDashLength(elem)
		})
	}

	animateSusBike(elem) {
		elem.find('.bike-icon path').css('animation', 'dash 2s forwards')
		elem.find('.shocks').css('animation', 'appear 1s 2s forwards')
	}

	animateFrame(elem) {
		//Линии
		elem.find('.line').css('animation', 'slide-to-right 2s forwards')
		//Текст
		elem.find('.text').css('animation', 'appear 2.4s forwards')
	}

	animateBattery(elem) {
		//Линии
		elem.find('.icons-line').css('animation', 'slide-to-right 2s forwards')
		//Батарейка
		elem.find('.__body').css('animation', 'appear .3s forwards')
		for (let i = 1; i <= 10; i++) {
			elem.find(`.__${i}`).css('animation', `appear .2s ${i * 200 / 1000}s forwards`)
		}
		//Напряжение
		elem.find('.icons-icon.__voltage').css('animation', 'appear-zoom 1.5s forwards')
		//Дистация
		elem.find('.wheel-left').css('animation', 'appear .5s forwards')
		elem.find('.dots').css('animation', 'appear .5s .5s forwards')
		elem.find('.wheel-right').css('animation', 'appear .5s 1s forwards')
		elem.find('.flag').css('animation', 'appear .5s 1.5s forwards')
		//Цифры
		elem.find('.icons-title .__number').each((index, elem) => {
			let time = 1000
			if ($(elem).is('.__voltage')) time += 200
			if ($(elem).is('.__range-from')) time += 400
			if ($(elem).is('.__range-to')) time += 600
			this.animateNumber($(elem), +$(elem).data('to'), 0, time)
		})
	}

	animateNumber(elem, to, from = 0, time = 2500) {
		if (!to) return
		let intNum = to - from
		let intTime = time / intNum
		let num = 0
		let value = from
		let intervalId = setInterval(() => {
			if (value === to) {
				clearInterval(intervalId)
				return
			}

			value += 1
			elem.text(value)

			//Дополнительная проверка на всякий случай, чтобы точно в бесконечность не попасть
			num++
			if (num >= intNum) {
				clearInterval(intervalId)
			}
		}, intTime)
	}

	animateMotor(elem) {
		//Иконка speed
		elem.find('.icons-icon.__speed .__arrow').css('animation', 'turn-arrow 1.5s forwards')
		//Линии
		elem.find('.icons-line').css('animation', 'slide-to-right 2s forwards')
		//Иконка power
		elem.find('.icons-icon.__power').css('animation', 'appear 1.5s forwards')
		//Иконка features
		for (let i = 1; i <= 4; i++) {
			elem.find(`.__${i}`).css('animation', `appear .5s ${i * 400 / 1000}s forwards`)
		}
	}


}

$(document).ready(() => {
	$('section.main.index').each((index, elem) => {
		new Index({elem: $(elem)})
	})
})