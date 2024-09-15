import mixer from "../../mixer";
import Destroyable from "../Destroyable"
import Eventable from '../Eventable.js'
import Properties from './Properties.js'

const VALUES = Symbol('values')

const mixin = mixer.mixin([Eventable, Destroyable], (base) => {
  return class Propertiable extends base {
    static sanitizeProperty(property) {

    }

    defineProperty(property) {
      Object.defineProperty(this, property.name, {
        get: function () {
          return this[VALUES][property.name]
        },
        set: async function (newValue) {
          await this.setPropertyValue(property, newValue)
        },
        enumerable: true,
      })
    }

    static define(definition) {
      super.define(definition)
      this.properties = new Properties(this)
      return this
    }

    constructor(...args) {
      super(...args)
      const properties = this.constructor.properties
      if (properties) {
        try {
          properties.forEach((p) => this.defineProperty(p))
        } catch (err) {
          console.error(this, [...properties])
          throw err
        }
      }

      Object.defineProperty(this, VALUES, { enumerable: false, writable: true, value: {} })
    }

    async set(values, options) {
      for (const [k, v] of Object.entries(values)) {
        const property = this.constructor.properties.find((p) => p.name === k)
        if (!property) {
          this[k] = v
          continue
          /*
          console.trace(this, this.constructor, [...this.constructor.properties])
          throw new Error(`Property ${k} not found`)
          */
        }

        await this.setPropertyValue(property, v, options)
      }
    }

    async propertyChanged(property, value, oldValue) {
      await this.emit('propertyChanged', [property, value, oldValue])
      await this.emit(`propertyChanged:${property.name}`, [value, oldValue])
      await this.emit('changed')
    }

    async setPropertyValue(property, value, options) {
      if (this.destroyed) { return }
      if (value === this[property.name]) { return }

      if (!this[VALUES]) {
        this[VALUES] = {}
      }
      const oldValue = this[VALUES][property.name]
      this[VALUES][property.name] = value

      await this.propertyChanged(property, value, oldValue, options)
      return value
    }

    destroy() {
      // we set null before super.destroy as we want it to trigger the events
      this.constructor.properties.forEach((p) => {
        this[p.name] = null
      })
      super.destroy()
    }

    toJSON(paths = {}, context = null) {
      const values = Object.entries(this)
        .reduce((acc, [k, v]) => {
          const property = this.constructor.properties.find((p) => p.name === k)
          if (!property || (property.context !== undefined && property.context !== context)) {
            return acc
          }

          const result = property.type.toJSON(v, paths && paths[property.name] || null, context)
          if (result !== undefined) {
            acc[property.name] = result
          }
          return acc
        }, {})

      return values
    }
  }
})
  .define()

export default mixin