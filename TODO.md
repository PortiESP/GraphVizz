
--- TASK QUEUE ---

- prohibir ids con espacios
- default style for svg exports
- fix topo sort (topo-2.json)
- sistema de mensajes o alertas

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