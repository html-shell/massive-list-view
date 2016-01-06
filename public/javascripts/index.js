'use strict'

const BindingList = require('./binding-list.js').BindingList
const getRandomInt = require('./math.js').getRandomInt

let initListView = function () {
  let tree = new BindingList()

  const startTime = Date.now()
  let key = 0
  for (let i = 0; i < 500000; ++i) {
    const newItem = {
      rowHeight: getRandomInt(10, 10),
      data: i,
      key: key
    }
    key += 1
    tree.push(newItem)
  }
  console.log(`totalHeight: ${tree.root.rowTotalHeight} ${Date.now() - startTime}`)
  const listView = document.querySelector('.MassiveListView')
  const scrollArea = document.querySelector('.MassiveListView .ScrollArea')
  scrollArea.style.height = tree.root.rowTotalHeight.toString() + 'px'
  // const scrollAreaTop = document.querySelector('.MassiveListView > .ScrollArea > .Top')
  listView.onscroll = (event) => {
    const startTime = Date.now()
    const listHeight = listView.clientHeight
    const scrollTop = listView.scrollTop
    let nodeStartIndex = tree.findRowForScrollTop(scrollTop - listHeight - 1080)
    let nodeEndIndex = tree.findRowForScrollTop(scrollTop + listHeight + listHeight + 1080)
    console.log(`${scrollTop} ${nodeStartIndex} ${nodeEndIndex} ${Date.now() - startTime} ${listHeight}`)
  // scrollAreaTop.style.height = listView.scrollTop + 'px'
  }
}

initListView()
