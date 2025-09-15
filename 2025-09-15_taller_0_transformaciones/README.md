# Taller 0 - Transformaciones Geométricas

Este taller implementa transformaciones geométricas básicas (traslación, rotación y escalado) sobre una figura en forma de casa, primero en **Python (Jupyter/Colab)** y de forma equivalente en **Unity**.

---

## Parte 1: Python

### Breve explicación de cada implementación
1. **Traslación**  
   - Se construye una matriz homogénea 3x3 que desplaza todos los puntos de la figura.  
   - Parámetros: `dx`, `dy`.  

2. **Rotación**  
   - Se construye una matriz homogénea 3x3 para girar la figura un ángulo `θ` respecto al origen.  
   - Parámetro: `angulo` (en grados).  

3. **Escalado**  
   - Se construye una matriz homogénea 3x3 que multiplica los puntos por factores `sx` y `sy`.  
   - Parámetros: `sx`, `sy`.  

4. **Animación**  
   - Se usa `matplotlib.animation.FuncAnimation` para interpolar los valores de traslación, rotación y escala en cada frame.  

### Capturas de pantalla / GIFs (OBLIGATORIO)
- Imagen 1: Casa original.  
- Imagen 2: Traslación aplicada.  
- Imagen 3: Rotación aplicada.  
- Imagen 4: Escalado aplicado.  
- GIF: Animación combinada.  

*(Subir los archivos PNG/GIF al repositorio y enlazarlos aquí).*

### Código relevante
El código está en el archivo [`taller_0.py`](./taller_0.py) y en el notebook [`Taller_0.ipynb`](./Taller_0.ipynb).  

Ejemplo de traslación en Python:
```python
def traslacion(x, y, dx, dy):
    T = np.array([[1, 0, dx],
                  [0, 1, dy],
                  [0, 0, 1]])
    puntos = np.column_stack([x, y, np.ones(len(x))])
    puntos_t = (T @ puntos.T).T
    return puntos_t[:,0], puntos_t[:,1]
