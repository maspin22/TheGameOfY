import { boardConst } from "./gameBoard";
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * Checks if the last player's move meets the win condition by touching three
 * sides of the board. It uses DFS to explore the connected pieces starting
 * from the last move to determine the sides touched.
 *
 * @param {Object[]} pieces - An array of all moves made, where each move is an
 * object containing the player ID, piece ID, neighbors, and the side it touches
 * @param {Object[]} lastPiece
 * @return {boolean} True if the win condition is met, false otherwise.
 */
function isWinningConditionMet(pieces, lastPiece) {

  // Build a graph of the player's pieces
  const graph = {};
  for (const piece of pieces) {
    graph[piece.id] = {
      touchedSides: new Set(piece.side),
      neighbors: boardConst[piece].neighbors.filter((neighborId) =>
      pieces.some((pp) => pp === neighborId)),
    };
  }

  const visited = new Set();
  const sidesTouched = new Set();

  /**
   * Performs a depth-first search starting from the given node ID to explore
   * all connected pieces and the sides of the board they touch.
   *
   * @param {number} nodeId - The ID of the node from which to start the DFS.
   */
  function dfs(nodeId) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = graph[nodeId];
    if (node) {
      node.touchedSides.forEach((side) => sidesTouched.add(side));
      node.neighbors.forEach((neighborId) => {
        if (pieces.some((piece) => piece === neighborId)) {
          dfs(neighborId);
        }
      });
    }
  }

  // Start DFS from the last piece moved
  dfs(lastPiece.id);

  console.log("sidesTouched:", sidesTouched);

  // Check if the player's pieces touch at least three sides of the board
  return sidesTouched.size >= 3;
}


// from a snapshot at const movesRef = db.ref(`games/${gameId}/moves/${uid}`);
function getSortedMovesFromSnapShot(moves) {
  const sortedMoves = Object.keys(moves)
      .sort((a, b) => {
          // Extracting numerical part of 'moveNumber' keys and comparing them
          const numA = parseInt(a.replace(/^\D+/g, ''), 10);
          const numB = parseInt(b.replace(/^\D+/g, ''), 10);
          return numA - numB;
      })
      .reduce((acc, key) => {
          // Reconstructing sorted moves object
          acc[key] = moves[key];
          return acc;
      }, {});

  return sortedMoves;
}

exports.checkWinCondition = functions.database.ref("games/${gameId}/moves/${uid}/${moveNumber}")
    .onWrite(async (change, context) => {
      // Get the data that was written to Realtime Database
      // const pieces = change.after.val();

      // You can access path wildcards via context.params
      const gameId = context.params.gameId;
      const uid = context.params.uid;
      const moveNumber = context.params.moveNumber;
      console.log("gameId:", gameId, "uid:", uid, "moveNumber:", moveNumber);

      const db = admin.database();

      // Change turns
      // Reference to the game state
      const gameRef = db.ref(`games/${gameId}/gameState`);

      // Get all proposals for the gameId
      const gameSnapshot = await gameRef.once('value');
      const game = gameSnapshot.val();
      const players = game.players;
      const playerIndex = players.indexOf(uid);
      const otherPlayerId = players.splice(playerIndex, 1)[0];

      const turnRef = db.ref(`games/${gameId}/gameState/turn`);

      // Set the game state
      await turnRef.set(otherPlayerId);

      const movesRef = db.ref(`games/${gameId}/moves/${uid}`);
      // Assuming `moveNumber` is the key for each move and the keys are stored as 'move1', 'move2', etc.
      const snapshot = await movesRef.orderByKey().once('value');
      
      const sortedMoves = getSortedMovesFromSnapShot(snapshot.val())

      // Assuming the last piece in the array is the latest move
      const lastPiece = sortedMoves[sortedMoves.length - 1];

      const win = isWinningConditionMet(sortedMoves, lastPiece);
      console.log("won:", win);

      if (win) {
        // If you're manipulating data, remember to return a Promise
        // For example, here we're arbitrarily setting data on another path
        return admin.database().ref(`games/${gameId}/gameState/winner`).set(uid);
      } else return;
    });


exports.startGameFromCustomGameId = functions.database.ref("proposal/{gameId}/{uid}")
    .onWrite(async (change, context) => {
        // Exit if data was deleted
        if (!change.after.exists()) return null;

        const gameId = context.params.gameId;
        const uid = context.params.uid;
        const db = admin.database();
        
        // Reference to the game proposals
        const proposalRef = db.ref(`proposal/${gameId}`);
        
        // Get all proposals for the gameId
        const proposalsSnapshot = await proposalRef.once('value');
        const proposals = proposalsSnapshot.val();

        // Check if there are at least two different players
        if (proposals && Object.keys(proposals).length > 1) {
            // Assuming the current UID and another random UID are the players
            const players = Object.keys(proposals);

            // Ensure the current player is part of the game
            if (!players.includes(uid)) return null;

            // Remove current player to prevent matching with self
            const playerIndex = players.indexOf(uid);
            players.splice(playerIndex, 1);

            // Randomly select another player
            const otherPlayerId = players[Math.floor(Math.random() * players.length)];

            // Game initialization data
            const gameData = {
                players: [uid, otherPlayerId],
                turn: Math.random() < 0.5 ? uid : otherPlayerId, // Randomly assign who's turn it is
                hasGameStarted: true
            };

            // Reference to the game state
            const gameRef = db.ref(`games/${gameId}/gameState`);
            
            // Set the game state
            await gameRef.set(gameData);

            // Optionally, clean up the proposals
            await proposalRef.remove();

            return null;
        }

        return null;
    });