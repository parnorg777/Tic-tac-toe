const cells = document.querySelectorAll(".cell");
const btnNG = document.querySelector("#btn-ng");
const divMess = document.querySelector("#mess");
const h1 = document.querySelector("h1");
const imgMess = document.querySelector("#mess-img");
const imgMess2 = document.querySelector("#mess-img2");
const btnP2P = document.querySelector("#btn-p2p");
const btnAI = document.querySelector("#btn-AI");

const crossImg = ["IMG/cross.svg", "IMG/cross-white.svg", "IMG/cross-pink.svg"];
const circleImg = [
  "IMG/circle.svg",
  "IMG/circle-white.svg",
  "IMG/circle-pink.svg",
];

const winCombs = [
  [1, 2, 3],
  [1, 5, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 5, 7],
  [3, 6, 9],
  [4, 5, 6],
  [7, 8, 9],
];

let nGame;

class Player {
  figure;
  img;
  moves;
  motion;
  win;
  static winComb;

  constructor(figure) {
    this.figure = figure;
    if (figure == "x") {
      this.img = crossImg;
      this.motion = true;
    } else {
      this.img = circleImg;
      this.motion = false;
    }
    this.moves = [];
    this.win = false;
  }

  makeMove(cell) {
    this.renderMess("ХОДИТ");
    this.renderFigure(cell);
    this.moves.push(Number(cell.id));

    if (Player.checkWin(this.moves, true) == 2) {
      this.winPlayer();
    } else if (Player.checkWin(this.moves) == 1) {
      this.drawPlay();
    }
  }

  static checkWin(moves, mm = null) {
    for (let comb of winCombs) {
      let movesComb = [];
      for (let move of moves) {
        if (comb.includes(move)) movesComb.push(move);
      }
      if (movesComb.length == 3) {
        if (mm) Player.winComb = movesComb;
        return 2;
      }
    }
    if (moves.length == 5) return 1;
    return 0;
  }

  renderMess(mess) {
    h1.textContent = mess + " -";
    imgMess2.hidden = true;

    switch (mess) {
      case "ХОДИТ":
        if (this.figure == "x") {
          imgMess.src = "IMG/circle-white.svg";
        } else {
          imgMess.src = "IMG/cross-white.svg";
        }
        break;
      case "ПОБЕДА":
        imgMess.src = this.img[1];
        break;
      case "НИЧЬЯ":
        imgMess.src = "IMG/cross-white.svg";
        imgMess2.hidden = false;
        break;
    }
  }

  winPlayer() {
    for (let move of Player.winComb) {
      cells[move - 1].firstChild.src = this.img[2];
    }

    this.win = true;
    this.renderMess("ПОБЕДА");
  }

  drawPlay() {
    this.win = true;
    this.renderMess("НИЧЬЯ");
  }

  renderFigure(cell) {
    let img = document.createElement("img");
    img.src = this.img[0];
    img.width = 110;
    cell.append(img);
  }
}

class Game {
  player1;
  player2;
  mode;

  constructor(f1, f2, mode) {
    this.player1 = new Player(f1);
    this.player2 = new Player(f2);
    this.mode = mode;
  }

  static clearField() {
    for (let cell of cells) {
      while (cell.firstChild) {
        cell.removeChild(cell.lastChild);
        cell.onclick = "";
      }

      cell.onclick = nGame.mode;
    }
  }

  static playTwoPlayer(event) {
    let cell = event.target;

    cell.onclick = "";

    if (nGame.player1.motion && !nGame.player2.win) {
      nGame.player1.makeMove(cell);
      nGame.player1.motion = false;
      nGame.player2.motion = true;
    } else if (nGame.player2.motion && !nGame.player1.win) {
      nGame.player2.makeMove(cell);
      nGame.player1.motion = true;
      nGame.player2.motion = false;
    }
  }

  static playToBot(event) {
    let cell = event.target;

    if (nGame.player1.motion && !nGame.player2.win) {
      cell.onclick = "";
      nGame.player1.makeMove(cell);
      nGame.player1.motion = false;
      nGame.player2.motion = true;
    }

    if (nGame.player2.motion && !nGame.player1.win) {
      nGame.player2.motion = false;
      setTimeout(() => {
        let move = Game.bot() - 1;
        cells[move].onclick = "";

        nGame.player2.makeMove(cells[move]);
        nGame.player1.motion = true;
      }, 700);
    }
  }

  static bot() {
    let moves = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    let mP1 = nGame.player1.moves;
    let mP2 = nGame.player2.moves;

    let allMoves = mP1.concat(mP2);

    for (let move of allMoves) {
      if (move == moves[moves.indexOf(move)]) {
        moves.splice(moves.indexOf(move), 1);
      }
    }

    for (let move of moves) {
      let gipMovesP1 = [...mP1];
      let gipMovesP2 = [...mP2];
      gipMovesP1.push(move);
      gipMovesP2.push(move);

      if (Player.checkWin(gipMovesP2) == 2) {
        return move;
      }
    }

    for (let move of moves) {
      let gipMovesP1 = [...mP1];
      let gipMovesP2 = [...mP2];
      gipMovesP1.push(move);
      gipMovesP2.push(move);

      if (Player.checkWin(gipMovesP1) == 2) {
        return move;
      }
    }

    if (mP1.includes(1) && mP1.includes(9) && moves.includes(2)) {
      return 2;
    } else if (mP1.includes(3) && mP1.includes(7) && moves.includes(8)) {
      return 8;
    } else if (mP1.includes(7) && mP1.includes(6) && moves.includes(9)) {
      return 9;
    } else if (mP1.includes(1) && mP1.includes(8) && moves.includes(7)) {
      return 7;
    }

    if (moves.includes(5)) {
      return 5;
    } else if (moves.includes(1)) {
      return 1;
    } else if (moves.includes(3)) {
      return 3;
    } else if (moves.includes(7)) {
      return 7;
    } else if (moves.includes(9)) {
      return 9;
    } else {
      return moves[Math.floor(Math.random() * moves.length)];
    }
  }

  static newGame(mode) {
    nGame = new Game("x", "o", mode);
    Game.clearField();
    nGame.player2.renderMess("ХОДИТ");
  }
}

btnNG.addEventListener("click", () => Game.newGame(nGame.mode));
btnP2P.addEventListener("click", () => Game.newGame(Game.playTwoPlayer));
btnAI.addEventListener("click", () => Game.newGame(Game.playToBot));

Game.newGame(Game.playToBot);
