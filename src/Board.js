import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = .5 }) {
  const [board, setBoard] = useState(createBoard);

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let i = 0; i < nrows; i++) {
      const row = [];

      for (let j = 0; j < nrows; j++) {
        row.push(Math.random() < chanceLightStartsOn);
      }

      initialBoard.push(row);
    }

    return initialBoard;
  }

  /** Returns true/false if all lights are out. */
  function hasWon() {
    return board.flat().every(c => c === false);
  }

  /**
   * Takes string coord 'y-x',
   * flips cell and surrounding cells, and
   * sets board state.
   * */

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      /**
       * Takes y and x coord numbers and board copy matrix array,
       * and flips cell if found.
       */
      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const boardCopy = JSON.parse(JSON.stringify(oldBoard));
      // alternative: map and spread each row [...row]

      flipCell(y, x, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y + 1, x, boardCopy);

      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else

  if (hasWon()) {
    return <h1>You Won!</h1>;
  }

  // make table board

  return (
    <table>
      <tbody>
        {board.map(
          (r, y) => <tr key={y}>{
            r.map(
              (c, x) => <Cell
                key={`${y}-${x}`}
                coords={`${y}-${x}`}
                isLit={c}
                flipCellsAroundMe={() => flipCellsAround(coords)}
              />
            )}
          </tr>
        )}
      </tbody>
    </table>
  );

}

export default Board;
