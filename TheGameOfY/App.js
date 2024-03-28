import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, Button, Alert, View, Text } from 'react-native';

const App = () => {
  const [playerTurn, setPlayerTurn] = useState(true); // true for Player 1's turn, false for Player 2
  const [pieces, setPieces] = useState([]); // Array to hold piece objects
  const boardRef = useRef(null); // Reference to the board's TouchableOpacity


  function findClosestPiece(left, top) {
    let minDistance = Infinity;
    let closestPiece = null;
  
    boardConst.forEach(piece => {
      const dx = piece.position.left - left;
      const dy = piece.position.top - top;
      const distance = Math.sqrt(dx * dx + dy * dy); // Euclidean distance
  
      if (distance < minDistance) {
        minDistance = distance;
        closestPiece = piece;
      }
    });
  
    return closestPiece;
  }

  const handlePress = (evt) => {
    boardRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Calculate the relative position
      const left = evt.nativeEvent.pageX - pageX - 10; // Adjusting to center the piece
      const top = evt.nativeEvent.pageY - pageY - 10;


      const closestPiece = findClosestPiece(left, top)

      console.log(closestPiece)
      
      // console.log(pageX, pageY)
      // console.log(evt.nativeEvent.pageX, evt.nativeEvent.pageY)
      // console.log(left, top)

      // Add the new piece to the array of pieces
      const newPiece = {
        id: pieces.length, // Simple unique identifier for each piece
        player: playerTurn ? 1 : 2, // Determine which player the piece belongs to
        position: closestPiece.position,
      };
      setPieces([...pieces, newPiece]);

      Alert.alert(`Player ${playerTurn ? '1' : '2'} made a move`);
      setPlayerTurn(!playerTurn);
      // console.log(playerTurn)
      // console.log(pieces)
    });
  };

  const LineBetweenTwoPoints = ({ x1, y1, x2, y2 }) => {
    return (
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0}}>
        <line x1={x1 + 10} y1={y1 + 10} x2={x2 + 10} y2={y2 + 10} stroke="red" />
      </svg>
    );
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
          <Image source={require('./assets/Game_of_Y_Mask_Board.svg')} style={styles.boardImage} />

          {/* {boardConst.map(
            piece => (
              piece.neighbors.map(
                neighbors => 
                <LineBetweenTwoPoints x1={piece.position.left} y1={piece.position.top} x2={boardConst[neighbors].position.left} y2={boardConst[neighbors].position.top} />
              )    
            )
          )} */}
        </TouchableOpacity>

        {pieces.map(piece => (
          <Image
            key={piece.id}
            source={piece.player === 1 ? require('./assets/blackStone.png') : require('./assets/whiteStone.png')}
            style={[styles.pieceImage, piece.position]}
          />
        ))}

        {/* {boardConst.map(piece => (
            <Image
            key={piece.id}
            source={piece.player === 1 ? require('./assets/blackStone.png') : require('./assets/whiteStone.png')}
            style={[styles.pieceImage, piece.position]} />
        ))} */}

          {/* <Text style={[styles.pieceImage, piece.position]}>
              {piece.id}
          </Text></> */}      
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

