/*
    This program creates a Gomoku game.
*/

enum STATUS {
    //  FREE is used to represent squares on the game board that are free.
    FREE = 'FREE',
    //  SELECTED is used to represent squares on the game board that have been selected by player one.
    SELECTED = 'SELECTED', 
    //  SELECTEDTWO is used to represent squares on the game board that have been selected by player two.
    SELECTEDTWO = 'SELECTEDTWO',
    //  OCCUPIED is used to represent squares on the game board that are occupied.
    OCCUPIED = 'OCCUPIED',
}
 
//  The themeClickCounter number is used to store clicks of the themeButton.  
let themeClickCounter: number = 0
//  The clickCounter number is used to store clicks of squares.
let clickCounter: number = 0
//  The playerOneScore number represents the number of games won by player one.  
let playerOneScore: number = 0
//  The playerTwoScore number represents the number of games won by player two. 
let playerTwoScore: number = 0

/*
    The Square class provides for creating Square objects with an id number and status.
*/
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
        //  EventListener for clicks on squares.
        this.element.addEventListener('click', () => {
            //  Call handleClick.
            this.handleClick()
        })
    }

    /*
        incrementClickCounter increments and returns the clickCounter.
    */
    incrementClickCounter() {
        clickCounter = clickCounter+1
        return clickCounter
    }

    /*
        handleClick sets the status of the square clicked on as being selected by player one or by player two.
    */
    handleClick() {
        this.incrementClickCounter()
        main.gameStatusDisplay()
        if (this.status === STATUS.OCCUPIED || this.status === STATUS.SELECTED || this.status === STATUS.SELECTEDTWO) return
        this.element.classList.remove(this.status.toLowerCase())
        //  If clickCounter is odd, status is set to SELECTEDONE.
        if (clickCounter % 2 != 0){
            this.status = this.status === STATUS.FREE ? STATUS.SELECTED : STATUS.FREE
            this.element.classList.add(this.status.toLowerCase())   
        }
        //  If clickCounter is even, status is set to SELECTEDONE.
        else {
            this.status = this.status === STATUS.FREE ? STATUS.SELECTEDTWO : STATUS.FREE
            this.element.classList.add(this.status.toLowerCase())
        }
    }

    /*
        isFree returns the status as being FREE.
    */
    get isFree() {
        return this.status === STATUS.FREE
    }

    /*
        isSelected returns the status as being SELECTED.
    */
    get isSelected() {
        return this.status === STATUS.SELECTED
    }

    /*
        isSelectedTwo returns the status as being SELECTEDTWO.
    */
    get isSelectedTwo(){
        return this.status === STATUS.SELECTEDTWO
    }

    /*
        isOccupied returns the status as being OCCUPIED.
    */
    get isOccupied() {
        return this.status === STATUS.OCCUPIED
    }
}

/*
    The Row class provides for creating Row objects with an id number and an array of Square objects,
*/
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

