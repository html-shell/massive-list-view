/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

exports.getRandomInt = getRandomInt


exports.removeItemsFromArray = function (arr) {
  for (let i = 1; i < arguments.length; ++i) {
    let what = arguments[i]
    let pos = 0
    while (true) {
      pos = arr.indexOf(what, pos)
      if (pos < 0) {
        break
      }
      arr.splice(pos, 1)
    }
  }
  return arr
}
