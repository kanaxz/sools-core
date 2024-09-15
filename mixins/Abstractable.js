import mixer from "../mixer"

export default mixer.mixin([], (baseClass) => {

  return class Abstractable extends baseClass {
    constructor(...args) {
      super(...args)
      if (this.constructor.definition.abstract) {
        throw new Error(`Cannot instanciate abstract type ${this.constructor.definition.name}`)
      }
    }
  }
})