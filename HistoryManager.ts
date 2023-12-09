export class HistoryManager {
    private history: string[][][] = [];
    // keep track of the current state
    // -1 means no state
    //  undo : pointer--
    //  redo : pointer++
    private pointer: number = -1;
    
    saveState(grid: string[][]) {
        // remove any undone states from the history
        //  lets say you've made some changes, then undo, then make some changes again
        // that means some of the states will be ahead of the current state
        // but when a new change is made, all the states ahead of the current state will be invalid so we need to remove them
        this.history = this.history.slice(0, this.pointer + 1);

        const newState = JSON.parse(JSON.stringify(grid));

        // only save the state if it is different from the current state
        if(this.pointer < 0 || JSON.stringify(this.history[this.pointer]) !== JSON.stringify(newState)) {
            this.history.push(newState);
            this.pointer++;
        }

    }

    undo(): string[][] | null {
        if (this.pointer > 0) { // means there is a state to undo
            this.pointer--;
            return this.history[this.pointer];
        }
        return null;
    }

    redo(): string[][] | null {
        if (this.pointer < this.history.length - 1) { // means there is a state to redo
            this.pointer++;
            return this.history[this.pointer];
        }
        return null;
    }

    // to debug get size of the history
    getSize() {
        return this.history.length;
    }

}