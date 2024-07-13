import { db } from "./firebase-config";
import { ref, set, onValue } from "firebase/database";
import { authentication } from './firebase-config';

class DBAccess {
    constructor(userId) {
        // Only use passed userId if not signed in
        // this.userId = (authentication.currentUser ? authentication.currentUser.uid : null) || userId;  
        this.userId = userId;  

        if (!this.userId) {
            throw new Error("User ID is not available");
        }

        // Bind methods to the instance to maintain the correct context
        this.proposeGame = this.proposeGame.bind(this);
        this.cleanUpWaiting = this.cleanUpWaiting.bind(this);
        this.askToGetMatched = this.askToGetMatched.bind(this);
        this.getMatchedGameId = this.getMatchedGameId.bind(this);
        this.resignGame = this.resignGame.bind(this);
        this.writePie = this.writePie.bind(this);
        this.getPie = this.getPie.bind(this);
        this.acceptPie = this.acceptPie.bind(this);
        this.writeMove = this.writeMove.bind(this);
        this.getOtherPlayersMoves = this.getOtherPlayersMoves.bind(this);
        this.getMoves = this.getMoves.bind(this);
        this.getGameState = this.getGameState.bind(this);
        this.getPlayers = this.getPlayers.bind(this);
        this.getTurn = this.getTurn.bind(this);
        this.retrieveWinner = this.retrieveWinner.bind(this);
        this.hasGameStarted = this.hasGameStarted.bind(this);
    }

    getUserId() {
        return this.userId;
    }

    proposeGame(gameId) {
        const proposalRef = ref(db, `proposal/${gameId}/${this.userId}/game`);
        set(proposalRef, 3).then(() => {
            console.log(`${this.userId} asking for a game ${gameId}`);
        }).catch((error) => {
            console.error("Error asking for a game: ", error);
        });
    }

    cleanUpWaiting() {
        const proposalRef = ref(db, `proposal/deleteUser/${this.userId}`);
        set(proposalRef, true).then(() => {
            console.log(`Cleaned up waiting for ${this.userId}`);
        }).catch((error) => {
            console.error("Error cleaning up waiting: ", error);
        });
    }

    askToGetMatched() {
        const proposalRef = ref(db, `waitingPool/${this.userId}`);
        set(proposalRef, 3).then(() => {
            console.log(`${this.userId} asking for a game`);
        }).catch((error) => {
            console.error("Error asking for a game: ", error);
        });
    }

    getMatchedGameId(success) {
        const proposalRef = ref(db, `users/${this.userId}/currentGame`);
        const unsubscribe = onValue(proposalRef, (snapshot) => {
            if (snapshot.exists()) {
                console.log("Retrieved gameId", snapshot.val());
                success(snapshot.val());
            }
        }, (error) => {
            console.error("Error retrieving gameId: ", error);
        });
        return unsubscribe;
    }

    resignGame(gameId) {
        const resignationRef = ref(db, `proposal/${gameId}/${this.userId}/resign`);
        set(resignationRef, true).then(() => {
            console.log(`${this.userId} resigning game ${gameId}`);
        }).catch((error) => {
            console.error("Error resigning game: ", error);
        });
    }

    writePie(gameId, initialMoves) {
        const pieRef = ref(db, `games/${gameId}/moves/${this.userId}/pie`);
        set(pieRef, initialMoves).then(() => {
            console.log(`${this.userId} writing pie moves for game ${gameId}`);
        }).catch((error) => {
            console.error("Error writing pie moves: ", error);
        });
    }

    getPie(gameId, otherPlayerId, canDecidePie, success) {
        if (canDecidePie) {
            const gameStateRef = ref(db, `games/${gameId}/moves/${otherPlayerId}/pie`);
            onValue(gameStateRef, (snapshot) => {
                if (snapshot.exists()) {
                    console.log("Retrieved pie moves: ", snapshot.val());
                    success(snapshot.val());
                } else {
                    console.log("No pie moves available");
                }
            }, (error) => {
                console.error("Error retrieving pie moves: ", error);
            });
        }
    }

