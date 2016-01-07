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
    expect(list.anchorSelectionIndex).to.equal(-1)
    list.anchorSelectionIndex = 0
    expect(list.anchorSelectionIndex).to.equal(0)
  })

  it('test leadSelectionIndex value change', function () {
    let list = new BindingList()
    expect(list.leadSelectionIndex).to.equal(-1)
    list.leadSelectionIndex = 0
    expect(list.leadSelectionIndex).to.equal(0)
  })

  it('test listener add remove', function () {
    let list = new BindingList()
    list.selectionMode = ListSelectionModel.SINGLE_SELECTION
    let currentEvent
    let handler = (event) => currentEvent = event
    list.addListSelectionListener(handler)
    list.removeListSelectionListener(null)
    expect(list.listeners.length).to.equal(1)
    list.removeListSelectionListener(handler)
    expect(currentEvent).to.equal(undefined)
  })

  it('test SINGLE_SELECTION ', function () {
    let list = new BindingList()
    list.selectionMode = ListSelectionModel.SINGLE_SELECTION
    for (let i = 0; i < 100; ++i) {
      list.push({
        rowHeight: 0
      })
    }
    let currentEvent
    let handler = (event) => currentEvent = event
    list.addListSelectionListener(handler)
    expect(list.listeners.length).to.equal(1)

    currentEvent = null
    list.clearSelection()
    expect(currentEvent).to.equal(null)
    currentEvent = null
    list.addSelectionInterval(0, 2)
    expect(currentEvent.firstIndex).to.equal(2)
    expect(currentEvent.lastIndex).to.equal(2)

    currentEvent = 'noevent'
    list.removeListSelectionListener(handler)
    expect(list.listeners.length).to.equal(0)
    list.clearSelection()
    expect(currentEvent).to.equal('noevent')
    list.addListSelectionListener(handler)
    expect(list.listeners.length).to.equal(1)
    list.addListSelectionListener(handler)
    expect(list.listeners.length).to.equal(1)

    list.addSelectionInterval(0, 2)
    currentEvent = null
    list.addSelectionInterval(5, 3)
    expect(list.getMinSelectionIndex()).to.equal(3)
    expect(currentEvent.firstIndex).to.equal(2)
    expect(currentEvent.lastIndex).to.equal(3)

    currentEvent = null
    list.clearSelection()
    expect(currentEvent.firstIndex).to.equal(3)
    expect(currentEvent.lastIndex).to.equal(3)
    expect(list.getMinSelectionIndex()).to.equal(-1)
    expect(list.getMaxSelectionIndex()).to.equal(-1)

    currentEvent = 'noclear'
    list.clearSelection()
    expect(currentEvent).to.equal('noclear')
    expect(list.getMinSelectionIndex()).to.equal(-1)
    expect(list.getMaxSelectionIndex()).to.equal(-1)
    expect(list.isSelectedIndex(3)).to.equal(false)
    expect(list.isSelectionEmpty()).to.equal(true)

    currentEvent = null
    list.addSelectionInterval(5, 3)
    expect(currentEvent.firstIndex).to.equal(3)
    expect(currentEvent.lastIndex).to.equal(3)

    currentEvent = null
    list.setSelectionInterval(2, 5)
    expect(currentEvent.firstIndex).to.equal(3)
    expect(currentEvent.lastIndex).to.equal(5)
    expect(list.getMinSelectionIndex()).to.equal(5)
    expect(list.getMaxSelectionIndex()).to.equal(5)
    expect(list.isSelectedIndex(5)).to.equal(true)
    expect(list.isSelectedIndex(2)).to.equal(false)
    expect(list.isSelectionEmpty()).to.equal(false)

    currentEvent = 'noevent'
    list.setSelectionInterval(2, 5)
    expect(currentEvent).to.equal('noevent')

    currentEvent = 'noevent'
    list.removeSelectionInterval(0, 1)
    expect(currentEvent).to.equal('noevent')

    currentEvent = 'noevent'
    list.removeSelectionInterval(2, 5)
    expect(currentEvent.firstIndex).to.equal(5)
    expect(currentEvent.lastIndex).to.equal(5)

    list.setSelectionInterval(5, 5)
    currentEvent = 'noevent'
    list.removeSelectionInterval(2, 10)
    expect(currentEvent.firstIndex).to.equal(5)
    expect(currentEvent.lastIndex).to.equal(5)
    list.setSelectionInterval(5, 5)

    list.setSelectionInterval(5, 5)
    currentEvent = 'noevent'
    list.removeSelectionInterval(5, 10)
    expect(currentEvent.firstIndex).to.equal(5)
    expect(currentEvent.lastIndex).to.equal(5)

    currentEvent = 'noevent'
    list.removeSelectionInterval(5, 10)
    expect(currentEvent).to.equal('noevent')
  })

  it('test SINGLE_INTERVAL_SELECTION ', function () {
    let list = new BindingList()
    list.selectionMode = ListSelectionModel.SINGLE_INTERVAL_SELECTION
    for (let i = 0; i < 100; ++i) {
      list.push({
        rowHeight: 0
      })
    }

    let currentEvent
    let handler = (event) => currentEvent = event
    list.addListSelectionListener(handler)
    expect(list.listeners.length).to.equal(1)

    // conjunction with [5,6] without overlapp, through 6,7
    list.clearSelection()
    expect(list.isSelectionEmpty()).to.equal(true)
    currentEvent = null
    list.addSelectionInterval(5, 6)
    expect(currentEvent.firstIndex).to.equal(5)
    expect(currentEvent.lastIndex).to.equal(6)
    expect(list.isSelectionEmpty()).to.equal(false)
    currentEvent = null
    list.addSelectionInterval(10, 7)
    expect(currentEvent.firstIndex).to.equal(7)
    expect(currentEvent.lastIndex).to.equal(10)
    expect(list.getMaxSelectionIndex()).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(5)

    // conjunction with [5,6] without overlapp, through 6,7 reverse
    list.clearSelection()
    list.addSelectionInterval(5, 6)
    currentEvent = null
    list.addSelectionInterval(7, 10)
    expect(currentEvent.firstIndex).to.equal(7)
    expect(currentEvent.lastIndex).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(5)
    expect(list.getMaxSelectionIndex()).to.equal(10)

    // conjunction with [5,6] with overlapp, through 6
    list.clearSelection()
    list.addSelectionInterval(5, 6)
    currentEvent = null
    list.addSelectionInterval(6, 10)
    expect(currentEvent.firstIndex).to.equal(7)
    expect(currentEvent.lastIndex).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(5)
    expect(list.getMaxSelectionIndex()).to.equal(10)

    // conjunction with [5,6] with overlapp, through 6 reverse
    list.clearSelection()
    list.addSelectionInterval(5, 6)
    currentEvent = null
    list.addSelectionInterval(10, 6)
    expect(currentEvent.firstIndex).to.equal(7)
    expect(currentEvent.lastIndex).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(5)
    expect(list.getMaxSelectionIndex()).to.equal(10)

    // conjunction with [8,10] without overlapp, through 8,7 on left
    list.clearSelection()
    list.addSelectionInterval(8, 10)
    currentEvent = null
    list.addSelectionInterval(7, 3)
    expect(currentEvent.firstIndex).to.equal(3)
    expect(currentEvent.lastIndex).to.equal(7)
    expect(list.getMinSelectionIndex()).to.equal(3)
    expect(list.getMaxSelectionIndex()).to.equal(10)

    // conjunction with [8,10] without overlapp, through 8,7 on left reverse
    list.clearSelection()
    list.addSelectionInterval(8, 10)
    currentEvent = null
    list.addSelectionInterval(3, 7)
    expect(currentEvent.firstIndex).to.equal(3)
    expect(currentEvent.lastIndex).to.equal(7)
    expect(list.getMinSelectionIndex()).to.equal(3)
    expect(list.getMaxSelectionIndex()).to.equal(10)

    // conjunction with [8,10] with overlapp, through 8 on left
    list.clearSelection()
    list.addSelectionInterval(8, 10)
    currentEvent = null
    list.addSelectionInterval(8, 3)
    expect(currentEvent.firstIndex).to.equal(3)
    expect(currentEvent.lastIndex).to.equal(7)
    expect(list.getMaxSelectionIndex()).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(3)

    // conjunction with [8,10] with overlapp, through 8 on left reverse
    list.clearSelection()
    list.addSelectionInterval(8, 10)
    currentEvent = null
    list.addSelectionInterval(3, 8)
    expect(currentEvent.firstIndex).to.equal(3)
    expect(currentEvent.lastIndex).to.equal(7)
    expect(list.getMaxSelectionIndex()).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(3)

    expect(list.isSelectedIndex(2)).to.equal(false)
    expect(list.isSelectedIndex(3)).to.equal(true)
    expect(list.isSelectedIndex(5)).to.equal(true)
    expect(list.isSelectedIndex(10)).to.equal(true)
    expect(list.isSelectedIndex(11)).to.equal(false)

    list.clearSelection()
    list.addSelectionInterval(5, 10)
    // No conjunction with the exist intervals, on right
    currentEvent = 'noevent'
    list.addSelectionInterval(12, 15)
    expect(currentEvent.firstIndex).to.equal(5)
    expect(currentEvent.lastIndex).to.equal(15)
    expect(list.isSelectionEmpty()).to.equal(false)

    list.clearSelection()
    list.addSelectionInterval(5, 10)
    // No conjunction with the exist intervals, on left
    currentEvent = 'noevent'
    list.addSelectionInterval(1, 3)
    expect(currentEvent.firstIndex).to.equal(1)
    expect(currentEvent.lastIndex).to.equal(10)
    expect(list.isSelectionEmpty()).to.equal(false)

    list.clearSelection()
    list.addSelectionInterval(2, 10)
    // True sub interval
    currentEvent = 'noevent'
    list.addSelectionInterval(5, 6)
    // console.log(currentEvent)
    expect(currentEvent).to.equal('noevent')

    // Sub interval, left touched
    currentEvent = 'noevent'
    list.addSelectionInterval(5, 6)
    expect(currentEvent).to.equal('noevent')

    // Sub interval, right touched
    currentEvent = 'noevent'
    list.addSelectionInterval(6, 10)
    expect(currentEvent).to.equal('noevent')

    // Sub interval, all touched, equal set
    currentEvent = 'noevent'
    list.addSelectionInterval(10, 5)
    expect(currentEvent).to.equal('noevent')

    // Sub interval, all touched, equal set, reverse direction
    currentEvent = 'noevent'
    list.addSelectionInterval(5, 10)
    expect(currentEvent).to.equal('noevent')

    // Clear the interval
    currentEvent = 'noevent'
    list.clearSelection()
    expect(currentEvent.firstIndex).to.equal(2)
    expect(currentEvent.lastIndex).to.equal(10)
    expect(list.getMaxSelectionIndex()).to.equal(-1)
    expect(list.getMinSelectionIndex()).to.equal(-1)

    // Superset Left equal, extend right
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.addSelectionInterval(6, 13)
    expect(currentEvent.firstIndex).to.equal(11)
    expect(currentEvent.lastIndex).to.equal(13)
    expect(list.getMinSelectionIndex()).to.equal(6)
    expect(list.getMaxSelectionIndex()).to.equal(13)

    // Superset Right equal, extend left
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.addSelectionInterval(3, 10)
    expect(currentEvent.firstIndex).to.equal(3)
    expect(currentEvent.lastIndex).to.equal(5)
    expect(list.getMinSelectionIndex()).to.equal(3)
    expect(list.getMaxSelectionIndex()).to.equal(10)

    // One in middle, other extend right
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.addSelectionInterval(8, 12)
    expect(currentEvent.firstIndex).to.equal(11)
    expect(currentEvent.lastIndex).to.equal(12)
    expect(list.getMinSelectionIndex()).to.equal(6)
    expect(list.getMaxSelectionIndex()).to.equal(12)

    // One in middle, other extend left
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.addSelectionInterval(3, 8)
    expect(currentEvent.firstIndex).to.equal(3)
    expect(currentEvent.lastIndex).to.equal(5)
    expect(list.getMaxSelectionIndex()).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(3)

    // One in middle, other extend left reverse
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.addSelectionInterval(8, 3)
    expect(currentEvent.firstIndex).to.equal(3)
    expect(currentEvent.lastIndex).to.equal(5)
    expect(list.getMaxSelectionIndex()).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(3)

    // Remove on no interval
    list.clearSelection()
    currentEvent = 'noevent'
    list.removeSelectionInterval(10, 12)
    expect(currentEvent).to.equal('noevent')

    // Remove on no interval reverse
    list.clearSelection()
    currentEvent = 'noevent'
    list.removeSelectionInterval(12, 10)
    expect(currentEvent).to.equal('noevent')

    // Remove on interval without conjunction right
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(12, 11)
    expect(currentEvent).to.equal('noevent')

    // Remove on interval without conjunction right reverse
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(11, 12)
    expect(currentEvent).to.equal('noevent')

    // Remove on interval without conjunction left
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(3, 5)
    expect(currentEvent).to.equal('noevent')

    // Remove on interval without conjunction left reverse
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(5, 3)
    expect(currentEvent).to.equal('noevent')

    // Remove on interval without conjunction far distance
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(100, 200)
    expect(currentEvent).to.equal('noevent')

    // Remove on inteval with single element intersect left
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(6, 3)
    expect(currentEvent.firstIndex).to.equal(6)
    expect(currentEvent.lastIndex).to.equal(6)
    expect(list.getMaxSelectionIndex()).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(7)

    // Remove on inteval with single element intersect left reverse
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(3, 6)
    expect(currentEvent.firstIndex).to.equal(6)
    expect(currentEvent.lastIndex).to.equal(6)
    expect(list.getMaxSelectionIndex()).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(7)

    // Remove on inteval with element intersect in middle left extend
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(3, 8)
    expect(currentEvent.firstIndex).to.equal(6)
    expect(currentEvent.lastIndex).to.equal(8)
    expect(list.getMaxSelectionIndex()).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(9)

    // Remove on inteval with element intersect in middle left extend reverse
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(8, 3)
    expect(currentEvent.firstIndex).to.equal(6)
    expect(currentEvent.lastIndex).to.equal(8)
    expect(list.getMaxSelectionIndex()).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(9)

    // Remove on inteval with element intersect in middle right extend
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(12, 8)
    expect(currentEvent.firstIndex).to.equal(8)
    expect(currentEvent.lastIndex).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(6)
    expect(list.getMaxSelectionIndex()).to.equal(7)

    // Remove on inteval equal set
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(6, 10)
    expect(currentEvent.firstIndex).to.equal(6)
    expect(currentEvent.lastIndex).to.equal(10)
    expect(list.getMaxSelectionIndex()).to.equal(-1)
    expect(list.getMinSelectionIndex()).to.equal(-1)

    // Remove on inteval equal set bigger
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(5, 11)
    expect(currentEvent.firstIndex).to.equal(6)
    expect(currentEvent.lastIndex).to.equal(10)
    expect(list.getMaxSelectionIndex()).to.equal(-1)
    expect(list.getMinSelectionIndex()).to.equal(-1)

    // Remove on inteval equal set bigger, left equal
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(6, 11)
    expect(currentEvent.firstIndex).to.equal(6)
    expect(currentEvent.lastIndex).to.equal(10)
    expect(list.getMaxSelectionIndex()).to.equal(-1)
    expect(list.getMinSelectionIndex()).to.equal(-1)

    // Remove on inteval equal set bigger, right equal
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(5, 10)
    expect(currentEvent.firstIndex).to.equal(6)
    expect(currentEvent.lastIndex).to.equal(10)
    expect(list.getMaxSelectionIndex()).to.equal(-1)
    expect(list.getMinSelectionIndex()).to.equal(-1)

    // Remove on inteval cause two interval
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.removeSelectionInterval(7, 8)
    expect(currentEvent).to.equal('noevent')
    expect(list.getMinSelectionIndex()).to.equal(6)
    expect(list.getMaxSelectionIndex()).to.equal(10)

    // Clear the interval
    currentEvent = null
    list.clearSelection()
    expect(currentEvent.firstIndex).to.equal(6)
    expect(currentEvent.lastIndex).to.equal(10)
    expect(list.getMinSelectionIndex()).to.equal(-1)
    expect(list.getMaxSelectionIndex()).to.equal(-1)

    // Add an interval that super contains the exist interval
    list.clearSelection()
    list.addSelectionInterval(6, 10)
    currentEvent = 'noevent'
    list.addSelectionInterval(3, 18)
    expect(currentEvent.firstIndex).to.equal(3)
    expect(currentEvent.lastIndex).to.equal(18)
    expect(list.getMinSelectionIndex()).to.equal(3)
    expect(list.getMaxSelectionIndex()).to.equal(18)
  })
})
