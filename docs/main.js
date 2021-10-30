let mainMenu = document.getElementById('main-menu');
const pauseBox = document.getElementById('pause-box');
let playBtn = document.getElementById('play');
let playback = document.getElementById('svg-play');
let game = document.querySelector('.game');
const choiceBox = document.querySelector(".choice-box");
const noteBtn = document.getElementById('notes');
const colorBtn = document.getElementById('color');
const timedisplay = document.getElementById('time');
const gamePad = document.getElementById('gamepad')
const gameMenu = document.getElementById('game-menu');
const gameMenuExitBtn = document.getElementById('game-menu-exit-btn');
const restartBtn = document.getElementById('restart');
const back = document.getElementById('back');
const newGame = document.getElementById('new-game');
const diffBox = document.getElementById('diff-box');
const level = document.getElementById('level'); 
const win = document.getElementById('win'); 
const winBtn = document.getElementById('win-btn');
// const choiceColorBox = document.querySelector(".choice-color-box");

let mainbw = mainBox.clientWidth; 
mainBox.style.width = mainbw - (5 * 9); 

let finished = false; 
let toggleColor = false;

let difficulties = [
    {level:"Very Easy", grade: 55}, 
    {level:'Easy', grade: 45}, 
    {level:'Intermediate', grade: 35}, 
    {level:'Hard', grade: 25}, 
    {level:'Very Hard', grade:15}
];

let difficulty = difficulties[0].grade;
level.textContent = difficulties[0].level;
let moveList = [];

let selectedX, selectedY;
let groupColor = 'rgb(169, 213, 247)';
let selectedColor = 'rgb(42, 161, 252)';
const highlightBtn = 'rgb(131, 45, 45)';
const normalBtnColor = 'rgb(71, 71, 126)';
let noteMode = false;
let pause = false;

class Node {
    constructor(x, y, parent, number, notes, background, border){
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.child  = null;
        this.number = number;
        this.notes = [...notes];
        this.background = background;
        this.border = border;
    }
}

let currentNode = null;

function addNodes(x, y){
    target = listBox[x][y]
    let number = target.number;
    let bg = target.background;
    let border = target.border;
    let notes = target.notes;

    if(currentNode == null){
        currentNode = new Node(x, y, null, number, notes, bg, border);
    } else {
        next = new Node(x, y, currentNode, number, notes, bg, border);
        currentNode.child = next;
        currentNode = next;
    }
}

function doCurrentNode(){
    selectedX = currentNode.x;
    selectedY = currentNode.y;

    resetBacground();
    target = listBox[currentNode.x][currentNode.y];
    target.number = currentNode.number;
    target.background = currentNode.background;
    target.border = currentNode.border;
    // target.notes = currentNode.notes;

    highlightGroup(currentNode.x, currentNode.y);
    highlightSame(currentNode.x, currentNode.y);
    target.cell.style.background = currentNode.background;

    target.cell.style.border = currentNode.border;
    createSubGrid();

    target.number != 0 ? target.display.textContent = target.number : target.display.textContent = '';
    const children = target.cell.childNodes;
    for(let i=0; i<9; i++){
        children[i].textContent = currentNode.notes[i];
    }
}

function undo(){
    if(currentNode.parent != null){
        let par = currentNode.parent;
        currentNode = par;
        doCurrentNode(); 
        check();
    }
}
function redo() {
    if(currentNode.child != null){
        let chi = currentNode.child
        currentNode = chi;
        doCurrentNode();
        check();
    }
}

let sec = 0;
let min = 0;
let hour = 0;

const timer = () => { 
    sec++;

    let s;
    let m;
    let h;
    if(sec > 59) {
        min++;
        sec=0;
    }
    if(min > 59) {
        hour++;
        min = 0;
    }

    sec < 10 ? s = `0${sec}` : s = sec;
    min < 10 ? m = `0${min}` : m = min;
    hour < 10 ? h = `0${hour}` : h = hour;
    timedisplay.textContent = `${h}:${m}:${s}`;
}

var startTime; 


function resetBacground(){
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            listBox[i][j].cell.style.background = 'white';
            listBox[i][j].background = 'white';
        }
    }
}

function findEmpty(){
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            if(listBox[i][j].number == 0){
                return [i, j];
            }
        }
    }
}

