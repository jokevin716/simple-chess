// tests/chess.test.js
const ChessGame = require('../chess');

describe('Chess Game Tests', () => {
  // Test board initialization
  describe('Board Initialization', () => {
    test('should initialize an 8x8 board with pieces in correct starting positions', () => {
      const game = new ChessGame();
      const board = game.board;
      
      // Check board dimensions
      expect(board.length).toBe(8);
      board.forEach(row => expect(row.length).toBe(8));
      
      // Check pawns
      for (let i = 0; i < 8; i++) {
        expect(board[1][i]).toEqual({ type: 'pawn', color: 'black' });
        expect(board[6][i]).toEqual({ type: 'pawn', color: 'white' });
      }
      
      // Check back row pieces
      const backRowTypes = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
      for (let i = 0; i < 8; i++) {
        expect(board[0][i]).toEqual({ type: backRowTypes[i], color: 'black' });
        expect(board[7][i]).toEqual({ type: backRowTypes[i], color: 'white' });
      }
      
      // Check empty squares
      for (let i = 2; i < 6; i++) {
        for (let j = 0; j < 8; j++) {
          expect(board[i][j]).toBeNull();
        }
      }
    });
  });
  
  // Test position parsing
  describe('Position Parsing', () => {
    test('should correctly parse algebraic notation to board coordinates', () => {
      const game = new ChessGame();
      
      expect(game.parsePosition('a1')).toEqual([7, 0]);
      expect(game.parsePosition('h8')).toEqual([0, 7]);
      expect(game.parsePosition('e4')).toEqual([4, 4]);
    });
    
    test('should return null for invalid positions', () => {
      const game = new ChessGame();
      
      expect(game.parsePosition('i9')).toBeNull();
      expect(game.parsePosition('a0')).toBeNull();
      expect(game.parsePosition('invalid')).toBeNull();
    });
  });
  
  // Test valid moves for different pieces
  describe('Piece Movement Validation', () => {
    // Test pawn movement
    describe('Pawn Movement', () => {
      test('should allow a pawn to move forward one square', () => {
        const game = new ChessGame();
        
        // White pawn at e2 to e3
        const result = game.isValidMove([6, 4], [5, 4]);
        expect(result).toBe(true);
      });
      
      test('should allow a pawn to move forward two squares from starting position', () => {
        const game = new ChessGame();
        
        // White pawn at e2 to e4
        const result = game.isValidMove([6, 4], [4, 4]);
        expect(result).toBe(true);
      });
      
      test('should not allow a pawn to move diagonally without capturing', () => {
        const game = new ChessGame();
        
        // White pawn at e2 to d3 (no piece to capture)
        const result = game.isValidMove([6, 4], [5, 3]);
        expect(result).toBe(false);
      });
      
      test('should allow a pawn to capture diagonally', () => {
        const game = new ChessGame();
        
        // Place a black piece at d3
        game.board[5][3] = { type: 'pawn', color: 'black' };
        
        // White pawn at e2 to d3 (capture)
        const result = game.isValidMove([6, 4], [5, 3]);
        expect(result).toBe(true);
      });
    });
    
    // Test rook movement
    describe('Rook Movement', () => {
      test('should allow a rook to move horizontally', () => {
        const game = new ChessGame();
        
        // Clear the path
        game.board[7][1] = null; // Remove knight at b1
        game.board[7][2] = null; // Remove bishop at c1
        game.board[7][3] = null; // Remove queen at d1
        
        // White rook at a1 to h1
        const result = game.isValidMove([7, 0], [7, 3]);
        expect(result).toBe(true);
      });
      
      test('should allow a rook to move vertically', () => {
        const game = new ChessGame();
        
        // Clear the path
        game.board[6][0] = null; // Remove pawn at a2
        
        // White rook at a1 to a8
        const result = game.isValidMove([7, 0], [1, 0]);
        expect(result).toBe(true);
      });
      
      test('should not allow a rook to move diagonally', () => {
        const game = new ChessGame();
        
        // White rook at a1 to h8
        const result = game.isValidMove([7, 0], [0, 7]);
        expect(result).toBe(false);
      });
    });
    
    // Test knight movement
    describe('Knight Movement', () => {
      test('should allow a knight to move in L-shape', () => {
        const game = new ChessGame();
        
        // White knight at b1 to c3
        const result = game.isValidMove([7, 1], [5, 2]);
        expect(result).toBe(true);
      });
      
      test('should not allow a knight to move in a straight line', () => {
        const game = new ChessGame();
        
        // White knight at b1 to b3
        const result = game.isValidMove([7, 1], [5, 1]);
        expect(result).toBe(false);
      });
    });
    
    // Test bishop movement
    describe('Bishop Movement', () => {
      test('should allow a bishop to move diagonally', () => {
        const game = new ChessGame();
        
        // Clear the path
        game.board[6][1] = null; // Remove pawn at b2
        
        // White bishop at c1 to a3
        const result = game.isValidMove([7, 2], [5, 0]);
        expect(result).toBe(true);
      });
      
      test('should not allow a bishop to move in a straight line', () => {
        const game = new ChessGame();

        // Clear the path
        game.board[6][2] = null; // Remove pawn at c2
        
        // White bishop at c1 to c8
        const result = game.isValidMove([7, 2], [0, 2]);
        expect(result).toBe(false);
      });
    });
    
    // Test queen movement
    describe('Queen Movement', () => {
      test('should allow a queen to move diagonally', () => {
        const game = new ChessGame();
        
        // Clear the path
        game.board[6][4] = null; // Remove pawn at e2
        
        // White queen at d1 to h5
        const result = game.isValidMove([7, 3], [3, 7]);
        expect(result).toBe(true);
      });
      
      test('should allow a queen to move horizontally', () => {
        const game = new ChessGame();
        
        // Clear the path
        game.board[7][1] = null; // Remove knight at b1
        game.board[7][2] = null; // Remove bishop at c1
        
        // White queen at d1 to a1
        const result = game.isValidMove([7, 3], [7, 1]);
        expect(result).toBe(true);
      });
      
      test('should not allow a queen to move like a knight', () => {
        const game = new ChessGame();
        
        // White queen at d1 to e3
        const result = game.isValidMove([7, 3], [5, 4]);
        expect(result).toBe(false);
      });
    });
    
    // Test king movement
    describe('King Movement', () => {
      test('should allow a king to move one square in any direction', () => {
        const game = new ChessGame();
        
        // Clear the path
        game.board[6][4] = null; // Remove pawn at e2
        
        // White king at e1 to e2
        const result = game.isValidMove([7, 4], [6, 4]);
        expect(result).toBe(true);
      });
      
      test('should not allow a king to move more than one square', () => {
        const game = new ChessGame();
        
        // White king at e1 to e3
        const result = game.isValidMove([7, 4], [5, 4]);
        expect(result).toBe(false);
      });
    });
  });
  
  // Test game end condition
  describe('Game End Condition', () => {
    test('should end the game when a king is captured', () => {
      const game = new ChessGame();
      
      // Setup a position where white queen can capture black king
      game.board = Array(8).fill().map(() => Array(8).fill(null));
      game.board[0][4] = { type: 'king', color: 'black' };
      game.board[1][4] = { type: 'queen', color: 'white' };
      game.currentPlayer = 'white';
      
      // Make the move to capture the king
      const result = game.makeMove('e7', 'e8');
      
      expect(result).toBe(true);
      expect(game.gameOver).toBe(true);
    });
  });
});