import { Grid } from './grid';
import { HistoryManager } from './HistoryManager';
// One of the following themes



let cellSize = 50;

let db: IDBDatabase;
const request = indexedDB.open('pixelArtDatabase', 1);




// Desc: Main entry point for the application
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const squaresCanvas = document.createElement('canvas');
const squaresCtx = squaresCanvas.getContext('2d')!;
squaresCanvas.width = canvas.width;
squaresCanvas.height = canvas.height;

const grid = new Grid(Math.ceil(canvas.height / cellSize), Math.ceil(canvas.width / cellSize));
let gridSize = canvas.width / grid.cols;

const historyManager = new HistoryManager();
const saveButton = document.getElementById('save-btn') as HTMLButtonElement;
const modal = document.getElementById('modal') as HTMLDivElement;
const closeBtn = document.querySelector('.close') as HTMLSpanElement;
const confirmBtn = document.getElementById('confirm-btn') as HTMLButtonElement;
const filenameInput = document.getElementById('filename-input') as HTMLInputElement;
const cellSizeDropdown = document.getElementById('cell-size-dropdown') as HTMLSelectElement;
const clearButton = document.getElementById('clear-btn') as HTMLButtonElement;
const colorPicker = document.getElementById('color-picker') as HTMLInputElement;
let currentColor = 'black';
const undoButton = document.getElementById('undo-btn') as HTMLButtonElement;
const redoButton = document.getElementById('redo-btn') as HTMLButtonElement;
const cursorDiv = document.getElementById('cursor') as HTMLDivElement;
const loadButton = document.getElementById('load-btn') as HTMLButtonElement;
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const fillButton = document.getElementById('fill-btn') as HTMLButtonElement;
const eraserButton = document.getElementById('erase-btn') as HTMLButtonElement;

let isDrawing = false;
let isSaved = false;
let hasDrawn = false;
let x = 0;
let y = 0;
let fillMode = false;
let eraserMode = false;

saveButton.addEventListener('click', e => {
    // 'block' : display the modal as a block element
    // block element : display the element as a block, like <p> and <div> 
    modal.style.display = 'block';
});


closeBtn.addEventListener('click', e => {
    modal.style.display = 'none';
});

fillButton.addEventListener('click', e => {
    
    if(eraserMode) return;
    
    fillMode = !fillMode;
    if (fillMode) {
        fillButton.style.backgroundColor = 'lightgreen';
    } else {
        fillButton.style.backgroundColor = 'white';
    }
});


eraserButton.addEventListener('click', e => {
    
    if (fillMode) return;
    eraserMode = !eraserMode;
    if (eraserMode) {
        eraserButton.style.backgroundColor = 'lightgreen';
    } else {
        eraserButton.style.backgroundColor = 'white';
    }
});

// IDBVersionChangeEvent : an interface of the IndexedDB API
// onupgradeneeded : an event handler for the upgradeneeded event
// upgradeneeded : an event that is fired when the database is opened with a version number higher than its current version
request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
    // e.target : the object that fired the event
    const req = e.target as IDBOpenDBRequest;
    db = req.result;
    // objectStore : a transactional database object store that allows access to a set of data in the database
    // objectStoreNames : a DOMStringList that contains a list of the names of the object stores currently in the database
    // contains : check if the list contains the given name
    if (!db.objectStoreNames.contains('gridStates')) {
        // createObjectStore : create a new object store in the connected database
        db.createObjectStore('gridStates', { keyPath: 'filename' });
    }
}

request.onsuccess = (e: Event) => {
    const req = e.target as IDBOpenDBRequest;
    db = req.result;
    console.log('Database opened successfully');
}

request.onerror = (e: Event) => {
    console.log('Error opening database');
}


canvas.addEventListener('click', e => {

});


confirmBtn.addEventListener('click', e => {
    // get the filename from the input
    const filename = filenameInput.value;

    squaresCtx.fillStyle = 'rgba(0,0,0,0)';
    // clearRect : clear the canvas
    // before saving the canvas, we need to clear the canvas to its blank state
    squaresCtx.clearRect(0, 0, squaresCanvas.width, squaresCanvas.height);
    let gridState = [];
    for (let row = 0; row < grid.rows; row++) {
        let rowState = [];
        for (let col = 0; col < grid.cols; col++) {
            const color = grid.getColor(row, col);
            rowState.push(color);
            if (color) {
                // if the color is default color, do not draw
                // to remove the white background
                if (color === grid.getDefaultColor()) continue;
                squaresCtx.fillStyle = color;
                squaresCtx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
            }
        }

        gridState.push(rowState);
    }
    const dataUrl = squaresCanvas.toDataURL('image/png',);
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = filename;
    anchor.click();
    isSaved = true;
    modal.style.display = 'none';

    // save the grid state to the database
    const transaction = db.transaction(['gridStates'], 'readwrite');
    const objectStore = transaction.objectStore('gridStates');
    objectStore.put({ filename, gridState });
});


loadButton.addEventListener('click', e => {
    fileInput.click();
});

// this actually does not loads instead it gets name of the file and look for database for the saved grid state
fileInput.addEventListener('change', e => {
    if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const filename = file.name.replace('.png', '');
        load(filename);
    }

});


// if the user tries to leave the page without saving the canvas, display a warning message
window.addEventListener('beforeunload', e => {
    if (!isSaved && hasDrawn) {
        e.preventDefault();
        e.returnValue = '';
    }

    if (e.target === modal) {
        modal.style.display = 'none';
    }
});


