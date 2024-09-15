
const eventCallback = () => {
  const callback = (...args) => {
    callback.triggered = true
    callback.args = args
  }
  callback.triggered = false
  return callback
}

export default {
  eventCallback
}