function solve(li){
    try{
        let i = li[0];
        let j = li[1];
        if(li){
            let target = listBox[i][j]
            let num = target.number + 1;
            target.number = num;
            if(num<=9){
                if(!isValid(i, j, num)){
                    solve([i, j]);
                }else{
                    solve(findEmpty());
                }
            }else{
                target.number = 0;
                if(j>0){
                    solve([i, j-1])
                }else{solve([i-1, 8])}
            }
        }else{
            return
        }
    }catch{return}
}

function generateSudocu() {
    targetList = [];

    init9 = []
    for(let i=0; i<9; i++){
        let init = Math.floor(Math.random()* 9) + 1;
        while(init9.includes(init)){
            init = Math.floor(Math.random()* 9) + 1;
        }
        init9.push(init);
        listBox[0][i].number = init;
    }

    solve(findEmpty());

    for(let i=0; i<difficulty; i++){
        let targetx = Math.floor(Math.random() * 9);
        let targety = Math.floor(Math.random() * 9);
        while(targetList.includes(`${targetx}${targety}`)){
            targetx = Math.floor(Math.random() * 9);
            targety = Math.floor(Math.random() * 9);
        }
        listBox[targetx][targety].locked = true;

        targetList.push(`${targetx}${targety}`)
    }
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            if(!listBox[i][j].locked){
                listBox[i][j].number = 0;
                listBox[i][j].display.textContent = '';
            }
            else {
                listBox[i][j].display.textContent = listBox[i][j].number;
            }
            listBox[i][j].cell.style.bacground = 'white';

        }
    }
}

generateSudocu();

const restart = () => {
    hour = 0;
    min = 0;
    sec = 0;
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            listBox[i][j].number = 0;
            listBox[i][j].locked = false;
            listBox[i][j].notes = ['', '', '', '', '', '', '', '', ''];
            listBox[i][j].background = 'white';
            listBox[i][j].border = 'solid 1px grey';


            listBox[i][j].cell.style.background = 'white';
            listBox[i][j].display.style.color = 'black';
        }
    }
    generateSudocu()
    createSubGrid()
}
function highlightGroup(x, y) {
    let xstart = (y<=2) ? 0 : (y>2 && y<=5) ? 3 : 6;
    let ystart = (x<=2) ? 0 : (x>2 && x<=5) ? 3 : 6;
    // console.log(xstart, ystart);

    for(let i=0; i<9; i++){
        if(i!=y){
            listBox[x][i].cell.style.background = groupColor;
            listBox[x][i].background = groupColor;
        }
    }
    for(let i=0; i<9; i++){
        if(i!=x){
            listBox[i][y].cell.style.background = groupColor;
            listBox[i][y].background = groupColor;
        }
    }

    for(let i=ystart; i<3 + ystart; i++){
        for(let j=xstart; j<3 + xstart; j++){
            if(x!=i && y!=j){
                listBox[i][j].cell.style.background = groupColor;
                listBox[i][j].background = groupColor;
            }
        }
    }
}

function highlightSame(x, y){
    let model = listBox[x][y].number;
    if(model!=0){
        for(let i=0; i<9; i++){
            for(let j=0; j<9; j++){
                if(listBox[i][j].number == model){
                    if(i!=x && j!=y){
                        listBox[i][j].cell.style.background = 'grey';
                        listBox[i][j].background = 'grey';

                    }
                }
            }
        }
    }
}


