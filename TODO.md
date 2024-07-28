
--- TASK QUEUE ---

 - Doc (tomorrow graph-manager)
    - Comment
    - Document
    - Indentation of 4 spaces
    - absolute imports
  - Component mode generalize

- Views of the algorithms (colors, heat-maps, etc)
- Marked attr for edges (used in min-span-trees and shortest-path)
- Set tool tip on after certain events to explain the user what to do
- Help page
- Review editable attributes on the ElementEditor (global, nodes, multiple, etc.)
- more examples
- review clone method (stores all the relevant information)
- review the convertions.js file to refactor the functions to handle invalid inputs
- test performance with a lot of elements

------------------

FEATURES
  - Images as nodes
  - Block nodes movement or edit style

GUI
  - Responsive
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