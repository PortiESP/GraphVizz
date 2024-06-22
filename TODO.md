FEATURES
  - Algorithms 
    - Dijkstra
    - Custom
  - Auto arrange
    - Camino critico (CPM)


GUI
  - Style the graph nodes and edges

REFACTOR
  - Create función para asignar los callbacks de los eventos del canvas en el componente padre. Definirla en el archivo canvas/utils/setup.js
  - ctx.save() and ctx.restore() wrapping every draw function
  - Define onclick, ondrag, etc. behavior for elements as methods
  - Zoom steps [0.1, 0.2, 0.5, 1, 2, 5, 10]
  - Disable drag when mouse leaves the canvas
  - Nodes, edges and elements stored globally as objects
  - Getter and setter for global variables
  - Global variable containing all the elements

FIX
  - Resize canvas when window is resized bug
  - `view.js` only considering nodes on focus functions, should consider edges, info, etc.