import scss from "../header.module.scss"
import { useEffect } from "react"
import { useState } from "react"


export default function SelectNodeView({hiddenView, options}) {


    const [node, setNode] = useState(window.graph.nodes[0]?.id)  // Default source node (first node)
    const [result, setResult] = useState("")

    // Create a listener to update the result when the graph changes
    useEffect(() => {
        const cbk = (nodes) => closeView()
        window.graph.graphListeners.push(cbk)
        return () => window.graph.graphListeners = window.graph.graphListeners.filter(listener => listener !== cbk)
    }, [])

    const resetView = () => {
        window.graph.nodes.forEach(node => {node.hidden = false; node.bubble = null})
        window.graph.edges.forEach(edge => edge.hidden = false)
    }

    const closeView = () => {
        resetView()
        options.setView(false)
    }

    useEffect(() => {
        resetView()
        setResult(options.callback(node))
    }, [node, options])

    return !hiddenView && <div className={[scss.menu_options_view_msg, scss.select_nodes].join(" ")}>
            <span>{options.title}</span>
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
            <button onClick={()=>options.setHiddenView(true)}>Hide menu</button>
            <hr />
            <button onClick={closeView}>Close view</button>
    </div>
}