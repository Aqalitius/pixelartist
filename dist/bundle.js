/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./HistoryManager.ts":
/*!***************************!*\
  !*** ./HistoryManager.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   HistoryManager: () => (/* binding */ HistoryManager)\n/* harmony export */ });\nclass HistoryManager {\n    constructor() {\n        this.history = [];\n        // keep track of the current state\n        // -1 means no state\n        //  undo : pointer--\n        //  redo : pointer++\n        this.pointer = -1;\n    }\n    saveState(grid) {\n        // remove any undone states from the history\n        //  lets say you've made some changes, then undo, then make some changes again\n        // that means some of the states will be ahead of the current state\n        // but when a new change is made, all the states ahead of the current state will be invalid so we need to remove them\n        this.history = this.history.slice(0, this.pointer + 1);\n        const newState = JSON.parse(JSON.stringify(grid));\n        // only save the state if it is different from the current state\n        if (this.pointer < 0 || JSON.stringify(this.history[this.pointer]) !== JSON.stringify(newState)) {\n            this.history.push(newState);\n            this.pointer++;\n        }\n    }\n    undo() {\n        if (this.pointer > 0) { // means there is a state to undo\n            this.pointer--;\n            return this.history[this.pointer];\n        }\n        return null;\n    }\n    redo() {\n        if (this.pointer < this.history.length - 1) { // means there is a state to redo\n            this.pointer++;\n            return this.history[this.pointer];\n        }\n        return null;\n    }\n    // to debug get size of the history\n    getSize() {\n        return this.history.length;\n    }\n}\n\n\n//# sourceURL=webpack:///./HistoryManager.ts?");

/***/ }),