/*
    The GridMap class provides for creating a GridMap object with an array of Row objects and arrays containing the id's of squares with status FREE, SELECTED and SELECTEDTWO.
*/
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
    }

    getSelectedTwoSquaresId(){
        this.selectedTwoSquares = this.rows.map(row => row.selectedTwoSquaresId).flat()
    }

    /*
        checkDraw checks for a draw result indicated by the number of squares with status free being zero.
    */
    checkDraw() {
        this.freeSquares = this.rows.map(row => row.freeSquaresId).flat()
        if (this.freeSquares.length === 0){
            //  Call gameOverDraw.
            main.gameOverDraw()
        }
    }

    /*
        checkFiveInARow checks for five squares having been selected in a row horizontally, vertically or diagonally by player one or player two.
    */
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
            diagonalArrayOneTLBR.push(this.selectedSquares[i])
            if (diagonalArrayOneTLBR.length >= 5){
                for (var i = 0; i < diagonalArrayOneTLBR.length-1; i++) {
                    if ((diagonalArrayOneTLBR[i] + diagonalCheck) === diagonalArrayOneTLBR[i+1]){
                        countDiagonalOneTLBR++
                        if (countDiagonalOneTLBR >= 5){
                            main.gameOver()
                        }
                    }
                }
            }
        }
        // Check for five in a row diagonally top-left to bottom-right direction for player two.
        for (var i = 0; i < this.selectedTwoSquares.length; i++){
            diagonalArrayTwoTLBR.push(this.selectedTwoSquares[i])
            if (diagonalArrayTwoTLBR.length >= 5){
                for (var i = 0; i < diagonalArrayTwoTLBR.length-1; i++) {
                    if ((diagonalArrayTwoTLBR[i] + diagonalCheck) === diagonalArrayTwoTLBR[i+1]){
                        countDiagonalTwoTLBR++
                        if (countDiagonalTwoTLBR >= 5){
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
    The Main class provides for creating a Main object containing elements for the game.
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

    /*
        setStatusText takes and returns a String for the status text.
    */
    setStatusText(statusUpdateText: string) {
        this.boardContainer.appendChild(this.statusText)
        return statusUpdateText
    }

    /*
        setScoreText takes and returns a String for the score text.
    */
    setScoreText(scoreUpdateText: string) {
        this.boardContainer.appendChild(this.scoreText)
        return scoreUpdateText
    }

    /*
        renderGame takes parameters being number of rows, number of squares per row, and an optional parameter of occupied squares to render a new GridMap.
    */
    renderGame(rowNumber: number, squareNumberPerRow: number, occupiedSquares?: number[]) {
        if (this.gridMap){
            this.boardContainer.lastChild?.remove()
        }
        this.gridMap = new GridMap(rowNumber, squareNumberPerRow, occupiedSquares)
        this.boardContainer.append(this.gridMap.element)
        //  Call boardSizeCheck to check number of rows and columns reaches the minimum required.
        this.boardSizeCheck()
    }

    /*
        boardSizeCheck displays a message to the user to configure the game to have minimum 5 numberRows or numberColumns, in order to facilitate the game rules as being 5 squares in a row to win.
    */
    boardSizeCheck() {
        if (numberColumns < 5 && numberRows < 5){
            this.statusText.innerText = this.setStatusText('Please configure game to have minimum 5 rows or 5 columns.')
            document.getElementById('main')?.append(this.statusText)
            this.scoreText.innerText = this.setScoreText("")
            document.getElementById('main')?.append(this.scoreText)
            console.log("Please set numberColumns and/or numberRows to be >= 5.")
        }
    }

    /*
        gameStatusDisplay displays the status being which player's turn it is and the score of player one and player two.
    */
    gameStatusDisplay() {
        //  If clickCounter is odd, display status as being player two's turn.
        if (clickCounter % 2 != 0){
            this.statusText.innerText = this.setStatusText('Player Two Turn')            
        }
        //  If clickCounter is even, display status as being player two's turn.
        else if (clickCounter % 2 == 0) {
            this.statusText.innerText = this.setStatusText('Player One Turn')
        }
        document.getElementById('main')?.append(this.statusText) 
        this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        document.getElementById('main')?.append(this.scoreText)       
    }

    /*
        resetGame displays a game reset status and renders a new game.
    */
    resetGame(){
        this.statusText.innerText = this.setStatusText('Game Reset. Click to start a new game: Player One Turn')
        document.getElementById('main')?.append(this.statusText)
        this.renderGame(numberRows, numberColumns)
        //  Reset clickCounter.
        clickCounter = 0
        this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        document.getElementById('main')?.append(this.scoreText)
    }

    /*
        gameOver ends the game, displays the status being player one won and renders a new game.
    */
    gameOver(){
        this.statusText.innerText = this.setStatusText('Game Over! Player One Won')
        document.getElementById('main')?.append(this.statusText)
        this.renderGame(numberRows, numberColumns)
        //  Reset clickCounter.
        clickCounter = 0
        playerOneScore++
        this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        document.getElementById('main')?.append(this.scoreText)
    }

    /*
        gameOverWinnerTwo ends the game, displays the status being player two won and renders a new game.
    */
    gameOverWinnerTwo(){
        this.statusText.innerText = this.setStatusText('Game Over! Player Two Won')
        document.getElementById('main')?.append(this.statusText)
        this.renderGame(numberRows, numberColumns)
        //  Reset clickCounter.
        clickCounter = 0
        playerTwoScore++
        this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        document.getElementById('main')?.append(this.scoreText)
    }

    /*
        gameOverDraw ends the game, displays the status being a draw and renders a new game.
    */
    gameOverDraw(){
        this.statusText.innerText = this.setStatusText('Game Over! Draw')
        document.getElementById('main')?.append(this.statusText)
        this.renderGame(numberRows, numberColumns)
        //  Reset clickCounter.
        clickCounter = 0
        this.scoreText.innerText = this.setScoreText(`Score: Player One: ${playerOneScore}, Player Two: ${playerTwoScore} `)
        document.getElementById('main')?.append(this.scoreText)
    }

    /*
        themeToggled switches the theme of the decorBar and scoreText between purple and green upon the user clicking the themeButton.
    */
    themeToggled() {
        themeClickCounter++
        //  If themeClickCounter is odd, the green theme is applied.
        if (themeClickCounter % 2 != 0){
            this.decorBar.classList.remove('decor-bar')
            this.decorBar.classList.add('decor-bar-theme-green')  
            this.scoreText.classList.remove('score-text')
            this.scoreText.classList.add('score-text-theme-green')     
            document.getElementById('decor-bar-theme-green')?.append(this.decorBar)   
            document.getElementById('score-text-theme-green')?.append(this.scoreText)    
        }
        //  If themeClickCounter is even, the purple theme is applied.
        else if (themeClickCounter % 2 == 0) {
            this.decorBar.classList.remove('decor-bar-theme-green') 
            this.decorBar.classList.add('decor-bar-purple')
            this.scoreText.classList.remove('score-text-theme-green') 
            this.scoreText.classList.add('score-text-theme-purple')
            document.getElementById('decor-bar-purple')?.append(this.decorBar)
            document.getElementById('score-text-theme-purple')?.append(this.scoreText)
        }
    }

}

//  Initialise app with main object.
const main = new Main()
//  Configure the number of columns and number of rows for the game.
let numberColumns: number = 6;
let numberRows: number = 6;
//  Call renderGame to render the game.
main.renderGame(numberRows, numberColumns)