
--- TASK QUEUE ---

- Views of the algorithms (colors, heat-maps, etc)
- Marked attr for edges (used in min-span-trees and shortest-path)
- Set tool tip on after certain events to explain the user what to do
- Help page
- Review editable attributes on the ElementEditor (global, nodes, multiple, etc.)
- more examples
- review clone method (stores all the relevant information)
- review the convertions.js file to refactor the functions to handle invalid inputs
- test performance with a lot of elements
- Default values for the elements in the global element editor

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

THEORY
 - Order: Number of nodes
 - Size: Number of edges
   - Maximum size is achieved when the graph is complete: all nodes are connected to all nodes: (n * (n - 1)) / 2
 - Degree: Number of edges connected to a node
    - Zero degree: Isolated node
 - Conex components
 - Bipartito
 - Eulerian: All nodes have even degree.
   - Eulerian path: Start and end in different nodes, while only passing once through each edge
   - Eulerian cycle: Start and end in the same node, while only passing once through each edge
 - Chromatic number