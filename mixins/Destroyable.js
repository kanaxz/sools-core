import mixer from '../mixer.js'

const Destroyable = mixer.mixin((base) => {
  return class Destroyable extends base {

    constructor(...args) {
      super(...args)
      Object.defineProperty(this, 'destroyed', {
        enumerable: false,
        writable: true,
        value: false
      })
    }

    onAlreadyDestroyed() {
      throw new Error('Already destroyed')
    }

    destroy() {
      if (this.destroyed) {
        this.onAlreadyDestroyed()
      }
      this.destroyed = true
    }
  }
})


export default Destroyable