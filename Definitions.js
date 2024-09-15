import Tree from './types/Tree.js'

export default (
	class Definitions extends Tree {
  constructor(owner) {
    super()
    this.push(owner.definition)
    this.owner = owner
    owner.definition.parents
      .filter((o) => o.definitions)
      .forEach((parent) => {
        this.push(parent.definitions)
      })
  }
}
)