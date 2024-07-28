import scss from "../views.module.scss"
import { useState, useEffect } from "react"

// Icons
import ArrowR from "@assets/arrow-right.svg?react"

/**
 * Shows a view to select a source and destination node.
 * 
 * @param {Object} options - The select nodes options.
 * @param {string} options.title - The select nodes title.
 * @param {Function} options.callback - The select nodes callback.
 * @param {boolean} options.allNodes - If true, show an option to select all nodes.
 * @param {Function} setHiddenView - The hidden view state setter.
 * @param {Function} setView - The view state setter.
 */
export default function SelectNodesView({ setView, setHiddenView, options }) {

    const [node1, setNode1] = useState(window.graph.nodes[0]?.id)  // Default source node (first node)
    const [node2, setNode2] = useState(options.allNodes ? "all": window.graph.nodes[0]?.id)  // Default destination node (option: all)
    const [result, setResult] = useState(options.callback(node1, node2))

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
        setResult(options.callback(node1, node2))
    }, [node1, node2, options])

    return  <div className={[scss.menu_options_view_msg, scss.select_nodes].join(" ")}>
            <h4>{options.title}</h4>
            <p className={scss.hint}>Select the source node and the destination node to apply the algorithm.</p>

            <div className={scss.inputs}>
                <div className={scss.nodes_selector_group}>
                    <label>Initial node</label>
                    <select onChange={e => setNode1(e.target.value)} title={node1} value={node1}>
                        {window.graph.nodes.map((node, index) => <option key={index} value={node.id}>{node.id}</option>)}
                    </select>
                </div>
                <ArrowR />
                <div className={scss.nodes_selector_group}>
                    <label>Dst. node</label>
                    <select onChange={e => setNode2(e.target.value)} title={node2} value={node2}>
                        <option value="all">All</option>
                        {window.graph.nodes.map((node, index) => <option key={index} value={node.id}>{node.id}</option>)}
                    </select>
                </div>
            </div>
            <div className={scss.nodes_selector_summary}>{result}</div>
            <button onClick={()=>setHiddenView(true)}>Hide menu</button>
            <hr />
            <button onClick={closeView}>Close view</button>
    </div>
}