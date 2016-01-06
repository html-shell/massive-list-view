'use strict'

function removeItemsFromArray (arr) {
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

module.exports = {
  // Add a listener to the list that's notified each time a change to the selection occurs.
  addListSelectionListener: function (ListSelectionListener) {
    this.listeners.push(ListSelectionListener)
  },
  // Remove a listener from the list that's notified each time a change to the selection occurs.
  removeListSelectionListener: function (ListSelectionListener) {
    removeItemsFromArray(this.listeners, ListSelectionListener)
  }
}
