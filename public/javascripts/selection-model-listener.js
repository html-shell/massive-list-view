'use strict'

module.exports = {
  // Add a listener to the list that's notified each time a change to the selection occurs.
  addListSelectionListener: function (ListSelectionListener) {
    if (this.listeners.indexOf(ListSelectionListener) >= 0) {
      return
    }
    this.listeners.push(ListSelectionListener)
  },
  // Remove a listener from the list that's notified each time a change to the selection occurs.
  removeListSelectionListener: function (ListSelectionListener) {
    let pos = this.listeners.indexOf(ListSelectionListener)
    if (pos < 0) {
      return
    }
    this.listeners.splice(pos, 1)
  }
}
