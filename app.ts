/*

TODO 09/07/2022 ADD SELECTEDTWO:

* 1. X "Selected" add additional STATUS SELECTEDTWO.
* 2. SelectedTwo implemented every second click.
* 3. X Styling colour pink for SELECTEDTWO.
* 4. Return selected and selectedTwo.
* 5. Remove Occupied? Or at least comment it all out; as not needed I think.
* 6. X Check if five in a row horizontally (record array? Map based on config? ie. number of rows/cols?)
* 7. Check if five in a row vertically
* 8. Reset upon five in a row

*/

// import { nodeModuleNameResolver } from "typescript"

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

export class Square {
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

export class Row {
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

export class GridMap {
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

    checkWinner() {
        let countHorizontal: number = 1;
        // let numbers: number[] = []  
        //let numbersVertical: number[] = []      
        //let countVertical: number = 0;
        for (var i = 0; i < this.selectedSquares.length-1; i++){
            if (((this.selectedSquares[i+1]) === ((this.selectedSquares[i]) +1))){
                countHorizontal++
                // TODO: if number not in numbers, push? else already there?
                // numbers.push(this.selectedSquares[i])
                // Testing; delete when not needed.
                console.log(this.selectedSquares)
                // console.log(numbers)
                console.log(countHorizontal)
                if (countHorizontal >= 5){
                    console.log('Game Over')
                    main.resetGame()
                }
            }
            // TODO 9/7/2022 trying:
            else {
                countHorizontal = 1
            }
            // end trying

            /*else if ((this.selectedSquares[i+10]) === ((this.selectedSquares[i]) +10)){
                countVertical++;
            }
            */
        }
        // countHorizontal = 0  // this doesn't work either. counts ones on side.

        // TODO: vertical.
        /*
        for (var i = 0; i < this.selectedSquares.length-1; i++){
            if (((this.selectedSquares[i+10]) === ((this.selectedSquares[i]) + 10))){
                countVertical++
                numbersVertical.push(this.selectedSquares[i])
                console.log(numbersVertical)
                console.log(countVertical)
            }
            else {
                countVertical = 0
            }
        }
        */

        // todo 9/7/2022 trying:
        /*
        if (countHorizontal >= 5){
            console.log('Game Over.')
            main.resetGame()
        }
        */
        

        /*
        else if (countVertical == 4){
            console.log('Game over vertical')
            main.resetGame()
        }
        */
/*
        for (var i = 0; i < this.selectedSquares.length-1; i++){
            // if(((this.selectedSquares[i]) +10) === (this.selectedSquares[i+10])){
            if ((this.selectedSquares[i+10]) === ((this.selectedSquares[i]) +10)){
                countVertical++;
            }
        }
        if (countVertical == 4){
            console.log('Winner. Game Over. 5 in a row vertical.')
            // Reset game
        }
        */
        // Also need to check vertically. need squareNumberPerRow (for column number).
        // == selectedSquares[i]+squareNumberPerRow === selectedSquares[i+squareNumberPerRow] +1
        // eg. [1]+10 === [1+10] 
        //      ie. 11  === [11]. Yeah, that's it.

    }
}

type Board = {
    rowNumber: number
    squareNumberPerRow: number
    occupiedSquares?: number[]
}

export class Main {
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
        // TODO: rendering status text.
        statusText.innerText = this.setStatusText('Status: Player One')
        // statusText.innerText = 'Status:'
        statusBar.appendChild(statusText)
        this.boardContainer.appendChild(statusBar)
        this.boardContainer.appendChild(resetButton)
        document.getElementById('main')?.append(this.boardContainer)
    }

    // TODO: rendering status text.
    setStatusText(statusText: string) {
        return statusText
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
        this.renderGame(numberRows, numberColumns)
        // this.setStatusText('')
    }
}

// Initialise app with main object.
const main = new Main()
// Number of rows and columns can be configured here.
let numberColumns: number = 10;
let numberRows: number = 5;
main.renderGame(numberRows, numberColumns)