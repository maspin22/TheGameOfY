import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, Button, TextInput, View, Text } from 'react-native';
import IllegalMoveBanner from './IllegalMoveBanner';
import UsernameInput from './UsernameInput';
import { retrieveGameState, saveGameState, savePlayersState, getPlayers } from './database/db_access';
import { findClosestPiece, boardConst } from './GameBoard';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [pieces, setPieces] = useState([]); // Array to hold piece objects
  const [board, setBoard] = useState(boardConst);
  const [showBanner, setShowBanner] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [username, setUsername] = useState(null);
  const [gameId, setGameId] = useState(null);

  const [player, setPlayer] = useState(-1);

  const boardRef = useRef(null); // Reference to the board's TouchableOpacity

  const handlePress = (evt) => {
    console.log(player)
    if (player !== pieces.length % 2) {
      alert("It's not your turn!");
      return;
    }

    boardRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Calculate the relative position
      const left = evt.nativeEvent.pageX - pageX - 10; // Adjusting to center the piece
      const top = evt.nativeEvent.pageY - pageY - 10;
      const closestPiece = findClosestPiece(left, top, board)
      console.log(closestPiece)

      if (board[closestPiece.id].player != -1) {
        setShowBanner(true);
        return
      }
      console.log(closestPiece)
      closestPiece.player = pieces.length % 2 + 1
      // Add the new piece to the array of pieces
      setPieces([...pieces, closestPiece]);
      saveGameState([...pieces, closestPiece], gameId);

      board[closestPiece.id].player = closestPiece.player
      setBoard(board);
    });
  };

  const handleBackPress = () => {
    // Remove the last piece
    board[pieces[pieces.length-1].id].player = -1;
    setBoard(board);

    const newPieces = pieces.slice(0, pieces.length - 1);
    setPieces(newPieces);
    saveGameState(newPieces, gameId);
  };

  // This function attempts to join the game if the player isn't already part of it
  const checkPlayerCount = useCallback(() => {
    getPlayers(gameId, (players) => {
      // Assuming players is always an array (empty if no players)
      const isPlayerInGame = players.includes(username);
      
      if (!isPlayerInGame && players.length < 2) {
        // Attempt to join game
        try {
          const updatedPlayers = [...players, username];
          savePlayersState(gameId, updatedPlayers);
          setPlayer(updatedPlayers.indexOf(username));
          if (updatedPlayers.length === 2) {
            setGameStarted(true);
          }
        } catch (error) {
          console.error("Error joining game:", error);
        }
      } else if (isPlayerInGame && players.length === 2) {
        // If the current player is in the game and there are 2 players, start the game
        setGameStarted(true);
      }
    });
  }, [gameId, username]); // Dependencies

  // Fetches and subscribes to the game state
  const fetchGameState = useCallback(() => {
    retrieveGameState(gameId, setPieces);
  }, [gameId]);

  // Initial setup: check player count and fetch game state
  useEffect(() => {
    if (username) {
      checkPlayerCount();
      fetchGameState();
    }

    // Assuming retrieveGameState returns a function for cleanup
    return () => {
      // Cleanup logic here, e.g., unsubscribe from gameState updates
    };
  }, [username, checkPlayerCount, fetchGameState]);

  return (
    <SafeAreaView style={styles.container}>
      {!gameStarted ? <><UsernameInput handleSaveUsername={setUsername} handleSaveGameId={setGameId}></UsernameInput></> : <></>}

      {gameStarted ? (
        <>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              {pieces.length % 2 === player ? "It's your turn" : "Player 2's Turn"}
            </Text>
          </View>
          <IllegalMoveBanner showBanner={showBanner}/>

          <Button title="Back" onPress={handleBackPress} color="#841584" />

          <View ref={boardRef} style={styles.boardTouchableArea} onStartShouldSetResponder={() => true}>
            <TouchableOpacity onPress={handlePress} style={styles.boardImageWrapper}>
              <Image source={require('./assets/Game_of_Y_Mask_Board.svg')} style={styles.boardImage} />
            </TouchableOpacity>
                    
            {console.log("pieces", pieces)}
            {pieces.map(piece => (
              <Image
                key={piece.id}
                source={piece.player === 1 ? require('./assets/blackStone.png') : require('./assets/whiteStone.png')}
                style={[styles.pieceImage, piece.position]}
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

export default App;
