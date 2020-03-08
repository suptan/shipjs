const createEmptyBoard = ({ gridHorizontal, gridVertical }) => {
  const board = [];
  while (board.length < gridVertical) {
    // deep clone array
    const rows = [];
    rows[gridHorizontal - 1] = 0;
    board.push(rows);
  }

  return board;
};

export {
  createEmptyBoard,
};
