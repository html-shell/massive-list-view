'use strict'

var sbt = require('./size-balanced-tree.js')
var selectionListeners = require('./selection-model-listener.js')
var normalSelectionModel = require('./normal-selection-model.js')
var multiSelectionModel = require('./multi-selection-model.js')

// https://docs.oracle.com/javase/8/docs/api/javax/swing/ListSelectionModel.html
var ListSelectionModel = {
  MULTIPLE_INTERVAL_SELECTION: 0,
  SINGLE_INTERVAL_SELECTION: 1,
  SINGLE_SELECTION: 2
}

/*
  Node.selectState
  0: the current Node's subtree are all unselected.
  1: the current Node's subtree are all selected.
  2: the current Node's subtree are partially selected, and the current Node are unselected.
  3: the current Node's subtree are partially selected, and the current Node are selected.

  The selectState always goes top-down ways. That means:
  When a Node has been decided as 'selected' or 'unselected' in the ANCESTOR Node,
  then we have no need to navigate down to check THE node's selectState.
*/
var Node = function () {
  sbt.NodeConstructor.apply(this, arguments)
  this.rowTotalHeight = this.value.rowHeight
  this.selectState = 0
}

Node.prototype.updateSize = function () {
  this.size = this.left.size + this.right.size + 1
  this.rowTotalHeight = this.left.rowTotalHeight + this.right.rowTotalHeight + this.value.rowHeight
}

var Nil = sbt.createNil(Node, {rowHeight: 0})

var BaseBindingList = sbt.CreateSBTreeClass(Node, Nil, sbt.updateChild)

var InitBindingListClass = function () {
  Object.defineProperty(this, 'selectionMode', {
    // Returns the current selection mode.
    get: function () {
      return this._selectionMode
    },
    // Sets the selection mode.
    set: function (selectionMode) {
      this._selectionMode = selectionMode
      switch (selectionMode) {
        case ListSelectionModel.SINGLE_SELECTION:
        case ListSelectionModel.SINGLE_INTERVAL_SELECTION:
          updateMethods(this, normalSelectionModel)
          break
        case ListSelectionModel.MULTIPLE_INTERVAL_SELECTION:
          updateMethods(this, multiSelectionModel)
          break
        default:
          console.error(`The selection mode:${selectionMode} doesn't support yet`)
          break
      }
    }
  })

  Object.defineProperty(this, 'anchorSelectionIndex', {
    // Return the first index argument from the most recent call to setSelectionInterval(), addSelectionInterval() or removeSelectionInterval().
    get: function () {
      return this._anchorSelectionIndex
    },
    // Set the anchor selection index.
    set: function (anchorSelectionIndex) {
      this._anchorSelectionIndex = anchorSelectionIndex
    }
  })

  Object.defineProperty(this, 'leadSelectionIndex', {
    // Return the second index argument from the most recent call to setSelectionInterval(), addSelectionInterval() or removeSelectionInterval().
    get: function () {
      return this._leadSelectionIndex
    },
    // Set the lead selection index.
    set: function (leadSelectionIndex) {
      this._leadSelectionIndex = leadSelectionIndex
    }
  })
}

var BindingList = function (options) {
  options = options || {}
  BaseBindingList.call(this)
  InitBindingListClass.call(this)
  this.selectionMode = (options.selectionMode || ListSelectionModel.SINGLE_SELECTION)
  this.anchorSelectionIndex = null
  this.leadSelectionIndex = null
  this.listeners = []
}

BindingList.prototype = BaseBindingList.prototype

function updateMethods (prototype, from) {
  for (let funcitonName in from) {
    prototype[funcitonName] = from[funcitonName]
  }
}

updateMethods(BindingList.prototype, selectionListeners)

function updateNode (node) {
  while (node !== Nil) {
    node.updateSize()
    node = node.parent
  }
}
BindingList.prototype.insertLeafNode = updateNode
BindingList.prototype.removeLeafNode = updateNode
BindingList.prototype.findRowForScrollTop = function (scrollTop) {
  if (this.root.rowTotalHeight === 0) {
    return 0
  }

  if (scrollTop < 0) {
    scrollTop = 0
  } else if (scrollTop >= this.root.rowTotalHeight) {
    scrollTop = this.root.rowTotalHeight - 1
  }
  let node = this.root
  while (true) {
    if (node.left.rowTotalHeight > scrollTop) {
      node = node.left
    } else {
      scrollTop -= node.left.rowTotalHeight
      if (scrollTop < node.value.rowHeight) {
        break
      }
      scrollTop -= node.value.rowHeight
      node = node.right
    }
  }
  return this.getIndex(node)
}

BindingList.prototype.selectionMode =
exports.BindingList = BindingList
exports.ListSelectionModel = ListSelectionModel
