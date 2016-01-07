'use strict'

// https://docs.oracle.com/javase/8/docs/api/javax/swing/ListSelectionModel.html
let ListSelectionModel = require('./list-selection-model.js')

// Two interval are intesected by the following definition:
// If are the conjunction of interval, they are a consective interval, then they
//  were intersected, for example:
//   a: [1, 2], [3, 4] are treat as intesected
//   b: [1, 5], [5, 10] are also intersected
// If exist interval and new interval are not intersected, then use the
// new interval directly
// If exit interval and new interval are intesected, then return the
// confunction of these two interval
exports.JoinIntervalIntersected = (options) => {
  // The only three posibility that have not intersect with exist interval
  if (options.maxNew + 1 < options.minExist ||
      options.minNew - 1 > options.maxExist ||
      (options.minExist === -1 ||
      options.maxExist === -1)) {
    // It's turns out to be override
    return exports.OverrideIntervalWith(options)
  }
  let newInterval = {
    min: Math.min(options.minExist, options.minNew),
    max: Math.max(options.maxExist, options.maxNew)
  }
  let changed = exports.MinusInterval(
    newInterval.min, newInterval.max,
    options.minExist, options.maxExist
  )

  // If the two interval's confunctoin are true contains the
  // exist interval, then the change are should be the whole
  // new interval
  if (changed.min === undefined || changed.max === undefined) {
    newInterval.firstIndex = newInterval.min
    newInterval.lastIndex = newInterval.max
  } else if (changed.min <= changed.max) {
    newInterval.firstIndex = changed.min
    newInterval.lastIndex = changed.max
  }
  return newInterval
}

exports.OverrideIntervalWith = (options) => {
  if (options.minExist === -1 || options.maxExist === -1) {
    return {
      min: options.minNew,
      max: options.maxNew,
      firstIndex: options.minNew,
      lastIndex: options.maxNew
    }
  }
  let change = {
    min: options.minNew,
    max: options.maxNew
  }
  // The new interval equals to the exist interval
  if (options.minNew === options.minExist && options.maxExist === options.maxNew) {
    // There is no change, so there is no firstIndex & lastIndex
    return change
  }
  // It's should be like this, cause the old interval are removed
  // and the new interval are setting down
  change.firstIndex = Math.min(options.minExist, options.minNew)
  change.lastIndex = Math.max(options.maxExist, options.maxNew)
  return change
}

// interval A always contains B
// if B inside of A or A === B then return emptry, for exmaple [3, 5] inside [1,6], but
// [3,6] not inside [1, 6]
// otherwise, return the remaining interval
exports.MinusInterval = (minA, maxA, minB, maxB) => {
  if ((minA < minB && maxB < maxA)) {
    return {}
  }
  if (minA === minB) {
    return {
      min: maxB + 1,
      max: maxA
    }
  }
  if (maxA === maxB) {
    return {
      min: minA,
      max: minB - 1
    }
  }
  return null
}

exports.IntersectInterval = (options) => {
  let min = Math.max(options.minExist, options.minNew)
  let max = Math.min(options.maxExist, options.maxNew)
  if (min <= max) {
    return {
      min: min,
      max: max
    }
  }
  return null
}

let NormalSelectionModel = function () {
  this.clearSelection()
}

NormalSelectionModel.prototype = {
  // Changes the selection to be the set union of the current selection and the indices between index0 and index1 inclusive.
  // index0 doesn't have to be less than or equal to index1.
  addSelectionInterval: function (index0, index1) {
    // For single selection mode, we can only setting the interval
    if (this.selectionMode === ListSelectionModel.SINGLE_SELECTION) {
      return this.setSelectionInterval(index0, index1)
    }
    let options = this.getIntervalOptions(index0, index1)
    let result = exports.JoinIntervalIntersected(options)
    this._min = result.min
    this._max = result.max
    return this.selectionChanged(result.firstIndex, result.lastIndex)
  },

  // Change the selection to the empty set.
  clearSelection: function () {
    let min = this.getMinSelectionIndex()
    let max = this.getMaxSelectionIndex()
    if (min !== -1 || max !== -1) {
      this._min = -1
      this._max = -1
      return this.selectionChanged(min, max)
    }
  },

  // Returns the last selected index or -1 if the selection is empty.
  getMaxSelectionIndex: function () {
    return this._max
  },

  // Returns the first selected index or -1 if the selection is empty.
  getMinSelectionIndex: function () {
    return this._min
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
    let options = this.getIntervalOptions(index0, index1, true)
    let intersect = exports.IntersectInterval(options)
    // Nothing to clear
    if (intersect === null) {
      return
    }
    let leaveBehind = exports.MinusInterval(
      options.minExist, options.maxExist,
      intersect.min, intersect.max
    )

    // The whole interval are removed
    if (intersect.min === options.minExist && intersect.max === options.maxExist) {
      this._min = -1
      this._max = -1
      return this.selectionChanged(intersect.min, intersect.max)
    }
    if (leaveBehind.min && leaveBehind.max) {
      this._min = leaveBehind.min
      this._max = leaveBehind.max
      return this.selectionChanged(intersect.min, intersect.max)
    }

    // Otherwise for interval truely inside the exist interval,
    // we do nothing for it, cause if we remove that
    // interval would cause the interval to be two interval
  },

  getIntervalOptions: function (index0, index1, isRemoveInterval) {
    if (this.selectionMode === ListSelectionModel.SINGLE_SELECTION &&
        isRemoveInterval !== true) {
      index0 = index1
    }
    return {
      minExist: this.getMinSelectionIndex(),
      maxExist: this.getMaxSelectionIndex(),
      minNew: Math.min(index0, index1),
      maxNew: Math.max(index0, index1)
    }
  },

  // Changes the selection to be between index0 and index1 inclusive. index0 doesn't have to be less than or equal to index1.
  setSelectionInterval: function (index0, index1) {
    let options = this.getIntervalOptions(index0, index1)
    let result = exports.OverrideIntervalWith(options)
    this._min = result.min
    this._max = result.max
    return this.selectionChanged(result.firstIndex, result.lastIndex)
  }
}

module.exports = NormalSelectionModel
