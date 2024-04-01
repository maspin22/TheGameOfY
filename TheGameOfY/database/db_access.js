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

    // Use onValue to listen for changes in real-time
    onValue(gameStateRef, (snapshot) => {
        if (snapshot.exists()) {
            console.log("Retrieved game state: ", snapshot.val());
            success(snapshot.val()); // Invoke the callback with the new game state
        } else {
            console.log("No game state available");
            success([]); // Optionally, invoke the callback with null or similar if no data
        }
    }, (error) => {
        console.error("Error retrieving game state: ", error);
    });
}


// Function to get stored players 
export function getPlayers(gameId , success) {
    const playersRef = ref(db, `players/${gameId}`);
    onValue(playersRef, (snapshot) => {
        if (snapshot.exists()) {
            // console.log("Retrieved players state: ", snapshot.val());
            success(snapshot.val());
        } else {
            success([]);
        }
    }, (error) => {
        console.error("Error retrieving players state: ", error);
    });    
}

// Function to save the players state
export function savePlayersState(gameId, players) {
    const playersRef = ref(db, `players/${gameId}`);

    if (players.length > 2) {
        throw new Error('Cannot join game');
    }
    // Set the value
    set(playersRef, players).then(() => {   
        console.log("Players state saved successfully!");
    }).catch((error) => {
        console.error("Error saving players state: ", error);
    });
}