/***/ "./app.ts":
/*!****************!*\
  !*** ./app.ts ***!
  \****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grid */ \"./grid.ts\");\n/* harmony import */ var _HistoryManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HistoryManager */ \"./HistoryManager.ts\");\n\n\nlet cellSize = 50;\n// Desc: Main entry point for the application\nconst canvas = document.getElementById('canvas');\nconst ctx = canvas.getContext('2d');\nconst squaresCanvas = document.createElement('canvas');\nconst squaresCtx = squaresCanvas.getContext('2d');\nsquaresCanvas.width = canvas.width;\nsquaresCanvas.height = canvas.height;\nconst grid = new _grid__WEBPACK_IMPORTED_MODULE_0__.Grid(Math.ceil(canvas.height / cellSize), Math.ceil(canvas.width / cellSize));\nlet gridSize = canvas.width / grid.cols;\nconst historyManager = new _HistoryManager__WEBPACK_IMPORTED_MODULE_1__.HistoryManager();\nconst saveButton = document.getElementById('save-btn');\nconst modal = document.getElementById('modal');\nconst closeBtn = document.querySelector('.close');\nconst confirmBtn = document.getElementById('confirm-btn');\nconst filenameInput = document.getElementById('filename-input');\nconst cellSizeDropdown = document.getElementById('cell-size-dropdown');\nconst clearButton = document.getElementById('clear-btn');\nconst colorPicker = document.getElementById('color-picker');\nlet currentColor = 'black';\nconst undoButton = document.getElementById('undo-btn');\nconst redoButton = document.getElementById('redo-btn');\nlet isDrawing = false;\nlet isSaved = false;\nlet hasDrawn = false;\nlet x = 0;\nlet y = 0;\nsaveButton.addEventListener('click', e => {\n    // 'block' : display the modal as a block element\n    // block element : display the element as a block, like <p> and <div> \n    modal.style.display = 'block';\n});\ncloseBtn.addEventListener('click', e => {\n    modal.style.display = 'none';\n});\ncanvas.addEventListener('click', e => {\n});\nconfirmBtn.addEventListener('click', e => {\n    // get the filename from the input\n    const filename = filenameInput.value;\n    squaresCtx.fillStyle = 'rgba(0,0,0,0)';\n    // clearRect : clear the canvas\n    // before saving the canvas, we need to clear the canvas to its blank state\n    squaresCtx.clearRect(0, 0, squaresCanvas.width, squaresCanvas.height);\n    for (let row = 0; row < grid.rows; row++) {\n        for (let col = 0; col < grid.cols; col++) {\n            const color = grid.getColor(row, col);\n            if (color) {\n                // if the color is default color, do not draw\n                // to remove the white background\n                if (color === grid.getDefaultColor())\n                    continue;\n                squaresCtx.fillStyle = color;\n                squaresCtx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);\n            }\n        }\n    }\n    const dataUrl = squaresCanvas.toDataURL('image/png');\n    const anchor = document.createElement('a');\n    anchor.href = dataUrl;\n    anchor.download = filename;\n    anchor.click();\n    isSaved = true;\n    modal.style.display = 'none';\n});\n// if the user tries to leave the page without saving the canvas, display a warning message\nwindow.addEventListener('beforeunload', e => {\n    if (!isSaved && hasDrawn) {\n        e.preventDefault();\n        e.returnValue = '';\n    }\n    if (e.target === modal) {\n        modal.style.display = 'none';\n    }\n});\n// key events\nwindow.addEventListener('keydown', e => {\n    if (e.ctrlKey && e.key === 'z') {\n        const state = historyManager.undo();\n        if (state) {\n            grid.setGrid(state);\n            draw();\n        }\n    }\n    else if (e.ctrlKey && e.key === 'y') {\n        const state = historyManager.redo();\n        if (state) {\n            grid.setGrid(state);\n            draw();\n        }\n        // prevent the browsers default redo action  \n        e.preventDefault();\n    }\n});\nfunction draw() {\n    // clear the canvas \n    ctx.clearRect(0, 0, canvas.width, canvas.height);\n    grid.draw(ctx, cellSize);\n    // requestAnimationFrame : call draw() when the browser is ready to repaint the canvas\n    requestAnimationFrame(draw);\n}\nfunction drawOnMouseEvents(e) {\n    const rect = canvas.getBoundingClientRect();\n    const scaleX = canvas.width / rect.width;\n    const scaleY = canvas.height / rect.height;\n    const x = (e.clientX - rect.left) * scaleX;\n    const y = (e.clientY - rect.top) * scaleY;\n    // calculate the row and col of the clicked cell\n    const row = Math.floor(y / gridSize);\n    const col = Math.floor(x / gridSize);\n    // set the color of the cell\n    if (isDrawing) {\n        // print current color \n        console.log('Current color: ', currentColor);\n        grid.setColor(row, col, currentColor);\n        // print grid to console \n        console.log('Grid after drawing: ', grid.getGrid());\n    }\n    // redraw the grid\n    for (let row = 0; row < grid.rows; row++) {\n        for (let col = 0; col < grid.cols; col++) {\n            const color = grid.getColor(row, col);\n            ctx.fillStyle = color;\n            ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);\n        }\n    }\n}\n// Modify your mouse event listeners to use the visible canvas\ncanvas.addEventListener('mousedown', e => {\n    isDrawing = true;\n    hasDrawn = true;\n    historyManager.saveState(grid.getGrid());\n    drawOnMouseEvents(e);\n});\n// to continue drawing when the mouse is moved \ncanvas.addEventListener('mousemove', e => {\n    if (!isDrawing)\n        return; // if the mouse is not pressed, do not draw\n    drawOnMouseEvents(e);\n});\ncanvas.addEventListener('mouseup', (e) => {\n    drawOnMouseEvents(e); // draw the last cell\n    historyManager.saveState(grid.getGrid());\n    isDrawing = false; // stop drawing\n});\n// add an event listener for the change event \ncellSizeDropdown.addEventListener('change', e => {\n    if (hasDrawn)\n        return;\n    // get the selected value \n    const selectedValue = cellSizeDropdown.value;\n    switch (selectedValue) {\n        case 'small':\n            cellSize = 20;\n            break;\n        case 'medium':\n            cellSize = 50;\n            break;\n        case 'large':\n            cellSize = 130;\n            break;\n        default:\n            cellSize = 50;\n            break;\n    }\n    const numRows = Math.ceil(canvas.height / cellSize);\n    const numCols = Math.ceil(canvas.width / cellSize);\n    // if the grid has not been drawn, redraw the grid\n    grid.update(numRows, numCols);\n    gridSize = canvas.width / grid.cols;\n    draw();\n});\nclearButton.addEventListener('click', e => {\n    grid.clear();\n    draw();\n});\n// Add an event listener for the change event\ncolorPicker.addEventListener('change', (e) => {\n    // Get the selected color\n    const selectedColor = e.target.value;\n    // Set the drawer color to the selected color\n    currentColor = selectedColor;\n});\nundoButton.addEventListener('click', e => {\n    console.log('undo clicked');\n    const state = historyManager.undo();\n    if (state) {\n        let gridBeforeUndo = grid.getGrid();\n        grid.setGrid(state);\n        let gridAfterUndo = grid.getGrid();\n        if (JSON.stringify(gridBeforeUndo) === JSON.stringify(gridAfterUndo)) {\n            console.log('grid before undo is the same as grid after undo');\n        }\n        draw();\n    }\n});\nredoButton.addEventListener('click', e => {\n    const state = historyManager.redo();\n    if (state) {\n        console.log('Grid before redo: ', grid.getGrid());\n        grid.setGrid(state);\n        console.log('Grid after redo: ', grid.getGrid());\n        draw();\n    }\n});\ndraw();\n\n\n//# sourceURL=webpack:///./app.ts?");

