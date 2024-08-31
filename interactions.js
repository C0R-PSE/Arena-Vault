// Items grid drag function
/*document.addEventListener('DOMContentLoaded', function () {
    const ele = document.getElementById('items-grid');

    let pos = { top: 0, left: 0, x: 0, y: 0 };

    const mouseDownHandler = function (e) {
        ele.style.userSelect = 'none';

        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };

    const mouseUpHandler = function () {
        ele.style.removeProperty('user-select');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);
});*/

export function tradePanelSwitch(input) {
    document.getElementById("trade_panel").classList = "trade_panel " + input
}

export function searchInputHandler(data) {
    var itemsList = Array.from(document.getElementById('items-grid').getElementsByClassName("item"))
    for (var i in itemsList) {
        var item = itemsList[i]
        var name = item.getAttribute("name")
        var shortName = item.querySelector('.item-name').innerHTML
        if (name.search(data) == -1 && shortName.search(data) == -1) {
            item.classList.add('filtered')
        } else {
            item.classList.remove('filtered')
        }
    }
}

export function checkboxInputHandler(checkbox) {
    checkbox.classList.toggle('checked')
    var grid = document.querySelector('#items-grid')
    grid.classList.toggle(checkbox.getAttribute('type') + '-' + checkbox.getAttribute('data'))
    if (document.querySelector('.checkbox.checked') != null) {
        grid.classList.add('filtered')
    } else {
        grid.classList.remove('filtered')
    }
}

export function sortInputHandler(sortOption) {
    document.querySelector('#dropdown').setAttribute('sort', sortOption.innerText)
    document.querySelector('#items-grid').setAttribute('sort', sortOption.innerText)
    gridSort()
}

export function sortOrderToggleHandler() {
    var grid = document.querySelector('#items-grid')
    if (grid.getAttribute('sortorder') == 'asc') {
        grid.setAttribute('sortorder', 'desc')
    } else {
        grid.setAttribute('sortorder', 'asc')
    }
    gridSort()
}

export function gridSort() {
    var grid = document.querySelector('#items-grid:not(.loading)')
    var sortType = grid.getAttribute('sort')
    var sortOrder = grid.getAttribute('sortorder')
    
    function sort_by_alphabet(a, b) {
        return a.getAttribute('name').localeCompare(b.getAttribute('name'))
    }
    var itemsArr = Array.from(grid.querySelectorAll('.item'))

    var output
    if (sortType == 'name') {
        if (sortOrder == 'asc') {
            output = itemsArr.sort((a, b) => sort_by_alphabet(a, b))
        } else {
            output = itemsArr.sort((a, b) => sort_by_alphabet(b, a))}
    } else if (sortType == 'quality') {
        var order_quality = ["common", "rare", "gold", "legendary"]
        var output = []
        for (var i = -3*(sortOrder != 'asc'); i <= 3*(sortOrder == 'asc'); i++) {
            output.push(...itemsArr.filter((itemElem) => itemElem.getAttribute('quality') == order_quality[Math.abs(i)]).sort((a, b) => ((sortOrder != 'asc')*-2 + 1) * (a.getAttribute('value') - b.getAttribute('value'))))
        }
    } else if (sortType == 'value') {
        output = itemsArr.sort((a, b) => ((sortOrder != 'asc')*-2 + 1) * (a.getAttribute('value') - b.getAttribute('value')))
    }
    grid.replaceChildren(...output)
}
