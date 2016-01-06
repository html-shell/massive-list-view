'use strict'

// https://docs.oracle.com/javase/8/docs/api/javax/swing/ListSelectionModel.html
var ListSelectionModel = require('./list-selection-model.js')

var NormalSelectionModel = {
  // Changes the selection to be the set union of the current selection and the indices between index0 and index1 inclusive.
  // index0 doesn't have to be less than or equal to index1.
  addSelectionInterval: function (index0, index1) {
    if (this.selectionMode === ListSelectionModel.SINGLE_SELECTION || this.isSelectionEmpty()) {
      return this.setSelectionInterval(index0, index1)
    }
    let addMin = Math.min(index0, index1)
    let addMax = Math.max(index0, index1)
    let min = this.getMinSelectionIndex()
    let max = this.getMaxSelectionIndex()
    if (addMin >= min && addMax <= max) {
      return
    }
    if (addMin - 1 > max || addMax + 1 < min) {
      throw new Error('For ListSelectionModel.SINGLE_INTERVAL_SELECTION, can not addSelectionInterval that would not create continuous single intervnal')
    }
    if (addMin < min && addMax > max) {
      let changeMin = addMin
      let changeMax = addMax
      this.anchorSelectionIndex = index0
      this.leadSelectionIndex = index1
      return this.selectionChanged(changeMin, changeMax)
    }
    let changeMin = addMin < min ? addMin : max + 1
    let changeMax = addMin < min ? min - 1 : addMax
    this.anchorSelectionIndex = addMin < min ? max : min
    this.leadSelectionIndex = addMin < min ? addMin : addMax
    return this.selectionChanged(changeMin, changeMax)
  },

  // Change the selection to the empty set.
  clearSelection: function () {
    let min = this.getMinSelectionIndex()
    let max = this.getMaxSelectionIndex()
    if (min !== -1 && max !== -1) {
      this.anchorSelectionIndex = -1
      this.leadSelectionIndex = -1
      return this.selectionChanged(min, max)
    }
  },

  // Returns the last selected index or -1 if the selection is empty.
  getMaxSelectionIndex: function () {
    if (this.selectionMode === ListSelectionModel.SINGLE_SELECTION) {
      return this.leadSelectionIndex
    }
    return Math.max(this.anchorSelectionIndex, this.leadSelectionIndex)
  },

  // Returns the first selected index or -1 if the selection is empty.
  getMinSelectionIndex: function () {
    if (this.selectionMode === ListSelectionModel.SINGLE_SELECTION) {
      return this.leadSelectionIndex
    }
    return Math.min(this.anchorSelectionIndex, this.leadSelectionIndex)
  },

  // Returns true if the specified index is selected.
  isSelectedIndex: function (index) {
    let min = this.getMinSelectionIndex()
    let max = this.getMaxSelectionIndex()
    return min <= index && index <= max
  },

  // Returns true if no indices are selected.
  isSelectionEmpty: function () {
    return this.getMinSelectionIndex() < 0
  },

  // Changes the selection to be the set difference of the current selection and the indices between index0 and index1 inclusive.
  // index0 doesn't have to be less than or equal to index1.
  removeSelectionInterval: function (index0, index1) {
    if (this.isSelectionEmpty()) {
      return
    }
    let clearMin = Math.min(index0, index1)
    let clearMax = Math.max(index0, index1)
    let min = this.getMinSelectionIndex()
    let max = this.getMaxSelectionIndex()
    if (clearMin < min) {
      clearMin = min
    }
    if (clearMax > max) {
      clearMax = max
    }
    if (clearMax < clearMin) {
      return
    }
    if (min === clearMin && max === clearMax) {
      return this.clearSelection()
    }

    if (min === clearMin || max === clearMax) {
      this.anchorSelectionIndex = min === clearMin ? max : min
      this.leadSelectionIndex = min === clearMin ? clearMax + 1 : clearMin - 1
      return this.selectionChanged(clearMin, clearMax)
    }
    throw new Error('For ListSelectionModel.SINGLE_INTERVAL_SELECTION, can not removeSelectionInterval in the middle')
  },

  // Changes the selection to be between index0 and index1 inclusive. index0 doesn't have to be less than or equal to index1.
  setSelectionInterval: function (index0, index1) {
    let min = this.getMinSelectionIndex()
    let max = this.getMaxSelectionIndex()
    this.anchorSelectionIndex = index0
    this.leadSelectionIndex = index1
    let newMin = this.getMinSelectionIndex()
    let newMax = this.getMaxSelectionIndex()
    if (min <= newMin && newMax <= max) {
      return
    }
    if (min !== -1) newMin = Math.min(min, newMin)
    if (max !== -1) newMax = Math.max(max, newMax)
    return this.selectionChanged(newMin, newMax)
  }
}

module.exports = NormalSelectionModel
