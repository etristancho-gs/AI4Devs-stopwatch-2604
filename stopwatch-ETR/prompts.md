# Stopwatch

El ejercicio consiste en crear una página web sencilla con lógica JavaScript que proporcione funcionalidades de cronómetro y de cuenta atrás.

## Contexto actual
- Se proporcionan dos ficheros base ``index.html`` y ``script.js``.
- El contenido inicial de ``index.html`` es el siguiente:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Timer and Countdown</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Timer and Countdown</h1>
    <script src="script.js"></script>
</body>
</html>
```
- El fichero ``script.js`` no tiene contenido inicial.
- No existe aún el fichero ``styles.css``.

## Restricciones
- El diseño de la interfaz deberá ser similar al expuesto en la página https://www.online-stopwatch.com/.
- No está permitido generar nuevos ficheros html ni js.
- Utilizar JavaScript Vanilla.

## Resultado esperado
- Todos los contadores deberán tener 00:00:00 como valor inicial.

---

# Prompt de ajuste

Existen problemas de maquetación durante la visualización del stopwatch, los números del timer se salen de la zona de dibujo negra donde se muestran los números. Genera de nuevo un fichero styles.css donde quede corregido el problema.

---

# Prompt para correcciones

Regenera los ficheros ``index.html``, ``script.js`` y, si fuera necesario, ``styles.css``, para implementar las siguientes mejoras observadas por coderabbitai en el contenido generado previamente:
- Consider adding button state management for better UX: The buttons don't reflect their current state (e.g., disabling "Start" when running, or "Pause" when stopped). Consider adding disabled attribute management in JavaScript for better user experience and accessibility.
- Consider using requestAnimationFrame for smoother timer updates: While setInterval(updateTimerDisplay, 10) works, requestAnimationFrame provides smoother visual updates synchronized with the browser's refresh rate and better battery efficiency. Note: You'll also need to update the pause and reset handlers to use cancelAnimationFrame(timerInterval) instead of clearInterval(timerInterval).
- Add input validation for minutes and seconds: While max="59" is specified on the inputs, users can still manually type values exceeding 59. The JavaScript in stopwatch-ETR/script.js doesn't validate or clamp these values, which could lead to confusing displays like "00:75:00" or incorrect calculations.
- Add defensive null checks for DOM elements: If any required DOM element is missing (e.g., due to HTML changes), the code will throw errors on line 11 or 19. Add null checks or use optional chaining to fail gracefully.

Adicionalmente, asegúrate de que el contador del stopwatch comienza en 00:00:00.00 y el del countdown comienza en 00:00:00.

---

# Chatbot utilizado

Microsoft 365 Copilot en modo "GPT 5.5 Razonamiento profundo".