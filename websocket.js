var players,
  playerLock = false;
var food,
  foodLock = false;
const ws = new WebSocket("ws://10.151.172.2:3000/snake");

var radius = 1000;
let canvas;

// Connection opened
ws.addEventListener("open", (event) => {
  console.log("Connected to server!");
  ws.send(JSON.stringify({ content: "GetFood", ID: "Spectator" }));
});

// Listen for messages
ws.addEventListener("message", (event) => {
  let data = JSON.parse(event.data);

  if (data.type == 2) {
    while (playerLock);
    playerLock = true;
    players = Object.values(JSON.parse(data.content));
    playerLock = false;
  }
  if (data.type == 3) {
    spectatingChef(data);
  }
  if (data.type == 4) {
    while (foodLock);
    foodLock = true;
    food = Object.values(JSON.parse(data.content));
    foodLock = false;
  }
});

function spectatingChef(data) {
  let newFood = Object.values(JSON.parse(data.content));

  while (foodLock);
  foodLock = true;

  for (let i = 0; i < newFood.length; i++) {
    food[newFood[i].index] = newFood[i].food;
  }

  food = Object.values(JSON.parse(data.content));

  foodLock = false;
}

function setup() {
  canvas = createCanvas(1900, 800);
  canvas.parent("canvasPlace");
}

function draw() {
  background(220);
  drawPlayers();
}

function drawPlayers() {
  ellipseMode(CENTER);

  for (let i = 0; i < food.length; i++) {
    let x = map(food[i].x, -radius, radius, 0, width);
    let y = map(food[i].y, -radius, radius, 0, height);

    ellipse(x, y, 1, 1);
  }

  for (let i = 0; i < players.length; i++) {
    let x = map(players[i].x, -radius, radius, 0, width);
    let y = map(players[i].y, -radius, radius, 0, height);

    push();
    fill(255, 0, 0);
    ellipse(x, y, 10, 10);
    pop();
  }
}
