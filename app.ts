/*

TODO 09/07/2022 ADD SELECTEDTWO:

* 1. "Selected" add additional STATUS SELECTEDTWO.
* 2. SelectedTwo implemented every second click.
* 3. Styling colour pink for SELECTEDTWO.
* 4. Return selected and selectedTwo.
* // Remove Occupied? Or at least comment it all out; as not needed I think.
* Check if five in a row (record array? Map based on config? ie. number of rows/cols?)

*/

enum STATUS {
    FREE = 'FREE',
    SELECTED = 'SELECTED', 
    // TODO 09/07/2022 ADD SELECTEDTWO: ___ OK
    SELECTEDTWO = 'SELECTEDTWO',
    OCCUPIED = 'OCCUPIED',
}

// enum for turn? OR a counter to track? odd/even
enum TURN {
    ONE = 'ONE',
    TWO = 'TWO',
}

// OR a boolean?

class Square {
    id: number
    status: STATUS
    element: HTMLDivElement
    // TODO 09/07/2022: ADD BOOLEAN
    turn: TURN
    // TODO 09/07/2022 ADD BOOLEAN
    constructor(id: number, isOccupied: boolean = false){  // turnTwo: boolean = false 
        this.id = id
        this.status = isOccupied ? STATUS.OCCUPIED: STATUS.FREE
        this.element = document.createElement('div')
        this.element.classList.add ('square')
        this.element.classList.add(this.status.toLowerCase())
        this.element.addEventListener('click', () => {
            // TODO: 09/07/2022 Add return enum TURN? or return boolean? ___ DO THIS
            this.handleClick()
        })
    }

    /* 
    TODO: update handle click function to change square selected colour alternatively, from square-selected-1; square-selected-2
    ie. selected1=black, selected2=white. ENUM? STATUS = SELECTED1 SELECTED2?
    */
    handleClick() {
        // TODO 09/07/2022 ADD SELECTEDTWO: ___ OK
        if (this.status === STATUS.OCCUPIED || this.status === STATUS.SELECTED || this.status === STATUS.SELECTEDTWO) return
        this.element.classList.remove(this.status.toLowerCase())
        // TODO: HERE: 09/07/2022 Add SelectedTwo. Alternate clicks setting status as occupied or selected. Upon second click. ___ DO THIS
        this.status = this.status === STATUS.FREE ? STATUS.SELECTED : STATUS.FREE
        // this.status = this.status === STATUS.FREE ? STATUS.SELECTEDTWO : STATUS.FREE // no styling? is selected a standard state?
        this.element.classList.add(this.status.toLowerCase())
    }

    get isSelected() {
        return this.status === STATUS.SELECTED
    }

    get isSelectedTwo(){
        return this.status === STATUS.SELECTEDTWO
    }

    get isOccupied() {
        return this.status === STATUS.OCCUPIED
    }

    // TODO: 9/7/2022 Add boolean- method to return click turn?
    /*
    get turn(){
        return this.turn === TURN.ONE
    }
    */
}

class Row {
    id: number
    squares: Square[]
    element: HTMLDivElement

    constructor(id: number, squareNumber: number, occupiedSquares: number[] = []) {
        this.id = id
        this.squares = Array.from({length: squareNumber}).map((_, index) => {
            const squareId = squareNumber * id + index
            return new Square(squareId, occupiedSquares.includes(squareId))
        })
        this.element = document.createElement('div')
        this.element.classList.add('row')
        this.element.append(...this.squares.map((square) => square.element))
    }

    get selectedSquaresId() {
        return this.squares.filter((square) => square.isSelected).map((square) => square.id)
    }

    // TODO 09/07/2022 ADD SELECTEDTWO: ___ OK
    get selectedTwoSquaresId() {
        return this.squares.filter((square) => square.isSelectedTwo).map((square) => square.id)
    }
}

class GridMap {
    rows: Row[]
    // Return occupied squares?
    selectedSquares: number[]  = []
    // TODO 09/07/2022 ADD SELECTEDTWO: ___ OK
    selectedTwoSquares: number[] = []
    element: HTMLDivElement

