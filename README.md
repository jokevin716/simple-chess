# Node.js Chess Game

A console-based chess game implementation in Node.js

## Features

- Standard 8x8 chessboard with pieces represented by symbols
- Console-based UI with board display after each move
- Turn-based gameplay between white and black players
- Input validation and move legality checking
- Win condition detection (king capture)

## Requirements

- Node.js (v12.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## How to Run

To start the game, run:

```bash
npm start
```

or

```bash
node chess-game.js
```

## How to Play

1. The game starts with white's turn
2. Enter moves in algebraic notation format: `[start position] [end position]`
   - Example: `e2 e4` moves the piece at e2 to e4
3. The board is displayed after each move
4. The game ends when a king is captured
5. Type `quit` at any time to exit the game

## Piece Representation

- White pieces are represented by uppercase letters:
  - K: King
  - Q: Queen
  - R: Rook
  - B: Bishop
  - N: Knight
  - P: Pawn

- Black pieces are represented by lowercase letters:
  - k: King
  - q: Queen
  - r: Rook
  - b: Bishop
  - n: Knight
  - p: Pawn

## Testing

To run the unit tests:

```bash
npm test
```

The tests cover:
- Board initialization
- Valid and invalid moves for different pieces
- Win condition (king capture)

## Project Structure

- `chess.js` - Main game file containing game logic and UI
- `tests/chess.test.js` - Unit tests for the chess game
- `package.json` - Project configuration and dependencies
- `README.md` - This file

## Limitations

- This implementation uses a simplified win condition (king capture) rather than checkmate
- Some advanced chess rules (castling, en passant, proper checkmate) are not implemented
- Pawn promotion is automatically to queen