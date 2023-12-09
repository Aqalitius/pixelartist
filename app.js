import { Grid } from './grid';
const gridSize = 20;
// Desc: Main entry point for the application
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const grid = new Grid(gridSize, gridSize);
const saveButton = document.getElementById('save-btn');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');
const confirmBtn = document.getElementById('confirm-btn');
const filenameInput = document.getElementById('filename-input');
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
// Event listeners
canvas.addEventListener('mousedown', e => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
});
canvas.addEventListener('mousemove', e => {
    if (isDrawing === true) {
        drawLine(ctx, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
        hasDrawn = true;
    }
});
canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // calculate the row and col of the clicked cell
    const row = Math.floor(y / gridSize);
    const col = Math.floor(x / gridSize);
    // toggle the color of the cell
    grid.toggleColor(row, col);
    // redraw the grid
    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            const color = grid.getColor(row, col);
            ctx.fillStyle = color;
            ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
        }
    }
});
// from windows because mouseup can happen outside of canvas
window.addEventListener('mouseup', e => {
    if (isDrawing === true) {
        drawLine(ctx, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
    }
});
saveButton.addEventListener('click', e => {
    const filename = filenameInput.value;
    const dataUrl = canvas.toDataURL('image/png');
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
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
function drawLine(context, x1, y1, x2, y2) {
    // beginPath()
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}