    constructor(rowNumber: number, squareNumberPerRow: number, occupiedSquares: number[] = []){
        this.rows = Array.from({ length: rowNumber }).map((_, index) => {
            return new Row(index, squareNumberPerRow, occupiedSquares)
        })
        this.element = document.createElement('div')
        this.element.classList.add('grid-map')
        this.element.append(...this.rows.map((row) => row.element))
        this.element.addEventListener('click', () => {
            /*
            // TODO 09/07/2022 if selectedOne=odd, turn is selectedTwo.
            if (!(this.selectedSquares.length % 2 == 0)){
                let mostRecent: number = this.selectedSquares.length-1;
                // const lastSquare = this.selectedSquares.at(-1);
                this.selectedTwoSquares.push(mostRecent)
            }
            */
            this.getSelectedSquaresId()
            // TODO 09/07/2022 ADD SELECTEDTWO: ___ OK
            this.getSelectedTwoSquaresId()
        })
    }
    getSelectedSquaresId(){
        this.selectedSquares = this.rows.map(row => row.selectedSquaresId).flat()
        console.log(`selected squares: ${this.selectedSquares.join(',')}`)
        this.checkWinner()
    }

    // TODO 09/07/2022 ADD SELECTEDTWO: ___ OK
    getSelectedTwoSquaresId(){
        this.selectedTwoSquares = this.rows.map(row => row.selectedTwoSquaresId).flat()
        console.log(`selected two squares: ${this.selectedTwoSquares.join(',')}`)
    }

    // TODO: method to check array for 5 in a row?
    checkWinner() {
        let countHorizontal: number = 0;
        let countVertical: number = 0;
        //var count = 0;
        // take parameter for array, or this.selectedSquares?
        for (var i = 0; i < this.selectedSquares.length-1; i++){
            if ((this.selectedSquares[i+1]) === ((this.selectedSquares[i]) +1)){
                countHorizontal++;
            }
        }

        if (countHorizontal == 4){
            console.log('Winner. Game Over. 5 in a row horizontal.')
            // Reset game.   
        }

        // Also need to check vertically. need squareNumberPerRow (for column number).
        // == selectedSquares[i]+squareNumberPerRow === selectedSquares[i+squareNumberPerRow] +1
        // eg. [1]+10 === [1+10] 
        //      ie. 11  === [11]. Yeah, that's it.
        for (var i = 0; i < this.selectedSquares.length-1; i++){
            if(((this.selectedSquares[i]) +10) === (this.selectedSquares[i+10])){
                countVertical++;
            }
        }
        if (countVertical == 4){
            console.log('Winner. Game Over. 5 in a row vertical.')
            // Reset game
        }

    }

    // TODO 09/07/2022: Array recording it? Or consts?
    setArrayOne() {

    }
    setArrayTwo() {

    }
}

type Board = {
    rowNumber: number
    squareNumberPerRow: number
    occupiedSquares?: number[]
}

class Main {
    gridMap: GridMap | null = null
    boardContainer: HTMLDivElement

    constructor() {
        this.boardContainer = document.createElement('div')
        this.boardContainer.id = 'board'
        this.boardContainer.classList.add('board')
        // Reset button:
        const resetButton = document.createElement('button')
        resetButton.classList.add('reset-button')
        resetButton.innerText = 'Reset'
        // Event handler for clicking on reset button:
        resetButton.addEventListener('click', () => {
            console.log("Reset game.")
            // Reset game function call.
            this.resetGame()
        })
        const statusBar = document.createElement('div')
        statusBar.classList.add('status-bar')
        const statusText = document.createElement('text')
        statusText.classList.add('status-text')
        statusText.innerText = 'Status:'
        statusBar.appendChild(statusText)
        this.boardContainer.appendChild(statusBar)
        this.boardContainer.appendChild(resetButton)
        document.getElementById('main')?.append(this.boardContainer)
    }

    renderGame(rowNumber: number, squareNumberPerRow: number, occupiedSquares?: number[]) {
        if (this.gridMap){
            this.boardContainer.lastChild?.remove()
        }
        this.gridMap = new GridMap(rowNumber, squareNumberPerRow, occupiedSquares)
        this.boardContainer.append(this.gridMap.element)
    }

    // Reset game
    resetGame(){
        this.renderGame(10, 10)
    }
}

// Initialise app with main object.
const main = new Main()
// Specify number of rows and number of squares per row.
main.renderGame(10, 10, [3,4])