import { searchInputHandler, checkboxInputHandler, sortInputHandler, sortOrderToggleHandler, tradePanelSwitch } from './interactions.js'
import { historyMove } from './functions.js'
var gridSearch = document.querySelector("#grid-search")
gridSearch.querySelector("#search-field").addEventListener("input", (e) => searchInputHandler(e.target.value))
var checkboxes = Array.from(gridSearch.querySelectorAll(".checkbox"))
for (var i in checkboxes) {
  var checkbox = checkboxes[i]
  checkbox.addEventListener("click", (s) => checkboxInputHandler(s.target))
}
var dropdown = document.querySelector("#dropdown")
dropdown.addEventListener("click", (e) => {
  if(e.target.id='dropdown') {
    dropdown.classList.toggle('active')
  }
})
var options = Array.from(gridSearch.querySelectorAll(".option"))
for (var i in options) {
  var option = options[i]
  option.addEventListener("click", (e) => sortInputHandler(e.target))
}
gridSearch.querySelector("#sortOrderToggle").addEventListener("click", () => sortOrderToggleHandler())
document.querySelector('body').addEventListener('click', (e) => {
  if (e.target.id != "dropdown") {
    dropdown.classList.remove('active')
  }
})
var trade_panel = document.querySelector('#trade_panel')
trade_panel.querySelector('.tab.trade').addEventListener('click', () => tradePanelSwitch('trade'))
trade_panel.querySelector('.tab.craft').addEventListener('click', () => tradePanelSwitch('craft'))
document.querySelector('#trade-button-back').addEventListener('click', () => historyMove({
  "type" : "button",
  "data" : "back"
}))
document.querySelector('#trade-button-forward').addEventListener('click', () => historyMove({
  "type" : "button",
  "data" : "forward"
}))


function contentWidthCheck() {
  return (window.innerWidth + document.querySelector('.content').offsetWidth) / 2
}
export var tooltip = document.getElementById('custom-tooltip');
var widthCheck = contentWidthCheck()

window.onresize = () => { widthCheck = contentWidthCheck() }
function tooltipMove(event) {
  var x = event.clientX,
      y = event.clientY;
  tooltip.style.top = (y - 17) + 'px';
  if (x + tooltip.offsetWidth + 5 < widthCheck || tooltip.hasAttribute('unchecked')) {
    tooltip.style.left = (x + 5) + 'px';
  } else {
    tooltip.style.left = (x - 5 - tooltip.offsetWidth) + 'px';
  }

}
window.onmousemove = (event) => tooltipMove(event)

export function addTooltip(elem, text, unchecked) {
  elem.addEventListener('mouseover', (event) => {
    tooltip.innerText = text
    if (unchecked) {
      tooltip.setAttribute('unchecked', '')
    } else {
      tooltip.removeAttribute('unchecked')
    }
    tooltip.classList.remove('hidden')
    tooltipMove(event)
  })
  elem.addEventListener('mouseout', () => {
    tooltip.classList.add('hidden')
  })
}
addTooltip(document.querySelector('#sortOrderToggle'), 'Sort Order', true)