import { db } from "./firebase-config"
import { ref, set, get, onValue, remove, onChildAdded, push, update } from "firebase/database";
import { uuidv4 } from "@firebase/util";

// Function to save the moves state
export function saveGameState(gameState, gameId) {
    // Create a reference to the specific path
    const gameStateRef = ref(db, `${gameId}/gameStates`);
    // Set the value
    set(gameStateRef, gameState).then(() => {
        console.log("Game state saved successfully!");
    }).catch((error) => {
        console.error("Error saving game state: ", error);
    });
}

// Function to retrieve the game state
export function retrieveGameState(gameId, success) {
    const gameStateRef = ref(db, `${gameId}/gameStates`);

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
    const playersRef = ref(db, `${gameId}/players`);
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
    const playersRef = ref(db, `${gameId}/players`);

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


// Function to save the moves state
export function resign(gameId, playerId) {
    // Create a reference to the specific path
    const winnerRef = ref(db, `${gameId}/winner`);
    // Set the value
    set(winnerRef, playerId).then(() => {
        console.log("Resigned successfully!");
    }).catch((error) => {
        console.error("Error saving game state: ", error);
    });
}

// Function to retrieve the game state
export function retrieveWinner(gameId, success) {
    const winnerRef = ref(db, `${gameId}/winner`);

    // Use onValue to listen for changes in real-time
    onValue(winnerRef, (snapshot) => {
        if (snapshot.exists()) {
            console.log("Retrieved winner: ", snapshot.val());
            success(snapshot.val()); // Invoke the callback with the new game state
        } else {
            console.log("No winner yet");
        }
    }, (error) => {
        console.error("Error retrieving game state: ", error);
    });
}
