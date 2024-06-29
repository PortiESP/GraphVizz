import { useState } from "react"
import scss from "./help.module.scss"


export default function Help(props) {

  return (
      <div className={scss.wrapper}>
        <div className={scss.content}>
          <h1>Help</h1>
          <p className={scss.tip}>In this page you can find information about features, shortcuts and support.</p>

          <section id="how-to">
            <h2>How to...</h2>

            <h3>Nodes and edges creation</h3>

            <Toggle title="Create a new node">
              <p>Press the <kbd>n</kbd> key. The new node will follow the mouse cursor until you click on the canvas to place it.</p>
              <p>Alternatively, you can add a new line at the LiveEditor with the node label</p>
            </Toggle>

            <Toggle title="Create a new edge">
              <p>Press the <kbd>e</kbd> key. Then, click on the source node and drag the mouse to the target node. Release the mouse button to create the edge.</p>
              <p>Alternatively, you can add a new line at the LiveEditor
              </p>
            </Toggle>

            <Toggle title="Delete a node">
              <p>Press the <kbd>Del</kbd> key. The node and all its edges will be removed.</p>
              <p>Alternatively, you can remove the line at the LiveEditor with the node label</p>
            </Toggle>
          </section>

          <section id="shortcuts">
            <h2>Shortcuts</h2>

            <h3>General</h3>
            <div>
              <ul>
                <li>Save the current graph<kbd>Ctrl + s</kbd></li>
                <li>Open a graph from a file<kbd>Ctrl + o</kbd></li>
                <li>Create a new graph<kbd>Ctrl + n</kbd></li>
              </ul>
            </div>
          </section >
        </div>
      </div>
  )
}


function Toggle(props) {
  const [expanded, setExpanded] = useState(false)

  return (
      <div className={scss.toggle_wrap}>
          <div className={scss.toggle_header} onClick={() => setExpanded(!expanded)}>
              <span className={[scss.toggle_triangle, expanded && scss.triangle_rot].join(" ")}>▲</span>
              <h4>{props.title}</h4>
          </div>
          {
              expanded &&
              <div className={scss.toggle_content}>
                  {props.children}
              </div>
          }
      </div>
  )
}
