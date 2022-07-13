/*
TODO:
* !!! VERTICAL COUNTER
* !!! DIAGONAL COUNTER
* - Score display
* - Improve function for status and score display- make it into one concise function.
        Take param for eg. status, string, use if ('status=="etc"), display.
* - Remove "occupied" as not using
* Bonus: color scheme choice, this may be easy? Button/Toggle: purple and green modes.
* Bonus: user chooses goal number; "best of", wins prizes? health bar?
*/

enum STATUS {
    FREE = 'FREE',
    SELECTED = 'SELECTED', 
    SELECTEDTWO = 'SELECTEDTWO',
    OCCUPIED = 'OCCUPIED',
}

enum THEME {
    THEMEONE = 'THEMEONE',
    THEMETWO = 'THEMETWO',
}

let themeClickCounter: number = 0
let clickCounter: number = 0
let playerOneScore: number = 0
let playerTwoScore: number = 0

export class Square {
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

    incrementClickCounter() {
        clickCounter = clickCounter+1
        return clickCounter
    }

    handleClick() {  // !!!! ORIGINAL
        this.incrementClickCounter()
        main.gameStatusDisplay() // !!!! ORIGINAL
        if (this.status === STATUS.OCCUPIED || this.status === STATUS.SELECTED || this.status === STATUS.SELECTEDTWO) return // !!!! ORIGINAL
        this.element.classList.remove(this.status.toLowerCase()) // !!!! ORIGINAL
        if (clickCounter % 2 != 0){
            this.status = this.status === STATUS.FREE ? STATUS.SELECTED : STATUS.FREE
            this.element.classList.add(this.status.toLowerCase())   
        }
        else {
            this.status = this.status === STATUS.FREE ? STATUS.SELECTEDTWO : STATUS.FREE
            this.element.classList.add(this.status.toLowerCase())
        }
        //this.status = this.status === STATUS.FREE ? STATUS.SELECTED : STATUS.FREE // !!!! ORIGINAL
        //this.element.classList.add(this.status.toLowerCase()) // !!!! ORIGINAL
    }

