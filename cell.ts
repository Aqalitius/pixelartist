// cell class 
export class Cell {

    color: string;
    changed: boolean; 

    constructor(public defaultColor: string = 'white' ) {
        this.color = defaultColor;
        this.changed = true;

    }

    toggleColor(): void {
        this.color = this.color === this.defaultColor ? 'black' : this.defaultColor;
        this.changed = true;
    }

    setColor(color: string): void {
        this.color = color;
        this.changed = true;
    }
}