import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, Button, View, Text } from 'react-native';
import { findClosestPiece, boardConst } from './GameBoard';

const YGameLocal = () => {
  const [playerTurn, setPlayerTurn] = useState(true); // true for Player 1's turn, false for Player 2
  const [board, setBoard] = useState(boardConst);
  const [pieces, setPieces] = useState([]); // Array to hold piece objects
  const boardRef = useRef(null); // Reference to the board's TouchableOpacity

  const handlePress = (evt) => {
    boardRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Calculate the relative position
      const left = evt.nativeEvent.pageX - pageX - 10; // Adjusting to center the piece
      const top = evt.nativeEvent.pageY - pageY - 10;
      const closestPiece = findClosestPiece(left, top, board);

      closestPiece.player = playerTurn ? 1 : 2;
      const newPieces = [...pieces, closestPiece];
      setPieces(newPieces);

      // Alert the turn change
      setPlayerTurn(!playerTurn);
    });
  };

  const handleBackPress = () => {
    // Remove the last piece
    const newPieces = pieces.slice(0, pieces.length - 1);
    setPieces(newPieces);

    // Reset the turn to the previous player
    setPlayerTurn(!playerTurn);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          {playerTurn ? "Player 1's Turn" : "Player 2's Turn"}
        </Text>
      </View>

      <Button title="Back" onPress={handleBackPress} color="#841584" />

      <View ref={boardRef} style={styles.boardTouchableArea} onStartShouldSetResponder={() => true}>
        <TouchableOpacity onPress={handlePress} style={styles.boardImageWrapper}>
          <Image source={require('../assets/Game_of_Y_Mask_Board.svg')} style={styles.boardImage} />
        </TouchableOpacity>
        {pieces.map((piece, index) => (
          <Image
            key={piece.id}
            source={piece.player === 1 ? require('../assets/blackStone.png') : require('../assets/whiteStone.png')}
            style={[
              styles.pieceImage,
              piece.position,
              (pieces && index === pieces.length - 1) ? styles.lastPlayed : null,
            ]}
          />
        ))}
      </View>
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
  },
  boardImage: {
    width: '100%',
    height: '100%',
  },
  pieceImage: {
    width: 20, // Adjust based on your piece image size
    height: 20,
    position: 'absolute',
    borderRadius: 50, /* Make the image circular */
  },
  lastPlayed: {
    shadowColor: '#800080', // Purple glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 10,
    shadowRadius: 6, // Adjust for a more subtle effect
    elevation: 100, // For Android shadow
    borderRadius: 50, // Make the shadow circular
  },
});

export default YGameLocal;
