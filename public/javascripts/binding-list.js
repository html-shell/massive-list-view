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

exports.BindingList = BindingList