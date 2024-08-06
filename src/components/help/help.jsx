import { useState } from "react"
import scss from "./help.module.scss"

// Icons
import GithubIcon from "@assets/github.svg?react"
import InfoIcon from "@assets/info-circle.svg?react"
import HelpIcon from "@assets/help-question.svg?react"
import BranchIcon from "@assets/git-branch.svg?react"
import Logo from "@assets/logo.svg?react"


export default function Help() {

    return (
        <div className={scss.wrapper}>
            <main className={scss.content}>
                <div className={scss.logo}><Logo /></div>
                <h1>Help</h1>
                <div className={scss.tip}>
                    <InfoIcon /> 
                    <p>In this page you can find information about <strong>features</strong>, <strong>shortcuts</strong> and <strong>support</strong>.</p>
                </div>

                <section id="how-to">
                    <span className={scss.section_id} id="to-how-to"></span>
                    <h2>How to...</h2>

                    <h3>Nodes and edges creation</h3>

                    <div className={scss.toggle_group}>
                        <Toggle title="Create a new Node">
                            <div>
                                <h5>Option 1: Node creation tool</h5>
                                <p>Press the <kbd>n</kbd> key. The new node will follow the mouse cursor until you click on the canvas to place it.</p>
                            </div>
                            <div>
                                <h5>Option 2: Live Editor</h5>
                                <p>You can add a new line at the LiveEditor with the node label</p>
                            </div>
                        </Toggle>

                        <Toggle title="Create a new Edge">
                            <div>
                                <h5>Option 1: Edge creation tool</h5>
                                <p>Press the <kbd>e</kbd> key. Then, click on the source node and drag the mouse to the target node. Release the mouse button to create the edge.</p>
                            </div>
                            <div>
                                <h5>Option 2: Live Editor</h5>
                                <p>You can add a new line at the LiveEditor with the edge label</p>
                            </div>
                        </Toggle>

                        <Toggle title="Delete a Node or Edge">
                            <div>
                                <h5>Option 1: Delete tool</h5>
                                <p>Press the <kbd>d</kbd> key. Then, click on the node/edge you want to delete.</p>
                            </div>
                            <div>
                                <h5>Option 2: Live Editor</h5>
                                <ul>
                                    <li><p>To remove a <strong>node</strong> you will need to remove every line that contains the node label. When every line is removed, the node will be deleted. ⚠️ Note that if we remove an edge and that was the last edge of other node, this node will be removed too.</p></li>
                                    <li><p>To remove an <strong>edge</strong> you will need to remove the line that contains the edge label.</p></li>
                                </ul>
                            </div>
                        </Toggle>

                        <Toggle title="Select and move Nodes">
                            <p>Press the <kbd>s</kbd> key to activate the selection tool. Then, click on the node you want to select. You can move the selected nodes by dragging on top of one of them.</p>
                        </Toggle>

                        <Toggle title="Multiple selection">
                            <div>
                                <h5>Option 1: Shift</h5>
                                <p>Hold the <kbd>Shift</kbd> key and click on the nodes you want to select. 💡 The <kbd>shift</kbd> key is used to toggle the selection of the element being hovered</p>
                            </div>
                            <div>
                                <h5>Option 2: Box selection</h5>
                                <p>Click on an empty space, then drag to create a selection box. All elements inside the box will be selected.</p>
                            </div>
                        </Toggle>

                        <Toggle title="Algorithms, Appearances and Views">
                            <p>There are <strong>three types of <em>algorithms</em></strong> you can run:</p>

                            <ul>
                                <li>
                                    <div>
                                        <h5>Algorithms</h5>
                                        <p>This ones are pure graph algorithms (e.g. Dijkstra, Kruskal, etc.)</p> This algorithms will return a result that can be copied to the clipboard. Some of them may highlight the nodes and edges that are part of the result, but wont change the graph's shape (nodes positioning).
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <h5>Arrangements</h5>
                                        <p>These algorithms will change the graph's shape (e.g. Circular, Tree, etc.)</p>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <h5>Views</h5>
                                        <p>These algorithms will change the nodes and edges appearance (e.g. color, size, etc.), but wont change the graph's shape.</p>
                                    </div>
                                </li>
                            </ul>
                        </Toggle>

                        <Toggle title="Live Editor">
                            <p>The Live Editor is a text area where you can write the graph in a specific format. The graph will be updated in real time as you type.</p>

                            <p>The format is as follows:</p>
                            <ul>
                                <li><div><kbd>A</kbd> → Creates a node with label A</div></li>
                                <li><div><kbd>A B</kbd> → Creates an edge from node A to node B</div></li>
                                <li><div><kbd>A 3 C</kbd> → Creates an edge from node A to node B with weight 3</div></li>
                                <li><div><kbd>A{">"}B</kbd> → Creates an directed edge from node A to node B</div></li>
                                <li><div><kbd>A 3{">"}B</kbd> → Creates an directed edge from node A to node B with weight 3</div></li>
                            </ul>
                        </Toggle>

                        <Toggle title="Element Editor">
                            <p>The Element Editor is a panel that allows you to edit the properties of the current selection.</p>
                            <p>If nothing is selected, the panel will show the properties of the graph.</p>
                            <p>When multiple elements are selected, the panel will show different sections for each type of element, and in each section you can edit the common properties of the selected elements of the same type.</p>
                            <p>This panel also has a reset button on each input that will reset it to its default value.</p>
                        </Toggle>

                    </div>

                </section>

                <section id="shortcuts">
                    <span className={scss.section_id} id="to-shortcuts"></span>
                    <h2>Shortcuts</h2>

                    <h3>Movement</h3>
                    <div>
                        <ul>
                            <li>Pan freely <span><kbd>WheelBtn+Drag</kbd> / <kbd>DoubleClick</kbd> / <kbd>Space+Drag</kbd></span></li>
                            <li>Pan one step <kbd>Ctrl+Arrows</kbd></li>
                            <li>Zoom in/out<span><kbd>WheelUp</kbd> / <kbd>WheelDown</kbd></span></li>
                        </ul>
                    </div>

                    <h3>Graph</h3>
                    <p>This shortcuts depend on the selected tool. Each tool has its own shortcuts as follows...</p>
                    <div>
                        <ul>
                            <li className={scss.list_title}>Select tool <kbd>S</kbd></li>
                                <li>Select a node <kbd>Click</kbd></li>
                                <li>Multiple select (toggle selection of the hovered node) <kbd>Shift+Click</kbd></li>
                                <li>Deselect all <span>while hovering an empty space <kbd>Click</kbd></span></li>
                                <li>Box selection <span>while hovering an empty space <kbd>Click+Drag</kbd></span></li>
                                <li>Select all <kbd>Ctrl+A</kbd></li>
                                <li>Move selected elements <span>while hovering a selected element <kbd>Drag</kbd></span></li>
                                <li>Snap to grid <span>while dragging elements <kbd>Shift</kbd></span></li>
                                <li>Delete selected elements <kbd>Supr/Delete</kbd></li>
                            <li className={scss.list_title}>Edges tool <kbd>E</kbd></li>
                                <li>Create an edge <span>click on a node to start, drag to another node, release the click to finish <kbd>Click+Drag</kbd></span></li>
                                <li>Create a directed edge <span>hold shift while creating an edge <kbd>Click+Drag+Shift</kbd></span></li>
                            <li className={scss.list_title}>Nodes tool <kbd>N</kbd></li>
                                <li>Snap to grid <kbd>Shift</kbd></li>
                            <li className={scss.list_title}>Delete tool <kbd>D</kbd></li>
                                <li>Delete node <kbd>Click</kbd></li>
                        </ul>
                    </div>

                    <h3>General</h3>
                    <div>
                        <ul>
                            <li>Force save graph to cache <kbd>Ctrl+S</kbd></li>
                            <li>Save graph to file <kbd>Ctrl+Shift+S</kbd></li>
                            <li>Load graph <kbd>Ctrl+O</kbd></li>
                            <li>Export graph <kbd>Ctrl+Shift+E</kbd></li>
                            <li>Empty graph <kbd>Ctrl+Alt+N</kbd></li>
                            <li>Undo <kbd>Ctrl+Z</kbd></li>
                            <li>Redo <span><kbd>Ctrl+Shift+Z</kbd> / <kbd>Ctrl+Y</kbd></span></li>
                            <li>Copy <kbd>Ctrl+C</kbd></li>
                            <li>Paste <kbd>Ctrl+V</kbd></li>
                        </ul>
                    </div>
                </section >

                <section id="contact">
                    <span className={scss.section_id} id="to-contact"></span>
                    <h2>Contact & Support</h2>
                    <div className={scss.contact_section}>
                        <span className={scss.contact_icon}>
                            <HelpIcon />
                        </span>
                        <p>If you have any <strong>questions, suggestions or problems</strong>, please contact us at <br/><a href="mailto:support@graphvizz.com">support@graphvizz.com</a></p>
                    </div>
                    <div className={scss.contact_section}>
                        <span className={scss.contact_icon}>
                            <BranchIcon />
                        </span>
                        <p>If you want to <strong>contribute to the project</strong>, please visit our <br/><a href="https://github.com/PortiESP/GraphVizz" target="_blank"><GithubIcon /> GitHub repository</a></p>
                    </div>
                </section>
            </main>
        </div>
    )
}


function Toggle(props) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div className={scss.toggle_wrap}>
            <div className={[scss.toggle_header, expanded ? scss.open: undefined].join(" ")} onClick={() => setExpanded(!expanded)}>
                <span className={[scss.toggle_triangle, expanded && scss.triangle_rot].join(" ")}>▲</span>
                <h4>{props.title}</h4>
            </div>
            {
                expanded &&
                <div className={scss.toggle_content}>
                    <hr />
                    {props.children}
                </div>
            }
        </div>
    )
}
