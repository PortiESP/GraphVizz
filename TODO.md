FEATURES
  - Algorithms 
    - Dijkstra
    - Custom
  - Auto arrange
    - Camino critico (CPM)
    - Hide unused edges and nodes
    - Add bubbles
  - Study memento actions
  - hover overlay
  - Images as nodes
  - Share as link

GUI
  - Style the graph nodes and edges
  - View mode
    - Add color attr within the view so it can be customized
  - Responsive
  - Language
  - Context menu
  - Reset defaults
  - Focus node on click in aside


- REFACTOR 
  - shortcuts as callbacks
  - Allow add nodes with live editor without modifying the current arrangement (Avoid create new nodes if those already exist)
  - Global variable hover that calculates once at the mousemove event and the elements just check if they are inside the hover, and not calculate the hover again

- FIX
  - console log Warnings of color when number