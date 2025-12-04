from PIL import Image, ImageFilter
import matplotlib.pyplot as plt

# 1. Cargar la imagen (debe estar en el mismo directorio del script)
imagen = Image.open("animal_en_extincion.jpg")

# 2. Mostrar la imagen original
plt.figure(figsize=(12, 4))

plt.subplot(1, 3, 1)
plt.imshow(imagen)
plt.axis("off")
plt.title("Imagen original (RGB)")

# 3. Suavizado / Desenfoque
suavizada = imagen.filter(ImageFilter.BLUR)
# También podrías usar: ImageFilter.GaussianBlur(3)

plt.subplot(1, 3, 2)
plt.imshow(suavizada)
plt.axis("off")
plt.title("Suavizada / Blur")

# 4. Realce de bordes
bordes = imagen.filter(ImageFilter.FIND_EDGES)
# Alternativa más suave: ImageFilter.EDGE_ENHANCE

plt.subplot(1, 3, 3)
plt.imshow(bordes, cmap="gray")
plt.axis("off")
plt.title("Realce de Bordes")

plt.show()
