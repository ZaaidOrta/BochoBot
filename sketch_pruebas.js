let theWorld;

function preload() {
  theWorld = loadImage("pista_final.png");
}

function setup() {
  createCanvas(640, 480);
  frameRate();

  // Inicializar el robot en la posición de "Start" en la pista.
  BochoAmarillo = new BochoBot(0, 20, 0, 40, theWorld); 
}

function draw() {
  // Dibujar la pista
  image(theWorld, 0, 0);

  // El robot sigue la línea y se dibuja
  BochoAmarillo.follow_line();
  BochoAmarillo.draw();
}

class BochoBot {
  constructor(x, y, angle, size, world) {
    this.x = x;
    this.y = y;
    this.angle = angle * PI / 180.0;
    this.radius = size;
    this.size_sensor = this.radius / 5;
    this.world = world;
    this.step_size = 2;  
    this.step_angle = PI / 30;  
    this.bucleCount = 0; // Contador para detectar bucles
    this.maxBucleCount = 10; // Limite de bucles antes de cambiar de estrategia
  }

  draw() {
    let status_sensor = this.read_sensors();  

    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Dibujar el cuerpo del robot
    noStroke();
    fill(236, 189, 64);
    circle(0, 0, this.radius);

    // Dibujar la cabeza
    fill(255, 204, 0);
    ellipse(0, -this.radius * 0.6, this.radius * 0.6, this.radius * 0.6);

    // Dibujar los ojos
    fill(0);
    let eyeRadius = this.size_sensor / 2;
    circle(-this.radius * 0.2, -this.radius * 0.7, eyeRadius);
    circle(this.radius * 0.2, -this.radius * 0.7, eyeRadius);

    // Dibujar los sensores
    fill(status_sensor[0] < 128 ? color(255, 0, 0) : color(200, 255, 0));
    circle(this.radius / 4, -this.radius / 4, this.size_sensor);

    fill(status_sensor[1] < 128 ? color(255, 0, 0) : color(200, 255, 0));
    circle(this.radius / 4, this.radius / 4, this.size_sensor);

    pop();
  }

  read_sensors() {
    let vsl = createVector(this.radius / 4, -this.radius / 4);
    vsl.rotate(this.angle);  
    let pixelColor = this.world.get(this.x + vsl.x, this.y + vsl.y);
    let s1 = pixelColor[0];

    let vsr = createVector(this.radius / 4, this.radius / 4);
    vsr.rotate(this.angle);  
    pixelColor = this.world.get(this.x + vsr.x, this.y + vsr.y);
    let s2 = pixelColor[0];

    return [s1, s2];
  }

  follow_line() {
    let [leftSensor, rightSensor] = this.read_sensors();

    if (leftSensor < 128 && rightSensor < 128) {
      // Ambos sensores detectan la línea, avanzar y resetear el contador de bucles
      this.move_forward();
      this.bucleCount = 0;
    } else if (leftSensor >= 128 && rightSensor < 128) {
      // Solo el sensor derecho detecta la línea, girar a la derecha
      this.rotate_right();
    } else if (leftSensor < 128 && rightSensor >= 128) {
      // Solo el sensor izquierdo detecta la línea, girar a la izquierda
      this.rotate_left();
    } else {
      // Si ambos sensores están fuera de la línea, intenta girar y aumenta el contador de bucles
      this.bucleCount++;
      if (this.bucleCount >= this.maxBucleCount) {
        // Si ha girado mucho sin salir del bucle, intenta una estrategia de búsqueda (por ejemplo, un giro amplio)
        this.search_mode();
      } else {
        // Sigue adelante
        this.move_forward();
      }
    }
  }

  move_forward() {
    let position = createVector(this.step_size, 0);
    position.rotate(this.angle);  
    this.x += position.x;
    this.y += position.y;
  }

  rotate_left() {
    this.angle -= this.step_angle;
  }

  rotate_right() {
    this.angle += this.step_angle;
  }

  search_mode() {
    // Estrategia de búsqueda: realizar un giro amplio
    this.rotate_right();
    this.move_forward();
  }
}
