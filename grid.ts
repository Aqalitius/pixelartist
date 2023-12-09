// add cell 


export class Grid {
    private grid: string[][];
    constructor(public rows: number, public cols: number, private defaultColor: string = 'white') {
        // break down : 
        // Array(rows) : create an array with length of rows
        // fill(null) : fill the array with null
        // map(() => Array(cols).fill(defaultColor)) : for each element in the array, create an array with length of cols and fill it with defaultColor
        this.grid = Array(rows).fill(null).map(() => Array(cols).fill(defaultColor));
    }

    // update rows and cols
    update(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.grid = Array(rows).fill(null).map(() => Array(cols).fill(this.defaultColor));
    }

    // get grid size 
    getRows() {
        return this.rows;
    }

    getCols() {
        return this.cols;
    }

    getColor(row: number, col: number) {
        return this.grid[row][col];
    }

    getDefaultColor() { 
        return this.defaultColor;
    }
    
    setColor(row: number, col: number, color: string) {
        this.grid[row][col] = color;
    }


    toggleColor(row: number, col: number): void {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.grid[row][col] = this.grid[row][col] === this.defaultColor ? 'black' : this.defaultColor;
        } else {
            console.error(`Invalid row or column: row=${row}, col=${col}`);
        }
    }

    draw(context: CanvasRenderingContext2D, cellSize: number) : void {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++){
                const color = this.getColor(row, col);
                context.fillStyle = color;
                // fillRect : draw a rectangle filled with the current fill style
                context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                // strokeRect : draw a rectangle with the current stroke style
                // stroke style is the color of the line
                context.strokeStyle = 'gray';
                context.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }

    // clear the grid
    clear() {
        this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(this.defaultColor));
    }

}