    acceptPie(gameId, accept) {
        const pieRef = ref(db, `games/${gameId}/moves/${this.userId}/acceptedPie`);
        set(pieRef, accept).then(() => {
            console.log(`${this.userId} accepting pie for game ${gameId}`);
        }).catch((error) => {
            console.error("Error accepting pie: ", error);
        });
    }

    writeMove(gameId, moveNumber, pieceId) {
        const gameStateRef = ref(db, `games/${gameId}/moves/${this.userId}/${moveNumber}`);
        set(gameStateRef, pieceId).then(() => {
            console.log("Game state saved successfully!");
        }).catch((error) => {
            console.error("Error saving game state: ", error);
        });
    }

    getOtherPlayersMoves(gameId, otherPlayerId, success) {
        const gameStateRef = ref(db, `games/${gameId}/moves/${otherPlayerId}`);
        const unsubscribe = onValue(gameStateRef, (snapshot) => {
            if (snapshot.exists() && snapshot.val() !== null) {
                console.log("Other Players Moves: ", snapshot.val());
                success(snapshot.val());
            } else {
                console.log("No game state available");
            }
        }, (error) => {
            console.error("Error retrieving game state: ", error);
        });
        return unsubscribe;
    }

    getMoves(gameId, success) {
        const gameStateRef = ref(db, `games/${gameId}/moves/${this.userId}`);
        const unsubscribe = onValue(gameStateRef, (snapshot) => {
            if (snapshot.exists()) {
                console.log("Retrieved game state: ", snapshot.val());
                success(snapshot.val());
            } else {
                console.log("No game state available");
            }
        }, (error) => {
            console.error("Error retrieving game state: ", error);
        });
        return unsubscribe;
    }

    getGameState(gameId, success) {
        const turnRef = ref(db, `games/${gameId}/gameState`);
        const unsubscribe = onValue(turnRef, (snapshot) => {
            if (snapshot.exists()) {
                console.log("Retrieved game state: ", snapshot.val());
                success(snapshot.val(), this.userId);
            }
        }, (error) => {
            console.error("Error retrieving game state: ", error);
        });
        return unsubscribe;
    }

    getPlayers(gameId, setOtherPlayerId) {
        const playersRef = ref(db, `games/${gameId}/gameState/players`);
        const unsubscribe = onValue(playersRef, (snapshot) => {
            if (snapshot.exists()) {
                const players = snapshot.val();
                console.log("Retrieved players state: ", players);
                const otherPlayerIndex = players.indexOf(this.userId) === 0 ? 1 : 0;
                console.log("otherPlayerIndex", players[otherPlayerIndex]);
                setOtherPlayerId(players[otherPlayerIndex]);
            }
        }, (error) => {
            console.error("Error retrieving players state: ", error);
        });
        return unsubscribe;
    }

    getTurn(gameId, success) {
        const turnRef = ref(db, `games/${gameId}/gameState/turn`);
        const unsubscribe = onValue(turnRef, (snapshot) => {
            if (snapshot.exists()) {
                success(snapshot.val() === this.userId);
            }
        }, (error) => {
            console.error("Error retrieving turn state: ", error);
        });
        return unsubscribe;
    }

    retrieveWinner(gameId, success) {
        const winnerRef = ref(db, `games/${gameId}/gameState/winner`);
        const unsubscribe = onValue(winnerRef, (snapshot) => {
            if (snapshot.exists()) {
                console.log("Retrieved winner: ", snapshot.val());
                success(snapshot.val());
            } else {
                console.log("No winner yet");
            }
        }, (error) => {
            console.error("Error retrieving game state: ", error);
        });
        return unsubscribe;
    }

    hasGameStarted(gameId, success, after) {
        const hasGameStartedRef = ref(db, `games/${gameId}/gameState/hasGameStarted`);
        const unsubscribe = onValue(hasGameStartedRef, (snapshot) => {
            if (snapshot.exists()) {
                console.log("Retrieved hasGameStarted: ", snapshot.val());
                success(snapshot.val());
                after();
            }
        }, (error) => {
            console.error("Error retrieving game state: ", error);
        });
        return unsubscribe;
    }
}

export default DBAccess;
