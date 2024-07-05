const boardConst = require('./gameBoard')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.startGameFromCustomGameId = functions.database.ref('proposal/{gameId}/{uid}/game')
  .onWrite(async (change, context) => {
    // Exit if data was deleted
    if (!change.after.exists()) return null

    const gameId = context.params.gameId
    const uid = context.params.uid
    const db = admin.database()

    // Reference to the game proposals
    const proposalRef = db.ref(`proposal/${gameId}`)

    // Get all proposals for the gameId
    const proposalsSnapshot = await proposalRef.once('value')
    const proposals = proposalsSnapshot.val()

    // Check if there are at least two different players
    if (proposals && Object.keys(proposals).length > 1) {
      // Assuming the current UID and another random UID are the players
      const players = Object.keys(proposals)

      // Ensure the current player is part of the game
      if (!players.includes(uid)) return null

      // Remove current player to prevent matching with self
      const playerIndex = players.indexOf(uid)
      players.splice(playerIndex, 1)

      // Randomly select another player
      const otherPlayerId = players[Math.floor(Math.random() * players.length)]

      // Game initialization data
      const gameData = {
        players: [uid, otherPlayerId],
        turn: Math.random() > 0.5 ? uid : otherPlayerId,
        hasGameStarted: true,
        pieLength: change.after.val(),
        lastUpdated: admin.database.ServerValue.TIMESTAMP // Setting the lastUpdated timestamp
      }

      // Reference to the game state
      const gameRef = db.ref(`games/${gameId}/gameState`)

      // Set the game state
      await gameRef.set(gameData)

      // Optionally, clean up the proposals
      await proposalRef.remove()

      return null
    }

    return null
  })

exports.matchPlayersWithTransaction = functions.database.ref('waitingPool/{uid}')
  .onWrite(async (change, context) => {
    // if (!change.after.exists() || !change.after.val()) return null

    const uid = context.params.uid
    const db = admin.database()
    const waitingPoolRef = db.ref('waitingPool')

    const waitingPoolSnapshot = await waitingPoolRef.once('value')
    if (!waitingPoolSnapshot.exists() && !change.after.exists()) {
      console.log('No players in the pool')
      return null // No players in the pool
    }
    const pieLength = change.after.val()
    console.log(waitingPoolSnapshot.val())

    const players = waitingPoolSnapshot.val()
    console.log('players', players)
    if (!players || Object.keys(players).length < 2) {
      console.log('Not enough players to match')
      return null // Not enough players to match
    }

    console.log(players)

    if (!Object.keys(players).includes(uid)) {
      console.log('Current player is no longer in the pool')
      return null // Current player is no longer in the pool
    }

    delete players[uid] // Remove current player to prevent matching with self
    const remainingPlayerIds = Object.keys(players)
    const otherPlayerId = remainingPlayerIds[Math.floor(Math.random() * remainingPlayerIds.length)]
    const newGameId = db.ref().child('games').push().key

    console.log('otherPlayerId', otherPlayerId)
    console.log('newGameId', newGameId)

    const gameData = {
      players: [uid, otherPlayerId],
      turn: Math.random() > 0.5 ? uid : otherPlayerId,
      hasGameStarted: true,
      pieLength,
      lastUpdated: admin.database.ServerValue.TIMESTAMP // Setting the lastUpdated timestamp
    }

    console.log('gameData', gameData)

    // Prepare a multi-path update object
    const updates = {}
    updates[`games/${newGameId}/gameState`] = gameData
    updates[`waitingPool/${uid}`] = null
    updates[`waitingPool/${otherPlayerId}`] = null
    updates[`users/${uid}/currentGame`] = newGameId // Point to the current game
    updates[`users/${otherPlayerId}/currentGame`] = newGameId // For the other player as well

    // Execute all updates in one go to ensure atomicity
    await db.ref().update(updates)

    console.log(`Players matched in game ${newGameId}`)
    return null
  })

/**
 * Checks if the last player's move meets the win condition by touching three
 * sides of the board. It uses DFS to explore the connected pieces starting
 * from the last move to determine the sides touched.
 *
 * @param {Object[]} pieces - An array of all moves made, where each move is an
 * piece ID
 * @param {Object[]} lastPiece
 * @return {boolean} True if the win condition is met, false otherwise.
 */
