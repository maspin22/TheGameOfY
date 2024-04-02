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
 * @param {string} playerId
 * @return {boolean} True if the win condition is met, false otherwise.
 */
function isWinningConditionMet(pieces, lastPiece, playerId) {
  // Filter pieces belonging to the player
  const playerPieces = pieces.filter((piece) => piece.player === playerId);

  // Build a graph of the player's pieces
  const graph = {};
  for (const piece of playerPieces) {
    graph[piece.id] = {
      touchedSides: new Set(piece.side),
      neighbors: piece.neighbors.filter((neighborId) =>
        playerPieces.some((pp) => pp.id === neighborId)),
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
        if (playerPieces.some((piece) => piece.id === neighborId)) {
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

exports.checkWinCondition = functions.database.ref("{wildcard}/gameStates")
    .onWrite((change, context) => {
      // Get the data that was written to Realtime Database
      const pieces = change.after.val();

      // You can access path wildcards via context.params
      const wildcardValue = context.params.wildcard;

      // Example: logging the data and the wildcard value
      console.log("Wildcard Value:", wildcardValue);

      // Assuming the last piece in the array is the latest move
      const lastPiece = pieces[pieces.length - 1];
      const playerId = lastPiece.player;

      const win = isWinningConditionMet(pieces, lastPiece, playerId);
      console.log("won:", win);

      if (win) {
        // If you're manipulating data, remember to return a Promise
        // For example, here we're arbitrarily setting data on another path
        return admin.database().ref(`${wildcardValue}/winner`).set(playerId);
      } else return;
    });
