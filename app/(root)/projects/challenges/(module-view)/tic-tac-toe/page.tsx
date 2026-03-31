"use client";

import { useEffect, useState } from "react";

type GridItems = Array<null | string>;

function generateGrid(gridSize: number): GridItems {
  return Array(gridSize * gridSize).fill(null);
}

const DEFAULT_GRID_SIZE = 3;
const DEFAULT_ITEMS = generateGrid(DEFAULT_GRID_SIZE);

export default function Page() {
  const [items, setItems] = useState<GridItems>(DEFAULT_ITEMS);
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);
  const [player, setPlayer] = useState("X");

  const resetGame = () => {
    setItems(generateGrid(gridSize));
    setPlayer("X");
  };

  useEffect(() => {
    const winner = getTicTacToeWinner(items);
    if (!winner) {
      const draw = items.filter(Boolean).length === items.length;
      if (draw) {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            alert(`It's a draw!`);
            resetGame();
          }),
        );
      }
      return;
    }

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        alert(`Player ${winner} wins!`);
        resetGame();
      }),
    );
  }, [items]);

  return (
    <>
      <h2 className="max-w-4xl text-2xl font-semibold leading-tight tracking-tight gradient md:text-3xl gradient">
        Tic Tac Toe
      </h2>
      <div className="w-full max-w-xl  mx-auto">
        <div className="flex justify-between">
          <form
            className="flex gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const size = formData.get("size");
              if (!size) return;
              setGridSize(+size);
              setItems(generateGrid(+size));
            }}
          >
            <label className="flex gap-4 items-center">
              <span className="text-lg">Grid Size</span>
              <input
                className="border-b focus:outline-none"
                type="number"
                name="size"
                min={3}
                max={6}
                defaultValue={DEFAULT_GRID_SIZE}
              />
            </label>
            <button className="px-3 py-1 bg-sky-500 rounded-2xl cursor-pointer uppercase font-bold">
              Set Size
            </button>
          </form>
          <button
            type="button"
            className="px-3 py-1 bg-blue-500 rounded-2xl cursor-pointer uppercase font-bold"
            onClick={resetGame}
          >
            Reset Game
          </button>
        </div>

        <div
          className="grid gap-8 mx-auto mt-8"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {items.map((checked, i) => {
            return (
              <button
                key={i}
                className="w-full aspect-square bg-white/5 border rounded-2xl border-white/10 text-4xl cursor-pointer"
                onClick={() => {
                  if (items[i]) return;

                  const aux = items.slice(0, items.length);
                  aux[i] = player;
                  setItems(aux);

                  if (player === "X") setPlayer("O");
                  else setPlayer("X");
                }}
              >
                {checked !== null && checked}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function getTicTacToeWinner(board: Array<string | null>) {
  const size = Math.sqrt(board.length);
  const rows = Array(size)
    .fill(null)
    .map((_, i) =>
      Array(size)
        .fill(null)
        .map((_, j) => i * size + j),
    );

  const columns = Array(size)
    .fill(null)
    .map((_, i) =>
      Array(size)
        .fill(null)
        .map((_, j) => j * size + i),
    );

  const mainDiag = Array(size)
    .fill(null)
    .map((_, j) => j * size + j);

  const secondaryDiag = Array(size)
    .fill(null)
    .map((_, j) => j * size + size - j - 1);

  const allLines = [...rows, ...columns, mainDiag, secondaryDiag];

  const winnerLine = allLines.find((line) => {
    const playerInWinnerLine = new Set(line.map((index) => board[index]));
    return playerInWinnerLine.size === 1 && board[line[0]] !== null;
  });

  return winnerLine ? board[winnerLine[0]] : null;
}
