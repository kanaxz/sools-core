import Tree from '../types/Tree.js'
import { expect, assert } from 'chai.js'

describe('tree', (t) => {

  it('found', async () => {
    const tree = new Tree()
    const obj = {}
    tree.push(obj)
    const found = tree.find((o) => o === obj)
    expect(found).to.be.equal(obj)
  })


  it('count', async () => {
    const tree = new Tree()
    tree.push(1)
    expect(tree.count).to.be.equal(1)
  })



})

