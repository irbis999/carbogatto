class Video {
	constructor(options) {
		this.elem = options.elem
		this.loaded = false
		let observer = new IntersectionObserver(this.load.bind(this))
		observer.observe(this.elem[0])
	}

	load(entries) {
		//При обратном скроле запускаем видео
		if(!entries[0].isIntersecting) return
		if(entries[0].boundingClientRect.top > 0) return
		if(this.loaded) return
		this.loaded = true
		this.elem[0].play()
	}
}

$(document).ready(() => {
	$('section.main.index video').each((index, elem) => {
		new Video({elem: $(elem)})
	})
})