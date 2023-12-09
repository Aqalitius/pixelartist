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

/***/ "./app.ts":
/*!****************!*\
  !*** ./app.ts ***!
  \****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grid */ \"./grid.ts\");\n\nlet cellSize = 50;\n// Desc: Main entry point for the application\nconst canvas = document.getElementById('canvas');\nconst ctx = canvas.getContext('2d');\nconst squaresCanvas = document.createElement('canvas');\nconst squaresCtx = squaresCanvas.getContext('2d');\nsquaresCanvas.width = canvas.width;\nsquaresCanvas.height = canvas.height;\nconst grid = new _grid__WEBPACK_IMPORTED_MODULE_0__.Grid(Math.ceil(canvas.height / cellSize), Math.ceil(canvas.width / cellSize));\nlet gridSize = canvas.width / grid.cols;\nconst saveButton = document.getElementById('save-btn');\nconst modal = document.getElementById('modal');\nconst closeBtn = document.querySelector('.close');\nconst confirmBtn = document.getElementById('confirm-btn');\nconst filenameInput = document.getElementById('filename-input');\nconst cellSizeDropdown = document.getElementById('cell-size-dropdown');\nconst clearButton = document.getElementById('clear-btn');\nconst colorPicker = document.getElementById('color-picker');\nlet currentColor = 'black';\nlet isDrawing = false;\nlet isSaved = false;\nlet hasDrawn = false;\nlet x = 0;\nlet y = 0;\nsaveButton.addEventListener('click', e => {\n    modal.style.display = 'block';\n});\ncloseBtn.addEventListener('click', e => {\n    modal.style.display = 'none';\n});\ncanvas.addEventListener('click', e => {\n});\nconfirmBtn.addEventListener('click', e => {\n    const filename = filenameInput.value;\n    squaresCtx.fillStyle = 'rgba(0,0,0,0)';\n    squaresCtx.clearRect(0, 0, squaresCanvas.width, squaresCanvas.height);\n    for (let row = 0; row < grid.rows; row++) {\n        for (let col = 0; col < grid.cols; col++) {\n            const color = grid.getColor(row, col);\n            if (color) {\n                // if the color is default color, do not draw\n                // to remove the white background\n                if (color === grid.getDefaultColor())\n                    continue;\n                squaresCtx.fillStyle = color;\n                squaresCtx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);\n            }\n        }\n    }\n    const dataUrl = squaresCanvas.toDataURL('image/png');\n    const anchor = document.createElement('a');\n    anchor.href = dataUrl;\n    anchor.download = filename;\n    anchor.click();\n    isSaved = true;\n    modal.style.display = 'none';\n});\nwindow.addEventListener('beforeunload', e => {\n    if (!isSaved && hasDrawn) {\n        e.preventDefault();\n        e.returnValue = '';\n    }\n    if (e.target === modal) {\n        modal.style.display = 'none';\n    }\n});\nfunction draw() {\n    // clear the canvas \n    ctx.clearRect(0, 0, canvas.width, canvas.height);\n    grid.draw(ctx, cellSize);\n    // requestAnimationFrame : call draw() when the browser is ready to repaint the canvas\n    requestAnimationFrame(draw);\n}\nfunction drawOnMouseEvents(e) {\n    const rect = canvas.getBoundingClientRect();\n    const scaleX = canvas.width / rect.width;\n    const scaleY = canvas.height / rect.height;\n    const x = (e.clientX - rect.left) * scaleX;\n    const y = (e.clientY - rect.top) * scaleY;\n    // calculate the row and col of the clicked cell\n    const row = Math.floor(y / gridSize);\n    const col = Math.floor(x / gridSize);\n    console.log(`Clicked at x=${x}, y=${y}`);\n    console.log(`Calculated row=${row}, col=${col}`);\n    // set the color of the cell\n    if (isDrawing) {\n        grid.setColor(row, col, currentColor);\n    }\n    // redraw the grid\n    for (let row = 0; row < grid.rows; row++) {\n        for (let col = 0; col < grid.cols; col++) {\n            const color = grid.getColor(row, col);\n            ctx.fillStyle = color;\n            ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);\n        }\n    }\n}\n// Modify your mouse event listeners to use the visible canvas\ncanvas.addEventListener('mousedown', e => {\n    isDrawing = true;\n    hasDrawn = true;\n    drawOnMouseEvents(e);\n});\ncanvas.addEventListener('mousemove', e => {\n    if (!isDrawing)\n        return;\n    drawOnMouseEvents(e);\n});\ncanvas.addEventListener('mouseup', (e) => {\n    drawOnMouseEvents(e);\n    isDrawing = false;\n});\n// add an event listener for the change event \ncellSizeDropdown.addEventListener('change', e => {\n    console.log('hasDrawn: ', hasDrawn);\n    if (hasDrawn)\n        return;\n    // get the selected value \n    const selectedValue = cellSizeDropdown.value;\n    switch (selectedValue) {\n        case 'small':\n            cellSize = 20;\n            break;\n        case 'medium':\n            cellSize = 50;\n            break;\n        case 'large':\n            cellSize = 130;\n            break;\n        default:\n            cellSize = 50;\n            break;\n    }\n    const numRows = Math.ceil(canvas.height / cellSize);\n    const numCols = Math.ceil(canvas.width / cellSize);\n    // if the grid has not been drawn, redraw the grid\n    grid.update(numRows, numCols);\n    gridSize = canvas.width / grid.cols;\n    draw();\n});\nclearButton.addEventListener('click', e => {\n    grid.clear();\n    draw();\n});\n// Add an event listener for the change event\ncolorPicker.addEventListener('change', (e) => {\n    // Get the selected color\n    const selectedColor = e.target.value;\n    // Set the drawer color to the selected color\n    currentColor = selectedColor;\n});\ndraw();\n\n\n//# sourceURL=webpack:///./app.ts?");