for(let i=0; i<9; i++){
    for(let j=0; j<9; j++){
        let target = listBox[i][j]

        target.cell.addEventListener('click', () => {
            if(!pause){
                resetBacground();
                target.cell.style.background = selectedColor;
                target.background = selectedColor;
                highlightGroup(i, j);
                highlightSame(i,j);
                selectedX = i;
                selectedY = j;

                addNodes(i, j);
            }
        });

    }
    document.getElementById(`${i+1}`).addEventListener('click', () => {
        if(!pause){

            let target = listBox[selectedX][selectedY];
            if(!toggleColor){
                if(!target.locked){
                    if(!noteMode){
                        const children = target.cell.childNodes;
                        children.forEach(element => {element.textContent = ''
                        });
                        if(target.number == (i + 1)){
                            target.number = 0;
                            target.display.textContent = ' ';
                            resetBacground();
                            highlightGroup(selectedX, selectedY);
                            target.cell.style.background = selectedColor;
                            addNodes(selectedX, selectedY);
                        }else{ 
                            resetBacground();
                            target.number = i + 1;
                            target.display.textContent = i + 1; 
                            target.cell.style.background = selectedColor; 
                            target.background = selectedColor;
                            highlightGroup(selectedX, selectedY);
                            highlightSame(selectedX, selectedY);
                            addNodes(selectedX, selectedY);
                        }
                        check();
                        if(checkIfFinished()){ 
                            finished = true; 
                            resetBacground();
                            win.style.display = 'grid';
                            pause = true; 
                            clearInterval(startTime);
                        }
                    }else{
                        target.display.textContent = '';
                        target.number = 0;
                        const children = target.cell.childNodes;
                        if(children[i].textContent == i + 1){
                            children[i].textContent = '';
                            target.notes[i] = '';
                            addNodes(selectedX, selectedY);
                        }else{
                            children[i].textContent = i + 1;
                            target.notes[i] = i + 1
                            addNodes(selectedX, selectedY);
                        }
                    }
                }
            }
            else {
                if(target.cell.style.border.split(' ')[2] == colorSelections[i]){
                    target.cell.style.border = "solid 1px grey";
                    target.border = "solid 1px grey";
                    createSubGrid();
                    addNodes(selectedX, selectedY);
                }else {
                    target.cell.style.border = `solid 3px ${colorSelections[i]}`;
                    target.border = `solid 3px ${colorSelections[i]}`;
                    addNodes(selectedX, selectedY);
                }

            }
        }
    })
}
 
function isValid(i, j, val) {
    let xstart = (j<=2) ? 0 : (j>2 && j<=5) ? 3 : 6;
    let ystart = (i<=2) ? 0 : (i>2 && i<=5) ? 3 : 6;
    for(let x = 0; x<9; x++){
        if(x!=j){
            if(listBox[i][x].number == val) {
                return false;
            }
        }
        if(x!=i){
            if(listBox[x][j].number == val){
                return false;
            }
        }
    }
    for(let k=ystart; k<3+ystart; k++){
        for(let l=xstart; l<3+xstart; l++){
            if(k!=i && l!=j){
                if(listBox[k][l].number == val){
                    return false;
                }
            }
        }
    }
    return true;
}


function check() {
    for(let i = 0; i<9; i++){
        for(let j=0; j<9; j++){
            if(!listBox[i][j].locked){
                if(isValid(i, j, listBox[i][j].number)){
                    listBox[i][j].display.style.color = 'blue';
                }
                else{
                    listBox[i][j].display.style.color = "red";
                }
            }
        }
    }
}
function checkIfFinished(){
    for(let i = 0; i<9; i++){
        for(let j=0; j<9; j++){
            if(!listBox[i][j].locked){
                if(!isValid(i, j, listBox[i][j].number) || listBox[i][j].number == 0){
                    return false;
                }
            }
        }
    }
    return true;
}

document.getElementById('undo').addEventListener('click', () => {
    if(!finished){   
        if(!pause){
            undo();
        }
    }
});
document.getElementById('redo').addEventListener('click', () => {
    if(!finished){ 
        if(!pause){
            redo();
        }
    }
})

noteBtn.addEventListener('click', () => {
    if(!pause){
        if(noteMode) {
            noteMode = false;
            noteBtn.style.color = normalBtnColor;
        }
        else{
            noteMode = true;
            noteBtn.style.color = highlightBtn;
            for(let i=0; i<9; i++){
                boxChildren[i].textContent = i+1;
                boxChildren[i].style.background = 'none';
            }
            toggleColor = false;
            colorBtn.style.color = normalBtnColor;
        }
    }
})

document.getElementById('clear').addEventListener('click', () => {
    if(!pause){

        target = listBox[selectedX][selectedY];
        if(toggleColor){
            target.cell.style.border = 'solid 1px grey';
            createSubGrid();
            addNodes(selectedX, selectedY);
        }else {
            target.display.textContent = '';
            target.number = 0;
            target.notes = ['', '', '', '', '', '', '', '', ''];
            const children = target.cell.childNodes;
            children.forEach(element => {
                element.textContent = '';
            });
            check();
            addNodes(selectedX, selectedY);
        }
    }
})

const boxChildren = choiceBox.children;
const colorSelections = ['red', 'violet', 'blue', 'aqua', 'green', 'lime', 'yellow', 'orange',  'grey'];
choiceBox.style.height = boxChildren[0].clientWidth + 2;

