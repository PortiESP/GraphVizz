FEATURES
  - Algorithms 
    - Dijkstra
    - Custom
  - Auto arrange
    - Camino critico (CPM)
  - Study memento actions
  - Images as nodes

GUI
  - Responsive
  - Language
  - Context menu
  - Reset defaults
  - Focus node on click in aside
  - LiveEditor different edge list formats


- REFACTOR 
  - shortcuts as callbacks
  - Allow add nodes with live editor without modifying the current arrangement (Avoid create new nodes if those already exist)
  - Global variable hover that calculates once at the mousemove event and the elements just check if they are inside the hover, and not calculate the hover again

- FIX
  - console log Warnings of color when number
  - When writing in the live editor, while having the element editor hidden, if the user presses tab, the window shows the element editor when it should not

UPDATE & CHECK regularly
  - Help page
  - Code quality (comments, JSDoc, encapsulation, consistency)
  - Unused code