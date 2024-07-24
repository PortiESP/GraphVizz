
--- TASK QUEUE ---

- Algorithms
- Algorithm view
- Review memento triggers
  - Style triggers
- Marked attr for edges (used in min-span-trees and shortest-path)
- Review memento events
- Refactor element editor widgets component as separated components
- Set tool tip on after certain events to explain the user what to do

------------------

FEATURES
  - Algorithms 
    - Dijkstra
    - Custom
  - Auto arrange
    - Camino critico (CPM)
    - Grid
    - Random
  - Study memento actions
  - Images as nodes
  - Block nodes movement or edit style
  - Organic arrangement (force directed)

GUI
  - Responsive
  - Language
  - Context menu
  - LiveEditor different edge list formats


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