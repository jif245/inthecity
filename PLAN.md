# Plan: Mapa interactivo Avellaneda

## Context
El repo `inthecity` tiene un txt con ~15 POIs de una visita a la zona de Av. Avellaneda (Floresta, Buenos Aires) y un intento previo de mapa en JSX con solo 3 spots. El objetivo es crear un mapa interactivo completo con todos los POIs, color-coded por categoría, con una ruta punteada de caminata, desplegable en GitHub Pages como HTML estático.

## Categorías y colores

| Categoría    | Color   | POIs |
|-------------|---------|------|
| Comida      | `#4CAF50` (verde) | KAP Mayorista, Hawaii |
| Restaurante | `#E91E63` (rosa)  | Maum |
| Ropa        | `#2196F3` (azul)  | REVEL, Galería x2, Mohicano, Terra, Paradox, JKM02 Jeans, Inquieta Denim, POP SUGAR |
| Bazar       | `#FF9800` (naranja) | Mayorista Oppa |
| Juguetería  | `#9C27B0` (violeta) | Juguetería (Av. Avellaneda 3807) |
| Calle       | `#78909C` (gris)  | Calle Argerich (referencia ropa de hombre) |

## Stack técnico
- **Un solo archivo `index.html`** en la raíz del repo
- **Leaflet.js** (CDN) + **OpenStreetMap** tiles
- Sin build step, sin dependencias, sin framework
- Deployable directo a GitHub Pages

## Pasos de implementación

### 1. Resolver coordenadas de todos los POIs
- Extraer lat/lng de los links de Google Maps (resolver short URLs)
- Para los que solo tienen dirección (Juguetería, Galerías), geocodificar manualmente
- Reusar las 3 coords que ya existen en `floresta-map.jsx` (Hawaii, Terra, REVEL)

### 2. Crear `index.html` con Leaflet
Archivo único con todo inline (CSS + JS + data):

- **Mapa base**: Leaflet + OpenStreetMap tiles, centrado en la zona de Av. Avellaneda
- **Markers**: Custom circle markers con colores por categoría, numerados
- **Popups**: Al hacer click, mostrar nombre, mini descripción, dirección, y link a Google Maps
- **Leyenda**: Panel con las categorías y sus colores
- **Lista lateral/inferior**: Cards con todos los POIs, clickeables (scroll al marker)

### 3. Ruta punteada de caminata
- Dibujar polyline punteada desde KAP (inicio) → todos los puntos intermedios → Maum (fin)
- Orden de recorrido: el orden del txt original (es el orden lógico de caminata)
- Estilo: línea punteada animada, color naranja/rojo
- Opción A (preferida): usar OSRM free API para obtener rutas reales por calles en modo "foot"
- Opción B (fallback): polyline recta entre puntos si OSRM no responde

### 4. Deploy en GitHub Pages
- Activar GitHub Pages en el repo (branch `main`, root `/`)
- El `index.html` en la raíz se sirve automáticamente

## Estructura de archivos
```
inthecity/
├── PLAN.md                          ← este archivo
├── index.html                       ← mapa interactivo (por crear)
└── avellaneda/
    └── input/
        ├── visita_juan_eli.txt      ← POIs originales
        ├── floresta-map.jsx         ← intento previo de mapa
        └── sample_routing.png       ← imagen de referencia
```

## Verificación
1. Abrir `index.html` localmente en el browser
2. Verificar markers con colores correctos por categoría
3. Click en markers → popup con info
4. Verificar la línea punteada de ruta KAP → Maum
5. Push al repo → verificar GitHub Pages
