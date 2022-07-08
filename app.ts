// import { textChangeRangeIsUnchanged } from "typescript"

enum STATUS {
    FREE = 'FREE',
    OCCUPIED = 'OCCUPIED',
    SELECTED = 'SELECTED',  
}

// enum for turn? OR a counter to track? odd/even
enum TURN {
    ONE = 'ONE',
    TWO = 'TWO',
}

class Square {
    id: number
    status: STATUS
    element: HTMLDivElement
    constructor(id: number, isOccupied: boolean = false){
        this.id = id
        this.status = isOccupied ? STATUS.OCCUPIED: STATUS.FREE
        this.element = document.createElement('div')
        this.element.classList.add ('square')
        this.element.classList.add(this.status.toLowerCase())
        this.element.addEventListener('click', () => {
            this.handleClick()
        })
    }

    /* 
    TODO: update handle click function to change square selected colour alternatively, from square-selected-1; square-selected-2
    ie. selected1=black, selected2=white. ENUM? STATUS = SELECTED1 SELECTED2?
    TODO: use status OCCUPIED? > status occupiedone, occupiedtwo?
    TODO: remove status occupied. not needed? unless reuse as alt to selected, for colours.
    */
    handleClick() {
        if (this.status === STATUS.OCCUPIED || this.status === STATUS.SELECTED) return
        this.element.classList.remove(this.status.toLowerCase())
        // TODO: alternate clicks setting status as occupied or selected.
        this.status = this.status === STATUS.FREE ? STATUS.SELECTED : STATUS.FREE
        this.element.classList.add(this.status.toLowerCase())
    }

    // Method to return click turn?

    get isSelected() {
        return this.status === STATUS.SELECTED
    }

    get isOccupied() {
        return this.status === STATUS.OCCUPIED
    }
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

    // Return occupied squares?
    get selectedSquaresId() {
        return this.squares.filter((square) => square.isSelected).map((square) => square.id)
    }
}

class GridMap {
    rows: Row[]
    // Return occupied squares?
    selectedSquares: number[]  = []
    element: HTMLDivElement

    constructor(rowNumber: number, squareNumberPerRow: number, occupiedSquares: number[] = []){
        this.rows = Array.from({ length: rowNumber }).map((_, index) => {
            return new Row(index, squareNumberPerRow, occupiedSquares)
        })
        this.element = document.createElement('div')
        this.element.classList.add('grid-map')
        this.element.append(...this.rows.map((row) => row.element))
        this.element.addEventListener('click', () => {
            this.getSelectedSquaresId()
        })
    }
    getSelectedSquaresId(){
       this.selectedSquares = this.rows.map(row => row.selectedSquaresId).flat()
        console.log(`selected squares: ${this.selectedSquares.join(',')}`)
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
        /*
        Board area upper aka. User display:
        08/07/2022 subsume UserDisplay into board? ie. Just have status bar and reset button? 
        const userDisplayElement = document.createElement('div')
        userDisplayElement.classList.add('user-display')
        userDisplayElement.innerText = 'User Display Area'
        */
        // Button:
        const resetButton = document.createElement('button')
        resetButton.classList.add('reset-button')
        resetButton.innerText = 'Reset'
        // Event handler for clicking on reset button:
        resetButton.addEventListener('click', () => {
            console.log("Resetting game.")
            // Reset game function call.
            this.resetGame()
        })
        // 08/07/2022 trying text area in user display:
        const statusBar = document.createElement('div')
        statusBar.classList.add('status-bar')
        // 08/07/2022: putting text as child w/in status bar
        const statusText = document.createElement('text')
        statusText.classList.add('status-text')
        statusText.innerText = 'Status:'

        // 08/07/2022 Delete this line if not placing reset button in userdisplay.
        //userDisplayElement.appendChild(resetButton)
        //userDisplayElement.appendChild(statusBar)
        //this.boardContainer.appendChild(userDisplayElement)
        
        // 08/07/2022 USE this to place button below Userdisplay section:
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