export default class Gene {
  constructor() {
    this._data = this.randomChar()
  }

  randomChar() {
    const charset = 'abcdefghijklmnopqrstuvwxyz '
    return charset.charAt(Math.floor(Math.random() * charset.length))
  }

  get data() {
    return this._data
  }
}
