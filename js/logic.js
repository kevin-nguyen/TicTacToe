$(document).ready(function () {
    var $tiles = $('.content');
    

    function GameUI() {
        var numberToString = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

        this.resetBoard = function reset() {
            var $winTiles = $('.win-color');

            $tiles.text('');
            $winTiles.removeClass('win-color');
        };

        this.print = function print(mode, value) {

            if (mode === 'user Play') {
                (value.tile).text(value.data);
            } else if (mode === 'ai Play') {
                var tilePosition = typeof value.tile.positionAdded === 'string' ? 
                    value.tile.positionAdded : numberToString[value.tile.positionAdded];
                var $tile = $('#' + tilePosition);
                $tile.text(value.data); 
            } 
            else if (mode === 'scorePlayer') {
                $scores = $('.player-score');
                var score = parseInt($scores.first().text(), 10);

                $scores.first().text("" + (score + 1));
            } else if (mode === 'scoreAI') {
                $scores = $('.player-score');
                var score = parseInt($scores.last().text(), 10);

                $scores.last().text("" + (score + 1));
            }
        };

        this.highlightWin = function highlightWin(winningRowArray) {
            if (winningRowArray.length === 3) {
                winningRowArray.forEach(function(element) {
                    $('#' + numberToString[element]).addClass('win-color');
                })
            } else if (winningRowArray.length === 9) {
                winningRowArray.forEach(function(element, index) {
                    $('#' + numberToString[index]).addClass('win-color');
                })
            }
        };

    };

    /*
        State - A constructor for a TicTacToe state
        @param Number position - player inputted position for this state
        @param State prevState - a previous state this state can build off of
    */
    function State(position, prevState, characterSelection) {
        this.boardState = [null, null, null, null, null, null, null, null, null];
        this.gameOver = false;
        this.minmaxScore = null;
        this.player = characterSelection === undefined ? 'X' : characterSelection;
        this.AITurnNumber = 0;
        this.winningRow = [];
        this.positionAdded = position;

        /*  P - Player wins
            A - AI wins
            T - Tie
            G - Game in progress
        */
        this.status = 'G';

        if (prevState !== undefined && !prevState.gameOver) {
            this.boardState = prevState.boardState.slice(); 
            this.player = prevState.player === 'X' ? 'O' : 'X';
            this.AITurnNumber = this.player === 'O' ? prevState.AITurnNumber + 1 : prevState.AITurnNumber;
        } else if (prevState !== undefined && prevState.gameOver) {
            this.boardState = prevState.boardState.slice(); 
            this.player = prevState.player;
            this.AITurnNumber = prevState.AITurnNumber;
            this.status = prevState.status;
            this.positionAdded = prevState.positionAdded;
            this.winningRow = prevState.winningRow.slice();
            this.gameOver = prevState.gameOver;
            this.minmaxScore = prevState.minmaxScore;
        }

        this.winnerCheck = function winnerCheck() {
            /* boardState Array Index
                0 | 1 | 2
                --|---|---
                3 | 4 | 5
                --|---|---
                6 | 7 | 8
            */

            for (var i = 0; i < 3; i++) {
                if (this.boardState[i] !== null 
                    && this.boardState[i] === this.boardState[i+3] 
                    && this.boardState[i+3] === this.boardState[i+6]) {

                    this.gameOver = true;
                    this.winningRow.push(i);
                    this.winningRow.push(i+3);
                    this.winningRow.push(i+6);

                    this.status = this.player === playerCharacter ? 'P' : 'A';

                    return true;
                }
            }

            for (var j = 0; j < 7; j+=3) {
                if (this.boardState[j] !== null 
                    && this.boardState[j] === this.boardState[j+1] 
                    && this.boardState[j+1] === this.boardState[j+2]) {
                    //this.incrementScore(state);
                    //resetBoard();
                    this.gameOver = true;
                    this.winningRow.push(j);
                    this.winningRow.push(j+1);
                    this.winningRow.push(j+2);

                    this.status = this.player === playerCharacter ? 'P' : 'A';

                    return true;
                }
            }

            if (this.boardState[0] !== null 
                && this.boardState[0] === this.boardState[4] 
                && this.boardState[4] === this.boardState[8]) {

                this.gameOver = true;
                this.winningRow.push(0);
                this.winningRow.push(4);
                this.winningRow.push(8);

                this.status = this.player === playerCharacter ? 'P' : 'A';

                return true;
            }

            if (this.boardState[2] !== null 
                && this.boardState[2] === this.boardState[4] 
                && this.boardState[4] === this.boardState[6]) {

                this.gameOver = true;
                this.winningRow.push(2);
                this.winningRow.push(4);
                this.winningRow.push(6);

                this.status = this.player === playerCharacter ? 'P' : 'A';

                return true;
            }

            if (this.boardState.indexOf(null) === -1) {
                this.status = 'T';
                this.gameOver = true;

                return true;
            }

            return false;
        };

        this.addPosition = function addPosition(pos) {
            switch (pos) {
                case 'zero':
                case 0:
                    this.boardState[0] = this.player;
                    break;
                case 'one':
                case 1:
                    this.boardState[1] = this.player;
                    break;
                case 'two':
                case 2:
                    this.boardState[2] = this.player;
                    break;
                case 'three':
                case 3:
                    this.boardState[3] = this.player;
                    break;
                case 'four':
                case 4:
                    this.boardState[4] = this.player;
                    break;
                case 'five':
                case 5:
                    this.boardState[5] = this.player;
                    break;
                case 'six':
                case 6:
                    this.boardState[6] = this.player;
                    break;
                case 'seven':
                case 7:
                    this.boardState[7] = this.player;
                    break;
                case 'eight':
                case 8:
                    this.boardState[8] = this.player;
                    break;
            }
        };

        this.availablePosition = function availablePosition() {
            var emptyTiles = [];

            this.boardState.forEach(function(tile, index) {
                if (tile === null) {
                    emptyTiles.push(index);
                }
            });

            return emptyTiles;
        };

        if (prevState === undefined) {
            this.addPosition(position);
        } else if (prevState.boardState.indexOf(null) !== -1) {
            this.addPosition(position);
            this.winnerCheck();
        }
    }

    /*
        minMax - Applies the recursive min-max algorithm to a state object
        @param State state - the State object of the previous player's turn
        @return State - returns the optimal next state the AI sould make
    */
    function minMax(state) {
        /* NOTE: 'state' variable holds previous player's turn 
            MinMax logic flipped to account for correct player's min/max choice */
        var minmaxScore;

        if (state.gameOver) {
            if (state.status === 'P') {
                minmaxScore = 10 - state.AITurnNumber;
            } else if (state.status === 'A') {
                minmaxScore = -10 + state.AITurnNumber;
            } else if (state.status === 'T') {
                minmaxScore = 0;
            }

            return minmaxScore;
        } else {
            // Initial comparison scores
            if (state.player === playerCharacter) {
                minmaxScore = 100;
            } else {
                minmaxScore = -100;
            }

            var nextMoves = state.availablePosition();
            var nextStates = nextMoves.map(function(pos) {
                return new State(pos, state);
            });

            nextStates.forEach(function(nextState) {
                var currentScore = minMax(nextState);

                if (state.player === playerCharacter) {
                    if (currentScore < minmaxScore) {
                        minmaxScore = currentScore;
                    }
                } else {
                    if (currentScore > minmaxScore) {
                        minmaxScore = currentScore;
                    }
                }
            });

            return minmaxScore;
        }
    }

    function aiFirstTurn(prevState) {
        var nextMoveApplied;
        var cornerTiles = ['zero', 'two', 'six', 'eight'];
        var middleTile = 'four';
        var fiftyFiftyChance = .5;
        var nextMove;

        if (cornerTiles.indexOf(prevState.positionAdded) !== -1) {
            cornerTiles = cornerTiles.filter(function(element) {
                return (element !== prevState.positionAdded);
            });
        } 

        if (prevState.positionAdded !== middleTile) {
            if (Math.random() < fiftyFiftyChance) {
                nextMoveApplied = new State(middleTile, prevState);
            } else {
                nextMove = cornerTiles[Math.floor(Math.random() * cornerTiles.length)];
                nextMoveApplied = new State(nextMove, prevState);
            }
        } else {
            nextMove = cornerTiles[Math.floor(Math.random() * cornerTiles.length)];
            nextMoveApplied = new State(nextMove, prevState);
        }

        return nextMoveApplied;
    }

    function aiTurn(prevState) {
        var nextMoveApplied = null;
        var availableMoves = prevState.availablePosition();
        var nextStates = availableMoves.map(function (element) {
            var nextMove = new State(element, prevState);

            nextMove.minmaxScore = minMax(nextMove);

            return nextMove;
        });

        if (prevState.player === playerCharacter) {
            // Current player is AI -- wants to minimize score for Player
            nextStates.sort(function(state1, state2) {
                return state1.minmaxScore - state2.minmaxScore;
            });
        } else {
            // Current player is Player -- wants to maximize score for Player
            nextStates.sort(function(state1, state2) {
                return state2.minmaxScore - state1.minmaxScore;
            });
        }

        nextMoveApplied = nextStates[0];

        return nextMoveApplied;
    }

    function ScoreRecord() {
        var score = {
                    "P": 0,
                    "A": 0
                    };

        this.increaseScorePlayer = function increaseScorePlayer() {
            score.P += 1;
        };

        this.increaseScoreAI = function increaseScoreAI() {
            score.A += 1;
        };

        this.getScorePlayer = function getScorePlayer() {
            return score.P;
        }

        this.getScoreAI = function getScoreAI() {
            return score.AI;
        }

        this.resetScore = function resetScore() {
            score.P = 0;
            score.A = 0;
        };
    }

    var UI = new GameUI();
    var score = new ScoreRecord();
    var game = null;
    var playerCharacter = null;
    var $overlay = null;


    $tiles.click(function(event) {
        var $that = $(this);

        if ($that.text() === '' && (game === null || !game.gameOver)) {
            game = (game === null) ? new State($that.attr("id"), undefined, playerCharacter) : new State($that.attr("id"), game);

            UI.print('user Play', {tile: $that, data: game.player});

            if (!game.gameOver) {
                game = aiTurn(game);

                UI.print('ai Play', {tile: game, data: game.player});
            }

            if (game.gameOver) {
                if (game.status === 'T') {
                    UI.highlightWin(game.boardState);
                } else {
                    UI.highlightWin(game.winningRow);

                    if (game.status === 'P') {
                        score.increaseScorePlayer();
                        UI.print('scorePlayer', score.getScorePlayer());
                    } else if (game.status === 'A') {
                        score.increaseScoreAI();
                        UI.print('scoreAI', score.getScoreAI());
                    }
                }
            }
        }
    });

    $(".character-choice").click(function() {
        var $that = $(this);
        playerCharacter = $that.text(); 
        $overlay = $('.overlay').detach();
    });

    $(".reset").click(function(event) {
        // score.resetScore();
        UI.resetBoard();
        game = null;
    });
});  