colorBtn.addEventListener('click', () => {
    if(!pause){
        if(toggleColor){
            for(let i=0; i<9; i++){
                boxChildren[i].textContent = i+1;
                boxChildren[i].style.background = 'none';
            }
            toggleColor = false;
            colorBtn.style.color = normalBtnColor;
        }else {
            let choiceHight = 0;
            for(let i=0; i<9; i++){
                boxChildren[i].textContent = ''; 
                boxChildren[i].style.background = colorSelections[i];
                boxChildren[i].style.borderRadius = "50%";
                choiceHight = boxChildren[i].clientWidth;
            }
            choiceBox.style.height = boxChildren[0].clientWidth + "px";
            toggleColor = true;
            colorBtn.style.color = highlightBtn;
            noteMode = false;
            noteBtn.style.color = normalBtnColor;
        }
    }
})

const resume = () => {
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            const children = listBox[i][j].cell.childNodes;
            for(let l=0; l<9; l++){
                children[l].textContent = listBox[i][j].notes[l];
            }

            if(listBox[i][j].number != 0){
                listBox[i][j].display.textContent = listBox[i][j].number;
            }
            listBox[i][j].cell.style.background = listBox[i][j].background;
            listBox[i][j].cell.style.border = listBox[i][j].border;
        }
    }
    createSubGrid();
    if(!finished){
        startTime = setInterval(timer, 1000);
    }
}

playBtn.addEventListener('click', () => {
    mainMenu.style.display = "none";
    startTime = setInterval(timer, 1000);
});



const pauseGame = () => {
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            const children = listBox[i][j].cell.childNodes;
            children.forEach(child => {
                child.textContent = '';
            })
            listBox[i][j].display.textContent = '';
            listBox[i][j].cell.style.background = 'white';
            listBox[i][j].cell.style.border = 'solid 1px grey';
            createSubGrid();
        }
    }
    clearInterval(startTime);
}


document.getElementById('pause').addEventListener('click', () => {
    if(!finished){
        if(pause){
            resume();
            pause = false;
            pauseBox.style.display = "none";


        }else {
            pauseGame()
            pause = true;
            pauseBox.style.display = "grid";
            console.log(gameMenu.style.display);
        } 
    }
})

playback.addEventListener('click', () => {
    pauseBox.style.display = "none";
    startTime = setInterval(timer, 1000);
    pause = false;
    resume();
});

gamePad.addEventListener('click', () => {
    pauseGame()
    gameMenu.style.display = "grid";
    pause = true;
    clearInterval(startTime);
})

gameMenuExitBtn.addEventListener('click', () => {
    if(!finished){
        pause = false;
    }
    resume();
    gameMenu.style.display = 'none';
})
document.addEventListener('resize', () => {
    choiceBox.style.height = boxChildren[0].clientWidth + 2;
})

restartBtn.addEventListener('click', () => {
    restart();
    gameMenu.style.display = 'none';
    startTime = setInterval(timer, 1000); 
    pause = false; 
    finished = false;
})

back.addEventListener('click', () => {
    if(!finished){
        pause = false;
    }
    resume();
    gameMenu.style.display = 'none';
})

newGame.addEventListener('click', () => {
    gameMenu.style.display = 'none';
    diffBox.style.display = 'grid'; 
})

document.getElementById('diff-exit-btn').addEventListener('click', () => {
    if(!finished){
        pause = false;
    } 
    resume();
    diffBox.style.display = 'none';
})

document.getElementById('diff-back').addEventListener('click', () => { 
    if(!finished){
        pause = false;
    }
    resume();
    diffBox.style.display = 'none'; 
})

const difBtns = document.getElementsByClassName('diff-btn');

for(let i=0; i<5; i++){
    difBtns[i].addEventListener('click', () => { 
        finished = false;
        pause = false;
        difficulty = difficulties[i].grade;
        level.textContent = difficulties[i].level;
        restart();
        resume();
        diffBox.style.display = 'none';
        startTime = setInterval(timer, 1000);
    })
}

level.addEventListener('click', () => {
    diffBox.style.display = 'grid';
    pauseGame()
    pause = true;
    clearInterval(startTime);
}) 

winBtn.addEventListener('click', () => {
    win.style.display = 'none';
})
