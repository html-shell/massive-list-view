'use strict'
const expect = require('chai').expect
const bindingList = require('../../public/javascripts/binding-list.js')
const BindingList = bindingList.BindingList
const ListSelectionModel = bindingList.ListSelectionModel

describe('testing binding list', function () {
  it('should be a constructor function', function () {
    expect(typeof BindingList).to.equal('function')
  })

  it('should have correct total height', function () {
    let list = new BindingList()
    for (let i = 0; i < 100; ++i) {
      const newItem = {
        rowHeight: 10
      }
      list.push(newItem)
    }
    expect(list.root.rowTotalHeight).to.equal(1000)
    expect(list.findRowForScrollTop(-1)).to.equal(0)
    expect(list.findRowForScrollTop(1000)).to.equal(99)
    expect(list.findRowForScrollTop(999)).to.equal(99)
    expect(list.findRowForScrollTop(990)).to.equal(99)
    expect(list.findRowForScrollTop(989)).to.equal(98)
  })

  it('should have correct total height when rowHeight are different', function () {
    let list = new BindingList()
    for (let i = 0; i < 100; ++i) {
      const newItem = {
        rowHeight: i
      }
      list.push(newItem)
    }
    expect(list.root.rowTotalHeight).to.equal(4950)
    expect(list.findRowForScrollTop(-1)).to.equal(1)
    expect(list.findRowForScrollTop(0)).to.equal(1)
    expect(list.findRowForScrollTop(1)).to.equal(2)
    expect(list.findRowForScrollTop(4950)).to.equal(99)
    expect(list.findRowForScrollTop(4949)).to.equal(99)
    expect(list.findRowForScrollTop(4851)).to.equal(99)

    expect(list.findRowForScrollTop(4850)).to.equal(98)
    expect(list.findRowForScrollTop(4849)).to.equal(98)

    expect(list.findRowForScrollTop(4753)).to.equal(98)
    expect(list.findRowForScrollTop(4752)).to.equal(97)
  })

  it('should have automatically skip zero height rows', function () {
    let list = new BindingList()
    for (let i = 0; i < 100; ++i) {
      const newItem = {
        rowHeight: 0
      }
      list.push(newItem)
    }
    expect(list.root.rowTotalHeight).to.equal(0)
    list.push({rowHeight: 10})
    expect(list.root.rowTotalHeight).to.equal(10)
    expect(list.findRowForScrollTop(-1)).to.equal(100)
    expect(list.findRowForScrollTop(0)).to.equal(100)
    expect(list.findRowForScrollTop(9)).to.equal(100)
    expect(list.findRowForScrollTop(10)).to.equal(100)
    list.push({rowHeight: 0})
    expect(list.findRowForScrollTop(10)).to.equal(100)
    list.push({rowHeight: 0})
    expect(list.findRowForScrollTop(10)).to.equal(100)
    list.push({rowHeight: 10})
    expect(list.findRowForScrollTop(10)).to.equal(103)
    expect(list.findRowForScrollTop(19)).to.equal(103)
    expect(list.size).to.equal(104)
    list.push({rowHeight: 0})
    expect(list.size).to.equal(105)
    expect(list.findRowForScrollTop(10)).to.equal(103)
    expect(list.findRowForScrollTop(19)).to.equal(103)
  })

  it('test selectionMode value change', function () {
    let list = new BindingList({
      selectionMode: ListSelectionModel.SINGLE_SELECTION
    })
    expect(list.selectionMode).to.equal(ListSelectionModel.SINGLE_SELECTION)
    list.selectionMode = ListSelectionModel.MULTIPLE_INTERVAL_SELECTION
    expect(list.selectionMode).to.equal(ListSelectionModel.MULTIPLE_INTERVAL_SELECTION)
    let oldAddSelectionInterval = list.addSelectionInterval
    list.selectionMode = ListSelectionModel.SINGLE_INTERVAL_SELECTION
    expect(list.selectionMode).to.equal(ListSelectionModel.SINGLE_INTERVAL_SELECTION)
    expect(list.addSelectionInterval).not.to.equal(oldAddSelectionInterval) // must be fail
  })

  it('test anchorSelectionIndex value change', function () {
    let list = new BindingList()
    expect(list.anchorSelectionIndex).to.equal(null)
    list.anchorSelectionIndex = 0
    expect(list.anchorSelectionIndex).to.equal(0)
  })

  it('test leadSelectionIndex value change', function () {
    let list = new BindingList()
    expect(list.leadSelectionIndex).to.equal(null)
    list.leadSelectionIndex = 0
    expect(list.leadSelectionIndex).to.equal(0)
  })

  it('test leadSelectionIndex value change', function () {
  })
})
