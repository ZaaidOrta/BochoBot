let theWorld;

// Cargar la imagen de la pista.
function preload() {
  theWorld = loadImage("pista_prueba.png");
}

function setup() {
  // Configurar el ancho y alto del lienzo
  createCanvas(640, 480);
  frameRate(30);  // Aumenté el frameRate para una respuesta más fluida

  // Dibujar el mundo y escalarlo para cubrir el lienzo.
  image(theWorld, 0, 0);
  
  // Ajustar las coordenadas iniciales del robot en la posición "Start"
  // Ajusta estas coordenadas para que coincidan con la posición "Start" en la pista.
  BochoAmarillo = new BochoBot(0, 20, 0, 40, theWorld); 
}

function draw() {
  // Dibujar el mundo y escalarlo para cubrir el lienzo.
  image(theWorld, 0, 0);
  
  BochoAmarillo.follow_line();  // Ahora sigue la línea
  BochoAmarillo.draw();
}

class BochoBot {
  
  constructor(x, y, angle, size, world) {
    // Este código se ejecuta una vez cuando se crea una instancia.
    this.x = x;
    this.y = y;
    this.angle = angle * PI / 180.0;

    this.radius = size;
    this.size_sensor = this.radius / 5;

    this.world = world;
    this.step_size = 5; 
    this.step_angle = PI / 10;
  }
  
  draw() {
    let status_sensor = this.read_sensors();  

    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Dibujar el cuerpo del robot
    noStroke();
    fill(236, 189, 64); // Color amarillo para el cuerpo
    circle(0, 0, this.radius);

    // Dibujar la cabeza
    fill(255, 204, 0); // Amarillo más claro para la cabeza
    ellipse(0, -this.radius * 0.6, this.radius * 0.6, this.radius * 0.6);

    // Dibujar los ojos
    fill(0); // Color negro para los ojos
    let eyeRadius = this.size_sensor / 2;  // Ajustar el tamaño de los ojos si es necesario
    circle(-this.radius * 0.2, -this.radius * 0.7, eyeRadius);
    circle(this.radius * 0.2, -this.radius * 0.7, eyeRadius);

    // Dibujar el estado de los sensores
    noStroke();
    fill(status_sensor[0] == 0 ? color(255, 0, 0) : color(200, 255, 0));
    circle(this.radius / 4, -this.radius / 4, this.size_sensor);

    fill(status_sensor[1] == 0 ? color(255, 0, 0) : color(200, 255, 0));
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

    if (leftSensor == 0 && rightSensor == 0) {
      this.move_forward();
    } else if (leftSensor != 0 && rightSensor == 0) {
      this.rotate_right();
    } else if (leftSensor == 0 && rightSensor != 0) {
      this.rotate_left();
    } else {
      this.move_forward();
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
}