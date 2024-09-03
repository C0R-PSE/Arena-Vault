import { itemListClick, buildItem } from "./functions.js"
import { gridSort } from "./interactions.js"
import { itemsJson } from "./functions.js"


var grid = document.querySelector("#items-grid")
for (var i in itemsJson) {
    var progress = Math.floor(i/itemsJson.length*100)
    grid.append(await buildItem(itemsJson[i]))
    grid.querySelector("#progress-bar").style.backgroundImage = "linear-gradient(90deg, black 0" + progress + "%, transparent " + progress + "%)"
}
grid.classList.toggle("loading")
gridSort()