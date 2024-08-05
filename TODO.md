
--- TASK QUEUE ---

- revisar el resetView Nav:43 y hacer que cada algoritmo lo ejecute
- element editor debe modificar el estilo original, no el temporal GenerateElementEditorOptions
- dejar claro q el estilo de un algoritmo:view se mantiene hasta que se cierra la view, incluso si ejecutamos un algoritmo:algorithm, hacer como una alerta de los views abiertos
- fix topo sort (topo-2.json)
- sistema de mensajes o alertas
- export png background
- getters y setters para todos los atributos de las clases

------------------

GUI
  - Language
  - Context menu


- REFACTOR 
  - shortcuts as callbacks
  - Allow add nodes with live editor without modifying the current arrangement (Avoid create new nodes if those already exist)
  - Global variable hover that calculates once at the mousemove event and the elements just check if they are inside the hover, and not calculate the hover again
  - Absolute paths for imports


- FIX
  - console log Warnings of color when number


UPDATE & CHECK regularly
  - Help page
  - Code quality (comments, JSDoc, encapsulation, consistency)
  - Unused code
  - Memento events

DOC
  - README
  - Doc the practices like the *triggers*, *shortcut managers*, etc.

TESTS
  - Run algorithms with empty graph
  - test performance with a lot of elements
  - review the convertions.js file to refactor the functions to handle invalid inputs
  - element editor updates with weird selections (select fast, remove selection, etc.)