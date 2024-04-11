import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, Button, View, Text } from 'react-native';
import IllegalMoveBanner from './IllegalMoveBanner';
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

  // Fetches and subscribes to the game state
  const fetchGameState = useCallback(() => {
    hasGameStarted(gameId, setGameStarted)
    getPlayers(gameId, setOtherPlayer)
    getOtherPlayersMoves(gameId, otherPlayer, setOtherPlayersPieces);
    getMoves(gameId, setPieces);
    retrieveWinner(gameId, setWinner);
    getTurn(gameId, setTurn);
  }, [gameId, otherPlayer]);

  // Initial setup: check player count and fetch game state
  useEffect(() => {
    if (username) {
      proposeGame(gameId);
      fetchGameState();
    }

    // Assuming retrieveGameState returns a function for cleanup
    return () => {
      // Cleanup logic here, e.g., unsubscribe from gameState updates
    };
  }, [username, fetchGameState]);

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
          <IllegalMoveBanner showBanner={showBanner}/>

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
