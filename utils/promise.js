
export const wait = (duration) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(resolve, duration)
  })

  return promise
}

export const immediate = () => wait(0)

export const interval = (fn, duration) => {
  let force = false
  let stop = false
  let timeout
  const work = async () => {
    await fn()
    if (stop) { return }
    if (force) {
      force = false
      setImmediate(work)
    } else {
      timeout = setTimeout(work, duration)
    }
  }

  const result = () => {
    if (timeout) {
      clearTimeout(timeout)
      work()
    } else {
      force = true
    }
  }
  result.stop = () => stop = true
  work()
  return result
}