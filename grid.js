export class Grid {
    constructor(rows, cols, defaultColor = 'white') {
        this.rows = rows;
        this.cols = cols;
        this.defaultColor = defaultColor;
        // break down : 
        // Array(rows) : create an array with length of rows
        // fill(null) : fill the array with null
        // map(() => Array(cols).fill(defaultColor)) : for each element in the array, create an array with length of cols and fill it with defaultColor
        this.grid = Array(rows).fill(null).map(() => Array(cols).fill(defaultColor));
    }
    getColor(row, col) {
        return this.grid[row][col];
    }
    setColor(row, col, color) {
        this.grid[row][col] = color;
    }
    toggleColor(row, col) {
        this.grid[row][col] = this.grid[row][col] === this.defaultColor ? 'black' : this.defaultColor;
    }
}
