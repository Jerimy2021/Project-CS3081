# Planets API Backend

Este proyecto es una API Flask que proporciona información sobre planetas, sistemas estelares y texturas de planetas.

## Estructura del Proyecto

```plaintext
planets_api/
│
├── app/
│   ├── __init__.py          # Inicialización de la app Flask
│   ├── routes.py            # Definición de las rutas de la API
│   ├── models.py            # Modelos de base de datos (si los hay)
│   ├── schemas.py           # Esquemas de validación (si los hay)
│   ├── config.py            # Configuración de la app (si es necesario)
│   └── utils.py             # Utilidades y funciones auxiliares
│
├── migrations/              # Archivos de migración de base de datos (si es necesario)
│   └── ... 
│
├── tests/                   # Pruebas para la aplicación
│   ├── __init__.py
│   ├── test_routes.py
│   ├── test_models.py
│   └── ... (otros archivos de prueba)
│
├── venv/                    # Entorno virtual
│   └── ... 
│
├── .env                     # Variables de entorno (opcional)
├── .flaskenv                # Configuraciones de Flask (opcional)
├── .gitignore               # Archivos a ignorar por git
├── requirements.txt         # Dependencias del proyecto
└── README.md                # Este archivo de instrucciones
```

## Requisitos Previos

- **Python 3.7+**: Asegúrate de tener Python instalado en tu sistema.
- **Virtualenv**: Es recomendable usar un entorno virtual para gestionar las dependencias del proyecto.

## Instalación

### 1. Clonar el Repositorio

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/Jerimy2021/Project-CS3081.git
cd Project-CS3081
```

### 2. Crear y Activar el Entorno Virtual

Crea un entorno virtual llamado `venv`:

```bash
python3 -m venv venv
```

Activa el entorno virtual:

- **En Linux/MacOS**:
  ```bash
  source venv/bin/activate
  ```
- **En Windows**:
  ```bash
  venv\Scripts\activate
  ```

### 3. Instalar Dependencias

Instala las dependencias listadas en `requirements.txt`:

```bash
pip install -r requirements.txt
```

## Configuración

### Variables de Entorno

Si necesitas configurar variables de entorno, puedes usar un archivo `.env` o `.flaskenv`. Asegúrate de no subir este archivo a control de versiones si contiene información sensible.

Ejemplo de `.flaskenv`:

```bash
FLASK_APP=app
```

## Ejecución de la Aplicación

Para iniciar la aplicación Flask, asegúrate de que el entorno virtual esté activado y ejecuta el siguiente comando:

```bash
flask run
```

Esto iniciará el servidor en `http://0.0.0.0:5000` (o en el puerto que hayas configurado).

Para ejecutar la aplicación en modo de desarrollo y habilitar la recarga automática, puedes usar:

```bash
flask run --reload
```

### Ejecución en Segundo Plano

Si deseas ejecutar la aplicación en segundo plano en un servidor Linux, puedes usar `nohup`:

```bash
nohup flask run --host=0.0.0.0 --port=5000 &
```

Esto ejecutará la aplicación en `http://0.0.0.0:5000`. Para detener la aplicación, encuentra el proceso en ejecución con `ps aux` y usa `kill` para finalizarlo.

## Uso de la API

La API proporciona las siguientes rutas:

- `GET /planets/<stellar_system>`: Devuelve información sobre los planetas en un sistema solar específico.
  - **Parámetros**: `<stellar_system>`

  ```bash
  curl "http://localhost:5000/planets/stellar_system_name"
  ```

- `GET /stellar_systems`: Devuelve una lista de sistemas estelares.
  
  ```bash
  curl "http://localhost:5000/stellar_systems"
  ```

- `GET /textures/<planet_id>`: Devuelve la URL de la textura de un planeta específico.
  
  ```bash
  curl "http://localhost:5000/textures/planet_id"
  ```

## Pruebas

Para ejecutar las pruebas del proyecto, usa:

```bash
pytest
```

Esto ejecutará todas las pruebas en el directorio `tests/`.


## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---
