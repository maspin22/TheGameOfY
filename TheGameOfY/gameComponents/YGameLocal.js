import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { findClosestPiece, boardConst } from './GameBoard';
import { LinearGradient } from 'expo-linear-gradient';
import GameBoardContainer from './GameBoardContainer';

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
        <GameBoardContainer
          boardRef={boardRef}
          onBoardPress={handlePress}
          pieces={player1Pieces}
          pieces2={player2Pieces}
          playerTurnText={winner ? `Player ${winner} Wins!` : (playerTurn ? "Player 1's Turn" : "Player 2's Turn")}
          actionButtonText="Undo"
          onActionButtonPress={handleBackPress}
          winner={winner}
          winnerText={`Player ${winner} Wins!`}
          lastPlayedIndex={pieces.length - 1}
          showLastPlayed={true}
        />
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
});

export default YGameLocal;
