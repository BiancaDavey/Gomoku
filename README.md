# Gomoku

Gomoku is a program creating a Gomoku game for the user to play. The program provides for the user to play as player one against player two. The game is won by player one placing five white squares in a row horizontally, vertically or diagonally, or by player two placing five black squares in a row horizontally, vertically or diagonally.

## Features

* Colour-coded display of squares selected by player one being white and by player two being black.
* The game can be reset mid-game by clicking on the reset button.
* The game results in a draw if no free squares remain on the game board.
* Status of the game is displayed, including which player's turn it is and whether the game has been reset, won by player one, won by player two or resulted in a draw.
* Size of game board is configurable and checked to meet the requirement of having a minimum of five rows or five columns, to enable the game to be won by a player selecting five squares in a row.

## Bonus Features

* Gomoku title with flickering "neon light" animation effect.
* Two theme choices being purple "Retrowave" and green "Matrix" can be selected by clicking the theme button.
* Score of games won by player one and player two is displayed.

## Installation

1. Start the app: `yarn start`
2. Go to [localhost:1234](http://localhost:1234)

## Instructions

1. Click on a square to begin the game as player one. Clicking on a square places a white square for player one. Every second square clicked on will place a white square for player one.
2. Click on another square to place a black square for player two. Every second square clicked on will place a black square for player two.
3. Place five squares in a row horizontally, vertically or diagonally for player one or player two to win the game.
* Click on the reset button to reset the game.
* Click on the theme button to switch between the purple theme and the green theme.
* Configure the size of the game board through viewing the `app.ts` file and typing in a number for `numberColumns` and `numberRows`. Either numberColumns or numberRows must be a minimum of 5, due to the game requiring 5 squares in a row to be selected for a player to win.

## Usage Example

* Set number of rows and number of columns.
[![Set-number-Rows-number-Columns.png](https://i.postimg.cc/YCZxKp8N/Set-number-Rows-number-Columns.png)](https://postimg.cc/mP397Wvh)

* Example of game board with purple theme.
[![Example-Gomoku-01.png](https://i.postimg.cc/28wzKykJ/Example-Gomoku-01.png)](https://postimg.cc/SJnFXyz7)

* Example of game board with green theme and player one with score 1.
[![Example-Gomoku-02.png](https://i.postimg.cc/Zqyz45mJ/Example-Gomoku-02.png)](https://postimg.cc/CZYQ4Yd2)

## Author

Bianca Davey

bdavey2@myune.edu.au