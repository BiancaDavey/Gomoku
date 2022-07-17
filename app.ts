enum STATUS {
    FREE = 'FREE',
    SELECTED = 'SELECTED', 
    SELECTEDTWO = 'SELECTEDTWO',
    OCCUPIED = 'OCCUPIED',
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

    handleClick() {
        this.incrementClickCounter()
        main.gameStatusDisplay()
        if (this.status === STATUS.OCCUPIED || this.status === STATUS.SELECTED || this.status === STATUS.SELECTEDTWO) return
        this.element.classList.remove(this.status.toLowerCase())
        if (clickCounter % 2 != 0){
            this.status = this.status === STATUS.FREE ? STATUS.SELECTED : STATUS.FREE
            this.element.classList.add(this.status.toLowerCase())   
        }
        else {
            this.status = this.status === STATUS.FREE ? STATUS.SELECTEDTWO : STATUS.FREE
            this.element.classList.add(this.status.toLowerCase())
        }
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
        // console.log(`selected two squares: ${this.selectedTwoSquares.join(',')}`)
    }

    checkDraw() {
        this.freeSquares = this.rows.map(row => row.freeSquaresId).flat()
        if (this.freeSquares.length === 0){
            console.log('Draw.')
            main.gameOverDraw()
        }
    }

    checkFiveInARow() {
        let countHorizontalOne: number = 1
        let countHorizontalTwo: number = 0
        let countVerticalOne: number = 1
        let countVerticalTwo: number = 1
        let verticalArrayOne: number[] = []
        let verticalArrayTwo: number[] = []
        let countDiagonalOneTRBL: number = 1
        let countDiagonalTwoTRBL: number = 1
        let diagonalArrayOneTRBL: number[] = []
        let diagonalArrayTwoTRBL: number[] = []
        let countDiagonalOneTLBR: number = 1
        let countDiagonalTwoTLBR: number = 1
        let diagonalArrayOneTLBR: number[] = []
        let diagonalArrayTwoTLBR: number[] = []
        let diagonalCheck: number = numberColumns+1
        // Check for five in a row vertically for player one.
        for (var i = 0; i < this.selectedSquares.length; i++){
            verticalArrayOne.push(this.selectedSquares[i])
            if (verticalArrayOne.length >= 5){
                for (var i = 0; i < verticalArrayOne.length; i++) {
                    if ((verticalArrayOne[i] + numberColumns) === verticalArrayOne[i+1]){
                        countVerticalOne++
                        if (countVerticalOne >= 5){
                            main.gameOver()
                        }
                    }
                }
            }
        }
        // Check for five in a row vertically for player two.
        for (var i = 0; i < this.selectedTwoSquares.length; i++){
            verticalArrayTwo.push(this.selectedTwoSquares[i])
            if (verticalArrayTwo.length >= 5){
                for (var i = 0; i < verticalArrayTwo.length; i++) {
                    if ((verticalArrayTwo[i] + numberColumns) === verticalArrayTwo[i+1]){
                        countVerticalTwo++
                        if (countVerticalTwo >= 5){
                            main.gameOverWinnerTwo()
                        }
                    }
                }
            }
        }
        // Check for five in a row horizontally for player one.
        for (var i = 0; i < this.selectedSquares.length-1; i++){
            if (((this.selectedSquares[i+1]) === ((this.selectedSquares[i]) +1))){
                countHorizontalOne++
                if (countHorizontalOne >= 5){
                    console.log('Game Over')
                    main.statusText.innerText = main.setStatusText('Game Over')
                    document.getElementById('main')?.append(main.statusText)
                    main.gameOver()
                }
            }
            else {
                countHorizontalOne = 1
            }
        }
        // Check for five in a row horizontally for player two.
        for (var i = 0; i < this.selectedTwoSquares.length-1; i++){
            if (((this.selectedTwoSquares[i+1]) === ((this.selectedTwoSquares[i]) +1))){
                countHorizontalTwo++
                if (countHorizontalTwo >= 5-1){
                    console.log('Game Over')
                    main.statusText.innerText = main.setStatusText('Game Over')
                    document.getElementById('main')?.append(main.statusText)
                    main.gameOverWinnerTwo()
                }
            }
            else {
                countHorizontalTwo = 0
            }
        }
        // Check for five in a row diagonally top-left to bottom-right direction for player one.
        for (var i = 0; i < this.selectedSquares.length; i++){
            diagonalArrayOneTRBL.push(this.selectedSquares[i])
            if (diagonalArrayOneTRBL.length >= 5){
                for (var i = 0; i < diagonalArrayOneTRBL.length-1; i++) {
                    if ((diagonalArrayOneTRBL[i] + diagonalCheck) === diagonalArrayOneTRBL[i+1]){
                        countDiagonalOneTRBL++
                        if (countDiagonalOneTRBL >= 5){
                            main.gameOver()
                        }
                    }
                }
            }
        }
        // Check for five in a row diagonally top-left to bottom-right direction for player two.
        for (var i = 0; i < this.selectedTwoSquares.length; i++){
            diagonalArrayTwoTRBL.push(this.selectedTwoSquares[i])
            if (diagonalArrayTwoTRBL.length >= 5){
                for (var i = 0; i < diagonalArrayTwoTRBL.length-1; i++) {
                    if ((diagonalArrayTwoTRBL[i] + diagonalCheck) === diagonalArrayTwoTRBL[i+1]){
                        countDiagonalTwoTRBL++
                        if (countDiagonalTwoTRBL >= 5){
                            main.gameOverWinnerTwo()
                        }
                    }
                }
            }
        }
        // Check for five in a row diagonally top-right to bottom-left direction for player one.
        for (var i = 0; i < this.selectedSquares.length; i++){
            diagonalArrayOneTRBL.push(this.selectedSquares[i])
            if (diagonalArrayOneTRBL.length >= 5){
                for (var i = 0; i < diagonalArrayOneTRBL.length-1; i++) {
                    if ((diagonalArrayOneTRBL[i] + (diagonalCheck-2)) === diagonalArrayOneTRBL[i+1]){
                        countDiagonalOneTRBL++
                        if (countDiagonalOneTRBL >= 5){
                            main.gameOver()
                        }
                    }
                }
            }
        }
        // Check for five in a row diagonally top-right to bottom-left direction for player two.
        for (var i = 0; i < this.selectedTwoSquares.length; i++){
            diagonalArrayTwoTRBL.push(this.selectedTwoSquares[i])
            if (diagonalArrayTwoTRBL.length >= 5){
                for (var i = 0; i < diagonalArrayTwoTRBL.length-1; i++) {
                    if ((diagonalArrayTwoTRBL[i] + (diagonalCheck-2)) === diagonalArrayTwoTRBL[i+1]){
                        countDiagonalTwoTRBL++
                        if (countDiagonalTwoTRBL >= 5){
                            main.gameOverWinnerTwo()
                        }
                    }
                }
            }
        }
    }
}

