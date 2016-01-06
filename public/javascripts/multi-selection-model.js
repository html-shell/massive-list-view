// https://docs.oracle.com/javase/8/docs/api/javax/swing/ListSelectionModel.html

var MultiIntervalSelectionModel = {
  // Changes the selection to be the set union of the current selection and the indices between index0 and index1 inclusive.
  addSelectionInterval: function (index0, index1) {},
  // Change the selection to the empty set.
  clearSelection: function () {},
  // Returns the last selected index or -1 if the selection is empty.
  getMaxSelectionIndex: function () {},
  // Returns the first selected index or -1 if the selection is empty.
  getMinSelectionIndex: function () {},
  // Returns true if the specified index is selected.
  isSelectedIndex: function (index) {},
  // Returns true if no indices are selected.
  isSelectionEmpty: function (index) {},
  // Changes the selection to be the set difference of the current selection and the indices between index0 and index1 inclusive.
  removeSelectionInterval: function (index0, index1) {},
  // Changes the selection to be between index0 and index1 inclusive. index0 doesn't have to be less than or equal to index1.
  setSelectionInterval: function (index0, index1) {}
}

module.exports = MultiIntervalSelectionModel