/***/ }),

/***/ "./grid.ts":
/*!*****************!*\
  !*** ./grid.ts ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Grid: () => (/* binding */ Grid)\n/* harmony export */ });\n// add cell \nclass Grid {\n    constructor(rows, cols, defaultColor = 'white') {\n        this.rows = rows;\n        this.cols = cols;\n        this.defaultColor = defaultColor;\n        // break down : \n        // Array(rows) : create an array with length of rows\n        // fill(null) : fill the array with null\n        // map(() => Array(cols).fill(defaultColor)) : for each element in the array, create an array with length of cols and fill it with defaultColor\n        this.grid = Array(rows).fill(null).map(() => Array(cols).fill(defaultColor));\n    }\n    // get grid\n    getGrid() {\n        return this.grid;\n    }\n    setGrid(newState) {\n        this.grid = JSON.parse(JSON.stringify(newState));\n    }\n    // update rows and cols\n    update(rows, cols) {\n        this.rows = rows;\n        this.cols = cols;\n        this.grid = Array(rows).fill(null).map(() => Array(cols).fill(this.defaultColor));\n    }\n    // get grid size \n    getRows() {\n        return this.rows;\n    }\n    getCols() {\n        return this.cols;\n    }\n    getColor(row, col) {\n        return this.grid[row][col];\n    }\n    getDefaultColor() {\n        return this.defaultColor;\n    }\n    setColor(row, col, color) {\n        this.grid[row][col] = color;\n    }\n    toggleColor(row, col) {\n        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {\n            this.grid[row][col] = this.grid[row][col] === this.defaultColor ? 'black' : this.defaultColor;\n        }\n        else {\n            console.error(`Invalid row or column: row=${row}, col=${col}`);\n        }\n    }\n    draw(context, cellSize) {\n        for (let row = 0; row < this.rows; row++) {\n            for (let col = 0; col < this.cols; col++) {\n                const color = this.getColor(row, col);\n                context.fillStyle = color;\n                // fillRect : draw a rectangle filled with the current fill style\n                context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);\n                // strokeRect : draw a rectangle with the current stroke style\n                // stroke style is the color of the line\n                context.strokeStyle = 'gray';\n                context.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);\n            }\n        }\n    }\n    // clear the grid\n    clear() {\n        this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(this.defaultColor));\n    }\n}\n\n\n//# sourceURL=webpack:///./grid.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./app.ts");
/******/ 	
/******/ })()
;