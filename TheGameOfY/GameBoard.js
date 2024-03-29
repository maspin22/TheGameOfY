import React, { useState } from 'react';

// Updated structure with spatial properties (x, y, radius)
const initialBoard = {
  nodes: {
    1: { state: null, neighbors: [2, 3], x: 100, y: 100, radius: 20 },
    2: { state: null, neighbors: [1, 3, 4], x: 200, y: 100, radius: 20 },
    3: { state: null, neighbors: [1, 2, 5], x: 150, y: 200, radius: 20 },
    4: { state: null, neighbors: [2], x: 300, y: 100, radius: 20 },
    5: { state: null, neighbors: [3], x: 150, y: 300, radius: 20 },
  }
};

export const boardConst = [
  {
    "id": 0,
    "player": 1,
    "position": { "left": 6, "top": 237 }
  },
  {
    "id": 1,
    "player": 2,
    "position": { "left": 4, "top": 202 }
  },
  {
    "id": 2,
    "player": 1,
    "position": { "left": 7, "top": 168 }
  },
  {
    "id": 3,
    "player": 2,
    "position": { "left": 17, "top": 133 }
  },
  {
    "id": 4,
    "player": 1,
    "position": { "left": 32, "top": 98 }
  },
  {
    "id": 5,
    "player": 2,
    "position": { "left": 55, "top": 63 }
  },
  {
    "id": 6,
    "player": 1,
    "position": { "left": 80, "top": 37 }
  },
  {
    "id": 7,
    "player": 2,
    "position": { "left": 108, "top": 17 }
  },
  {
    "id": 8,
    "player": 1,
    "position": { "left": 141, "top": 1 }
  },
  {
    "id": 9,
    "player": 2,
    "position": { "left": 173, "top": 16 }
  },
  {
    "id": 10,
    "player": 1,
    "position": { "left": 201, "top": 37 }
  },
  {
    "id": 11,
    "player": 2,
    "position": { "left": 227, "top": 62 }
  },
  {
    "id": 12,
    "player": 1,
    "position": { "left": 249, "top": 94 }
  },
  {
    "id": 13,
    "player": 2,
    "position": { "left": 265, "top": 129 }
  },
  {
    "id": 14,
    "player": 1,
    "position": { "left": 274, "top": 164 }
  },
  {
    "id": 15,
    "player": 2,
    "position": { "left": 278, "top": 198 }
  },
  {
    "id": 16,
    "player": 1,
    "position": { "left": 276, "top": 234 }
  },
  {
    "id": 17,
    "player": 2,
    "position": { "left": 246, "top": 253 }
  },
  {
    "id": 18,
    "player": 1,
    "position": { "left": 215, "top": 268 }
  },
  {
    "id": 19,
    "player": 2,
    "position": { "left": 179, "top": 277 }
  },
  {
    "id": 20,
    "player": 1,
    "position": { "left": 141, "top": 281 }
  },
  {
    "id": 21,
    "player": 2,
    "position": { "left": 102, "top": 277 }
  },
  {
    "id": 22,
    "player": 1,
    "position": { "left": 67, "top": 268 }
  },
  {
    "id": 23,
    "player": 2,
    "position": { "left": 36, "top": 254 }
  },
  {
    "id": 24,
    "player": 1,
    "position": { "left": 30, "top": 220 }
  },
  {
    "id": 25,
    "player": 2,
    "position": { "left": 26, "top": 188 }
  },
  {
    "id": 26,
    "player": 1,
    "position": { "left": 32, "top": 155 }
  },
  {
    "id": 27,
    "player": 2,
    "position": { "left": 44, "top": 121 }
  },
  {
    "id": 28,
    "player": 1,
    "position": { "left": 63, "top": 88 }
  },
  {
    "id": 29,
    "player": 2,
    "position": { "left": 86, "top": 62 }
  },
  {
    "id": 30,
    "player": 1,
    "position": { "left": 112, "top": 42 }
  },
  {
    "id": 31,
    "player": 2,
    "position": { "left": 141, "top": 26 }
  },
  {
    "id": 32,
    "player": 1,
    "position": { "left": 171, "top": 40 }
  },
  {
    "id": 33,
    "player": 2,
    "position": { "left": 196, "top": 63 }
  },
  {
    "id": 34,
    "player": 1,
    "position": { "left": 220, "top": 89 }
  },
  {
    "id": 35,
    "player": 2,
    "position": { "left": 239, "top": 124 }
  },
  {
    "id": 36,
    "player": 1,
    "position": { "left": 250, "top": 157 }
  },
  {
    "id": 37,
    "player": 2,
    "position": { "left": 256, "top": 188 }
  },
  {
    "id": 38,
    "player": 1,
    "position": { "left": 253, "top": 220 }
  },
  {
    "id": 39,
    "player": 2,
    "position": { "left": 226, "top": 240 }
  },
  {
    "id": 40,
    "player": 1,
    "position": { "left": 195, "top": 252 }
  },
  {
    "id": 41,
    "player": 2,
    "position": { "left": 160, "top": 258 }
  },
  {
    "id": 42,
    "player": 1,
    "position": { "left": 121, "top": 258 }
  },
  {
    "id": 43,
    "player": 2,
    "position": { "left": 87, "top": 251 }
  },
  {
    "id": 44,
    "player": 1,
    "position": { "left": 56, "top": 240 }
  },
  {
    "id": 45,
    "player": 2,
    "position": { "left": 49, "top": 208 }
  },
  {
    "id": 46,
    "player": 1,
    "position": { "left": 48, "top": 179 }
  },
  {
    "id": 47,
    "player": 2,
    "position": { "left": 57, "top": 147 }
  },
  {
    "id": 48,
    "player": 1,
    "position": { "left": 72, "top": 116 }
  },
  {
    "id": 49,
    "player": 2,
    "position": { "left": 92, "top": 88 }
  },
  {
    "id": 50,
    "player": 1,
    "position": { "left": 115, "top": 65 }
  },
  {
    "id": 51,
    "player": 2,
    "position": { "left": 141, "top": 51 }
  },
  {
    "id": 52,
    "player": 1,
    "position": { "left": 168, "top": 65 }
  },
  {
    "id": 53,
    "player": 2,
    "position": { "left": 191, "top": 88 }
  },
  {
    "id": 54,
    "player": 1,
    "position": { "left": 211, "top": 115 }
  },
  {
    "id": 55,
    "player": 2,
    "position": { "left": 225, "top": 148 }
  },
  {
    "id": 56,
    "player": 1,
    "position": { "left": 233, "top": 178 }
  },
  {
    "id": 57,
    "player": 2,
    "position": { "left": 233, "top": 209 }
  },
  {
    "id": 58,
    "player": 1,
    "position": { "left": 207, "top": 225 }
  },
  {
    "id": 59,
    "player": 2,
    "position": { "left": 176, "top": 234 }
  },
  {
    "id": 60,
    "player": 1,
    "position": { "left": 141, "top": 237 }
  },
  {
    "id": 61,
    "player": 2,
    "position": { "left": 106, "top": 234 }
  },
  {
    "id": 62,
    "player": 1,
    "position": { "left": 75, "top": 225 }
  },
  {
    "id": 63,
    "player": 2,
    "position": { "left": 68, "top": 198 }
  },
  {
    "id": 64,
    "player": 1,
    "position": { "left": 71, "top": 169 }
  },
  {
    "id": 65,
    "player": 2,
    "position": { "left": 82, "top": 140 }
  },
  {
    "id": 66,
    "player": 1,
    "position": { "left": 98, "top": 112 }
  },
  {
    "id": 67,
    "player": 2,
    "position": { "left": 117, "top": 89 }
  },
  {
    "id": 68,
    "player": 1,
    "position": { "left": 141, "top": 70 }
  },
  {
    "id": 69,
    "player": 2,
    "position": { "left": 165, "top": 88 }
  },
  {
    "id": 70,
    "player": 1,
    "position": { "left": 184, "top": 112 }
  },
  {
    "id": 71,
    "player": 2,
    "position": { "left": 201, "top": 140 }
  },
  {
    "id": 72,
    "player": 1,
    "position": { "left": 211, "top": 169 }
  },
  {
    "id": 73,
    "player": 2,
    "position": { "left": 214, "top": 198 }
  },
  {
    "id": 74,
    "player": 1,
    "position": { "left": 188, "top": 211 }
  },
  {
    "id": 75,
    "player": 2,
    "position": { "left": 158, "top": 216 }
  },
  {
    "id": 76,
    "player": 1,
    "position": { "left": 125, "top": 214 }
  },
  {
    "id": 77,
    "player": 2,
    "position": { "left": 95, "top": 211 }
  },
  {
    "id": 78,
    "player": 1,
    "position": { "left": 87, "top": 187 }
  },
  {
    "id": 79,
    "player": 2,
    "position": { "left": 99, "top": 163 }
  },
  {
    "id": 80,
    "player": 1,
    "position": { "left": 112, "top": 139 }
  },
  {
    "id": 81,
    "player": 2,
    "position": { "left": 126, "top": 116 }
  },
  {
    "id": 82,
    "player": 1,
    "position": { "left": 141, "top": 94 }
  },
  {
    "id": 83,
    "player": 2,
    "position": { "left": 156, "top": 116 }
  },
  {
    "id": 84,
    "player": 1,
    "position": { "left": 171, "top": 139 }
  },
  {
    "id": 85,
    "player": 2,
    "position": { "left": 183, "top": 162 }
  },
  {
    "id": 86,
    "player": 1,
    "position": { "left": 195, "top": 186 }
  },
  {
    "id": 87,
    "player": 2,
    "position": { "left": 168, "top": 189 }
  },
  {
    "id": 88,
    "player": 1,
    "position": { "left": 141, "top": 190 }
  },
  {
    "id": 89,
    "player": 2,
    "position": { "left": 114, "top": 189 }
  },
  {
    "id": 90,
    "player": 1,
    "position": { "left": 127, "top": 164 }
  },
  {
    "id": 91,
    "player": 1,
    "position": { "left": 141, "top": 140 }
  }
]


const GameBoard = () => {
  const [board, setBoard] = useState(initialBoard);

  const placePiece = (cellId, player) => {
    const newState = { ...board.nodes[cellId], state: player };
    const newNodes = { ...board.nodes, [cellId]: newState };
    setBoard({ ...board, nodes: newNodes });
    // Implement win condition checks as needed
  };

  // This could be used for a graphical representation, for example in an SVG
  const renderNodes = () => {
    return Object.keys(board.nodes).map((cellId) => {
      const { x, y, radius } = board.nodes[cellId];

      // For simplicity, using buttons to represent the nodes
      // In a real application, you might use SVG or Canvas
      return (
        <button
          key={cellId}
          style={{
            position: 'absolute',
            left: x - radius,
            top: y - radius,
            width: radius * 2,
            height: radius * 2,
            borderRadius: '50%', // Make it circular
          }}
          onClick={() => placePiece(cellId, 'Player1')}
        >
          {cellId}
        </button>
      );
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {renderNodes()}
    </div>
  );
};

export default GameBoard;
