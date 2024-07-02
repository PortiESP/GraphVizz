FEATURES
  - Algorithms 
    - Dijkstra
    - Custom
  - Auto arrange
    - Camino critico (CPM)
  - Study memento actions
  - Images as nodes
  - Save to cache (avoid losing the graph when reloading the page)

GUI
  - Responsive
  - Language
  - Context menu
  - LiveEditor different edge list formats


- REFACTOR 
  - shortcuts as callbacks
  - Allow add nodes with live editor without modifying the current arrangement (Avoid create new nodes if those already exist)
  - Global variable hover that calculates once at the mousemove event and the elements just check if they are inside the hover, and not calculate the hover again
  - make a listener for graph changes and allow some parts of the code to subscribe to changes
  - SVGs imported as components with the new lib installed as in examples

- FIX
  - console log Warnings of color when number

UPDATE & CHECK regularly
  - Help page
  - Code quality (comments, JSDoc, encapsulation, consistency)
  - Unused code
  - Memento events