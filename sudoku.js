var table;
var puzzle = []
var solution = []
var remaining = [9, 9, 9, 9, 9, 9, 9, 9, 9]

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
