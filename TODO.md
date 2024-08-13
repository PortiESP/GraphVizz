
--- TASK QUEUE ---

DOC

- setupAfterCanvas, mejorar esta práctica
- canvas user select disabled for mobile devices
- sistema de mensajes o alertas
- mouse hovers y actives
- logo responsive on top of other menus
- dejar claro q el estilo de un algoritmo:view se mantiene hasta que se cierra la view, incluso si ejecutamos un algoritmo:algorithm, hacer como una alerta de los views abiertos

------------------

GUI
  - Language
  - Context menu

REFACTOR 
  - Global variable hover that calculates once at the mousemove event and the elements just check if they are inside the hover, and not calculate the hover again

FIX

UPDATE & CHECK regularly
  - Help page
  - Code quality (comments, JSDoc, encapsulation, consistency)
  - Unused code

DOC
  - README
  - Doc the practices like the *triggers*, *shortcut managers*, etc.
    - Triggers & listeners
    - Global variables
    - Getters and setters
    - Shortcut manager

TESTS
  - test performance with a lot of elements
  - element editor updates with weird selections (select fast, remove selection, etc.)