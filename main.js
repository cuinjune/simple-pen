let maxSpeed = 5;
let maxRad = 2;
let minRad = 0.5;
let touched = false;
let lastPosX = 0;
let lastPosY = 0;
let lastRad = maxRad;
let points = [];
let timestamp = null;
let lastMouseX = null;
let lastMouseY = null;

function map(value, inputMin, inputMax, outputMin, outputMax, clamp) {
  let outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
  if (clamp) {
    if (outputMax < outputMin) {
      if (outVal < outputMax) outVal = outputMax;
      else if (outVal > outputMin) outVal = outputMin;
    } else {
      if (outVal > outputMax) outVal = outputMax;
      else if (outVal < outputMin) outVal = outputMin;
    }
  }
  return outVal;
}

window.onload = function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const canvas = document.getElementById("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const button1 = document.getElementById("button1");
  button1.addEventListener("click", function (e) {
    maxSpeed = 5;
    maxRad = 2;
    minRad = 0.5;
  });
  const button2 = document.getElementById("button2");
  button2.addEventListener("click", function (e) {
    maxSpeed = 2;
    maxRad = 8;
    minRad = 0.5;
  });
  const button3 = document.getElementById("button3");
  button3.addEventListener("click", function (e) {
    maxSpeed = 5;
    maxRad = 0.5;
    minRad = 8;
  });
  const button4 = document.getElementById("button4");
  button4.addEventListener("click", function (e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  function drawLine(x1, y1, x2, y2, r1, r2) {
    // calculate direction vector of point 1 and 2
    const directionVectorX = x2 - x1;
    const directionVectorY = y2 - y1;
    // calculate angle of perpendicular vector
    const perpendicularVectorAngle = Math.atan2(directionVectorY, directionVectorX) + Math.PI / 2;
    // construct shape
    const path = new Path2D();
    path.arc(x1, y1, r1, perpendicularVectorAngle, perpendicularVectorAngle + Math.PI);
    path.arc(x2, y2, r2, perpendicularVectorAngle + Math.PI, perpendicularVectorAngle);
    path.closePath();
    return path;
  }

  const performAnimation = () => {
    requestAnimationFrame(performAnimation);
    for (let i = 0; i < points.length; i++) {
      const line = drawLine(points[i].x1, points[i].y1, points[i].x2, points[i].y2, points[i].r1, points[i].r2);
      ctx.fill(line);
    }
    points = [];
  }
  requestAnimationFrame(performAnimation);


  canvas.addEventListener("touchstart", function (e) {
    console.log("asd", e.touches[0]);
    touched = true;
    lastPosX = e.touches[0].clientX;
    lastPosY = e.touches[0].clientY;
    points.push({ x1: lastPosX, y1: lastPosY, x2: lastPosX, y2: lastPosY, r1: maxRad, r2: maxRad });
  });

  canvas.addEventListener("touchmove", function (e) {
    if (touched) {
      if (timestamp === null) {
        timestamp = Date.now();
        lastMouseX = e.touches[0].screenX;
        lastMouseY = e.touches[0].screenY;
        return;
      }
      const now = Date.now();
      const dt = now - timestamp;
      const dx = e.touches[0].screenX - lastMouseX;
      const dy = e.touches[0].screenY - lastMouseY;
      const movementX = Math.abs(dx / dt);
      const movementY = Math.abs(dy / dt);
      timestamp = now;
      lastMouseX = e.touches[0].screenX;
      lastMouseY = e.touches[0].screenY;

      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;
      const speed = Math.abs(movementX) + Math.abs(movementY);
      console.log(speed);
      const rad = map(speed, 0, maxSpeed, maxRad, minRad, true);
      points.push({ x1: lastPosX, y1: lastPosY, x2: x, y2: y, r1: lastRad, r2: rad });
      lastRad = rad;
      lastPosX = x;
      lastPosY = y;
    }
  });

  canvas.addEventListener("touchend", function (e) {
    touched = false;
  });

  canvas.addEventListener("touchcancel", function (e) {
  });

  canvas.addEventListener("mousedown", function (e) {
    touched = true;
    lastPosX = e.clientX;
    lastPosY = e.clientY;
    points.push({ x1: lastPosX, y1: lastPosY, x2: lastPosX, y2: lastPosY, r1: maxRad, r2: maxRad });
  });

  canvas.addEventListener("mousemove", function (e) {
    if (touched) {
      if (timestamp === null) {
        timestamp = Date.now();
        lastMouseX = e.screenX;
        lastMouseY = e.screenY;
        return;
      }
      const now = Date.now();
      const dt = now - timestamp;
      const dx = e.screenX - lastMouseX;
      const dy = e.screenY - lastMouseY;
      const movementX = Math.abs(dx / dt);
      const movementY = Math.abs(dy / dt);
      timestamp = now;
      lastMouseX = e.screenX;
      lastMouseY = e.screenY;

      let x = e.clientX;
      let y = e.clientY;
      const speed = Math.abs(movementX) + Math.abs(movementY);
      console.log(speed);
      const rad = map(speed, 0, maxSpeed, maxRad, minRad, true);
      points.push({ x1: lastPosX, y1: lastPosY, x2: x, y2: y, r1: lastRad, r2: rad });
      lastRad = rad;
      lastPosX = x;
      lastPosY = y;
    }
  });

  canvas.addEventListener("mouseup", function (e) {
    touched = false;
  });

  canvas.addEventListener("mouseout", function (e) {
  });
}