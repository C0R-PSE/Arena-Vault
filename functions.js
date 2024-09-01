import { addTooltip, tooltip, hideTooltip } from "/eventListeners.js";

export async function fetchPic(item) {
    var pathJson = await fetch('/categoryPaths.json').then(resp => resp.json())
    var path = '/files/images/items/' + pathJson[item.category] + '/' + item.shortName + '.webp'
    return(path)
}

export function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('GET', url, false);
    http.send();
    return http.status!=404;
}

export function arrSimilar(a, b, orderMatters) {
    var check = false
    if ((a && b) && (a.length == b.length)) {
        check = true
        for (var i in a) {
            if ((orderMatters && a[i] != b[i]) || b.indexOf(a[i]) == -1) {
                check = false
            }
        }
    }
    return check
}

export function capitalize(string) {
    var words = string.split(' ')
    var output = ''
    for (var i in words) {
        var word = words[i]
        output += ' ' + word.charAt(0).toUpperCase() + word.slice(1)
    }
    return (output.slice(1))
}

async function setItemActive(itemName) {
    var activeElement = document.getElementById("items-grid").getElementsByClassName("active")[0]
    if (activeElement) {
        activeElement.classList.remove("active")
    }
    document.querySelector('#items-grid').querySelector("[name='" + itemName + "']").classList.add("active")

}

export var itemsJson = await fetch('/items.json').then(resp => resp.json())
export var tradesJson = await fetch('/trades.json').then(resp => resp.json())

var tradesPlacehoder = '<div class="trade"><div class="trader-pic"></div><div class="ingredients-list"><div class="item ingredient empty"></div><div class="item ingredient empty"></div><div class="item ingredient empty"></div></div></div>'
async function showTrade(inputName) {
    var item = itemsJson.filter((item) => item.name == inputName)[0]
    
    // crafts list
    var crafts = tradesJson[item.name]
    var craftsList = document.getElementById("crafts-list")
    if (crafts != undefined) {
        var craftsElemsArray = []
        for (var i in crafts) {
            var trade = crafts[i]

            // trade
            var tradeElem = document.createElement('div')
            tradeElem.classList = "trade"
            tradeElem.setAttribute('trader', trade.trader)
            
            // trader picture
            var traderPic = document.createElement('img')
            traderPic.classList = "trader-pic"
            traderPic.alt = trade.trader
            traderPic.src = "/files/images/contacts/" + trade.trader + ".png"
            addTooltip(traderPic, capitalize(trade.trader))
            tradeElem.append(traderPic)

            // ingredients
            var ingredientsList = document.createElement('div')
            ingredientsList.classList = "ingredients-list"
            tradeElem.append(ingredientsList)

            for (var k in trade.ingredients) {
                var ingredient = trade.ingredients[k]
                var ingredientElem = await buildItem(itemsJson.filter((item) => item.name == ingredient.name)[0], {"type" : "ingredient", "data" : ingredient})
                ingredientsList.append(ingredientElem)     
            }
            craftsElemsArray.push(tradeElem)
        }
        craftsList.replaceChildren(...craftsElemsArray)
    } else {
        craftsList.innerHTML = tradesPlacehoder
    }

    // trade list
    var inTrades = item.inTrades

    // checking if trades are similar
    var currentTrades = undefined
    if (targetItemsHistory.history.length > 0) {
        currentTrades = itemsJson.filter(itemCheck => itemCheck.name == targetItemsHistory.history[targetItemsHistory.pos])[0].inTrades
    }
    if (arrSimilar(inTrades, currentTrades, false)) { // identical trades - nochange
        console.log('nochange - identical trades')
    } else { // different trades - apply changes
        var tradesList = document.getElementById("trades-list")
        if (inTrades.length > 0) {
            var tradesElemsArray = []
            for (var i in inTrades) {
                var trade = tradesJson[inTrades[i]].filter(trade => trade.ingredients.filter(ingredient => ingredient.name == item.name))[0]
    
                var tradeElem = document.createElement('div')
                tradeElem.classList = "trade"
                tradeElem.setAttribute('trader', trade.trader)
                
                
                var traderPic = document.createElement('img')
                traderPic.classList = "trader-pic"
                traderPic.alt = trade.trader
                traderPic.src = "/files/images/contacts/" + trade.trader + ".png"
                addTooltip(traderPic, capitalize(trade.trader))
                tradeElem.append(traderPic)
    
                var tradeItems = document.createElement('div')
                tradeItems.classList = "ingredients-list"
                for (var k in trade.ingredients) {
                    var ingredient = trade.ingredients[k]
                    var ingredientElem = await buildItem(itemsJson.filter((item) => item.name == ingredient.name)[0], {"type" : "ingredient", "data" : ingredient})
                    tradeItems.append(ingredientElem)
                }
    
                var resultItemElem = await buildItem(itemsJson.filter((item) => item.name == inTrades[i])[0], {"type" : "result", "data" : trade})
                
                tradeElem.append(tradeItems)  
                tradeElem.append(resultItemElem) 
                tradesElemsArray.push(tradeElem)
            }
            tradesList.replaceChildren(...tradesElemsArray) 
        } else {
            tradesList.innerHTML = tradesPlacehoder
        }
    }
}

