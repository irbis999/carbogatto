import queryString from 'query-string'

class Share {
	constructor(options) {
		this.elem = options.elem

		this.elem.click((event) => {
			console.log('click')
			let link = $(event.target).closest(".ct-sc-link")
			if (link.length && this.elem[0].contains(event.target)) {
				if (link.hasClass("__in")) {
					this.showIn()
				}
				if (link.hasClass("__fb")) {
					this.showFb()
				}
				if (link.hasClass("__twitter")) {
					this.showTwitter()
				}
				if (link.hasClass("__google")) {
					this.showGoogle()
				}
			}
		})
	}

	showIn() {
		let urlOptions = {
			url: location.href,
			mini: 'true',
		}

		urlOptions = queryString.stringify(urlOptions)
		let url = `https://www.linkedin.com/shareArticle?${urlOptions}`

		let options = {
			width: 650,
			height: 540,
			url: url,
		}

		this.openPopup(options)
	}

	showFb() {
		let urlOptions = {
			u: location.href,
		}

		urlOptions = queryString.stringify(urlOptions)
		let url = `https://www.facebook.com/sharer.php?${urlOptions}`

		let options = {
			width: 800,
			height: 680,
			url: url,
		}

		this.openPopup(options)
	}

	showTwitter() {
		let urlOptions = {
			url: location.href,
		}

		urlOptions = queryString.stringify(urlOptions)
		let url = `https://twitter.com/intent/tweet?${urlOptions}`

		let options = {
			width: 560,
			height: 480,
			url: url,
		}

		this.openPopup(options)
	}

	showGoogle() {
		let urlOptions = {
			url: location.href,
		}

		urlOptions = queryString.stringify(urlOptions)
		let url = `https://plus.google.com/share?${urlOptions}`

		let options = {
			width: 560,
			height: 520,
			url: url,
		}

		this.openPopup(options)
	}

	openPopup(options) {
		let left = screen.width / 2 - 325
		let top = screen.height / 2 - 270
		window.open(options.url, "social", `width=${options.width},height=${options.height},left=${left},top=${top},resizable=yes,scrollbars=yes`)
	}
}

$(document).ready(() => {
	$('.share-component').each((index, elem) => {
		new Share({elem: $(elem)})
	})
})