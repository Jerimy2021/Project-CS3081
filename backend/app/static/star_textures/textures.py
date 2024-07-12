from PIL import Image
import os

# Obtener la ruta absoluta del directorio actual
current_dir = os.getcwd()

# Carpeta donde están las texturas (relativa al directorio actual)
folder_name = 'origin'
folder_path = os.path.join(current_dir, folder_name)

# Obtener la lista de archivos en la carpeta
files = os.listdir(folder_path)

# Iterar sobre cada archivo
for file_name in files:
    # Verificar si el archivo es una imagen
    if file_name.endswith('.png') or file_name.endswith('.jpg'):
        # Construir la ruta completa al archivo de imagen
        file_path = os.path.join(folder_path, file_name)

        # Abrir la imagen usando Pillow
        img = Image.open(file_path)

        # Aplicar un efecto de aclarado (mezcla con blanco)
        # Usamos una lambda para ajustar el brillo de los píxeles
        lightened_img = Image.eval(img, lambda px: min(255, px + 80))

        # Guardar la imagen modificada (sobrescribir la original)
        lightened_img.save(file_path)

        # Cerrar la imagen original
        img.close()
