import Mixin from './Mixin.js'
import Base from './Base.js'
const getMixin = (dependency) => {
  return dependency.mixin || dependency
}

const processDependency = (allDependencies, dependency) => {
  const index = allDependencies.indexOf(dependency)
  if (index !== -1) {
    return null
  }
  allDependencies.push(dependency)
  const dependencies = processDependencies(allDependencies, dependency.mixinDependencies)
  return [
    ...dependencies,
    dependency,
  ]
}

const processDependencies = (allDependencies, dependenciesTree) => {
  return dependenciesTree
    .flatMap((dependency) => processDependency(allDependencies, dependency))
    .filter((o) => o)
}

const buildBase = (base, dependenciesTree) => {
  const allDependencies = [...(base.allDependencies || [])]
  const dependencies = processDependencies(allDependencies, dependenciesTree)
  let currentClass = base
  for (const dependency of dependencies) {

    currentClass = dependency.fn(currentClass)
  }
  Object.assign(currentClass, {
    allDependencies,
    dependencies,
    dependenciesOwner: null,
  })

  return currentClass
}

const getDependencies = (dependencies = []) => {
  if (!mixer.base) {
    return dependencies
  }
  return [mixer.base, ...dependencies]
}

const mixer = {
  proxy(...args) {
    const mixin = this.mixin(...args)
    const type = this.extends([mixin]);
    type.mixin = mixin;

    return new Proxy(type, {
      apply: (target, thisArg, args) => {
        //fallback for babel ?
        if (thisArg) {
          return target.apply(thisArg, args);
        }
        return fn.apply(null, args);
      }
    })
  },
  mixin(...args) {
    const fn = args.find((arg) => typeof arg === 'function')
    const mixinDependencies = getDependencies(args.find((arg) => Array.isArray(arg)))
    const base = mixer.extends(Mixin, mixinDependencies)

    const mixin = fn(base)

    Object.assign(mixin, {
      mixinDependencies,
      fn,
      base,
    })
    return mixin
  },
  extends(arg1, arg2) {
    let base
    let dependencies
    if (typeof arg1 === 'function') {
      base = arg1
      dependencies = getDependencies(arg2)
    } else {
      base = class { }
      dependencies = getDependencies(arg1)
    }
    return buildBase(base, dependencies)
  },
  is(object, mixinOrClass) {
    if (object.constructor === mixinOrClass) { return true }
    const dependencies = object.constructor?.allDependencies

    if (dependencies) {
      const hasMixin = dependencies.find((d) => d === getMixin(mixinOrClass))
      if (hasMixin) {
        return true
      }
    }
    if (typeof mixinOrClass !== 'function') {
      return false
    }

    if (object instanceof mixinOrClass) {
      return true
    }

    return false
  },
}

mixer.base = mixer.mixin(Base)

export default mixer