// key events
window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'z') {
        const state = historyManager.undo();
        if (state) {
            grid.setGrid(state);
            draw();
        }
    } else if (e.ctrlKey && e.key === 'y') {
        const state = historyManager.redo();
        if (state) {
            grid.setGrid(state);
            draw();
        }

        // prevent the browsers default redo action  
        e.preventDefault();
    }
});



function draw() {
    // clear the canvas 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.draw(ctx, cellSize);
    // requestAnimationFrame : call draw() when the browser is ready to repaint the canvas
    requestAnimationFrame(draw);
}


function load(filename: string) {
    // db.transaction : create a transaction object
    // transaction object : a transactional database object store that allows access to a set of data in the database
    const transaction = db.transaction(['gridStates'], 'readonly');
    const objectStore = transaction.objectStore('gridStates');
    const request = objectStore.get(filename);

    request.onsuccess = (e: Event) => {
        const req = e.target as IDBRequest;
        const data = req.result;
        if (data) {
            console.log('File found');
            grid.setGrid(data.gridState);
            draw();
        } else {
            console.log('File not found');
        }
    };

    request.onerror = (e: Event) => {
        console.log('Error loading file');
    }
}

function drawOnMouseEvents(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // calculate the row and col of the clicked cell
    const row = Math.floor(y / gridSize);
    const col = Math.floor(x / gridSize);


    if (fillMode) {
        console.log('fill mode');
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize); // assuming cellSize is the size of a cell in pixels
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        fill(x, y, currentColor);
    }

    // set the color of the cell
    if (isDrawing) {
        // print current color 

        grid.setColor(row, col, currentColor);

        // print grid to console 

    }

    if (eraserMode) {
        erase(col, row);
    }


    // redraw the grid
    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            const color = grid.getColor(row, col);
            ctx.fillStyle = color;
            ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
        }
    }
}

function fill(startX: number, startY: number, fillColor: string) {
    console.log('filling');
    const startColor = grid.getGrid()[startY][startX];
    if (startColor === fillColor) return;

    const queue = [[startX, startY]];

    while (queue.length > 0) {
        let point = queue.shift();
        if (point) {

            const [x, y] = point;
            const currentColor = grid.getGrid()[y][x];

            if (currentColor === startColor) {
                grid.getGrid()[y][x] = fillColor;
                if (x > 0) queue.push([x - 1, y]);
                if (x < grid.cols - 1) queue.push([x + 1, y]);
                if (y > 0) queue.push([x, y - 1]);
                if (y < grid.rows - 1) queue.push([x, y + 1]);
            }
        }
    }
}


// erasing function with clearRect
function erase(x: number, y: number) {
    ctx.clearRect(x * gridSize, y * gridSize, gridSize, gridSize);
    grid.setColor(y, x, grid.getDefaultColor());
}



// Modify your mouse event listeners to use the visible canvas
canvas.addEventListener('mousedown', e => {
    isDrawing = true;
    hasDrawn = true;
    historyManager.saveState(grid.getGrid());
    drawOnMouseEvents(e);
});

// to continue drawing when the mouse is moved 
canvas.addEventListener('mousemove', e => {
    cursorDiv.style.width = `${cellSize}px`;
    cursorDiv.style.height = `${cellSize}px`;
    cursorDiv.style.left = `${e.pageX - cursorDiv.offsetWidth / 2}px`;
    cursorDiv.style.top = `${e.pageY - cursorDiv.offsetHeight / 2}px`;
    cursorDiv.style.backgroundColor = currentColor;
    cursorDiv.style.display = 'block';

    if (!isDrawing) return; // if the mouse is not pressed, do not draw
    drawOnMouseEvents(e);
});

// when mouse leave from canvas change cursor to default
canvas.addEventListener('mouseleave', e => {
    cursorDiv.style.display = 'none';
});

canvas.addEventListener('mouseup', (e) => {
    drawOnMouseEvents(e); // draw the last cell
    historyManager.saveState(grid.getGrid());
    isDrawing = false; // stop drawing
});




// add an event listener for the change event 
cellSizeDropdown.addEventListener('change', e => {

    if (hasDrawn) return;

    // get the selected value 
    const selectedValue = cellSizeDropdown.value;
    switch (selectedValue) {
        case 'small':
            cellSize = 20;
            break;
        case 'medium':
            cellSize = 50;
            break;
        case 'large':
            cellSize = 130;
            break;
        default:
            cellSize = 50;
            break;
    }

    const numRows = Math.ceil(canvas.height / cellSize);
    const numCols = Math.ceil(canvas.width / cellSize);

    // if the grid has not been drawn, redraw the grid
    grid.update(numRows, numCols);
    gridSize = canvas.width / grid.cols;
    draw();


});


clearButton.addEventListener('click', e => {
    grid.clear();
    draw();
});

// Add an event listener for the change event
colorPicker.addEventListener('change', (e) => {
    // Get the selected color
    const selectedColor = (e.target as HTMLSelectElement).value;

    // Set the drawer color to the selected color
    currentColor = selectedColor;


});


undoButton.addEventListener('click', e => {

    const state = historyManager.undo();
    if (state) {
        let gridBeforeUndo = grid.getGrid();
        grid.setGrid(state);
        let gridAfterUndo = grid.getGrid();
        if (JSON.stringify(gridBeforeUndo) === JSON.stringify(gridAfterUndo)) {

        }
        draw();
    }
});

redoButton.addEventListener('click', e => {
    const state = historyManager.redo();
    if (state) {

        grid.setGrid(state);

        draw();
    }
});





draw();