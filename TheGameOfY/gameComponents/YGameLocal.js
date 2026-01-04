import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { findClosestPiece, boardConst } from './GameBoard';
import GameBoardContainer from './GameBoardContainer';

const YGameLocal = ({ navigation }) => {
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
            <Text style={styles.navTitleText}>LOCAL MATCH</Text>
          </View>
          
          <View style={styles.spacer} />
        </View>

        <GameBoardContainer
          boardRef={boardRef}
          onBoardPress={handlePress}
          pieces={player1Pieces}
          pieces2={player2Pieces}
          playerTurnText={winner ? `PLAYER ${winner} WINS!` : (playerTurn ? "PLAYER 1's TURN" : "PLAYER 2's TURN")}
          actionButtonText="UNDO"
          onActionButtonPress={handleBackPress}
          winner={winner}
          winnerText={`★ PLAYER ${winner} WINS! ★`}
          lastPlayedIndex={pieces.length - 1}
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

export default YGameLocal;
