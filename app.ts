import {Grid} from './grid';


let cellSize = 50;

 




// Desc: Main entry point for the application
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!; 
const squaresCanvas = document.createElement('canvas');
const squaresCtx = squaresCanvas.getContext('2d')!;
squaresCanvas.width = canvas.width;
squaresCanvas.height = canvas.height;

const grid = new Grid(Math.ceil(canvas.height / cellSize) ,Math.ceil( canvas.width / cellSize)); 
let gridSize = canvas.width / grid.cols;

const saveButton = document.getElementById('save-btn') as HTMLButtonElement;
const modal = document.getElementById('modal') as HTMLDivElement;  
const closeBtn = document.querySelector('.close') as HTMLSpanElement;
const confirmBtn = document.getElementById('confirm-btn') as HTMLButtonElement;
const filenameInput = document.getElementById('filename-input') as HTMLInputElement;
const cellSizeDropdown = document.getElementById('cell-size-dropdown') as HTMLSelectElement;
const clearButton = document.getElementById('clear-btn') as HTMLButtonElement;
const colorPicker = document.getElementById('color-picker') as HTMLInputElement;
let currentColor = 'black';

let isDrawing = false;
let isSaved = false;
let hasDrawn = false;
let x = 0; 
let y = 0;


saveButton.addEventListener('click', e => {
    modal.style.display = 'block';
}); 


closeBtn.addEventListener('click', e => {
    modal.style.display = 'none';
});





canvas.addEventListener('click', e => {
  
});


confirmBtn.addEventListener('click', e => {
    const filename = filenameInput.value;
    squaresCtx.fillStyle = 'rgba(0,0,0,0)';
    squaresCtx.clearRect(0, 0, squaresCanvas.width, squaresCanvas.height);
    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            const color = grid.getColor(row, col);
            if (color) {
                // if the color is default color, do not draw
                // to remove the white background
                if (color === grid.getDefaultColor()) continue;
                squaresCtx.fillStyle = color;
                squaresCtx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
            }
        }
    }
    const dataUrl = squaresCanvas.toDataURL('image/png',);
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = filename;
    anchor.click();
    isSaved = true;
    modal.style.display = 'none';
});

window.addEventListener('beforeunload', e => {
    if (!isSaved && hasDrawn) {
        e.preventDefault();
        e.returnValue = '';
    }

    if(e.target === modal) {
        modal.style.display = 'none';
    }
});



function draw() {
    // clear the canvas 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.draw(ctx, cellSize);
    // requestAnimationFrame : call draw() when the browser is ready to repaint the canvas
    requestAnimationFrame(draw);
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

    console.log(`Clicked at x=${x}, y=${y}`);
    console.log(`Calculated row=${row}, col=${col}`);
    // set the color of the cell
    if (isDrawing) {
        grid.setColor(row, col, currentColor);
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
// Modify your mouse event listeners to use the visible canvas
canvas.addEventListener('mousedown', e => {
    isDrawing = true;
    hasDrawn = true;
    drawOnMouseEvents(e);
});

canvas.addEventListener('mousemove', e => {
    if (!isDrawing) return;
    drawOnMouseEvents(e);
});

canvas.addEventListener('mouseup', (e) => {
    drawOnMouseEvents(e);
    isDrawing = false;
});

// add an event listener for the change event 
cellSizeDropdown.addEventListener('change', e => {
    console.log('hasDrawn: ', hasDrawn);
    if(hasDrawn) return;
    
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
}   );

// Add an event listener for the change event
colorPicker.addEventListener('change', (e) => {
    // Get the selected color
    const selectedColor = (e.target as HTMLSelectElement).value;

    // Set the drawer color to the selected color
    currentColor = selectedColor;

    
});




draw();