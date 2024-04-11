import { db } from "./firebase-config"
import { ref, set, get, onValue, remove, onChildAdded, push, update } from "firebase/database";
import { uuidv4 } from "@firebase/util";
import { authentication } from './firebase-config';

// Client can only write moves, propose resignation, and propose a game 
// to propose a game it can be done in two ways 
// 1. You make your own game with a unique id 
// 2. the server match you with a game thats waiting for a second player 

// Function to propose a match
export function proposeGame(gameId) {
    const uid = authentication.currentUser.uid;
    // Create a reference to the specific path
    const proposalRef = ref(db, `proposal/${gameId}/${uid}/game`);
    // Set the value
    set(proposalRef, true).then(() => {
        console.log(`${uid} asking for a game ${gameId}`);
    }).catch((error) => {
        console.error("Error asking for a game: ", error);
    });
}

// Get matched
export function getMatched() {
    const uid = authentication.currentUser.uid;
    // Create a reference to the specific path
    const proposalRef = ref(db, `waitingPool/${uid}`);
    // Set the value
    set(proposalRef, true).then(() => {
        console.log(`${uid} asking for a game`);
    }).catch((error) => {
        console.error("Error asking for a game: ", error);
    });
}

// Function to resign a game
export function resignGame(gameId) {
    const uid = authentication.currentUser.uid;
    // Create a reference to the specific path
    const resignationRef = ref(db, `proposal/${gameId}/${uid}/resign`);
    // Set the value
    set(resignationRef, true).then(() => {
        console.log(`${uid} resigning game ${gameId}`);
    }).catch((error) => {
        console.error("Error resigning game: ", error);
    });
}

// Function to acceptPie move
export function acceptPie(gameId) {
    const uid = authentication.currentUser.uid;
    console.log(uid);
    // Create a reference to the specific path
    const resignationRef = ref(db, `proposal/${gameId}/${uid}/acceptedPie`);
    // Set the value
    set(resignationRef, true).then(() => {
        console.log(`${uid} resigning game ${gameId}`);
    }).catch((error) => {
        console.error("Error resigning game: ", error);
    });
}

// Function to save the moves state
export function writeMove(gameId, moveNumber, pieceId) {
    const uid = authentication.currentUser.uid;
    console.log(uid);
    // Create a reference to the specific path
    const gameStateRef = ref(db, `games/${gameId}/moves/${uid}/${moveNumber}`);
    // Set the value
    set(gameStateRef, pieceId).then(() => {
        console.log("Game state saved successfully!");
    }).catch((error) => {
        console.error("Error saving game state: ", error);
    });
}

// Function to retrieve the OtherPlayersMoves
export function getOtherPlayersMoves(gameId, otherPlayerId, success) {
    const gameStateRef = ref(db, `games/${gameId}/moves/${otherPlayerId}`);

    // Use onValue to listen for changes in real-time
    const unsubscribe = onValue(gameStateRef, (snapshot) => {
        if (snapshot.exists()) {
            console.log("Retrieved game state: ", snapshot.val());
            // format val unto nice array 
            success(snapshot.val()); // Invoke the callback with the new game state
        } else {
            console.log("No game state available");
        }
    }, (error) => {
        console.error("Error retrieving game state: ", error);
    });
    // Return the unsubscribe function so it can be called to remove the listener
    return unsubscribe;
}

// Function to retrieve the OtherPlayersMoves
export function getMoves(gameId, success) {
    const uid = authentication.currentUser.uid;
    const gameStateRef = ref(db, `games/${gameId}/moves/${uid}`);

    // Use onValue to listen for changes in real-time
    const unsubscribe = onValue(gameStateRef, (snapshot) => {
        if (snapshot.exists()) {
            console.log("Retrieved game state: ", snapshot.val());
            // format val unto nice array 
            success(snapshot.val()); // Invoke the callback with the new game state
        } else {
            console.log("No game state available");
        }
    }, (error) => {
        console.error("Error retrieving game state: ", error);
    });
    // Return the unsubscribe function so it can be called to remove the listener
    return unsubscribe;
}

// Function to retrieve the OtherPlayersMoves
export function getPie(gameId, otherPlayerId, success) {
    const gameStateRef = ref(db, `games/${gameId}/moves/${otherPlayerId}`);

    // Use onValue to listen for changes in real-time
    onValue(gameStateRef, (snapshot) => {
        if (snapshot.exists()) {
            console.log("Retrieved game state: ", snapshot.val());
            // format val unto nice array 
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
export function getPlayers(gameId, setOtherPlayerId) {
    const playersRef = ref(db, `games/${gameId}/gameState/players`);
    const uid = authentication.currentUser.uid;

    const unsubscribe = onValue(playersRef, (snapshot) => {
        if (snapshot.exists()) {
            const players = snapshot.val();
            console.log("Retrieved players state: ", players);
            const otherPlayerIndex = players.indexOf(uid) === 0 ? 1 : 0;
            console.log("otherPlayerIndex", players[otherPlayerIndex]);
            setOtherPlayerId(players[otherPlayerIndex]);
        } 
    }, (error) => {
        console.error("Error retrieving players state: ", error);
    });   
    // Return the unsubscribe function so it can be called to remove the listener
    return unsubscribe;
}


// Function to get turn
export function getTurn(gameId, success) {
    const uid = authentication.currentUser.uid;

    const turnRef = ref(db, `games/${gameId}/gameState/turn`);
    const unsubscribe = onValue(turnRef, (snapshot) => {
        if (snapshot.exists()) {
            // console.log("Retrieved players state: ", snapshot.val());
            success(snapshot.val() === uid);
        } else {
            success([]);
        }
    }, (error) => {
        console.error("Error retrieving turn state: ", error);
    });    
    // Return the unsubscribe function so it can be called to remove the listener
    return unsubscribe;
}

// Function to retrieve the game state
export function retrieveWinner(gameId, success) {
    const winnerRef = ref(db, `games/${gameId}/gameState/winner`);

    // Use onValue to listen for changes in real-time
    const unsubscribe = onValue(winnerRef, (snapshot) => {
        if (snapshot.exists()) {
            console.log("Retrieved winner: ", snapshot.val());
            success(snapshot.val()); // Invoke the callback with the new game state
        } else {
            console.log("No winner yet");
        }
    }, (error) => {
        console.error("Error retrieving game state: ", error);
    });
    // Return the unsubscribe function so it can be called to remove the listener
    return unsubscribe;
}

// Function to get hasGameStarted
export function hasGameStarted(gameId, success) {
    const uid = authentication.currentUser.uid;

    const hasGameStartedRef = ref(db, `games/${gameId}/gameState/hasGameStarted`);
    const unsubscribe = onValue(hasGameStartedRef, (snapshot) => {
        if (snapshot.exists()) {
            console.log("Retrieved hasGameStarted: ", snapshot.val());
            success(snapshot.val());
        } 
    }, (error) => {
        console.error("Error retrieving turn state: ", error);
    });    

    // Return the unsubscribe function so it can be called to remove the listener
    return unsubscribe;
}
