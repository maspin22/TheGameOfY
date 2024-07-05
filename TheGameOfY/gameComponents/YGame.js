import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, Button, View, Text } from 'react-native';
import GameOverBanner from './GameOverBanner';
import { getOtherPlayersMoves, writeMove, resignGame, getMoves, getGameState, getPie, writePie, acceptPie } from '../database/db_access';
import { findClosestPiece, boardConst } from './GameBoard';

const YGame = ({ route }) => {
  const { gameId } = route.params;
  console.log('Route gameId:', gameId); 

  const [pieces, setPieces] = useState([]); // Array to hold piece objects
  const [pieces2, setOtherPlayersPieces] = useState([]); // Array to hold piece objects
  const [turn, setTurn] = useState(false);
  const [otherPlayer, setOtherPlayer] = useState('');
  const [board, setBoard] = useState(boardConst);
  const [winner, setWinner] = useState(null);

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

      writeMove(gameId, pieces.length, closestPiece.id);

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
    resignGame(gameId);
  };

  // Initial setup: check player count and fetch game state
  useEffect(() => {
    // Array to hold cleanup functions
    const cleanupFunctions = [];

    // Add the unsubscribe function from each gameState fetch to the array
    cleanupFunctions.push(getGameState(gameId, setGameState));
    // cleanupFunctions.push(getPie(gameId, otherPlayer, canDecidePie, setInitialMoves));
    cleanupFunctions.push(getOtherPlayersMoves(gameId, otherPlayer, setOtherPlayersPieces));
    cleanupFunctions.push(getMoves(gameId, setPieces));
    return () => cleanupFunctions.forEach(cleanup => cleanup && cleanup());

  }, [gameId, otherPlayer]);

  return (
    <SafeAreaView style={styles.container}>
      {winner && <GameOverBanner winner={winner} ></GameOverBanner>}
      {!winner && (
        <>
          {/* {
            <View>
              {canDecidePie && (
                <View style={styles.decisionBanner}>
                  <Button title="Take White's Moves" onPress={() => {console.log("here"); acceptPie(gameId, "true"); setCanDecidePie(false)} } color="#4CAF50" />
                  <Button title="Take Black's Moves" onPress={() => {acceptPie(gameId, false); setCanDecidePie(false)} } color="#F44336" />
                </View>
              )}
            </View>
          } */}

          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              {turn ? `Its your turn` : "Player 2's Turn"}
            </Text>
          </View>

          <View style={{ marginVertical: 3 }}>
            <Button title="Resign Game" onPress={handleResign} color="#FF6347" />
          </View>

          <View ref={boardRef} style={styles.boardTouchableArea} onStartShouldSetResponder={() => true}>
            <TouchableOpacity onPress={handleMove} style={styles.boardImageWrapper}>
              <Image source={require('../assets/Game_of_Y_Mask_Board.svg')} style={styles.boardImage} />
            </TouchableOpacity>
            {console.log("pieces", pieces)}

            {/* {initialMoves.map((piece, index) => (
              <Image
                key={piece.id}
                source={index % 2 === 0 ? require('../assets/blackStone.png') : require('../assets/whiteStone.png')}
                style={[styles.pieceImage, piece.position]}
              />
            ))} */}

            {Array.isArray(pieces) && pieces.map(piece => (
              <Image
                key={piece}
                source={require('../assets/whiteStone.png')}
                style={[styles.pieceImage, boardConst[piece].position]}
              />
            ))}

            {Array.isArray(pieces2) && pieces2.map(piece => (
              <Image
                key={piece}
                source={require('../assets/blackStone.png')}
                style={[styles.pieceImage, boardConst[piece].position]}
              />
            ))}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  boardTouchableArea: {
    width: 300, // Adjust based on your board image size
    height: 300,
    position: 'relative', // Allows absolute positioning within
  },
  boardImageWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f9f9f9',
  },
  boardImage: {
    width: '100%',
    height: '100%',
  },
  pieceImage: {
    width: 20, // Adjust based on your piece image size
    height: 20,
    position: 'absolute',
  },
  pieceImage: {
    width: 20, // Adjust based on your piece image size
    height: 20,
    position: 'absolute',
    color: '#FF0000'
  },
  decisionBanner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  }
});

export default YGame;
