# Todo App con Angular

Lista de tareas al estilo [TodoMVC](https://todomvc.com/) hecha con **Angular 17**, para practicar componentes standalone, **signals** y formularios reactivos.

## Qué incluye

- Crear tareas, marcarlas como hechas, editarlas con doble clic y borrarlas.
- Filtros: todas, pendientes y completadas.
- Borrar de una vez las completadas.
- Las tareas se guardan en `localStorage`.

## Qué se practica

| Concepto | Dónde |
|---|---|
| Estado con `signal`, valores derivados con `computed` y persistencia con `effect` | [`home.component.ts`](src/app/pages/home/home.component.ts) |
| Formularios reactivos con `FormControl` y validadores | [`home.component.ts`](src/app/pages/home/home.component.ts) |
| Ejercicios sueltos de signals y formularios | [`labs.component.ts`](src/app/pages/labs/labs.component.ts), en la ruta `/labs` |

## Stack

- Angular 17 (standalone) y TypeScript
- SCSS con los estilos de TodoMVC
- Karma y Jasmine
- Configuración de despliegue en Firebase Hosting (`firebase.json`)

## Cómo ejecutar

Requiere Node.js 18 o superior.

```bash
npm install
npm start
```

La aplicación queda en `http://localhost:4200`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo |
| `npm test` | Tests unitarios |
| `npm run build` | Compila para producción en `dist/todoapp-ng` |