/***/ }),

/***/ "./grid.ts":
/*!*****************!*\
  !*** ./grid.ts ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Grid: () => (/* binding */ Grid)\n/* harmony export */ });\n// add cell \nclass Grid {\n    constructor(rows, cols, defaultColor = 'white') {\n        this.rows = rows;\n        this.cols = cols;\n        this.defaultColor = defaultColor;\n        // break down : \n        // Array(rows) : create an array with length of rows\n        // fill(null) : fill the array with null\n        // map(() => Array(cols).fill(defaultColor)) : for each element in the array, create an array with length of cols and fill it with defaultColor\n        this.grid = Array(rows).fill(null).map(() => Array(cols).fill(defaultColor));\n    }\n    // update rows and cols\n    update(rows, cols) {\n        this.rows = rows;\n        this.cols = cols;\n        this.grid = Array(rows).fill(null).map(() => Array(cols).fill(this.defaultColor));\n    }\n    // get grid size \n    getRows() {\n        return this.rows;\n    }\n    getCols() {\n        return this.cols;\n    }\n    getColor(row, col) {\n        return this.grid[row][col];\n    }\n    getDefaultColor() {\n        return this.defaultColor;\n    }\n    setColor(row, col, color) {\n        this.grid[row][col] = color;\n    }\n    toggleColor(row, col) {\n        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {\n            this.grid[row][col] = this.grid[row][col] === this.defaultColor ? 'black' : this.defaultColor;\n        }\n        else {\n            console.error(`Invalid row or column: row=${row}, col=${col}`);\n        }\n    }\n    draw(context, cellSize) {\n        for (let row = 0; row < this.rows; row++) {\n            for (let col = 0; col < this.cols; col++) {\n                const color = this.getColor(row, col);\n                context.fillStyle = color;\n                // fillRect : draw a rectangle filled with the current fill style\n                context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);\n                // strokeRect : draw a rectangle with the current stroke style\n                // stroke style is the color of the line\n                context.strokeStyle = 'gray';\n                context.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);\n            }\n        }\n    }\n    // clear the grid\n    clear() {\n        this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(this.defaultColor));\n    }\n}\n\n\n//# sourceURL=webpack:///./grid.ts?");

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