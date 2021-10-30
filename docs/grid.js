

const gameBox = document.querySelector('.game');
const mainBox = document.querySelector('.main-box');
let box_width = mainBox.clientWidth / 9 ; 
listBox = [];


class Box {
    constructor(box, num) {
        this.cell = box
        this.number = 0;
        this.locked = false;
        this.display = num;
        this.bacground = "white";
        this.border = 'solid 1px grey';
        this.notes = ['', '', '', '', '', '', '', '', ''];
    }
}



let createGrid = () => {
    for(let i=0; i<9; i++){
        listBox[i] = []
        for(let j=0; j<9; j++){

            // creating box
            cell = document.createElement('div');
            cell.setAttribute('class', 'box');
            mainBox.appendChild(cell);

            for(let k=0; k<9; k++){
                smallCell = document.createElement('div');
                cell.appendChild(smallCell);
                // smallCell.textContent = k + 1;
            }

            // creating numbers
            num = document.createElement('p');
            num.setAttribute('class', "num")
            cell.appendChild(num);
            cell.style.bacground = 'white';

            bx = new Box(cell, num);
            listBox[i].push(bx);

            cell.style.width = box_width;
            cell.style.height = box_width;

            
        }
    }
}

function createSubGrid() {
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            if(j==2 || j == 5) {
                listBox[i][j].cell.style.borderRight = "black solid 3px";
            }
            if(i == 2 || i == 5){
                listBox[i][j].cell.style.borderBottom = "black solid 3px";
            }
        }
    }
}

createGrid();
createSubGrid();

window.addEventListener('resize', () => {
    // mainBox.width = 100 + "%";
    box_width = mainBox.clientWidth / 9;
    // console.log(box_width)
    
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            listBox[i][j].cell.style.width = box_width + "px";
            listBox[i][j].cell.style.height = box_width + "px";

        }
    }
})

