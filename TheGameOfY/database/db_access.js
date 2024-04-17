import { db } from "./firebase-config"
import { ref, set, onValue } from "firebase/database";
import { authentication } from './firebase-config';

// Client can only write moves, propose resignation, and propose a game 
// to propose a game it can be done in two ways 
// 1. You make your own game with a unique id 
// 2. the server match you with a game thats waiting for a second player 

// Function to propose a match
export function proposeGame(gameId) {
    if (authentication.currentUser) {
        const uid = authentication.currentUser.uid;
        // Create a reference to the specific path
        const proposalRef = ref(db, `proposal/${gameId}/${uid}/game`);
        // The set value represent's the pie length 
        set(proposalRef, 3).then(() => {
            console.log(`${uid} asking for a game ${gameId}`);
        }).catch((error) => {
            console.error("Error asking for a game: ", error);
        });
    }
}

// Get matched
export function askToGetMatched() {
    if (authentication.currentUser) {
        const uid = authentication.currentUser.uid;
        // Create a reference to the specific path
        const proposalRef = ref(db, `waitingPool/${uid}`);
        // The set value represent's the pie length 
        set(proposalRef, 3).then(() => {
            console.log(`${uid} asking for a game`);
        }).catch((error) => {
            console.error("Error asking for a game: ", error);
        });
    }
}

// Get matched
export function getMatchedGameId(success) {
    if (authentication.currentUser) {
        const uid = authentication.currentUser.uid;
        // Create a reference to the specific path
        const proposalRef = ref(db, `users/${uid}/currentGame`);
        // Set the value
        const unsubscribe = onValue(proposalRef, (snapshot) => {
            if (snapshot.exists()) {
                console.log("Retrieved gameId", snapshot.val());
                success(snapshot.val()); 
            }
        }, (error) => {
            console.error("Error retrieving gameId: ", error);
        });
        return unsubscribe
    }
}

// Function to resign a game
export function resignGame(gameId) {
    if (authentication.currentUser) {
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
}

// Write pie moves 
export function writePie(gameId, intialMoves) {
    if (authentication.currentUser) {
        const uid = authentication.currentUser.uid;
        const resignationRef = ref(db, `games/${gameId}/moves/${uid}/pie`);
        set(resignationRef, intialMoves).then(() => {
            console.log(`${uid} resigning game ${gameId}`);
        }).catch((error) => {
            console.error("Error resigning game: ", error);
        });
    }
}

// Function to retrieve the OtherPlayersMoves
export function getPie(gameId, otherPlayerId, canDecidePie, success) {
    if (canDecidePie) { 
        const gameStateRef = ref(db, `games/${gameId}/moves/${otherPlayerId}/pie`);

        // Use onValue to listen for changes in real-time
        onValue(gameStateRef, (snapshot) => {
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
    }
}

// Function to acceptPie move
export function acceptPie(gameId, accept) {
    if (authentication.currentUser) {
        const uid = authentication.currentUser.uid;
        console.log(uid);
        // Create a reference to the specific path
        const pieRef = ref(db, `games/${gameId}/moves/${uid}/acceptedPie`);
        // Set the value
        set(pieRef, accept).then(() => {
            console.log(`${uid} accepting pie ${gameId}`);
        }).catch((error) => {
            console.error("Error accepting pie : ", error);
        });
    }
}

// Function to save the moves state
export function writeMove(gameId, moveNumber, pieceId) {
    if (authentication.currentUser) {
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
}

// Function to retrieve the OtherPlayersMoves
export function getOtherPlayersMoves(gameId, otherPlayerId, success) {
    const gameStateRef = ref(db, `games/${gameId}/moves/${otherPlayerId}`);

    // Use onValue to listen for changes in real-time
    const unsubscribe = onValue(gameStateRef, (snapshot) => {
        if (snapshot.exists() &&snapshot.val() !== null ) {
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
    if (authentication.currentUser) {
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
}

export function getGameState(gameId, success) {
    if (authentication.currentUser) {
        const uid = authentication.currentUser.uid;

        const turnRef = ref(db, `games/${gameId}/gameState`);
        const unsubscribe = onValue(turnRef, (snapshot) => {
            if (snapshot.exists()) {
                console.log("Retrieved players state: ", snapshot.val());
                success(snapshot.val(), uid);
            } 
        }, (error) => {
            console.error("Error retrieving turn state: ", error);
        });    
        // Return the unsubscribe function so it can be called to remove the listener
        return unsubscribe;
    }
}

// Function to get stored players 
export function getPlayers(gameId, setOtherPlayerId) {
    if (authentication.currentUser) {
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
}

// Function to get turn
export function getTurn(gameId, success) {
    if (authentication.currentUser) {
        const uid = authentication.currentUser.uid;

        const turnRef = ref(db, `games/${gameId}/gameState/turn`);
        const unsubscribe = onValue(turnRef, (snapshot) => {
            if (snapshot.exists()) {
                // console.log("Retrieved players state: ", snapshot.val());
                success(snapshot.val() === uid);
            } 
        }, (error) => {
            console.error("Error retrieving turn state: ", error);
        });    
        // Return the unsubscribe function so it can be called to remove the listener
        return unsubscribe;
    }
}

// Function to retrieve the game state
export function retrieveWinner(gameId, success) {
    if (authentication.currentUser) {
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
}

// save this for devoted use for now 
// Function to get hasGameStarted
export function hasGameStarted(gameId, success) {
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
