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
var tooltip = document.getElementById('custom-tooltip');
var tooltipText = tooltip.querySelector('.tooltip-text');
var tooltipTextBuffer = ''
var tooltipHintsBuffer = ''
var tooltipHints = tooltip.querySelector('.tooltip-hints');
var widthCheck = contentWidthCheck()
var wWidth = window.innerWidth
window.onresize = () => { widthCheck = contentWidthCheck(); wWidth = window.innerWidth }

function tooltipMove(event) {
  var x = event.clientX,
      y = event.clientY;
  tooltip.style.top = (y - tooltipText.offsetHeight + 10) + 'px';
  if (x + tooltip.offsetWidth + 5 < wWidth) {
    tooltip.classList.remove('left')
    tooltip.style.left = (x + 5) + 'px';
  } else {
    tooltip.classList.add('left')
    tooltip.style.left = (x - 5 - tooltip.offsetWidth) + 'px';
  }

}

export async function triggerTooltip(event, text, hints, unchecked) {
  tooltipTextBuffer = tooltipText.innerHTML
  tooltipHintsBuffer = tooltipHints.innerHTML
  tooltipText.innerHTML = text
  tooltipHints.innerHTML = hints
  if (unchecked) {
    tooltip.setAttribute('unchecked', '')
  } else {
    tooltip.removeAttribute('unchecked')
  }
  window.onmousemove = (event) => tooltipMove(event)
  tooltip.classList.remove('hidden')
}
export async function hideTooltip(event) {
  if (event.target.classList.contains('value')) {
    tooltipText.innerHTML = tooltipTextBuffer
    tooltipHints.innerHTML = tooltipHintsBuffer
  } else {
    tooltip.classList.add('hidden')
    window.onmousemove = function() {}
    tooltipText.innerHTML = ""
    tooltip.style = ""
  }
}

export function addTooltip(elem, text, unchecked) {
  var hints = ''
  if (elem.classList.contains('item')) {
    hints = '<svg style="fill:currentColor" width="20" height="20" viewBox="0 0 800 800" ><use href="resources/styles/icons/left-click.svg#Capa_1"/></svg>left click<br>right click'
  }
  elem.addEventListener('mouseenter', (event) => { triggerTooltip(event, text, hints, unchecked) })
  elem.addEventListener('mouseleave', (event) => { hideTooltip(event) })
}
addTooltip(document.querySelector('#sortOrderToggle'), 'Sort Order', true)