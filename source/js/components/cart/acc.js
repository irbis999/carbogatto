export default class AccCart {
  //acc: {id: Number, name: String, num: Number, price: String}
  static addAcc(acc, updateNum = false) {
    if (!this.checkAccFormat(acc)) {
      return
    }

    let cart = this.getCart()
    let index = cart.findIndex(elem => elem.id === acc.id)
    //Товар уже в корзине
    if (index !== -1) {
      if(updateNum) {
        //Обновляем кол-во
        cart[index].num = acc.num
      } else {
        //Увеличиваем кол-во на 1
        cart[index].num += 1
      }

      this.saveCart(cart)
      return
    }

    //Товара нет в корзине
    cart.push(acc)
    this.saveCart(cart)
  }

  static deleteAcc(id) {
    let cart = this.getCart()
    let index = cart.findIndex(elem => elem.id === id)
    if(index === -1) {
      return
    }

    cart.splice(index, 1)
    this.saveCart(cart)
  }

  static getCart() {
    let cart = $.getCookie('acc_cart')
    if (!cart) {
      cart = []
      this.saveCart(cart)
      cart = JSON.stringify(cart)
    }
    return JSON.parse(cart)
  }

  static saveCart(cart) {
    //Защита от сохранения мусора в корзине
    if(typeof cart !== 'object') {
      cart = []
    }
    //Сохраняем на день
    $.setCookie('acc_cart', JSON.stringify(cart), {
      expires: 60 * 60 * 24
    })
  }

  static clearCart() {
    $.deleteCookie('acc_cart')
  }

  static checkAccFormat(acc) {
    if (typeof acc.id !== 'number') {
      console.error('id must be number')
      return false
    }
    if (typeof acc.num !== 'number') {
      console.error('num must be number')
      return false
    }
    if (typeof acc.price !== 'number') {
      console.error('price must be number')
      return false
    }
    if (typeof acc.name !== 'string') {
      console.error('name must be number')
      return false
    }
    return true
  }
}