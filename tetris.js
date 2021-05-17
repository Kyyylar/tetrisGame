const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.scale(20,20);

function draw()
{
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawShape(arena, {x:0, y:0});
    drawShape(player.shape, player.position);
}

function drawShape(shape, offset)
{
    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0)
            {
                ctx.fillStyle = 'red';
                ctx.fillRect(offset.x + x, offset.y + y, 1,1);
            }
        })
    })
}

function deleteRows()
{
    let k=0;
    let rowsDeleted = 0;
    for(let i=0; i<arena.length; i++)
    {
        k=0;
        for(let j=0; j<arena[i].length; j++)
        {
            if(arena[i][j] !== 0)
            {
                k++;
            }
        }
        if(k === arena[i].length)
        {
            arena.unshift(arena.splice(i, 1)[0].fill(0));
            rowsDeleted++;
        }
    }
    let value = 0;
    switch (rowsDeleted)
    {
        case 1: value = 100; break;
        case 2: value = 300; break;
        case 3: value = 500; break;
        case 4: value = 800; break;
        default: value = 0;
    }
    addPoints(value);
}

const tetrominoes = 
    {
        T: [
            [0,0,0],
            [1,1,1],
            [0,1,0],  ],
        I: [
            [0,0,2,0],
            [0,0,2,0],
            [0,0,2,0],
            [0,0,2,0], ],
        Z: [
            [3, 3, 0],
            [0, 3, 3],
            [0, 0, 0], ],
        L: [
            [0, 4, 0],
            [0, 4, 0],
            [0, 4, 4], ],
        J: [
            [0, 5, 0],
            [0, 5, 0],
            [5, 5, 0], ],
        S: [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0], ],
        O: [
            [7, 7],
            [7, 7],
        ]     
    }

let arena = [];
function fillArena(arena) {
    for(let i=0; i<20; i++)
    {
        arena[i] = [];
        arena[i].length = 10;
        arena[i].fill(0);
    }
}
const player = {
    position: {x: 0, y: 0},
    shape: null,
    score: 0,
}

function addPoints(value) 
{
    player.score += value;
    if(value > 0)
    {
        document.querySelector('h2.add').textContent = `+${value}`;
    }
    document.querySelector('#score div').textContent = `${player.score}`;
}


function connect(player, arena)
{
    player.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0)
            {
                arena[player.position.y + y][player.position.x + x] = value;
            }
        })
    })
}

function collision(arena, player)
{
    for(let i=0; i<player.shape.length; i++)
    {
        for(let j=0; j<player.shape[i].length; j++)
        {
            if(player.shape[i][j] !== 0 && (arena[i + player.position.y] && arena[i + player.position.y][j + player.position.x]) !== 0)
            {
                return true;
            }
        }
    }
    return false;
}

function rotate(shape)
{
    for(let y=0; y<shape.length; y++)
    {
        for(let x=0; x<y; x++)
        {
            [
                shape[y][x],shape[x][y],
            ] = [
                shape[x][y], shape[y][x],
            ]
        }
    }
    shape.forEach(row => row.reverse());
}
function playerRotate()
{
    const pos = player.position.x;
    let value = 1;
    rotate(player.shape);
    while(collision(arena, player))
    {
        player.position.x+=value;
        value = -(value += (value > 0 ? 1 : -1));
        if(value > player.shape[0].length)
        {
            rotate(player.shape);
            player.position.x = pos;
            return;
        }
    }
}

function resetPlayer() 
{
    player.shape = Object.values(tetrominoes)[Math.floor(Math.random() * Object.values(tetrominoes).length)];
    player.position.y=0;
    player.position.x = Math.floor(arena[0].length/2) - Math.floor(player.shape[0].length/2);
    if(collision(arena, player))
    {
        fillArena(arena);
        player.score = 0;
        addPoints(0);
        document.querySelector('h2.add').textContent = `+0`;
    }
}

function playerDrop()
{
    player.position.y++;
    if(collision(arena, player))
    {
        player.position.y--;
        connect(player, arena);
        resetPlayer();
        deleteRows();
    }
    dropCounter = 0;
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if(dropCounter > dropInterval)
    {
        playerDrop();
        dropCounter = 0;
    }
    draw();
    requestAnimationFrame(update);
}

function playerMove(dir)
{
        player.position.x+=dir;
        if(collision(arena, player))
        {
            player.position.x-=dir;
        }
}
function handleKey(e)
{
    if(e.keyCode === 37)
    {
        playerMove(-1);
    }
    else if(e.keyCode === 39)
    {
        playerMove(1);
    }
    else if(e.keyCode === 40)
    {
        playerDrop();
    }
    else if(e.keyCode === 38)
    {
        playerRotate();
    }
}
fillArena(arena);
resetPlayer();
update();

document.addEventListener('keydown', handleKey);