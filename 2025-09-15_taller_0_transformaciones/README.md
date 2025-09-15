# Taller 0 - Transformaciones Geométricas con Matrices

Este proyecto implementa transformaciones geométricas (traslación,
rotación y escalado) aplicadas a una figura en forma de casa usando
**matrices de transformación homogéneas** en Python con `matplotlib` y
`numpy`.

## Contenido

1.  **Traslación**
    -   Se implementa una función que aplica una matriz de traslación a
        las coordenadas de la figura.\
    -   Parámetros ajustables: `tx`, `ty` para mover la figura.
2.  **Rotación**
    -   Se utiliza una matriz de rotación con ángulos en radianes.\
    -   Parámetro ajustable: `theta` (en grados).
3.  **Escalado**
    -   Se aplica una matriz de escala que permite agrandar o reducir la
        figura.\
    -   Parámetros ajustables: `sx`, `sy`.
4.  **Animación**
    -   Se genera un movimiento continuo de la figura usando bucles y
        `matplotlib.animation`.\
    -   Ejemplo: traslación progresiva hacia la derecha.

## Requisitos

-   Python 3.x\
-   Numpy\
-   Matplotlib

## Capturas / GIFs

*(Aquí debes pegar las capturas de pantalla o GIFs de tus animaciones
mostrando la casa moviéndose, rotando y escalando. Si no puedes subir
GIFs, usa imágenes secuenciales con diferentes estados de la
animación).*

## Uso

Ejecutar en Jupyter Notebook:

``` bash
jupyter notebook Taller_0.ipynb
```

y correr las celdas según la transformación que quieras probar.
