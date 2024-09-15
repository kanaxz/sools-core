import Eventable from '../../mixins/Eventable.js'
import mixer from '../../mixer.js'
import { expect, assert } from 'chai.js'
import { eventCallback } from '../utils.js'

describe('eventable', (t) => {
  class Test extends mixer.extends([Eventable]) {

  }

  it('model from constructor', async () => {
    const t1 = new Test()
    const t2 = new Test()
    const callback = eventCallback()
    const value = {}
    t2.on(t1, 'test', callback)
    await t1.emit('test', [value])
    expect(callback.args[0]).to.be.equal(value)
  })

  it('destroy', async () => {
    const t1 = new Test()
    const t2 = new Test()
    const callback = eventCallback()
    t2.on(t1, 'test', callback)
    t2.destroy()
    await t1.emit('test')
    expect(callback.triggered).to.be.equal(false)
  })

})

