# Proyecto: Extracción de Metadata de PNG (WIP otros outputs) y Almacenamiento en MongoDB

## Descripción
Este proyecto permite recorrer una carpeta de archivos PNG (wip scripts para otros outputs), extraer su metadata y almacenarla en una base de datos MongoDB. 

## Características
- **Extracción de metadata de PNG**, incluyendo dimensiones, modo de color y chunks de información.
- **Prioriza el chunk `tEXt`** para capturar información incrustada en la imagen.
- **Evita duplicados en MongoDB**, asegurando que no se almacenen registros redundantes.
- **Uso de BLAKE2s** para generar un hash del contenido del `tEXt`, optimizando la detección de archivos duplicados.
- **Organización de los datos** para futuras consultas y procesamiento en el frontend.

## Requisitos
1. **Python 3.10+**
2. **MongoDB en ejecución** (local o remoto)
3. Instalación de dependencias:
   ```sh
   pip install pymongo pillow pypng
   ```

## Instalación y Uso
### 1. Clonar el repositorio
```sh
git clone https://github.com/matallana/metachunk-reader.git
cd metachunk-reader
```

### 2. Crear y activar entorno virtual (opcional pero recomendado)
```sh
python -m venv venv
source venv/bin/activate  # En Windows usar venv\Scripts\activate
```

### 3. Ejecutar el script
```sh
python scripts/extract_png_metadata.py
```

### 4. Consultar los datos en MongoDB
```sh
mongosh
use png_metadata
db.images.find().pretty()
```

## Estructura de Datos Almacenados en MongoDB
Cada imagen procesada se guarda con la siguiente estructura:
```json
{
    "filename": "example.png",
    "width": 1024,
    "height": 768,
    "format": "PNG",
    "mode": "RGB",
    "bit_depth": 8,
    "color_type": false,
    "alpha": true,
    "text_chunks": ["Author: John Doe", "Software: Photoshop"],
    "text_hash": "cd681e4a0e072c51...",
    "physical_dimensions": {
        "pixels_per_unit_x": 2835,
        "pixels_per_unit_y": 2835,
        "unit_specifier": "meters"
    },
    "has_text_metadata": true
}
```

## Notas Importantes
- Se omiten los primeros 8 bytes de cada archivo PNG, ya que corresponden a la firma del formato y no contienen metadatos.
- Si `text_chunks` está vacío, se almacena `has_text_metadata: false`.
- Se usa un hash `BLAKE2s` para evitar duplicados en MongoDB basados en `text_chunks`.

## Mejoras Futuras
- Optimizar los logs para mejorar el rendimiento en el procesamiento de grandes cantidades de archivos.
- Permitir la selección dinámica de la carpeta a analizar desde el frontend.
- Agregar otros scripts (Audio, Video que simulen lo mismo en otra collection).

## Licencia
Este proyecto está licenciado bajo la **MIT License**.

