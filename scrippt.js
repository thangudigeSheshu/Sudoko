let cells = [];
let board = [];
let solBoard = [];
let temp = [];
let mistakes = 0;
let maxMistakes = 10;
let selectedRow = null,selectedCol = null;
let maxHints = 7,hints = 0;
let tbody = document.querySelector('.tbody');
window.addEventListener('DOMContentLoaded', () => {
      document.getElementById('mainContent').classList.add('blur');
      Swal.fire({
        title: 'Choose Difficulty',
        input: 'select',
        inputOptions: {
          'easy': 'Easy',
          'medium': 'Medium',
          'hard': 'Hard',
          'expert' : 'Expert'
        },
        inputPlaceholder: 'Select difficulty',
        allowOutsideClick: false,
        confirmButtonText: 'Start Game'
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          document.getElementById('mainContent').classList.remove('blur');
          document.querySelector('.difflel').innerHTML = `You Have Selected ${result.value} Level`;
          document.getElementById('difficulty').style.display = 'none';
          document.getElementById('timer').style.display = 'block';
          document.getElementById('pauseResumeBtn').style.display = 'block';
          startGame(result.value);
          document.querySelector('#number-pad').style.display = 'flex';
          startTimer();
          document.querySelector('#resumeBtn').style.display = 'flex';
        }else{
          swal.fire("Please Select Difficulty").then(() => {
            location.reload();
          });
        }
    });
});

function createGrid() {
      let tbody = document.querySelector('.tbody');
      tbody.innerHTML = ''; // Clear any previous content
      cells = []; // Reset cells
      for (let i = 0; i < 9; i++) {
        let row = [];
        const tr = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
          const td = document.createElement('td');
          const inp = document.createElement('input');
          inp.type = "text";
          inp.maxLength = "1";
          inp.setAttribute('data-row', i);
          inp.setAttribute('data-col', j);
          inp.addEventListener('click',()=>{
            selectedRow = i;
            selectedCol = j;
          })
          inp.addEventListener('input', function (e) {
              selectedRow = i;
              selectedCol = j;
              let val = e.target.value;
              let row = parseInt(inp.getAttribute('data-row'));
              let col = parseInt(inp.getAttribute('data-col'));
              if (!conflict(row,col,val)) {
                  mistakes++;
                  updateMaxMistakes();
                  document.querySelector('.mistakes').innerText = mistakes;

                  if (mistakes >= maxMistakes) {
                    Swal.fire({
                      title: 'Game Over',
                      text: `You have reached the limit of maximum number of mistakes (${maxMistakes}).`,
                      icon: 'error',
                      confirmButtonText: 'Start New Game'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        location.reload(); // restart the game
                      }
                    });
                  }
                }
                  document.addEventListener('keydown', (e) => {
                  
                      if (e.key === 'Backspace') {
                        if (selectedRow !== null && selectedCol !== null) {
                          cells[selectedRow][selectedCol].value = '';
                        }
                      }
                      for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                  cells[r][c].classList.remove('conflict');
                }
              }
                    });

          });
          td.appendChild(inp);
          tr.appendChild(td);
          row.push(inp);
        }
        cells.push(row);
        tbody.appendChild(tr);
      }
}

