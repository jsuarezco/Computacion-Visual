void setup() {
  size(400, 400);
  background(255);
  fill(0, 150, 255);
  stroke(0);
}

void draw() {
  background(255);

  pushMatrix(); 
  // Animación circular usando frameCount
  float t = frameCount * 0.05;
  float x = width/2 + 100 * cos(t);
  float y = height/2 + 100 * sin(t);
  translate(x, y);

  // Rotación usando sin() para un efecto oscilante
  rotate(sin(t) * PI / 4);

  // Escalado pulsante usando sin()
  float s = 1 + 0.5 * sin(t * 2);
  scale(s);

  // Dibujar la elipse transformada
  ellipse(0, 0, 50, 30);
  popMatrix(); // restaurar estado para futuras figuras

  // Otra elipse estática para mostrar que las transformaciones están aisladas
  pushMatrix();
  translate(300, 300);
  ellipse(0, 0, 50, 30);
  popMatrix();
}
