import scss from "../header.module.scss"
import ArrowR from "../../../assets/arrow-right.svg?react"
import { useEffect } from "react"
import { useState } from "react"


export default function SelectNodesView({options}) {

    const [node1, setNode1] = useState(window.graph.nodes[0]?.id)  // Default source node (first node)
    const [node2, setNode2] = useState(options.allNodes ? "all": window.graph.nodes[0]?.id)  // Default destination node (option: all)
    const [result, setResult] = useState(options.callback(node1, node2))

    // Create a listener to update the result when the graph changes
    useEffect(() => {
        const cbk = (nodes) => {
            const newSrc = nodes[0]?.id
            setNode1(newSrc)
            setNode2(options.allNodes ? "all": window.graph.nodes[0]?.id)
            resetView()
            setResult(options.callback(node1, node2))
        }
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
        options.callback(node1, node2)
    }, [node1, node2])

    return !options.hiddenView && <div className={[scss.menu_options_view_msg, scss.select_nodes].join(" ")}>
            <span>{options.title}</span>
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
            <div className={scss.nodes_selector_summary}>
                {result}
            </div>
            <button onClick={()=>options.setHiddenView(true)}>Hide menu</button>
            <hr />
            <button onClick={closeView}>Close view</button>
    </div>
}