document.querySelector('.st').addEventListener('click', () => {
  
      Swal.fire({
        title: 'Are you sure?',
        text: 'Current game progress will be lost.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, continue',
      }).then((result) => {
        if (result.isConfirmed) {
          hints = 0;
          document.querySelector('.hints').innerHTML = hints.toString();
          document.querySelector('#mainContent').classList.add('blur');
          document.getElementById('number-pad').classList.add('blur');
          document.querySelector('.time').classList.add('blur');
          Swal.fire({
            title: 'Select Difficulty',
            input: 'select',
            inputOptions: {
              'easy': 'Easy',
              'medium': 'Medium',
              'hard': 'Hard',
              'expert':'Expert'
            },
            inputPlaceholder: 'Choose difficulty',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: 'Start Game',
            cancelButtonText: 'Cancel'
          }).then((res) => {
            if (res.isConfirmed && res.value) {
              document.querySelector('#mainContent').classList.remove('blur');
              document.getElementById('number-pad').classList.remove('blur');
              document.querySelector('.time').classList.remove('blur');
              document.querySelector('.difflel').innerHTML = `You Have Selected ${res.value} Level`;
              document.getElementById('difficulty').style.display = 'none';
              document.getElementById('timer').style.display = 'block';
              
              startGame(res.value);
              startTimer();
            }else{
              swal.fire("Please Select Difficulty").then(() => {
                location.reload();
              });
            }
          });
        }
      });
    });

    document.querySelector('.rulesBtn').addEventListener('click', () => {
      document.querySelector('#mainContent').classList.add('blur');
      document.getElementById('number-pad').classList.remove('blur');
              document.querySelector('.time').classList.remove('blur');
     Swal.fire({
    title: '🎯 Sudoku Game Rules',
    html: `
      <div style="text-align: left; font-size: 16px">
        <h3>🔢 Objective</h3>
        <ul>
          <li>Fill a 9×9 grid with digits 1 to 9.</li>
          <li>Each <b>row</b>, <b>column</b>, and <b>3×3 subgrid</b> must contain digits 1 to 9 without repetition.</li>
        </ul>

        <h3>🖱️ How to Play</h3>
        <ul>
          <li>Click on any empty cell to enter a digit (1 to 9).</li>
          <li>Try to solve the entire grid following the rules above.</li>
        </ul>

        <h3>⚠️ Conflicts</h3>
        <ul>
          <li>A <b>conflict</b> occurs when the same digit appears more than once in the same row, column, or subgrid.</li>
          <li>If you enter a number that causes a conflict:
            <ul>
              <li>The cell will be highlighted in <span style="color: red; font-weight: bold;">red</span>.</li>
              <li>A message like <i>"Invalid move! This number already exists."</i> will appear.</li>
              <li>Your <b>mistake counter</b> will increase by 1.</li>
            </ul>
          </li>
        </ul>

        <h3>💀 Mistake Limits</h3>
        <ul>
          <li><b>Easy:</b> 10 mistakes allowed</li>
          <li><b>Medium:</b> 7 mistakes allowed</li>
          <li><b>Hard:</b> 5 mistakes allowed</li>
          <li><b>Expert:</b> 3 mistakes allowed</li>
        </ul>

        <h3>🚫 Game Over</h3>
        <ul>
          <li>If you reach the allowed mistake limit, the game ends with a "Game Over" alert.</li>
          <li>You can restart the game after that.</li>
        </ul>

        <h3>💡 Hint System</h3>
        <ul>
          <li>Use the "Hint" button to reveal a correct number in one cell.</li>
          <li>Hints are same for all difficulty levels (limited to 7).</li>
        </ul>
      </div>
    `,
    confirmButtonText: 'Ok',
    width: '600px',
    padding: '2em',
  }).then(()=>{
    document.querySelector('#mainContent').classList.remove('blur');
     document.querySelector('#mainContent').classList.remove('blur');
              document.getElementById('number-pad').classList.remove('blur');
              document.querySelector('.time').classList.remove('blur');
  });
});

//now for filling use back tracking algorithm find a unique solution and remove some elements as per difficulty
function isSafe(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num || board[row][i] === num) return false;

    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

function solve(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffle(nums);
        for (let i = 0; i < 9; i++) {
          let n = nums[i];
          if (isSafe(board, r, c, n)) {
            board[r][c] = n;
            if (solve(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

function copyBoard(src, dest) {
  for (let i = 0; i < 9; i++) {
    dest[i] = [];
    for (let j = 0; j < 9; j++) {
      dest[i][j] = src[i][j];
    }
  }
}

function countSolutions(board) {
  let count = 0;
  copyBoard(board, temp);

  function dfs(b) {
    if (count > 1) return;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] === 0) {
          for (let n = 1; n <= 9; n++) {
            if (isSafe(b, r, c, n)) {
              b[r][c] = n;
              dfs(b);
              b[r][c] = 0;
            }
          }
          return;
        }
      }
    }
    count++;
  }

  dfs(temp);
  return count;
}

function generateBoard() {
  
  for (let i = 0; i < 9; i++) {
    board[i] = [];
    for (let j = 0; j < 9; j++) {
      board[i][j] = 0;
    }
  }
  solve(board);
  copyBoard(board,solBoard);
  return board;
}

function removeCells(board, clues) {
  let cells = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells.push([i, j]);
    }
  }

  shuffle(cells);
  let total = 81;
  for (let i = 0; i < cells.length && total > clues; i++) {
    let r = cells[i][0];
    let c = cells[i][1];
    let saved = board[r][c];
    board[r][c] = 0;

    if (countSolutions(board) !== 1) {
      board[r][c] = saved; // put back if multiple solutions
    } else {
      total--;
    }
  }
}

function fillGrid(board){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            let val = board[i][j];
            if(val === 0 || val === '0') {
                cells[i][j].value = '';
            } else {
                cells[i][j].value = val.toString();
            }
            //console.log(`Filling cell [${i},${j}] with: "${board[i][j]}"`);  // Debug line
        }
    }
}


function updateMaxMistakes() {
      const difficulty = document.getElementById('difficulty').value;
      if (difficulty === 'easy') maxMistakes = 10;
      else if (difficulty === 'medium') maxMistakes = 7;
      else if (difficulty === 'hard') maxMistakes = 5;
      else maxMistakes = 3;
      document.querySelector('.max-mistakes').innerText = maxMistakes;
}