/*
type Board = {
    rowNumber: number
    squareNumberPerRow: number
    occupiedSquares?: number[]
}
*/

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
        this.statusText.innerText = this.setStatusText('Welcome! Player One Turn')
        this.scoreText = document.createElement('div')
        this.scoreText.id = 'score-text'
        this.scoreText.classList.add('score-text')
        this.scoreText.innerText = this.setStatusText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
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
        this.boardSizeCheck()
    }

    boardSizeCheck() {
        if (numberColumns < 5 && numberRows < 5){
            this.statusText.innerText = this.setStatusText('Please configure game board to have minimum 5 rows or 5 columns.')
            document.getElementById('main')?.append(this.statusText)
            this.scoreText.innerText = this.setScoreText("")
            document.getElementById('main')?.append(this.scoreText)
        }
    }

    gameStatusDisplay() {
        if (clickCounter % 2 != 0){
            this.statusText.innerText = this.setStatusText('Player Two Turn')            
        }
        else if (clickCounter % 2 == 0) {
            this.statusText.innerText = this.setStatusText('Player One Turn')
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
        this.statusText.innerText = this.setStatusText('Game Over! Player One Won')
        document.getElementById('main')?.append(this.statusText)
        this.renderGame(numberRows, numberColumns)
        clickCounter = 0
        playerOneScore++
        this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        document.getElementById('main')?.append(this.scoreText)
    }

    gameOverWinnerTwo(){
        this.statusText.innerText = this.setStatusText('Game Over! Player Two Won')
        document.getElementById('main')?.append(this.statusText)
        this.renderGame(numberRows, numberColumns)
        clickCounter = 0
        playerTwoScore++
        this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        document.getElementById('main')?.append(this.scoreText)
    }

    gameOverDraw(){
        this.statusText.innerText = this.setStatusText('Game Over! Draw')
        document.getElementById('main')?.append(this.statusText)
        this.renderGame(numberRows, numberColumns)
        clickCounter = 0
        this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        document.getElementById('main')?.append(this.scoreText)
    }

    themeToggled() {
        themeClickCounter++
        if (themeClickCounter % 2 != 0){
            // Green theme.
            // TODO: check this function.
            this.decorBar.classList.remove('decor-bar')
            this.decorBar.classList.add('decor-bar-theme-green')  
            this.scoreText.classList.remove('score-text')
            this.scoreText.classList.add('score-text-theme-green')     
            document.getElementById('decor-bar-theme-green')?.append(this.decorBar)   
            document.getElementById('score-text-theme-green')?.append(this.scoreText)    
        }
        else if (themeClickCounter % 2 == 0) {
            // Purple theme.
            this.decorBar.classList.remove('decor-bar-theme-green') 
            this.decorBar.classList.add('decor-bar')
            this.scoreText.classList.remove('score-text-theme-green') 
            this.scoreText.classList.add('score-text')
            document.getElementById('decor-bar')?.append(this.decorBar)
            document.getElementById('score-text')?.append(this.scoreText)
        }
    }

}

// Initialise app with main object.
const main = new Main()
// Number of rows and columns can be configured here.
let numberColumns: number = 8;
let numberRows: number = 8;
main.renderGame(numberRows, numberColumns)