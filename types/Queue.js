const Array = require('./Array')
const { loop, bound } = require('../utils/number')

module.exports = class Queue extends Array {
  constructor(...args) {
    super(...args)
    this.index = 0
  }

  next() {
    this.index = loop(this.index + 1, [0, this.length - 1])
    this.changed()
  }

  previous() {
    this.index = loop(this.index - 1, [0, this.length -1])
    this.changed()
  }

  get current() {
    return this[this.index]
  }

  removeCurrent() {
    const current = this.current
    this.index = bound(this.index, [0, this.length - 1])
    this.splice(this.index, 1)
    return current
  }
}