import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { findClosestPiece, boardConst } from './GameBoard';
import { authentication } from '../database/firebase-config';
import DBAccess from '../database/db_access.js';
import GameBoardContainer from './GameBoardContainer';

const YGame = ({ route, navigation }) => {
  const { gameId, userId } = route.params;
  console.log('Route gameId:', gameId); 
  console.log('Route userId:', userId); 
  const dbAccess = new DBAccess(userId)

  const [pieces, setPieces] = useState([]); // Array to hold piece objects
  const [pieces2, setOtherPlayersPieces] = useState([]); // Array to hold piece objects
  const [turn, setTurn] = useState(false);
  const [otherPlayer, setOtherPlayer] = useState('');
  const [board, setBoard] = useState(boardConst);
  const [winner, setWinner] = useState(null);
  // const [lastPlayedIndex, setLastPlayedIndex] = useState(null); // Track the index of the last played piece

  // const [initialMoves, setInitialMoves] = useState([]);
  // const [canDecidePie, setCanDecidePie] = useState(false);

  const boardRef = useRef(null); // Reference to the board's TouchableOpacity

  function setGameState(gameState, uid) {
    if (gameState.players !== null) {
      setOtherPlayer(gameState.players[gameState.players.indexOf(uid) === 0 ? 1 : 0])
    }
    if (gameState.turn !== null) {
      setTurn(gameState.turn === uid)
    }
    if (gameState.winner !== null) {
      setWinner(gameState.winner)
    }
    // if (canDecidePie !== true) {
    //   setCanDecidePie((gameState.turn !== uid) && (pieces2.length === 0) && (pieces.length === 0))
    // }
  }

  const handleMove = (evt) => {
    if (!turn) {
      alert("It's not your turn!");
      return;
    }

    boardRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Calculate the relative position
      const left = evt.nativeEvent.pageX - pageX - 10; // Adjusting to center the piece
      const top = evt.nativeEvent.pageY - pageY - 10;
      const closestPiece = findClosestPiece(left, top, board)

      // console.log(pieces.indexOf(closestPiece.id));
      // console.log(pieces2.indexOf(closestPiece.id));
      if (Array.isArray(pieces) && pieces.indexOf(closestPiece.id) != -1 | Array.isArray(pieces2) && pieces2.indexOf(closestPiece.id) != -1) {
        alert("Illegal move");
        return
      }
      closestPiece.player = pieces.length % 2 + 1

      dbAccess.writeMove(gameId, pieces.length, closestPiece.id);

      board[closestPiece.id].player = closestPiece.player
      setBoard(board);

      // if (!canDecidePie) {
      //   const newMoves = [...initialMoves, closestPiece];
      //   setInitialMoves(newMoves);
      //   if (newMoves.length >= 3) {
      //     writePie(gameId, newMoves); // Write pie for second player to decide on 
      //     // setInitialMoves([]);
      //   }
      // } else {
      //   // Add the new piece to the array of pieces
        
      // }
    });
  };

  const handleResign = () => {
    dbAccess.resignGame(gameId);
  };

  // Initial setup: check player count and fetch game state
  useEffect(() => {
    // Array to hold cleanup functions
    const cleanupFunctions = [];

    // Add the unsubscribe function from each gameState fetch to the array
    cleanupFunctions.push(dbAccess.getGameState(gameId, setGameState));
    // cleanupFunctions.push(getPie(gameId, otherPlayer, canDecidePie, setInitialMoves));
    cleanupFunctions.push(dbAccess.getOtherPlayersMoves(gameId, otherPlayer, setOtherPlayersPieces));
    cleanupFunctions.push(dbAccess.getMoves(gameId, setPieces));
    return () => cleanupFunctions.forEach(cleanup => cleanup && cleanup());

  }, [gameId, otherPlayer]);

  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.container}>
        {/* Retro Navigation Banner */}
        <View style={styles.navBanner}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>◄ EXIT</Text>
          </TouchableOpacity>
          
          <View style={styles.navTitle}>
            <Text style={styles.navTitleText}>ONLINE MATCH</Text>
          </View>
          
          <View style={styles.spacer} />
        </View>

        <GameBoardContainer
          boardRef={boardRef}
          onBoardPress={handleMove}
          pieces={pieces}
          pieces2={pieces2}
          playerTurnText={turn ? `YOUR TURN` : "OPPONENT'S TURN"}
          actionButtonText="RESIGN"
          onActionButtonPress={handleResign}
          winner={winner}
          winnerText={winner === userId ? `★ VICTORY ★` : `GAME OVER`}
          lastPlayedIndex={pieces2 && turn ? pieces2.length - 1 : null}
          showLastPlayed={true}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  
  // Navigation Banner
  navBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderWidth: 4,
    borderColor: '#00ff00',
    padding: 15,
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 10,
  },
  backButtonText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ffff00',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  navTitle: {
    flex: 1,
    alignItems: 'center',
  },
  navTitleText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#00ffff',
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  spacer: {
    width: 60, // Same width as back button for centering
  },
});

export default YGame;
