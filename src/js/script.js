let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = 'cross';


const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
  [0, 4, 8], [2, 4, 6], // diagonal
]

function init() {
    render();
}

function render() {
    const content = document.getElementById('content');

    let tableHTML = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = "";
            if (fields[index] === 'circle') {
                symbol = generateCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateCrossSVG();
            }
            tableHTML += `<td onclick="fillField(this, ${index})">${symbol}</td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    content.innerHTML = tableHTML;
}

function fillField(cell, index) {
    if (fields[index] === null) {
      fields[index] = currentPlayer;
      cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
      cell.onclick = null;
      currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';

      if (isGameFinished()) {
        const winCombination = checkWin();
        drawWinningLine(winCombination);
      }
  }
}

function isGameFinished() {
  return fields.every((field) => field !== null) || checkWin() !== null;
}

function checkWin() {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (fields[a] === fields[b] && fields[b] === fields[c] && fields[a] !== null) {
            return winningCombinations[i]
        }
    }
    return null;
}

function resetGame() {
  fields = [null, null, null, null, null, null, null, null, null];
  render(); 
}

function drawWinningLine(combination) {
  const lineColor = '#ffffff';
  const lineWidth = 5;

  const startCell = document.querySelectorAll(`td`)[combination[0]];
  const endCell = document.querySelectorAll(`td`)[combination[2]];
  const startRect = startCell.getBoundingClientRect();
  const endRect = endCell.getBoundingClientRect();

  const contentRect = document.getElementById('content').getBoundingClientRect();

  const lineLength = Math.sqrt(
      Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
  );
  const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

  const line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.width = `${lineLength}px`;
  line.style.height = `${lineWidth}px`;
  line.style.backgroundColor = lineColor;
  line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
  line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
  line.style.transform = `rotate(${lineAngle}rad)`;
  line.style.transformOrigin = `top left`;
  document.getElementById('content').appendChild(line);
}

function generateCircleSVG() {
    const color = '#00B0EF';
    const width = 70;
    const height = 70;
    return `<svg width="${width}" height="${height}">
              <circle cx="35" cy="35" r="30" stroke="${color}" stroke-width="5" fill="none">
                <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.2s" fill="freeze" />
              </circle>
            </svg>`;
}

function generateCrossSVG() {
    const color = '#FFC000';
    const width = 70;
    const height = 70;
    const svgHtml = `
      <svg width="${width}" height="${height}">
        <line x1="0" y1="0" x2="${width}" y2="${height}"
          stroke="${color}" stroke-width="5">
          <animate attributeName="x2" values="0; ${width}" dur="200ms" />
          <animate attributeName="y2" values="0; ${height}" dur="200ms" />
        </line>
        <line x1="${width}" y1="0" x2="0" y2="${height}"
          stroke="${color}" stroke-width="5">
          <animate attributeName="x2" values="${width}; 0" dur="200ms" />
          <animate attributeName="y2" values="0; ${height}" dur="200ms" />
        </line>
      </svg>
    `;
    return svgHtml;
}