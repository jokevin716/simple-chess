// chess-game.js
const readline = require('readline');

// Set up readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Chess piece symbols using standard notation
const symbols = {
  white: {
    king: 'K',
    queen: 'Q',
    rook: 'R',
    bishop: 'B',
    knight: 'N',
    pawn: 'P'
  },
  black: {
    king: 'k',
    queen: 'q',
    rook: 'r',
    bishop: 'b',
    knight: 'n',
    pawn: 'p'
  },
  empty: '.'
};

// Game state
class ChessGame {
  constructor() {
    this.board = this.createNewBoard();
    this.currentPlayer = 'white';
    this.gameOver = false;
    this.moveHistory = [];
  }

  // Create a new chess board with pieces in starting positions
  createNewBoard() {
    const board = Array(8).fill().map(() => Array(8).fill(null));
    
    // Set up pawns
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: 'pawn', color: 'black' };
      board[6][i] = { type: 'pawn', color: 'white' };
    }
    
    // Set up other pieces
    const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
      board[0][i] = { type: backRow[i], color: 'black' };
      board[7][i] = { type: backRow[i], color: 'white' };
    }
    
    return board;
  }

  // Display the chess board in the console
  displayBoard() {
    console.clear();
    console.log('  a b c d e f g h');
    console.log('  ---------------');
    
    for (let i = 0; i < 8; i++) {
      let row = `${8-i}|`;
      
      for (let j = 0; j < 8; j++) {
        const piece = this.board[i][j];
        let symbol = symbols.empty;
        
        if (piece) {
          symbol = symbols[piece.color][piece.type];
        }
        
        row += symbol + ' ';
      }
      
      row += `|${8-i}`;
      console.log(row);
    }
    
    console.log('  ---------------');
    console.log('  a b c d e f g h');
    console.log(`\nCurrent player: ${this.currentPlayer}`);
  }

  // Convert chess notation to board coordinates (e.g., "e4" to [4, 4])
  parsePosition(pos) {
    if (pos.length !== 2 || !pos.match(/[a-h][1-8]/)) {
      return null;
    }
    
    const col = pos.charCodeAt(0) - 97;  // 'a' is 97 in ASCII
    const row = 8 - parseInt(pos[1]);
    
    return [row, col];
  }

  // Check if a move is valid (simplified for this example)
  isValidMove(from, to) {
    // Basic validation - source must have a piece and destination must be empty or have opponent's piece
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    const sourcePiece = this.board[fromRow][fromCol];
    const destPiece = this.board[toRow][toCol];
    
    if (!sourcePiece) {
      console.log("There is no piece at the selected position.");
      return false;
    }
    
    if (sourcePiece.color !== this.currentPlayer) {
      console.log("You can only move your own pieces.");
      return false;
    }
    
    if (destPiece && destPiece.color === this.currentPlayer) {
      console.log("You cannot capture your own piece.");
      return false;
    }
    
    // Simplified movement logic (not enforcing all chess rules)
    switch (sourcePiece.type) {
      case 'pawn':
        // Simplified pawn movement (not including en passant, etc.)
        const direction = sourcePiece.color === 'white' ? -1 : 1;
        const startRow = sourcePiece.color === 'white' ? 6 : 1;
        
        // Forward movement (no capture)
        if (fromCol === toCol && !destPiece) {
          // Regular move
          if (toRow === fromRow + direction) {
            return true;
          }
          // Double move from starting position
          if (fromRow === startRow && toRow === fromRow + 2 * direction && !this.board[fromRow + direction][fromCol]) {
            return true;
          }
        }
        
        // Diagonal capture
        if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && destPiece) {
          return true;
        }
        
        console.log("Invalid pawn move.");
        return false;
        
      case 'rook':
        // Rook moves in straight lines
        if (fromRow === toRow || fromCol === toCol) {
          // Check for pieces in between
          const rowStep = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
          const colStep = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);
          
          let currRow = fromRow + rowStep;
          let currCol = fromCol + colStep;
          
          while (currRow !== toRow || currCol !== toCol) {
            if (this.board[currRow][currCol]) {
              console.log("There is a piece in the way.");
              return false;
            }
            currRow += rowStep;
            currCol += colStep;
          }
          
          return true;
        }
        
        console.log("Rooks can only move in straight lines.");
        return false;
        
      case 'knight':
        // Knight moves in L-shape
        const rowDiff = Math.abs(fromRow - toRow);
        const colDiff = Math.abs(fromCol - toCol);
        
        if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
          return true;
        }
        
        console.log("Knights move in an L-shape pattern.");
        return false;
        
      case 'bishop':
        // Bishop moves diagonally
        if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
          // Check for pieces in between
          const rowStep = toRow > fromRow ? 1 : -1;
          const colStep = toCol > fromCol ? 1 : -1;
          
          let currRow = fromRow + rowStep;
          let currCol = fromCol + colStep;
          
          while (currRow !== toRow && currCol !== toCol) {
            if (this.board[currRow][currCol]) {
              console.log("There is a piece in the way.");
              return false;
            }
            currRow += rowStep;
            currCol += colStep;
          }
          
          return true;
        }
        
        console.log("Bishops can only move diagonally.");
        return false;
        
      case 'queen':
        // Queen moves like rook or bishop
        const isDiagonal = Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol);
        const isStraight = fromRow === toRow || fromCol === toCol;
        
        if (isDiagonal || isStraight) {
          // Check for pieces in between
          const rowStep = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
          const colStep = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);
          
          let currRow = fromRow + rowStep;
          let currCol = fromCol + colStep;
          
          while (currRow !== toRow || currCol !== toCol) {
            if (this.board[currRow][currCol]) {
              console.log("There is a piece in the way.");
              return false;
            }
            currRow += rowStep;
            currCol += colStep;
          }
          
          return true;
        }
        
        console.log("Queens can move diagonally or in straight lines.");
        return false;
        
      case 'king':
        // King moves one square in any direction
        if (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1) {
          return true;
        }
        
        console.log("Kings can only move one square in any direction.");
        return false;
        
      default:
        return false;
    }
  }

  // Make a move
  makeMove(fromPos, toPos) {
    const from = this.parsePosition(fromPos);
    const to = this.parsePosition(toPos);
    
    if (!from || !to) {
      console.log("Invalid position format. Use algebraic notation like 'e2'.");
      return false;
    }
    
    if (this.isValidMove(from, to)) {
      // Check if this is a capture
      const capturedPiece = this.board[to[0]][to[1]];
      if (capturedPiece) {
        console.log(`${this.currentPlayer} captures ${capturedPiece.color}'s ${capturedPiece.type}.`);
      }
      
      // Move the piece
      this.board[to[0]][to[1]] = this.board[from[0]][from[1]];
      this.board[from[0]][from[1]] = null;
      
      // Record the move
      this.moveHistory.push({
        from: fromPos,
        to: toPos,
        piece: this.board[to[0]][to[1]].type,
        color: this.board[to[0]][to[1]].color,
        captured: capturedPiece ? capturedPiece.type : null
      });
      
      // Check for pawn promotion (simplified)
      if (this.board[to[0]][to[1]].type === 'pawn') {
        if ((this.board[to[0]][to[1]].color === 'white' && to[0] === 0) ||
            (this.board[to[0]][to[1]].color === 'black' && to[0] === 7)) {
          this.board[to[0]][to[1]].type = 'queen';
          console.log(`Pawn promoted to queen at ${toPos}!`);
        }
      }
      
      // Check for king capture (simplified win condition)
      if (capturedPiece && capturedPiece.type === 'king') {
        this.gameOver = true;
        console.log(`${this.currentPlayer} wins by capturing the king!`);
        return true;
      }
      
      // Switch player
      this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
      return true;
    }
    
    return false;
  }

  // Start the game
  start() {
    this.gameLoop();
  }

  // Main game loop
  gameLoop() {
    this.displayBoard();
    
    if (this.gameOver) {
      console.log("Game over!");
      rl.close();
      return;
    }
    
    rl.question(`${this.currentPlayer}'s move (e.g., "e2 e4" or "quit"): `, (answer) => {
      if (answer.toLowerCase() === 'quit') {
        console.log("Thanks for playing!");
        rl.close();
        return;
      }
      
      const [from, to] = answer.split(' ');
      if (!from || !to) {
        console.log("Invalid input format. Use 'e2 e4' format.");
        this.gameLoop();
        return;
      }
      
      const moveResult = this.makeMove(from, to);
      if (!moveResult) {
        console.log("Move failed. Press Enter to continue...");
        rl.question('', () => {
          this.gameLoop();
        });
      } else {
        this.gameLoop();
      }
    });
  }
}

// Start the game when run directly
if (require.main === module) {
  console.log("Welcome to Node.js Chess!");
  console.log("Enter moves in the format 'e2 e4', or type 'quit' to exit.");
  console.log("Press Enter to start...");

  rl.question('', () => {
    const game = new ChessGame();
    game.start();
  });
}

// Export the class for testing
module.exports = ChessGame;