function startGame(difficulty) {
  mistakes = 0;
  document.querySelector('.mistakes').innerText = mistakes;

  document.getElementById('difficulty').value = difficulty;
  updateMaxMistakes();

  createGrid(); // this fills the `cells` array with DOM references

  let sud = generateBoard(); // generates full solved board

  let clues;
  if (difficulty === 'easy') clues = 40;
  else if (difficulty === 'medium') clues = 32;
  else if (difficulty === 'hard') clues = 25;
  else clues = 20;

  removeCells(sud, clues); // remove some cells to make it a puzzle

  fillGrid(sud); // now populate the grid

  //console.log(sud);
}



document.querySelectorAll('.num-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (selectedRow !== null && selectedCol !== null) {
      let val = btn.textContent;
      cells[selectedRow][selectedCol].value = val;
      if(val === "Clr"){
        cells[selectedRow][selectedCol].value = '';
        for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                  cells[r][c].classList.remove('conflict');
                }
              }
      }
      else if (!conflict(selectedRow, selectedCol, val)) {
        // conflict detected
        cells[selectedRow][selectedCol].style.color = "red";
        mistakes++;
        updateMaxMistakes();
        document.querySelector('.mistakes').innerText = mistakes;

        if (mistakes >= maxMistakes) {
          Swal.fire({
            title: 'Game Over',
            text: `You have reached the limit of maximum number of mistakes (${maxMistakes}).`,
            icon: 'error',
            confirmButtonText: 'Start New Game'
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
        }
      } else{
        cells[selectedRow][selectedCol].style.color = "blue";
      }
    }
  });
});

function conflict(row,col,val){
              for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                  cells[r][c].classList.remove('conflict');
                }
              }
    
              if (val < '1' || val > '9') return;
    
              let isValid = true;
    
              for (let i = 0; i < 9; i++) {
                if (i !== col && cells[row][i].value === val) {
                  cells[row][i].classList.add('conflict');
                  isValid = false;
                }
                if (i !== row && cells[i][col].value === val) {
                  cells[i][col].classList.add('conflict');
                  isValid = false;
                }
              }
    
              let startRow = row - (row % 3);
              let startCol = col - (col % 3);
              for (let r = startRow; r < startRow + 3; r++) {
                for (let c = startCol; c < startCol + 3; c++) {
                  if ((r !== row || c !== col) && cells[r][c].value === val) {
                    cells[r][c].classList.add('conflict');
                    isValid = false;
                  }
                }
              }
          return isValid;
}

document.querySelector('#hintButton').addEventListener('click',()=>{
  if(hints >= maxHints){
    Swal.fire('Hint Limit Reached', `You can only use up to ${maxHints} hints.`, 'warning');
    return;
  }
  if (selectedRow === null || selectedCol === null) {
    Swal.fire('Hint', 'Please select a cell first.', 'info');
    return;
  }

  if (cells[selectedRow][selectedCol].value !== '') {
    Swal.fire('Hint', 'Selected cell is already filled.', 'info');
    return;
  }

  let cn = solBoard[selectedRow][selectedCol];
  cells[selectedRow][selectedCol].value = cn.toString();

  cells[selectedRow][selectedCol].disabled = true;
  
  conflict(selectedRow, selectedCol, cn.toString());

  hints++;

  document.querySelector('.hints').innerHTML = hints;
});

let timerInterval;
let secondsPassed = 0;
let isRunning = false;

function startTimer() {
  if (isRunning) return; // Don't start multiple intervals
  isRunning = true;
  timerInterval = setInterval(() => {
    secondsPassed++;
    let minutes = Math.floor(secondsPassed / 60);
    let seconds = secondsPassed % 60;
    if (minutes <= 9) minutes = '0' + minutes;
    if (seconds <= 9) seconds = '0' + seconds;
    document.getElementById('timer').innerText = 'Time: ' + minutes + ':' + seconds;
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

document.querySelector('#pauseResumeBtn').addEventListener('click', () => {
  pauseTimer();
  document.querySelector('#resumeBtn').style.display = 'flex';
  document.querySelector('#resumeBtn').disabled = false;
  document.querySelector('#pauseResumeBtn').disabled = true;
  //document.querySelector('#resumeBtn').style. = '3px solid black';
});

document.querySelector('#resumeBtn').addEventListener('click', () => {
  startTimer();
  document.querySelector('#resumeBtn').disabled = true;
   document.querySelector('#pauseResumeBtn').disabled = false;
});

function checkWinCondition() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const inputValue = cells[i][j].value;
      const solutionValue = solBoard[i][j].toString();
      if (inputValue !== solBoard) {
        return false;
      }
    }
  }

  // All cells match the solution
  Swal.fire({
    title: 'Congratulations!',
    text: 'You have successfully completed the Sudoku puzzle!',
    icon: 'success',
    confirmButtonText: 'Play Again'
  }).then((result) => {
    if (result.isConfirmed) {
      location.reload();
    }
  });

  return true;
}
