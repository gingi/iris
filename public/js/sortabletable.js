function sortTable (elem) {

    var row   = elem.parentNode;
    var thead = row.parentNode;
    var table = thead.parentNode;

    var headerCells = row.cells;
    var cellIdx = 0;
    
    for (var i = 0; i < headerCells.length; i++) {
        if (headerCells[i] == elem) {
            cellIdx = i;
            break;
        }
    }

    //if the table doesn't have an ID, we make one up for it
    var tableIdentifier = sortImgIdentifier(table);
    
    var imgID = tableIdentifier + '-tablesorter';
    
    //toss the old sort image, if it existed. Note - obviously this means
    //we can only sort by one column at a time.
    var oldImg = document.getElementById(imgID);
    if (oldImg != null) {
        headerCells[table.lastSortIndex].removeChild(oldImg);
    }

    //sort ascending by default
    var order = 'ascending';

    //and adjust. If we're sorting the same column and are already ascending
    //then make it descending.
    //if we're descending, then wipe out the sort
    if (table.lastSortIndex == cellIdx) {
        if (table.lastSortOrder == 'ascending') {
            table.lastSortOrder = order = 'descending';
        }
        else {
            table.lastSortIndex = null;
            order = null;
        }
    }
    else {
        table.lastSortIndex = cellIdx;
        table.lastSortOrder = 'ascending';
    }

    //add in our appropriate image
    var img = document.createElement('img');
    img.width = 12;
    img.height = 8;
    img.id = imgID;
    
    if (order != null) {
        if (order == 'ascending') {
            img.src = '/static/images/sort-asc.png';
        }
        else if (order == 'descending') {
            img.src = '/static/images/sort-desc.png';                    
        }
        
        elem.appendChild(img);
    }
    
    //create our sorter function at the given cell
    var sorterFunction = sortAtIndex(cellIdx, order);

    //and finally, loop through all the tbodies and sort as appropriate
    var bodies = table.tBodies;
    for (var i = 0; i < bodies.length; i++) {
        var tbody = bodies[i];
        if (tbody.structure == null) {
            buildStructure(tbody);
        }
        var structure = tbody.structure;
        if (order == null) {
            rearrange(tbody, tbody.originalStructure);
        }
        else {
            structure.sort(sorterFunction);
            rearrange(tbody);
        }
    }
    
}

//return's the table id if it has one, otherwise makes something up
function sortImgIdentifier (table) {
    if (table.id != null && table.id != '') {
        return table.id;
    }
    else {
        if (table.sortImgIdentifier == null) {
            table.sortImgIdentifier = 'sorttable-' + Math.random();
        }
        return table.sortImgIdentifier;
    }
}

//returns a function to sort the structure on the specified cell
function sortAtIndex(idx, direction) {
    return function (a, b) {
    
        var aVal, bVal;
        
        if (direction == 'ascending') {
            aVal = a[idx].sort;
            bVal = b[idx].sort;
        }
        else {
            aVal = b[idx].sort;
            bVal = a[idx].sort;
        }
        
        var aValCommaFree = aVal;
        var bValCommaFree = bVal;
        
        var aValCommaFree = aVal.replace(/,/g,'');
        var bValCommaFree = bVal.replace(/,/g,'');

        var aFloat = parseFloat(aValCommaFree);
        var bFloat = parseFloat(bValCommaFree);

        if (isNaN(aFloat) || isNaN(bFloat)) {
            return aVal < bVal
                ? -1
                : (aVal > bVal
                    ? 1
                    : 0);
        }
        else { 
            return aFloat - bFloat;
        }
    }
}

//transforms the tbody's rows & cells into a multidimensional array of values
function buildStructure (tbody) {

    var structure = new Array();
    var original = new Array();

    var rows = tbody.rows;
    for (var i = 0; i < rows.length; i++) {
        structure[i] = new Array();
        original[i] = new Array();
        var cells = rows[i].cells;
        for (var j = 0; j < cells.length; j++) {
            original[i][j] = new Object();
            structure[i][j] = new Object();
            if (document.all) {
	            original[i][j].sort = structure[i][j].sort = cells[j].innerText.toLowerCase();
	        }
	        else {
	            original[i][j].sort = structure[i][j].sort = cells[j].textContent.toLowerCase();
	        }
            original[i][j].html = structure[i][j].html = cells[j].innerHTML;
        }
    }

    tbody.structure = structure;
    tbody.originalStructure = original;
            
}

//rearranges the cells in the tbody to match the structure. Use's
//the tbody's structure if none provided
function rearrange (tbody, structure) {
    if (structure == null) {
        structure = tbody.structure;
    }
    
    var rows = tbody.rows;
    
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].cells;
        for (var j = 0; j < cells.length; j++) {
            cells[j].innerHTML = structure[i][j].html;
        }
    }
    
}

//just adds in the onclick events to the table headers 
function makeSortable(table) {
    var rows = table.tHead.rows;
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].cells;
        for (var j = 0; j < cells.length; j++) {
            cells[j].setAttribute('onclick', "sortTable(this)");
        }
    }
}
