const wordData = [
    { word: "RAÇÃO", row: 1, col: 4, dir: "h", clue: "1. Principal alimento dos pets." },
    { word: "COLEIRA", row: 1, col: 4, dir: "v", clue: "2. Usado no pescoço para passear." },
    { word: "SACHÊ", row: 3, col: 2, dir: "h", clue: "3. Alimento úmido muito amado por gatos." },
    { word: "OSSINHO", row: 5, col: 1, dir: "h", clue: "4. Petisco clássico para cães roerem." },
    { word: "AREIA", row: 3, col: 3, dir: "v", clue: "5. Onde os gatos fazem suas necessidades." },
    { word: "XAMPU", row: 7, col: 4, dir: "h", clue: "6. Produto para dar banho e deixar cheiroso." },
    { word: "AQUÁRIO", row: 1, col: 10, dir: "v", clue: "7. Casa dos peixes ornamentais." },
    { word: "GATO", row: 10, col: 2, dir: "h", clue: "8. Animal que mia e adora caixas." },
    { word: "PÁSSARO", row: 5, col: 7, dir: "v", clue: "9. Animal de penas que vive em viveiros." },
    { word: "BRINQUEDO", row: 11, col: 3, dir: "h", clue: "10. Diversão para o pet gastar energia." }
];

function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    renderGrid();
    renderClues();
}

function renderGrid() {
    const grid = document.getElementById('crossword-grid');
    grid.innerHTML = '';
    const cells = Array(12).fill().map(() => Array(12).fill(null));

    // Preenche matriz logicamente
    wordData.forEach((data, index) => {
        for (let i = 0; i < data.word.length; i++) {
            let r = data.row + (data.dir === 'v' ? i : 0);
            let c = data.col + (data.dir === 'h' ? i : 0);
            if (!cells[r][c]) cells[r][c] = { char: data.word[i], num: i === 0 ? (index + 1) : null };
        }
    });

    // Gera elementos HTML
    for (let r = 0; r < 12; r++) {
        for (let c = 0; c < 12; c++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell' + (cells[r][c] ? '' : ' empty');
            
            if (cells[r][c]) {
                if (cells[r][c].num) {
                    const numSpan = document.createElement('span');
                    numSpan.className = 'clue-number';
                    numSpan.innerText = cells[r][c].num;
                    cellDiv.appendChild(numSpan);
                }
                const input = document.createElement('input');
                input.maxLength = 1;
                input.dataset.answer = cells[r][c].char.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
                
                // Pular para próximo campo ao digitar
                input.addEventListener('input', function() {
                    if (this.value.length === 1) {
                        const allInputs = Array.from(document.querySelectorAll('.cell:not(.empty) input'));
                        const next = allInputs[allInputs.indexOf(this) + 1];
                        if (next) next.focus();
                    }
                });

                cellDiv.appendChild(input);
            } else {
                const input = document.createElement('input');
                input.disabled = true;
                cellDiv.appendChild(input);
            }
            grid.appendChild(cellDiv);
        }
    }
}

function renderClues() {
    const list = document.getElementById('clues-list');
    list.innerHTML = '';
    wordData.forEach(data => {
        const p = document.createElement('p');
        p.innerText = data.clue;
        list.appendChild(p);
    });
}

function checkWin() {
    const inputs = document.querySelectorAll('.cell:not(.empty) input');
    let winCount = 0;

    inputs.forEach(input => {
        const userVal = input.value.toUpperCase();
        if (userVal === input.dataset.answer) {
            input.style.backgroundColor = "var(--correct)";
            winCount++;
        } else if (userVal !== "") {
            input.style.backgroundColor = "var(--wrong)";
        }
    });

    if (winCount === inputs.length) {
        alert("🎉 Excelente! Você completou a cruzadinha Pet!");
    }
}