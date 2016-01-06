'use strict';

var sbt = require('./size-balanced-tree.js');

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
  sbt.NodeConstructor.apply(this, arguments);
  this.rowTotalHeight = this.value.rowHeight
  this.selectState = 0
}

Node.prototype.updateSize = function() {
  this.size = this.left.size + this.right.size + 1;
  this.rowTotalHeight = this.left.rowTotalHeight + this.right.rowTotalHeight + this.value.rowHeight
}

var Nil = sbt.createNil(Node, {rowHeight: 0})

var BindingList = sbt.CreateSBTreeClass(Node, Nil, sbt.updateChild)


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
  let node = this.root;
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

// https://docs.oracle.com/javase/8/docs/api/javax/swing/ListSelectionModel.html

// Add a listener to the list that's notified each time a change to the selection occurs.
BindingList.prototype.addListSelectionListener = function (ListSelectionListener) {
}

// Changes the selection to be the set union of the current selection and the indices between index0 and index1 inclusive.
BindingList.prototype.addSelectionInterval = function (index0, index1) {
}

// Change the selection to the empty set.
BindingList.prototype.clearSelection = function () {
}

// Return the first index argument from the most recent call to setSelectionInterval(), addSelectionInterval() or removeSelectionInterval().
BindingList.prototype.getAnchorSelectionIndex = function () {
}

// Return the second index argument from the most recent call to setSelectionInterval(), addSelectionInterval() or removeSelectionInterval().
BindingList.prototype.getLeadSelectionIndex = function () {
}

// Returns the last selected index or -1 if the selection is empty.
BindingList.prototype.getMaxSelectionIndex = function () {
}

// Returns the first selected index or -1 if the selection is empty.
BindingList.prototype.getMinSelectionIndex = function () {
}

// Returns the current selection mode.
BindingList.prototype.getSelectionMode = function () {
}

// Returns true if the specified index is selected.
BindingList.prototype.isSelectedIndex = function (index) {
}

// Returns true if no indices are selected.
BindingList.prototype.isSelectionEmpty = function (index) {
}

// Remove a listener from the list that's notified each time a change to the selection occurs.
BindingList.prototype.removeListSelectionListener = function (ListSelectionListener) {
}

// Changes the selection to be the set difference of the current selection and the indices between index0 and index1 inclusive.
BindingList.prototype.removeSelectionInterval = function (index0, index1) {
}

// Set the anchor selection index.
BindingList.prototype.setAnchorSelectionIndex = function (index) {
}

// Set the lead selection index.
BindingList.prototype.setLeadSelectionIndex = function (index) {
}

// Changes the selection to be between index0 and index1 inclusive.
BindingList.prototype.setSelectionInterval = function (index0, index1) {
}

// Sets the selection mode.
BindingList.prototype.setSelectionMode = function (selectionMode) {
}


exports.BindingList = BindingList