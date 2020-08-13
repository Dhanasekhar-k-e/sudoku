
var table;
var puzzle = [];
var solution = [];


var remaining = [9, 9, 9, 9, 9, 9, 9, 9, 9];

function newGame(difficulty) {

    var grid = getGridInit();
 
    var rows = grid;
    var cols = getColumns(grid);
    var blks = getBlocks(grid);

    var psNum = generatePossibleNumber(rows, cols, blks);

    solution = solveGrid(psNum, rows, true);

    for (var i in remaining)
        remaining[i] = 9;

    
    puzzle = makeItPuzzle(solution, difficulty);

    ViewPuzzle(puzzle);
    updateRemainingTable();
}

function getGridInit() {
    var rand = [];

    for (var i = 1; i <= 9; i++) {
        var row = Math.floor(Math.random() * 9);
        var col = Math.floor(Math.random() * 9);
        var accept = true;
        for (var j = 0; j < rand.length; j++) {
            if (rand[j][0] == i | (rand[j][1] == row & rand[j][2] == col)) {
                accept = false;
                i--;
                break;
            }
        }
        if (accept) {
            rand.push([i, row, col]);
        }
    }

    var result = [];
    for (var i = 0; i < 9; i++) {
        var row = "000000000";
        result.push(row);
    }

    for (var i = 0; i < rand.length; i++) {
        result[rand[i][1]] = replaceCharAt(result[rand[i][1]], rand[i][2], rand[i][0]);
    }

    return result;
}

function getColumns(grid) {
    var result = ["", "", "", "", "", "", "", "", ""];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++)
            result[j] += grid[i][j];
    }
    return result;
}

function getBlocks(grid) {
    var result = ["", "", "", "", "", "", "", "", ""];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++)
            result[Math.floor(i / 3) * 3 + Math.floor(j / 3)] += grid[i][j];
    }
    return result;
}


function replaceCharAt(string, index, char) {
    if (index > string.length - 1) return string;
    return string.substr(0, index) + char + string.substr(index + 1);
}

function generatePossibleNumber(rows, columns, blocks) {
    var psb = [];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            psb[i * 9 + j] = "";
            if (rows[i][j] != 0) {
                psb[i * 9 + j] += rows[i][j];
            } else {
                for (var k = '1'; k <= '9'; k++) {
                    if (!rows[i].includes(k))
                        if (!columns[j].includes(k))
                            if (!blocks[Math.floor(i / 3) * 3 + Math.floor(j / 3)].includes(k))
                                psb[i * 9 + j] += k;
                }
            }
        }
    }
    return psb;
}

function solveGrid(possibleNumber, rows, startFromZero) {
    var solution = [];
    var result = nextStep(0, possibleNumber, rows, solution, startFromZero);
    if (result == 1)
        return solution;
}

function nextStep(level, possibleNumber, rows, solution, startFromZero) {
    
    var x = possibleNumber.slice(level * 9, (level + 1) * 9);
    var y = generatePossibleRows(x);
    if (y.length == 0)
        return 0;

    var start = startFromZero ? 0 : y.length - 1;
    var stop = startFromZero ? y.length - 1 : 0;
    var step = startFromZero ? 1 : -1;
    var condition = startFromZero ? (start <= stop) : (start >= stop);

    for (var num = start; condition; num += step) {
        var condition = startFromZero ? (num + step <= stop) : (num + step >= stop);
        for (var i = level + 1; i < 9; i++)
            solution[i] = rows[i];
        solution[level] = y[num];
        if (level < 8) {
            var cols = getColumns(solution);
            var blocks = getBlocks(solution);
            var poss = generatePossibleNumber(solution, cols, blocks);
            if (nextStep(level + 1, poss, rows, solution, startFromZero) == 1)
                return 1;
        }
        if (level == 8)
            return 1;
    }
    return -1;
}

function generatePossibleRows(possibleNumber) {
    var result = [];

    function step(level, PossibleRow) {
        if (level == 9) {
            result.push(PossibleRow);
            return;
        }

        for (var i in possibleNumber[level]) {
            if (PossibleRow.includes(possibleNumber[level][i]))
                continue;
            step(level + 1, PossibleRow + possibleNumber[level][i]);
        }
    }

    step(0, "");

    return result;
}

