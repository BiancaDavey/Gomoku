// import { textChangeRangeIsUnchanged } from "typescript"

enum STATUS {
    FREE = 'FREE',
    OCCUPIED = 'OCCUPIED',
    SELECTED = 'SELECTED',  
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
    */
    handleClick() {
        if (this.status === STATUS.OCCUPIED) return
        this.element.classList.remove(this.status.toLowerCase())
        this.status = this.status === STATUS.FREE ? STATUS.SELECTED : STATUS.FREE
        this.element.classList.add(this.status.toLowerCase())
    }

    get isSelected() {
        return this.status === STATUS.SELECTED
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

    get selectedSquaresId() {
        return this.squares.filter((square) => square.isSelected).map((square) => square.id)
    }
}

class GridMap {
    rows: Row[]
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
        // Board area upper aka. User display:
        const userDisplayElement = document.createElement('div')
        userDisplayElement.classList.add('user-display')
        userDisplayElement.innerText = 'User Display Area'
        // Button:
        const resetButton = document.createElement('button')
        resetButton.classList.add('reset-button')
        resetButton.innerText = 'Reset'
        this.boardContainer.appendChild(userDisplayElement)
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
}

// Initialise app with main object.
const main = new Main()
// Specify number of rows and number of squares per row.
main.renderGame(10, 10, [3,4])