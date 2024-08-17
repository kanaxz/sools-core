const ExtensibleFunction = require('../../types/ExtensibleFunction')

module.exports = class Lock extends ExtensibleFunction {
  constructor() {
    super((fn) => this.process(fn))
  }

  async process(fn) {
    if (this.promises) {
      const promise = new Promise((resolve, reject) => {
        this.promises.push([resolve, reject])
      })
      return promise
    } else {
      this.promises = []
    }
    try {
      await fn()
      for (const [resolve] of this.promises) {
        resolve(er)
      }
    } catch (err) {
      for (const [, reject] of this.promises) {
        reject(er)
      }
    } finally {
      this.promises = null
    }
  }
}