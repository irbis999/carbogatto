export default class BikesCart {
  //bike: {frameId: Number, frameName: String, framePrice: Number,
  // batteryId: Number,  batteryName: String, batteryPrice: Number,
  // motorId: Number, motorName: String, motorPrice: Number,
  // tyresId: Number, tyresName: String, tyresPrice: Number,
  // detailsId: Number, linksId: Number}
  static addBike(bike, updateNum = false) {
    if (!this.checkBikeFormat(bike)) {
      return
    }

    let cart = this.getCart()
    let index = this.bikeIndex(bike)
    //Товар уже в корзине
    if (index !== -1) {
      if (updateNum) {
        //Обновляем кол-во
        cart[index].num = bike.num
      } else {
        //Увеличиваем кол-во на 1
        cart[index].num += 1
      }

      this.saveCart(cart)
      return
    }

    //Товара нет в корзине
    cart.push(bike)
    this.saveCart(cart)
  }

  static bikeIndex(bike) {
    let cart = this.getCart()
    //console.log(bike, cart)
    return cart.findIndex(elem => {
      if(bike.frameId === elem.frameId &&
      bike.batteryId === elem.batteryId &&
      bike.motorId === elem.motorId &&
      bike.tyresId === elem.tyresId &&
      bike.colorId === elem.colorId &&
      bike.detailsId === elem.detailsId &&
      bike.linksId === elem.linksId) {
        return true
      }
    })
  }

  static deleteBike(bike) {
    let cart = this.getCart()
    let index = this.bikeIndex(bike)
    if (index === -1) {
      return
    }

    cart.splice(index, 1)
    this.saveCart(cart)
  }

  static getCart() {
    let cart = $.getCookie('bikes_cart')
    if (!cart) {
      cart = []
      this.saveCart(cart)
      cart = JSON.stringify(cart)
    }
    return JSON.parse(cart)
  }

  static saveCart(cart) {
    //Защита от сохранения мусора в корзине
    if (typeof cart !== 'object') {
      cart = []
    }
    //Сохраняем на день
    $.setCookie('bikes_cart', JSON.stringify(cart), {
      expires: 60 * 60 * 24
    })
  }

  static clearCart() {
    $.deleteCookie('bikes_cart')
  }

  static checkBikeFormat(bike) {
    if (typeof bike.colorId !== 'number') {
      console.error('colorId must be number')
      return false
    }
    if (typeof bike.num !== 'number') {
      console.error('num must be number')
      return false
    }
    if (typeof bike.frameId !== 'number') {
      console.error('frameName must be number')
      return false
    }
    if (typeof bike.batteryId !== 'number') {
      console.error('batteryName must be number')
      return false
    }
    if (typeof bike.motorId !== 'number') {
      console.error('motorName must be number')
      return false
    }
    if (typeof bike.tyresId !== 'number') {
      console.error('tyresName must be number')
      return false
    }

    if (typeof bike.frameName !== 'string') {
      console.error('frameName must be number')
      return false
    }
    if (typeof bike.framePrice !== 'number') {
      console.error('framePrice must be number')
      return false
    }

    if (typeof bike.batteryName !== 'string') {
      console.error('batteryName must be number')
      return false
    }
    if (typeof bike.batteryPrice !== 'number') {
      console.error('batteryPrice must be number')
      return false
    }
    if (typeof bike.motorName !== 'string') {
      console.error('motorName must be number')
      return false
    }
    if (typeof bike.motorPrice !== 'number') {
      console.error('motorPrice must be number')
      return false
    }
    if (typeof bike.tyresName !== 'string') {
      console.error('tyresName must be number')
      return false
    }
    if (typeof bike.tyresPrice !== 'number') {
      console.error('tyresPrice must be number')
      return false
    }

    if (typeof bike.detailsId !== 'number') {
      console.error('detailsId must be number')
      return false
    }

    if (typeof bike.linksId !== 'number') {
      console.error('linksId must be number')
      return false
    }

    return true
  }
}