function isWinningConditionMet (pieces, lastPiece) {
  // Build a graph of the player's pieces
  const graph = {}
  for (const piece of pieces) {
    graph[piece] = {
      touchedSides: new Set(boardConst[piece].side),
      neighbors: boardConst[piece].neighbors.filter((neighborId) =>
        pieces.some((pp) => pp === neighborId))
    }
  }

  // console.log('graph', graph)
  const visited = new Set()
  const sidesTouched = new Set()

  /**
   * Performs a depth-first search starting from the given node ID to explore
   * all connected pieces and the sides of the board they touch.
   *
   * @param {number} nodeId - The ID of the node from which to start the DFS.
   */
  function dfs (nodeId) {
    if (visited.has(nodeId)) return
    visited.add(nodeId)

    const node = graph[nodeId]
    if (node) {
      node.touchedSides.forEach((side) => sidesTouched.add(side))
      node.neighbors.forEach((neighborId) => {
        if (pieces.some((piece) => piece === neighborId)) {
          dfs(neighborId)
        }
      })
    }
  }

  // Start DFS from the last piece moved
  dfs(lastPiece)

  console.log('sidesTouched:', sidesTouched)

  // Check if the player's pieces touch at least three sides of the board
  return sidesTouched.size >= 3
}

exports.checkWinCondition = functions.database.ref('games/{gameId}/moves/{uid}/{moveNumber}')
  .onWrite(async (change, context) => {
    // Get the data that was written to Realtime Database
    // const pieces = change.after.val();
    console.log(boardConst)
    // You can access path wildcards via context.params
    const gameId = context.params.gameId
    const uid = context.params.uid
    const moveNumber = context.params.moveNumber
    console.log('gameId:', gameId, 'uid:', uid, 'moveNumber:', moveNumber)

    const db = admin.database()

    const movesRef = db.ref(`games/${gameId}/moves/${uid}`)
    // Assuming `moveNumber` is the key for each move and the keys are stored as 'move1', 'move2', etc.
    const snapshot = await movesRef.orderByKey().once('value')
    const moves = snapshot.val()
    console.log('moves', moves)

    // Assuming the last piece in the array is the latest move
    const lastPiece = moves[moves.length - 1]

    const win = isWinningConditionMet(moves, lastPiece)
    console.log('won:', win)

    if (win) {
      // If you're manipulating data, remember to return a Promise
      // For example, here we're arbitrarily setting data on another path
      await admin.database().ref(`games/${gameId}/gameState`).update({
        winner: uid,
        lastUpdated: admin.database.ServerValue.TIMESTAMP // Update lastUpdated timestamp
      })

      // Fetch the current game state from Firebase Realtime Database
      const gameRef = db.ref(`games/${gameId}`)
      const gameSnapshot = await gameRef.once('value')
      const gameState = gameSnapshot.val()

      const firestore = admin.firestore()
      await firestore.collection('archivedGames').doc(gameId).set(gameState)

      // delete the game state from Realtime Database
      await gameRef.remove()
    }
  })

exports.handleResignation = functions.database.ref('proposal/{gameId}/{uid}/resign')
  .onWrite(async (change, context) => {
    const { gameId, uid } = context.params
    const db = admin.database()

    if (change.after.val() === true) {
      const gameStateRef = db.ref(`games/${gameId}/gameState`)
      const gameStateSnapshot = await gameStateRef.once('value')
      const game = gameStateSnapshot.val()

      console.log(game)
      const players = game.players
      const playerIndex = players.indexOf(uid)

      // Assuming there are only two players, find the index of the other player
      const otherPlayerIndex = playerIndex === 0 ? 1 : 0
      const otherPlayerId = players[otherPlayerIndex] // Get the ID of the other player
      console.log(otherPlayerId)

      // If you're manipulating data, remember to return a Promise
      // For example, here we're arbitrarily setting data on another path
      await db.ref(`games/${gameId}/gameState`).update({
        winner: otherPlayerId,
        lastUpdated: admin.database.ServerValue.TIMESTAMP // Update lastUpdated timestamp
      })

      // Fetch the current game state from Firebase Realtime Database
      const gameRef = db.ref(`games/${gameId}`)
      const gameSnapshot = await gameRef.once('value')
      const gameState = gameSnapshot.val()

      const firestore = admin.firestore()
      await firestore.collection('archivedGames').doc(gameId).set(gameState)

      // delete the game state from Realtime Database
      await gameRef.remove()
    }
  })

