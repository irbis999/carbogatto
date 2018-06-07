class Waves {
	constructor(options) {
		this.elem = options.elem
		this.renderer = new THREE.CanvasRenderer({alpha: true})
		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.mup = $('body').data('mup')
		this.device = 'desktop'
		if(window.innerWidth < this.mup) {
			this.device = 'mobile'
		}
		this.particles = []
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(100, 2, 5, 10000)
		this.camera.position.set(0, 500, 0)
		this.count = 0
		this.AMOUNTX =  100
		this.AMOUNTY = 20
		this.SEPARATION = 140

		this.init()
		this.animate()
		this.setSize()

		$(window).on('resize', () => {
			let width = window.innerWidth
			let device = 'desktop'
			if(width < this.mup) {
				device = 'mobile'
			}
			if(this.device === device) {
				return
			}
			this.device = device
			this.setSize()
		})
		//window.addEventListener('resize', this.setSize.bind(this), false)
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this))
		this.render()
	}

	render() {
		let i = 0
		for (let ix = 0; ix < this.AMOUNTX; ix++) {
			for (let iy = 0; iy < this.AMOUNTY; iy++) {
				let particle = this.particles[i++]
				particle.position.y = (Math.sin((ix + this.count) * 0.3) * 50) +
					(Math.sin((iy + this.count) * 0.5) * 50)
				particle.scale.x = particle.scale.y = (Math.sin((ix + this.count) * 0.3) + 1) * 4 +
					(Math.sin((iy + this.count) * 0.5) + 1) * 4
			}
		}
		this.renderer.render(this.scene, this.camera)
		this.count += 0.1
	}

	init() {
		let PI2 = Math.PI * 2
		let material = new THREE.SpriteCanvasMaterial({
			color: '#00d2ff',
			program (ctx) {
				ctx.beginPath()
				ctx.shadowColor = '#00d2ff'
				ctx.shadowBlur = 10
				ctx.arc(0.9, 0, 0.3, 0, PI2, true)
				ctx.fill()
			}
		})
		let i = 0
		for (let ix = 0; ix < this.AMOUNTX; ix++) {
			for (let iy = 0; iy < this.AMOUNTY; iy++) {
				let particle = this.particles[i++] = new THREE.Sprite(material)
				particle.position.x = ix * this.SEPARATION - ((this.AMOUNTX * this.SEPARATION) / 2)
				particle.position.z = iy * this.SEPARATION - ((this.AMOUNTY * this.SEPARATION) / 2)
				this.scene.add(particle)
			}
		}

		this.elem.append(this.renderer.domElement)
	}

	setSize() {
		//windowHalfX = window.innerWidth / 2
		//windowHalfY = window.innerHeight / 2
		//camera.aspect = window.innerWidth / window.innerHeight
		//camera.updateProjectionMatrix()
		//this.renderer.setSize(window.innerWidth, 280)
		if(this.device === 'desktop') {
			this.renderer.setSize(2000, 570)
			return
		}

		this.renderer.setSize(550, 280)
	}
}

$(document).ready(() => {
	$('section.main.buy .top-block').each((index, elem) => {
		new Waves({elem: $(elem)})
	})
})