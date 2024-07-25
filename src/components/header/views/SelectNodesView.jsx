import scss from "../header.module.scss"
import dijkstra from "../../graph-manager/utils/algorithms/dijkstra"
import ArrowR from "../../../assets/arrow-right.svg?react"
import { useEffect } from "react"
import { useState } from "react"
import { generateAdjacencyList } from "../../graph-manager/utils/algorithms/algorithm_utils/generate_graph"
import { generateEdgesByPredecessors, generateEdgesPathByPredecessors } from "../../graph-manager/utils/algorithms/algorithm_utils/convertions"


export default function SelectNodesView({options}) {

    const [node1, setNode1] = useState(window.graph.nodes[0]?.id)  // Default source node (first node)
    const [node2, setNode2] = useState(options.allNodes ? "all": window.graph.nodes[0]?.id)  // Default destination node (option: all)
    const [result, setResult] = useState(dijkstra(generateAdjacencyList(), window.graph.nodes.find(node => node.id === node1)))

    // Create a listener to update the result when the graph changes
    useEffect(() => {
        const cbk = (nodes) => {
            const newSrc = nodes[0]?.id
            setNode1(newSrc)
            setNode2(options.allNodes ? "all": window.graph.nodes[0]?.id)
            calcAlgorithm(newSrc)
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

    const calcAlgorithm = (startId) => {
        const g = generateAdjacencyList()
        const start = window.graph.nodes.find(node => node.id === startId)
        const result = dijkstra(g, start)
        setResult(result)
    }

    useEffect(() => {
        resetView()
        options.callback(node1, node2)
    }, [node1, node2])

    const copyTable = () => {
        const data = Object.entries(result).map(([node, data]) => ({node, ...data}))
        navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    }

    return !options.hiddenView && <div className={[scss.menu_options_view_msg, scss.select_nodes].join(" ")}>
            <span>Choose an initial node and a destination node</span>
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
                        {window.graph.nodes.map((node, index) => <option key={index} value={node.id} disabled={result[node].distance === Infinity}>{node.id}</option>)}
                    </select>
                </div>
            </div>
            <div className={scss.nodes_selector_summary}>
                {
                    result && <><table>
                        <thead>
                            <tr>
                                <th>Node</th>
                                <th>Distance</th>
                                <th>Prev. node</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(result).map(([node, data], index) => (
                                <tr key={index} className={node1===node ? scss.initial : node2===node ? scss.dst: undefined}>
                                    <td>{node}</td>
                                    <td>{data.distance}</td>
                                    <td>{data.prevNode || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={copyTable}>Copy table as JSON</button>
                    </>
                }
            </div>
            <button onClick={()=>options.setHiddenView(true)}>Hide menu</button>
            <hr />
            <button onClick={closeView}>Close view</button>
    </div>
}