import { db } from "./firebase-config"
import { ref, set, get, onValue, remove, onChildAdded, push, update } from "firebase/database";
import { uuidv4 } from "@firebase/util";

// Function to save the moves state
export function saveGameState(gameState, gameId) {
    // Create a reference to the specific path
    const gameStateRef = ref(db, `gameStates/${gameId}`);
    // Set the value
    set(gameStateRef, gameState).then(() => {
        console.log("Game state saved successfully!");
    }).catch((error) => {
        console.error("Error saving game state: ", error);
    });
}

// Function to retrieve the game state
export function retrieveGameState(gameId, success) {
    const gameStateRef = ref(db, `gameStates/${gameId}`);
    get(gameStateRef).then((snapshot) => {
      if (snapshot.exists()) {
        console.log("Retrieved game state: ", snapshot.val());
        success(snapshot.val());
      } else {
        console.log("No game state available");
      }
    }).catch((error) => {
      console.error("Error retrieving game state: ", error);
    });
  }