    get isFree() {
        return this.status === STATUS.FREE
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

    get freeSquaresId(){
        return this.squares.filter((square) => square.isFree).map((square) => square.id)
    }

    get selectedSquaresId() {
        return this.squares.filter((square) => square.isSelected).map((square) => square.id)
    }

    get selectedTwoSquaresId() {
        return this.squares.filter((square) => square.isSelectedTwo).map((square) => square.id)
    }
}

export class GridMap {
    rows: Row[]
    freeSquares: number[] = []
    selectedSquares: number[]  = []
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
            this.getSelectedSquaresId()
            this.getSelectedTwoSquaresId()
            this.checkDraw()
            this.checkFiveInARow()
        })
    }

    getSelectedSquaresId(){
        this.selectedSquares = this.rows.map(row => row.selectedSquaresId).flat()
        console.log(`selected squares: ${this.selectedSquares.join(',')}`)
    }

    getSelectedTwoSquaresId(){
        this.selectedTwoSquares = this.rows.map(row => row.selectedTwoSquaresId).flat()
        console.log(`selected two squares: ${this.selectedTwoSquares.join(',')}`)
    }

    checkDraw() {
        this.freeSquares = this.rows.map(row => row.freeSquaresId).flat()
        if (this.freeSquares.length === 0){
            console.log('Draw.')
            main.gameOverDraw()
        }
    }

    checkFiveInARow() {
        
        console.log('checking five in a row. printng selected one:')
        console.log(this.selectedSquares)
        console.log('checking five in a row 2, printing selectedTWO: ')
        console.log(this.selectedTwoSquares)  // YES, it returns it.
        
        let countHorizontalOne: number = 1
        let countVerticalOne: number = 1
        let countHorizontalTwo: number = 0
        let countVerticalTwo: number = 0
        let numCol: number = 10

        // TODO: fix vertical count.
        // Check for five in a column vertically.
        for (var j = 0; j < this.selectedSquares.length-1; j++){
            if (((this.selectedSquares[j]) + 10) === (this.selectedSquares[numCol])){
                console.log(numCol)
                console.log('Vertical match: j and 10')  // Doesn't work.
                console.log(this.selectedSquares[j])
                console.log(this.selectedSquares[numCol])
            }
        }

        // TODO: fix horizontal count for alternating board size. All in same ROW? IT ONLY WORKS FOR 5 RIGHT NOW!!!
        // Check for five in a row horizontally for selected one.
        for (var i = 0; i < this.selectedSquares.length-1; i++){
            if (((this.selectedSquares[i+1]) === ((this.selectedSquares[i]) +1))){
                countHorizontalOne++
                if (countHorizontalOne >= numberColumns){
                    console.log('Game Over')
                    main.statusText.innerText = main.setStatusText('Game Over')  // It's now on the bottom of the page.
                    document.getElementById('main')?.append(main.statusText)
                    main.gameOver()
                }
            }
            else {
                countHorizontalOne = 1
            }
        }

        // Check for five in a row horizontally for selected two.
        for (var i = 0; i < this.selectedTwoSquares.length-1; i++){
            if (((this.selectedTwoSquares[i+1]) === ((this.selectedTwoSquares[i]) +1))){
                countHorizontalTwo++
                if (countHorizontalTwo >= numberColumns-1){
                    console.log('Game Over')
                    main.statusText.innerText = main.setStatusText('Game Over')  // It's now on the bottom of the page.
                    document.getElementById('main')?.append(main.statusText)
                    main.gameOverWinnerTwo()
                }
            }
            else {
                countHorizontalTwo = 0
            }
        }
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
    statusText: HTMLDivElement
    scoreText: HTMLDivElement
    decorBar: HTMLDivElement

    constructor() {
        this.boardContainer = document.createElement('div')
        this.boardContainer.id = 'board'
        this.boardContainer.classList.add('board')
        const resetButton = document.createElement('button')
        resetButton.classList.add('reset-button')
        resetButton.innerText = 'Reset'
        resetButton.addEventListener('click', () => {
            console.log("Reset game.")
            this.resetGame()
        })
        const themeToggle = document.createElement('div')
        themeToggle.classList.add('theme-toggle')
        themeToggle.innerText = 'Theme'
        themeToggle.addEventListener('click', () => {
            console.log("Theme switched.")
            this.themeToggled()
        })
        this.decorBar = document.createElement('div')
        this.decorBar.id = 'decor-bar'
        this.decorBar.classList.add('decor-bar')
        this.statusText = document.createElement('div')
        this.statusText.id = 'status-text'
        this.statusText.classList.add('status-text')
        this.statusText.innerText = this.setStatusText('Welcome. Player One Turn.')
        this.scoreText = document.createElement('div')
        this.scoreText.id = 'score-text'
        this.scoreText.classList.add('score-text')
        this.scoreText.innerText = this.setStatusText('Score: 0, 0')
        this.boardContainer.appendChild(resetButton)
        this.boardContainer.appendChild(themeToggle)
        document.getElementById('main')?.append(this.decorBar)
        document.getElementById('main')?.append(this.boardContainer)
        document.getElementById('main')?.append(this.statusText)
        document.getElementById('main')?.append(this.scoreText)
    }

    setStatusText(statusUpdateText: string) {
        this.boardContainer.appendChild(this.statusText)
        return statusUpdateText
    }

    setScoreText(scoreUpdateText: string) {
        this.boardContainer.appendChild(this.scoreText)
        return scoreUpdateText
    }

    renderGame(rowNumber: number, squareNumberPerRow: number, occupiedSquares?: number[]) {
        if (this.gridMap){
            this.boardContainer.lastChild?.remove()
        }
        this.gridMap = new GridMap(rowNumber, squareNumberPerRow, occupiedSquares)
        this.boardContainer.append(this.gridMap.element)
    }

    gameStatusDisplay() {
        if (clickCounter % 2 != 0){
            this.statusText.innerText = this.setStatusText('Game On: Player Two Turn')            
        }
        else if (clickCounter % 2 == 0) {
            this.statusText.innerText = this.setStatusText('Game On: Player One Turn')
        }
        document.getElementById('main')?.append(this.statusText) 
        this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        document.getElementById('main')?.append(this.scoreText)       
    }

    resetGame(){
        this.statusText.innerText = this.setStatusText('Game Reset. Click to start a new game: Player One Turn')
        document.getElementById('main')?.append(this.statusText)
        this.renderGame(numberRows, numberColumns)
        clickCounter = 0
        this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        document.getElementById('main')?.append(this.scoreText)
    }

    gameOver(){
        this.statusText.innerText = this.setStatusText('Game Over: Player One Won')
        document.getElementById('main')?.append(this.statusText)
        this.renderGame(numberRows, numberColumns)
        clickCounter = 0
        playerOneScore++
        console.log(playerOneScore) // test, delete when done. Incremented.
        this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        document.getElementById('main')?.append(this.scoreText)
    }

    gameOverWinnerTwo(){
        this.statusText.innerText = this.setStatusText('Game Over: Player Two Won')
        document.getElementById('main')?.append(this.statusText)
        this.renderGame(numberRows, numberColumns)
        clickCounter = 0
        playerTwoScore++
        console.log(playerTwoScore)  // test, delete when done
        this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        document.getElementById('main')?.append(this.scoreText)
    }

    gameOverDraw(){
        this.statusText.innerText = this.setStatusText('Game Over: Draw')
        document.getElementById('main')?.append(this.statusText)
        this.renderGame(numberRows, numberColumns)
        clickCounter = 0
        this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        document.getElementById('main')?.append(this.scoreText)
    }

    themeToggled() {
        themeClickCounter++
        /* TODO currently, hides decor bar upon click, re-shows it upon click, doesn't render green version. */
        if (themeClickCounter % 2 != 0){
            // Green theme.
            this.decorBar.classList.remove('decor-bar')
            this.decorBar.classList.add('decor-bar-theme-green') 
            // doesn't work still for theme green.   
            document.getElementById('decor-bar-theme-green')?.append(this.decorBar)    
        }
        else if (themeClickCounter % 2 == 0) {
            // Purple theme.
            this.decorBar.classList.remove('decor-bar-theme-green') 
            this.decorBar.classList.add('decor-bar')
            document.getElementById('decor-bar')?.append(this.decorBar)
        }
        //document.getElementById('decor-bar')?.append(this.decorBar)
        
        
        //document.getElementById('main')?.append(this.statusText) 
        //this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        //document.getElementById('main')?.append(this.scoreText)  
        // TODO 13/07: could base it on Square; status selected or not. and allow unselect, like before.
            // Applies to: decorbar. squares. resetbutton. themebutton. scoretext.
    }

}

// Initialise app with main object.
const main = new Main()
// Number of rows and columns can be configured here.
let numberColumns: number = 3;
let numberRows: number = 3;
main.renderGame(numberRows, numberColumns)