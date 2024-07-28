import scss from "../views.module.scss"
import { useState, useEffect } from "react"

/**
 * Shows a select node view.
 * 
 * @param {Object} options - The select node options.
 * @param {string} options.title - The select node title.
 * @param {Function} options.callback - The select node callback.
 * @param {boolean} options.all - If true, show an option to select all nodes.
 * @param {Function} setView - The view state setter.
 * @param {Function} setHiddenView - The hidden view state setter.
 */
export default function SelectNodeView({ setView, setHiddenView, options }) {

    const [node, setNode] = useState(window.graph.nodes[0]?.id)  // Default source node (first node)
    const [result, setResult] = useState(undefined)

    // Create a listener to update the result when the graph changes
    useEffect(() => {
        const cbk = () => closeView()
        window.graph.graphListeners.push(cbk)
        return () => window.graph.graphListeners = window.graph.graphListeners.filter(listener => listener !== cbk)
    }, [])

    // Close the view, resetting the view and hiding the view menu
    const closeView = () => {
        window.graph.resetView()
        setView(false)
    }

    // Update the result when the source or destination node changes
    useEffect(() => {
        window.graph.resetView()
        setResult(options.callback(node))
    }, [node, options])

    return  <div className={[scss.menu_options_view_msg, scss.select_nodes].join(" ")}>
            <h4>{options.title}</h4>
            <p className={scss.hint}>Select the a node to apply the algorithm.</p>

            <div className={scss.inputs}>
                <div className={scss.nodes_selector_group}>
                    <label>Initial node</label>
                    <select onChange={e => setNode(e.target.value)} title={node} value={node}>
                        { options.all && <option value="all">All</option> }
                        {window.graph.nodes.map((node, index) => <option key={index} value={node.id}>{node.id}</option>)}
                    </select>
                </div>
            </div>
            <div className={scss.nodes_selector_summary}>
                {result}
            </div>
            <button onClick={()=>setHiddenView(true)}>Hide menu</button>
            <hr />
            <button onClick={closeView}>Close view</button>
    </div>
}