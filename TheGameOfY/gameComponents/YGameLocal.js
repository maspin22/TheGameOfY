import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, Button, View, Text } from 'react-native';
import { findClosestPiece, boardConst } from './GameBoard';
import { LinearGradient } from 'expo-linear-gradient';

const YGameLocal = () => {
  const [playerTurn, setPlayerTurn] = useState(true); // true for Player 1's turn, false for Player 2
  const [board, setBoard] = useState(boardConst);
  const [pieces, setPieces] = useState([]); // Array for all pieces
  const [player1Pieces, setPlayer1Pieces] = useState([]); // Array for Player 1's pieces
  const [player2Pieces, setPlayer2Pieces] = useState([]); // Array for Player 2's pieces
  const [winner, setWinner] = useState(null);
  const boardRef = useRef(null);

  // Win condition check function
  function isWinningConditionMet(pieces, lastPiece) {
    // Build a graph of the player's pieces
    const graph = {};
    for (const piece of pieces) {
      graph[piece] = {
        touchedSides: new Set(boardConst[piece].side),
        neighbors: boardConst[piece].neighbors.filter((neighborId) =>
          pieces.some((pp) => pp === neighborId))
      };
    }

    const visited = new Set();
    const sidesTouched = new Set();

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
    dfs(lastPiece);
    return sidesTouched.size >= 3;
  }

  const handlePress = (evt) => {
    if (winner) return; // Prevent moves after game is won

    boardRef.current.measure((x, y, width, height, pageX, pageY) => {
      const left = evt.nativeEvent.pageX - pageX - 10;
      const top = evt.nativeEvent.pageY - pageY - 10;
      const closestPiece = findClosestPiece(left, top, board);

      // Check if piece is already placed
      if (pieces.includes(closestPiece.id)) {
        alert("Piece already placed!");
        return;
      }

      const newPieces = [...pieces, closestPiece.id];
      setPieces(newPieces);

      if (playerTurn) {
        // Player 1's turn
        const newPlayer1Pieces = [...player1Pieces, closestPiece.id];
        setPlayer1Pieces(newPlayer1Pieces);
        
        // Check if Player 1 won
        if (isWinningConditionMet(newPlayer1Pieces, closestPiece.id)) {
          setWinner(1);
        }
      } else {
        // Player 2's turn
        const newPlayer2Pieces = [...player2Pieces, closestPiece.id];
        setPlayer2Pieces(newPlayer2Pieces);
        
        // Check if Player 2 won
        if (isWinningConditionMet(newPlayer2Pieces, closestPiece.id)) {
          setWinner(2);
        }
      }

      setPlayerTurn(!playerTurn);
    });
  };

  const handleBackPress = () => {
    if (pieces.length === 0) return;
    
    const lastPiece = pieces[pieces.length - 1];
    const newPieces = pieces.slice(0, -1);
    setPieces(newPieces);

    if (playerTurn) {
      // If it's Player 1's turn now, the last piece was Player 2's
      setPlayer2Pieces(player2Pieces.filter(id => id !== lastPiece));
    } else {
      // If it's Player 2's turn now, the last piece was Player 1's
      setPlayer1Pieces(player1Pieces.filter(id => id !== lastPiece));
    }

    setPlayerTurn(!playerTurn);
    setWinner(null); // Reset winner if undoing winning move
  };

  return (
    <LinearGradient
      colors={['#4A148C', '#7B1FA2', '#9C27B0']}
      style={styles.backgroundGradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          {winner ? (
            <Text style={styles.cardText}>
              Player {winner} Wins!
            </Text>
          ) : (
            <Text style={styles.cardText}>
              {playerTurn ? "Player 1's Turn" : "Player 2's Turn"}
            </Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.resignButton}
          onPress={handleBackPress}
        >
          <Text style={styles.resignButtonText}>Undo</Text>
        </TouchableOpacity>

        <View ref={boardRef} style={styles.boardContainer}>
          <TouchableOpacity onPress={handlePress} style={styles.boardImageWrapper}>
            <Image source={require('../assets/Game_of_Y_Mask_Board.svg')} style={styles.boardImage} />
          </TouchableOpacity>
          {pieces.map((pieceId, index) => (
            <Image
              key={pieceId}
              source={player1Pieces.includes(pieceId) ? 
                require('../assets/blackStone.png') : 
                require('../assets/whiteStone.png')}
              style={[
                styles.pieceImage,
                boardConst[pieceId].position,
                (index === pieces.length - 1) ? styles.lastPlayed : null,
              ]}
            />
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    width: '90%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    color: '#4A148C',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resignButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resignButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  boardContainer: {
    width: 300,
    height: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 20,
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
