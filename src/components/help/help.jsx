import { useState } from "react"
import scss from "./help.module.scss"
import GithubIcon from "@assets/github.svg?react"
import InfoIcon from "@assets/info-circle.svg?react"
import HelpIcon from "@assets/help-question.svg?react"
import BranchIcon from "@assets/git-branch.svg?react"

export default function Help(props) {

    return (
        <div className={scss.wrapper}>
            <main className={scss.content}>
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
                        <Toggle title="Create a new node">
                            <p>Press the <kbd>n</kbd> key. The new node will follow the mouse cursor until you click on the canvas to place it.</p>
                            <p>Alternatively, you can add a new line at the LiveEditor with the node label</p>
                        </Toggle>

                        <Toggle title="Create a new edge">
                            <p>Press the <kbd>e</kbd> key. Then, click on the source node and drag the mouse to the target node. Release the mouse button to create the edge.</p>
                            <p>Alternatively, you can add a new line at the LiveEditor</p>
                        </Toggle>

                        <Toggle title="Delete a node">
                            <p>Press the <kbd>Del</kbd> key. The node and all its edges will be removed.</p>
                            <p>Alternatively, you can remove the line at the LiveEditor with the node label</p>
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
