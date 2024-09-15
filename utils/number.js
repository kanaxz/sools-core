export const bound = (int, [min, max]) => {
  if (int < min) {
    return min
  }
  if (int > max) {
    return max
  }
  return int
}

export const loop = (int, [min, max]) => {
  if (int < min) {
    return max
  }
  if (int > max) {
    return min
  }
  return int
}

export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}