import mixer from '../mixer.js'
import { expect, assert } from 'chai.js'

describe('base', (t) => {

  it('hasMixin', async () => {
    const M1 = mixer.mixin((base) => class extends base { }).define()
    const M2 = mixer.mixin([M1], (base) => class extends base { }).define()
    const M3 = mixer.mixin([M1], (base) => class extends base { }).define()
    class C1 extends mixer.extends(class { }, [M3, M2]) {
    }

    C1.define()
    expect(M2.hasMixin(M1)).to.be.equal(true)
    expect(C1.hasMixin(M1)).to.be.equal(true)
    expect(C1.hasMixin(mixer.base)).to.be.equal(true)
  })
})