function makeItPuzzle(grid, difficulty) {
    if (!(difficulty < 3 && difficulty > -1))
        difficulty = 13;
    var remainedValues = 81;
    var puzzle = grid.slice(0);
    function clearValue(grid, x, y, remainedValues) {
        function getSymmetry(x, y) {
            var symX = 8 - x;  
            var symY = 8 - y;
            return [symX, symY];
        }
        var sym = getSymmetry(x, y);
        if (grid[y][x] != 0) {
            grid[y] = replaceCharAt(grid[y], x, "0")
            remainedValues--;
            if (x != sym[0] && y != sym[1]) {
                grid[sym[1]] = replaceCharAt(grid[sym[1]], sym[0], "0")
                remainedValues--;
            }
        }
        return remainedValues;
    }
    while (remainedValues > (difficulty * 5 + 20)) {
        var x = Math.floor(Math.random() * 9);
        var y = Math.floor(Math.random() * 9);
        remainedValues = clearValue(puzzle, x, y, remainedValues);
    }
    return puzzle;
}

function ViewPuzzle(grid) {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            var input = table.rows[i].cells[j].getElementsByTagName('input')[0];
            addClassToCell(table.rows[i].cells[j].getElementsByTagName('input')[0]);
            if (grid[i][j] == "0") {
                input.disabled = false;
                input.value = "";
            }
            else {
                input.disabled = true;
                input.value = grid[i][j];
                remaining[grid[i][j] - 1]--;
            }
        }
    }
}

function readInput() {
    var result = [];
    for (var i = 0; i < 9; i++) {
        result.push("");
        for (var j = 0; j < 9; j++) {
            var input = table.rows[i].cells[j].getElementsByTagName('input')[0];
            if (input.value == "" || input.value.length > 1 || input.value == "0") {
                input.value = ""
                result[i] += "0";
            }
            else
                result[i] += input.value;
        }
    }
    return result;
}

function checkValue(value, row, column, block, defaultValue, correctValue) {
    if (value === "" || value === '0')
        return 0;
    if (!(value > '0' && value < ':'))
        return 4;
    if (value === defaultValue)
        return 0;
    if ((row.indexOf(value) != row.lastIndexOf(value))
        || (column.indexOf(value) != column.lastIndexOf(value))
        || (block.indexOf(value) != block.lastIndexOf(value))) {
        return 3;
    }
    if (value !== correctValue)
        return 2;
    return 1;
}

function addClassToCell(input, className) {
    input.classList.remove("right-cell");
    input.classList.remove("worning-cell");
    input.classList.remove("wrong-cell");

    if (className != undefined)
        input.classList.add(className);
}

function updateRemainingTable() {
    for (var i = 1; i < 10; i++) {
        var item = document.getElementById("remain-" + i);
        item.innerText = remaining[i - 1];
        item.classList.remove("red");
        item.classList.remove("gray");
        if (remaining[i - 1] === 0)
            item.classList.add("gray");
        else if (remaining[i - 1] < 0 || remaining[i - 1] > 9)
            item.classList.add("red");
    }
}


window.onload = function () {
    table = document.getElementById("puzzle-grid");
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var input = table.rows[i].cells[j].getElementsByTagName('input')[0];
            input.onchange = function () {
                addClassToCell(this);
                if (this.value > 0 && this.value < 10)
                    remaining[this.value - 1]--;
                if (this.oldvalue !== "") {
                    if (this.oldvalue > 0 && this.oldvalue < 10)
                        remaining[this.oldvalue - 1]++;
                }
                updateRemainingTable();
            };
            input.onfocus = function () {
                this.oldvalue = this.value;
            };
        }
    }
}

function startGameButtonClick() {
    document.getElementById("hide-box").style.display="none"
    var difficulties = document.getElementsByName('difficulty');
    var difficulty = 3;
    for (var i = 0; i < difficulties.length; i++) {
        if (difficulties[i].checked) {
            newGame(2 - i);
            difficulty = i;
            break;
        }
    }
    
}

function restartButtonClick() {
        ViewPuzzle(puzzle);
        updateRemainingTable();
}


function solvingButtonClick() {
        ViewPuzzle(solution);
        updateRemainingTable();
}


