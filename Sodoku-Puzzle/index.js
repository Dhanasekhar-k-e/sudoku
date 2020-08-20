let arr=[[ 1,2,3],
        [4,5,6],
        [7,8,9]]

function inputRowData(arr,row){
        return arr[row]
}
function inputColData(arr,col){
    var column = []
    for(var i = 0; i < 3; i++){
        column.push(arr[i][col])
    }
    return column
}
function sum(arr){
    var total = 0
    for(var i = 0 ; i < 3; i++){
        total += arr[i]
    }
    return total
}
function column(arr){
    
}
// console.log(inputRowData(arr,0))
// console.log(inputColData(arr,1))
console.log(sum(arr[0]))




// 1 2 3
// 4 5 6
// 7 8 9