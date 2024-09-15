import mixer from "../mixer"

export default mixer.mixin((baseClass) => {
  return class Initializeable extends baseClass {
    constructor(...args){
      super(...args)
      this.isInitialized = false
    }
    initialize() {
      this.isInitialized = true
    }
  }
})