const boardConst = [{'id': 0,
  'player': 1,
  'position': {'left': 6, 'top': 234},
  'radius': 5,
  'neighbors': [1, 24, 23]},
 {'id': 1,
  'player': 2,
  'position': {'left': 4, 'top': 196},
  'radius': 5,
  'neighbors': [0, 2, 25, 24]},
 {'id': 2,
  'player': 1,
  'position': {'left': 7, 'top': 163},
  'radius': 5,
  'neighbors': [1, 3, 25, 26]},
 {'id': 3,
  'player': 2,
  'position': {'left': 16, 'top': 129},
  'radius': 5,
  'neighbors': [2, 4, 26, 27]},
 {'id': 4,
  'player': 1,
  'position': {'left': 31, 'top': 93},
  'radius': 5,
  'neighbors': [3, 5, 27, 28]},
 {'id': 5,
  'player': 2,
  'position': {'left': 55, 'top': 62},
  'radius': 5,
  'neighbors': [4, 6, 28, 29]},
 {'id': 6,
  'player': 1,
  'position': {'left': 80, 'top': 37},
  'radius': 5,
  'neighbors': [5, 7, 29, 30]},
 {'id': 7,
  'player': 2,
  'position': {'left': 108, 'top': 17},
  'radius': 5,
  'neighbors': [6, 8, 30, 31]},
 {'id': 8,
  'player': 1,
  'position': {'left': 141, 'top': 1},
  'radius': 5,
  'neighbors': [7, 9, 31]},
 {'id': 9,
  'player': 2,
  'position': {'left': 173, 'top': 16},
  'radius': 5,
  'neighbors': [8, 10, 31, 32]},
 {'id': 10,
  'player': 1,
  'position': {'left': 201, 'top': 37},
  'radius': 5,
  'neighbors': [9, 11, 32, 33]},
 {'id': 11,
  'player': 2,
  'position': {'left': 227, 'top': 62},
  'radius': 5,
  'neighbors': [10, 12, 33, 34]},
 {'id': 12,
  'player': 1,
  'position': {'left': 249, 'top': 94},
  'radius': 5,
  'neighbors': [11, 13, 34, 35]},
 {'id': 13,
  'player': 2,
  'position': {'left': 265, 'top': 129},
  'radius': 5,
  'neighbors': [12, 14, 35, 36]},
 {'id': 14,
  'player': 1,
  'position': {'left': 274, 'top': 164},
  'radius': 5,
  'neighbors': [13, 15, 36, 37]},
 {'id': 15,
  'player': 2,
  'position': {'left': 278, 'top': 198},
  'radius': 5,
  'neighbors': [14, 16, 37, 38]},
 {'id': 16,
  'player': 1,
  'position': {'left': 276, 'top': 234},
  'radius': 5,
  'neighbors': [15, 17, 38]},
 {'id': 17,
  'player': 2,
  'position': {'left': 246, 'top': 253},
  'radius': 5,
  'neighbors': [16, 18, 38, 39]},
 {'id': 18,
  'player': 1,
  'position': {'left': 215, 'top': 268},
  'radius': 5,
  'neighbors': [17, 19, 39, 40]},
 {'id': 19,
  'player': 2,
  'position': {'left': 179, 'top': 277},
  'radius': 5,
  'neighbors': [18, 20, 40, 41]},
 {'id': 20,
  'player': 1,
  'position': {'left': 141, 'top': 281},
  'radius': 5,
  'neighbors': [19, 21, 41, 42]},
 {'id': 21,
  'player': 2,
  'position': {'left': 102, 'top': 277},
  'radius': 5,
  'neighbors': [20, 22, 42, 43]},
 {'id': 22,
  'player': 1,
  'position': {'left': 67, 'top': 268},
  'radius': 5,
  'neighbors': [21, 23, 43, 44]},
 {'id': 23,
  'player': 2,
  'position': {'left': 36, 'top': 254},
  'radius': 5,
  'neighbors': [0, 22, 24, 44]},
 {'id': 24,
  'player': 1,
  'position': {'left': 30, 'top': 220},
  'radius': 5,
  'neighbors': [0, 1, 23, 25, 44, 45]},
 {'id': 25,
  'player': 2,
  'position': {'left': 26, 'top': 188},
  'radius': 5,
  'neighbors': [1, 2, 24, 26, 45, 46]},
 {'id': 26,
  'player': 1,
  'position': {'left': 32, 'top': 155},
  'radius': 5,
  'neighbors': [2, 3, 25, 27, 46, 47]},
 {'id': 27,
  'player': 2,
  'position': {'left': 44, 'top': 121},
  'radius': 5,
  'neighbors': [3, 4, 26, 28, 47, 48]},
 {'id': 28,
  'player': 1,
  'position': {'left': 63, 'top': 88},
  'radius': 5,
  'neighbors': [4, 5, 27, 29, 48, 49]},
 {'id': 29,
  'player': 2,
  'position': {'left': 86, 'top': 62},
  'radius': 5,
  'neighbors': [5, 6, 28, 30, 49, 50]},
 {'id': 30,
  'player': 1,
  'position': {'left': 112, 'top': 42},
  'radius': 5,
  'neighbors': [6, 7, 29, 31, 50, 51]},
 {'id': 31,
  'player': 2,
  'position': {'left': 141, 'top': 26},
  'radius': 5,
  'neighbors': [7, 8, 9, 30, 32, 51]},
 {'id': 32,
  'player': 1,
  'position': {'left': 171, 'top': 40},
  'radius': 5,
  'neighbors': [9, 10, 31, 33, 51, 52]},
 {'id': 33,
  'player': 2,
  'position': {'left': 196, 'top': 63},
  'radius': 5,
  'neighbors': [10, 11, 32, 34, 52, 53]},
 {'id': 34,
  'player': 1,
  'position': {'left': 220, 'top': 89},
  'radius': 5,
  'neighbors': [11, 12, 33, 35, 53, 54]},
 {'id': 35,
  'player': 2,
  'position': {'left': 239, 'top': 124},
  'radius': 5,
  'neighbors': [12, 13, 34, 36, 54, 55]},
 {'id': 36,
  'player': 1,
  'position': {'left': 250, 'top': 157},
  'radius': 5,
  'neighbors': [13, 14, 35, 37, 55, 56]},
 {'id': 37,
  'player': 2,
  'position': {'left': 256, 'top': 188},
  'radius': 5,
  'neighbors': [14, 15, 36, 38, 56, 57]},
 {'id': 38,
  'player': 1,
  'position': {'left': 253, 'top': 220},
  'radius': 5,
  'neighbors': [15, 16, 17, 37, 39, 57]},
 {'id': 39,
  'player': 2,
  'position': {'left': 226, 'top': 240},
  'radius': 5,
  'neighbors': [17, 18, 38, 40, 57, 58]},
 {'id': 40,
  'player': 1,
  'position': {'left': 195, 'top': 252},
  'radius': 5,
  'neighbors': [18, 19, 39, 41, 58, 59]},
 {'id': 41,
  'player': 2,
  'position': {'left': 160, 'top': 258},
  'radius': 5,
  'neighbors': [19, 20, 40, 42, 59, 60]},
 {'id': 42,
  'player': 1,
  'position': {'left': 121, 'top': 258},
  'radius': 5,
  'neighbors': [20, 21, 41, 43, 60, 61]},
 {'id': 43,
  'player': 2,
  'position': {'left': 87, 'top': 251},
  'radius': 5,
  'neighbors': [21, 22, 42, 44, 61, 62]},
 {'id': 44,
  'player': 1,
  'position': {'left': 56, 'top': 240},
  'radius': 5,
  'neighbors': [22, 23, 24, 43, 45, 62]},
 {'id': 45,
  'player': 2,
  'position': {'left': 49, 'top': 208},
  'radius': 5,
  'neighbors': [24, 25, 44, 46, 62, 63]},
 {'id': 46,
  'player': 1,
  'position': {'left': 48, 'top': 179},
  'radius': 5,
  'neighbors': [25, 26, 45, 47, 63, 64]},
 {'id': 47,
  'player': 2,
  'position': {'left': 57, 'top': 147},
  'radius': 5,
  'neighbors': [26, 27, 46, 48, 64, 65]},
 {'id': 48,
  'player': 1,
  'position': {'left': 72, 'top': 116},
  'radius': 5,
  'neighbors': [27, 28, 47, 49, 65, 66]},
 {'id': 49,
  'player': 2,
  'position': {'left': 92, 'top': 88},
  'radius': 5,
  'neighbors': [28, 29, 48, 50, 66, 67]},
 {'id': 50,
  'player': 1,
  'position': {'left': 115, 'top': 65},
  'radius': 5,
  'neighbors': [29, 30, 49, 51, 67, 68]},
 {'id': 51,
  'player': 2,
  'position': {'left': 141, 'top': 51},
  'radius': 5,
  'neighbors': [30, 31, 32, 50, 52, 68]},
 {'id': 52,
  'player': 1,
  'position': {'left': 168, 'top': 65},
  'radius': 5,
  'neighbors': [32, 33, 51, 53, 68, 69]},
 {'id': 53,
  'player': 2,
  'position': {'left': 191, 'top': 88},
  'radius': 5,
  'neighbors': [33, 34, 52, 54, 69, 70]},
 {'id': 54,
  'player': 1,
  'position': {'left': 211, 'top': 115},
  'radius': 5,
  'neighbors': [34, 35, 53, 55, 70, 71]},
 {'id': 55,
  'player': 2,
  'position': {'left': 225, 'top': 148},
  'radius': 5,
  'neighbors': [35, 36, 54, 56, 71, 72]},
 {'id': 56,
  'player': 1,
  'position': {'left': 233, 'top': 178},
  'radius': 5,
  'neighbors': [36, 37, 55, 57, 72, 73]},
 {'id': 57,
  'player': 2,
  'position': {'left': 233, 'top': 209},
  'radius': 5,
  'neighbors': [37, 38, 39, 56, 58, 73]},
 {'id': 58,
  'player': 1,
  'position': {'left': 207, 'top': 225},
  'radius': 5,
  'neighbors': [39, 40, 57, 59, 73, 74]},
 {'id': 59,
  'player': 2,
  'position': {'left': 176, 'top': 234},
  'radius': 5,
  'neighbors': [40, 41, 58, 60, 74, 75]},
 {'id': 60,
  'player': 1,
  'position': {'left': 141, 'top': 237},
  'radius': 5,
  'neighbors': [41, 42, 59, 61, 75, 76]},
 {'id': 61,
  'player': 2,
  'position': {'left': 106, 'top': 234},
  'radius': 5,
  'neighbors': [42, 43, 60, 62, 76, 77]},
 {'id': 62,
  'player': 1,
  'position': {'left': 75, 'top': 225},
  'radius': 5,
  'neighbors': [43, 44, 45, 61, 63, 77]},
 {'id': 63,
  'player': 2,
  'position': {'left': 68, 'top': 198},
  'radius': 5,
  'neighbors': [45, 46, 62, 64, 77, 78]},
 {'id': 64,
  'player': 1,
  'position': {'left': 71, 'top': 169},
  'radius': 5,
  'neighbors': [46, 47, 63, 65, 78, 79]},
 {'id': 65,
  'player': 2,
  'position': {'left': 82, 'top': 140},
  'radius': 5,
  'neighbors': [47, 48, 64, 66, 79, 80]},
 {'id': 66,
  'player': 1,
  'position': {'left': 98, 'top': 112},
  'radius': 5,
  'neighbors': [48, 49, 65, 67, 80, 81]},
 {'id': 67,
  'player': 2,
  'position': {'left': 117, 'top': 89},
  'radius': 5,
  'neighbors': [49, 50, 66, 68, 81, 82]},
 {'id': 68,
  'player': 1,
  'position': {'left': 141, 'top': 70},
  'radius': 5,
  'neighbors': [50, 51, 52, 67, 69, 82]},
 {'id': 69,
  'player': 2,
  'position': {'left': 165, 'top': 88},
  'radius': 5,
  'neighbors': [52, 53, 68, 70, 82, 83]},
 {'id': 70,
  'player': 1,
  'position': {'left': 184, 'top': 112},
  'radius': 5,
  'neighbors': [53, 54, 69, 71, 83, 84]},
 {'id': 71,
  'player': 2,
  'position': {'left': 201, 'top': 140},
  'radius': 5,
  'neighbors': [54, 55, 70, 72, 84, 85]},
 {'id': 72,
  'player': 1,
  'position': {'left': 211, 'top': 169},
  'radius': 5,
  'neighbors': [55, 56, 71, 73, 85, 86]},
 {'id': 73,
  'player': 2,
  'position': {'left': 214, 'top': 198},
  'radius': 5,
  'neighbors': [56, 57, 58, 72, 74, 86]},
 {'id': 74,
  'player': 1,
  'position': {'left': 188, 'top': 211},
  'radius': 5,
  'neighbors': [58, 59, 73, 75, 86, 87]},
 {'id': 75,
  'player': 2,
  'position': {'left': 158, 'top': 216},
  'radius': 5,
  'neighbors': [59, 60, 74, 76, 87, 88]},
 {'id': 76,
  'player': 1,
  'position': {'left': 125, 'top': 214},
  'radius': 5,
  'neighbors': [60, 61, 75, 77, 88, 89]},
 {'id': 77,
  'player': 2,
  'position': {'left': 95, 'top': 211},
  'radius': 5,
  'neighbors': [61, 62, 63, 76, 78, 89]},
 {'id': 78,
  'player': 1,
  'position': {'left': 87, 'top': 187},
  'radius': 5,
  'neighbors': [63, 64, 77, 79, 89]},
 {'id': 79,
  'player': 2,
  'position': {'left': 99, 'top': 163},
  'radius': 5,
  'neighbors': [64, 65, 78, 80, 89, 90]},
 {'id': 80,
  'player': 1,
  'position': {'left': 112, 'top': 139},
  'radius': 5,
  'neighbors': [65, 66, 79, 81, 90, 91]},
 {'id': 81,
  'player': 2,
  'position': {'left': 126, 'top': 116},
  'radius': 5,
  'neighbors': [66, 67, 80, 82, 83, 91]},
 {'id': 82,
  'player': 1,
  'position': {'left': 141, 'top': 94},
  'radius': 5,
  'neighbors': [67, 68, 69, 81, 83]},
 {'id': 83,
  'player': 2,
  'position': {'left': 156, 'top': 116},
  'radius': 5,
  'neighbors': [69, 70, 82, 84, 81, 91]},
 {'id': 84,
  'player': 1,
  'position': {'left': 171, 'top': 139},
  'radius': 5,
  'neighbors': [70, 71, 83, 85, 91, 92]},
 {'id': 85,
  'player': 2,
  'position': {'left': 183, 'top': 162},
  'radius': 5,
  'neighbors': [71, 72, 84, 86, 87, 92]},
 {'id': 86,
  'player': 1,
  'position': {'left': 195, 'top': 186},
  'radius': 5,
  'neighbors': [72, 73, 74, 85, 87]},
 {'id': 87,
  'player': 2,
  'position': {'left': 168, 'top': 189},
  'radius': 5,
  'neighbors': [74, 75, 85, 86, 88, 92]},
 {'id': 88,
  'player': 1,
  'position': {'left': 141, 'top': 190},
  'radius': 5,
  'neighbors': [75, 76, 87, 89, 90, 92]},
 {'id': 89,
  'player': 2,
  'position': {'left': 114, 'top': 189},
  'radius': 5,
  'neighbors': [76, 77, 78, 79, 88, 90]},
 {'id': 90,
  'player': 1,
  'position': {'left': 127, 'top': 164},
  'radius': 5,
  'neighbors': [79, 80, 88, 89, 91, 92]},
 {'id': 91,
  'player': 2,
  'position': {'left': 141, 'top': 140},
  'radius': 5,
  'neighbors': [80, 81, 83, 84, 90, 92]},
 {'id': 92,
  'player': 1,
  'position': {'left': 155, 'top': 163},
  'radius': 5,
  'neighbors': [84, 85, 87, 88, 90, 91]}]

export default App;
