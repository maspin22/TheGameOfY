import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, Button, View, Text } from 'react-native';
import UsernameInput from './UsernameInput';
import GameOverBanner from './GameOverBanner';
import { getOtherPlayersMoves, writeMove, resignGame, retrieveWinner, getTurn, proposeGame, hasGameStarted, getPlayers, getMoves } from '../database/db_access';
import { findClosestPiece, boardConst } from './GameBoard';

const YGame = () => {
  const [pieces, setPieces] = useState([]); // Array to hold piece objects
  const [pieces2, setOtherPlayersPieces] = useState([]); // Array to hold piece objects
  const [turn, setTurn] = useState(false);
  const [otherPlayer, setOtherPlayer] = useState('');
  const [board, setBoard] = useState(boardConst);
  const [showBanner, setShowBanner] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [username, setUsername] = useState(null);
  const [gameId, setGameId] = useState(null);

  const boardRef = useRef(null); // Reference to the board's TouchableOpacity

  const handlePress = (evt) => {
    if (!turn) {
      alert("It's not your turn!");
      return;
    }
    console.log(evt)

    boardRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Calculate the relative position
      const left = evt.nativeEvent.pageX - pageX - 10; // Adjusting to center the piece
      const top = evt.nativeEvent.pageY - pageY - 10;
      const closestPiece = findClosestPiece(left, top, board)

      console.log(pieces.indexOf(closestPiece.id));
      console.log(pieces2.indexOf(closestPiece.id));
      if (pieces.indexOf(closestPiece.id) != -1 | pieces2.indexOf(closestPiece.id) != -1) {
        alert("Illegal move");
        setShowBanner(true);
        return
      }
      closestPiece.player = pieces.length % 2 + 1
      // Add the new piece to the array of pieces
      writeMove(gameId, pieces.length, closestPiece.id );

      board[closestPiece.id].player = closestPiece.player
      setBoard(board);
    });
  };

  // this is brokem just make you win lol 
  const handleResign = () => {
    resignGame(gameId);
  };

  // Initial setup: check player count and fetch game state
  useEffect(() => {
    // Array to hold cleanup functions
    const cleanupFunctions = [];
    if (username) {
      proposeGame(gameId);
      
      // Add the unsubscribe function from each gameState fetch to the array
      cleanupFunctions.push(hasGameStarted(gameId, setGameStarted));
      cleanupFunctions.push(getPlayers(gameId, setOtherPlayer));
      cleanupFunctions.push(getOtherPlayersMoves(gameId, otherPlayer, setOtherPlayersPieces));
      cleanupFunctions.push(getMoves(gameId, setPieces));
      cleanupFunctions.push(retrieveWinner(gameId, setWinner));
      cleanupFunctions.push(getTurn(gameId, setTurn));
    }

    return () => cleanupFunctions.forEach(cleanup => cleanup && cleanup());

  }, [username, gameId, otherPlayer]);

  return (
    <SafeAreaView style={styles.container}>
      {winner && <GameOverBanner winner={winner} player={username}></GameOverBanner>}
      {!gameStarted ? <><UsernameInput handleSaveUsername={setUsername} handleSaveGameId={setGameId}></UsernameInput></> : <></>}
      {console.log("gameStarted:", gameStarted)}
      {!winner && gameStarted ? (
        <>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              {turn ? `Its your turn ${username}` : "Player 2's Turn"}
            </Text>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Button title="Resign Game" onPress={handleResign} color="#FF6347" />
          </View>   
                 
          <View ref={boardRef} style={styles.boardTouchableArea} onStartShouldSetResponder={() => true}>
            <TouchableOpacity onPress={handlePress} style={styles.boardImageWrapper}>
              <Image source={require('../assets/Game_of_Y_Mask_Board.svg')} style={styles.boardImage} />
            </TouchableOpacity>
            {console.log("pieces", pieces)}

            {pieces.map(piece => (
              <Image
                key={piece}
                source={require('../assets/whiteStone.png')}
                style={[styles.pieceImage, boardConst[piece].position]}
              />
            ))}

            {pieces2.map(piece => (
              <Image
                key={piece}
                source={require('../assets/blackStone.png')}
                style={[styles.pieceImage, boardConst[piece].position]}
              />
            ))}
          </View>
        </>
      ) : <></>}
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
});

export default YGame;