exports.validateMoveAndChangeTurn = functions.database.ref('games/{gameId}/moves/{uid}')
  .onWrite(async (change, context) => {
    // Get the value after the change
    // const moveData = change.after.val()
    const gameId = context.params.gameId
    const uid = context.params.uid

    // TODO: Validate the move
    const db = admin.database()
    const gameRef = db.ref(`games/${gameId}/gameState`)
    const gameSnapshot = await gameRef.once('value')
    const game = gameSnapshot.val()
    console.log(game)
    const players = game.players
    const playerIndex = players.indexOf(uid)

    // Assuming there are only two players, find the index of the other player
    const otherPlayerIndex = playerIndex === 0 ? 1 : 0
    const otherPlayerId = players[otherPlayerIndex] // Get the ID of the other player
    console.log(otherPlayerId)

    // Check if there's a decision about the pie rule
    // if (moveData.acceptedPie !== null) {
    //   const movesRef = admin.database().ref(`games/${gameId}/moves`)

    //   // Fetch the pie moves
    //   const pieSnapshot = await movesRef.child(`${uid}/pie`).once('value')
    //   if (pieSnapshot.exists()) {
    //     const pieMoves = pieSnapshot.val()
    //     const evenIndexedMoves = {}
    //     const oddIndexedMoves = {}

    //     // Segregate moves into even and odd indexed
    //     Object.keys(pieMoves).forEach((key, index) => {
    //       if (index % 2 === 0) {
    //         evenIndexedMoves[key] = pieMoves[key]
    //       } else {
    //         oddIndexedMoves[key] = pieMoves[key]
    //       }
    //     })

    //     // If pie rule is accepted, apply the moves to the accepting player's set of moves
    //     if (moveData.acceptedPie === true) {
    //       await movesRef.child(uid).update({ pieces: evenIndexedMoves })
    //       await movesRef.child(otherPlayerId).update({ pieces: oddIndexedMoves })
    //     } else {
    //       await movesRef.child(uid).update({ pieces: oddIndexedMoves })
    //       await movesRef.child(otherPlayerId).update({ pieces: evenIndexedMoves })
    //     }
    //     await moveData.update({ acceptedPie: null })
    //   }
    // }

    // Set the game state's turn property to the other player's ID
    await db.ref(`games/${gameId}/gameState`).update({
      turn: otherPlayerId,
      lastUpdated: admin.database.ServerValue.TIMESTAMP // Update lastUpdated timestamp
    })
  })

exports.cleanupOldGames = functions.pubsub.schedule('every 60 minutes').onRun(async (context) => {
  const db = admin.database()
  const gamesRef = db.ref('games')

  const now = Date.now()
  const cutoff = now - 60 * 60 * 1000 // 60 minutes in milliseconds

  const oldGamesSnapshot = await gamesRef.orderByChild('lastUpdated').endAt(cutoff).once('value')

  if (oldGamesSnapshot.exists()) {
    const updates = {}
    oldGamesSnapshot.forEach(childSnapshot => {
      updates[childSnapshot.key] = null // Setting values to null will remove them from the database
    })

    // Perform the cleanup
    await gamesRef.update(updates)
    console.log('Old games cleaned up:', updates)
  } else {
    console.log('No old games to clean up')
  }

  return null
})

exports.deleteUserWhenMatched = functions.database.ref('proposal/deleteUser/{uid}')
  .onWrite(async (change, context) => {
    // Exit if data was deleted
    if (!change.after.exists()) return null

    const uid = context.params.uid
    const db = admin.database()

    // Reference to the game proposals
    const proposalRef = db.ref(`proposal/deleteUser/${uid}`)
    // Remove the user's proposal entry
    await proposalRef.remove()

    const userRef = db.ref(`users/${uid}`)
    await userRef.remove()

    return null
  })