export var targetItemsHistory = {
    "pos" : -1,
    "history" : []
}

export async function historyMove(input) {
    var change
    if (input.type == "button") {
        var itemName
        if (input.data == "forward" && targetItemsHistory.pos < targetItemsHistory.history.length - 1) {
            targetItemsHistory.pos = targetItemsHistory.pos + 1
            itemName = targetItemsHistory.history[targetItemsHistory.pos]
        } else if (input.data == "back" && targetItemsHistory.pos > 0) {
            targetItemsHistory.pos = targetItemsHistory.pos - 1
            itemName = targetItemsHistory.history[targetItemsHistory.pos]
        }
        if (itemName) {
            change = true
            await setItemActive(itemName)
            await showTrade(itemName)
        }
    } else if (input.type == "newItem") {
        change = true
        var newName = input.data
        targetItemsHistory.history = targetItemsHistory.history.slice(0, targetItemsHistory.pos + 1)
        targetItemsHistory.history.push(newName)
        targetItemsHistory.pos += 1
    }
    if (change) {
        if (targetItemsHistory.pos == 0) {
            document.querySelector('#trade-button-back').classList.add('disabled')
        } else (
            document.querySelector('#trade-button-back').classList.remove('disabled')
        )
        if (targetItemsHistory.pos == targetItemsHistory.history.length - 1) {
            document.querySelector('#trade-button-forward').classList.add('disabled')
        } else (
            document.querySelector('#trade-button-forward').classList.remove('disabled')
        )
    }
    //console.log(targetItemsHistory) 
}

function showPreview(itemName) {
    var item = itemsJson.filter((item) => item.name == itemName)[0]
    var preview = document.getElementById("preview")

    preview.setAttribute('quality', item.quality)
    preview.querySelector('.preview-header').innerText = capitalize(item.name)
    preview.querySelector('.preview-data.category').innerText = capitalize(item.category)
    preview.querySelector('.preview-data.weight').innerText = item.weight + "kg"
    var valueElem = preview.querySelector('.preview-data.value')
    valueElem.innerHTML = '<img class="koen" alt = "koen" src="/files/images/items/koen.webp">' + item.value
    addTooltip(valueElem, 'Item value is an estimate from the contact.')
    var sizeElem = preview.querySelector('.preview-data.size')
    sizeElem.style = "width: " + (item.size[0]*7 - 2) + "px; height: " + (item.size[2]*7 - 2) + "px"
    addTooltip(sizeElem, 'Size')
    preview.querySelector('.preview-info-area').innerText = item.description
}

export async function itemListClick(itemName, itemElem) {
    if (targetItemsHistory.history[targetItemsHistory.pos] != itemName) {
        await setItemActive(itemName)
        showPreview(itemName)
        await showTrade(itemName)
        await historyMove({
            "type" : "newItem",
            "data" : itemName
        })
        if (itemElem.classList.contains('result') || itemElem.classList.contains('ingredient')) {
            hideTooltip()
        }
    }
}

export async function buildItem(item, settings) {
    // item element
    var itemElem = document.createElement('div')
    itemElem.classList = "item"
    var type
    if (settings) {
        type = settings.type
        itemElem.classList.add(type)
    }
    itemElem.setAttribute('name', item.name)
    itemElem.setAttribute('quality', item.quality) 
    itemElem.setAttribute('value', item.value)

    // item name element
    var itemName = document.createElement('div')
    if (item.shortName.length > 0) {
        itemName.innerHTML = item.shortName
    } else {
        itemName.innerHTML = item.name
    }
    itemName.classList = "item-name"
    itemElem.append(itemName)

    // item image element
    var itemPic = document.createElement('img')
    itemPic.classList = "item-pic"
    itemPic.alt = item.name
    //itemPic.src = await fetchPic(item)
    itemPic.src = "/files/images/items/Unknown.png"
    itemPic.setAttribute("onerror", "this.src='/files/images/items/Unknown.png'")
    itemElem.append(itemPic)

    // item value/amount element
    var itemValue = document.createElement('div')
    if (type == 'ingredient' || type == 'result') {
        itemValue.classList = "amount"
        var amount = settings.data.amount
        if (amount > 1) {
            itemValue.innerText = amount
        }
    } else {
        itemValue.classList = "value"
        itemValue.innerHTML = '<img class="koen" alt="koen" src="/files/images/items/koen.webp">'
        if (item.value >= 10000) {
            itemValue.append(Math.floor(item.value / 1000) + 'k')
        } else {
            itemValue.append(item.value)
        }
    }
    itemElem.append(itemValue)
    
    //applying changes
    itemElem.addEventListener('click', () => { itemListClick(item.name, itemElem) })
    addTooltip(itemElem, capitalize(item.name))

    return(itemElem)
}
