export function createGrid(cols = 7, rows = 9){
  const cells = new Array(rows).fill(0).map((_, r) =>
    new Array(cols).fill(0).map((_, c) => ({
      col: c,
      row: r,
      id: `${r}-${c}`,
      selected: false
    }))
  );

  function forEachCell(cb){
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        cb(cells[r][c], r, c);
      }
    }
  }

  function toggleCell(row, col){
    if(row<0||col<0||row>=rows||col>=cols) return;
    cells[row][col].selected = !cells[row][col].selected;
    return cells[row][col];
  }

  function clearSelection(){
    forEachCell(cell => cell.selected = false);
  }

  return {
    cols, rows, cells, forEachCell, toggleCell, clearSelection
  };
}

