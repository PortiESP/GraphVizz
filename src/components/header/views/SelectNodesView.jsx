import scss from "../header.module.scss"
import dijkstra from "../../graph-manager/utils/algorithms/dijkstra"
import ArrowR from "../../../assets/arrow-right.svg?react"
import { useEffect } from "react"
import { useState } from "react"
import { generateAdjacencyList } from "../../graph-manager/utils/algorithms/algorithm_utils/generate_graph"
import { generateEdgesByPredecessors, generateEdgesPathByPredecessors } from "../../graph-manager/utils/algorithms/algorithm_utils/convertions"


export default function SelectNodesView(props) {

    const [src, setSrc] = useState(window.graph.nodes[0]?.id)  // Default source node (first node)
    const [dst, setDst] = useState("all")  // Default destination node (option: all)
    const [result, setResult] = useState(dijkstra(generateAdjacencyList(), window.graph.nodes.find(node => node.id === src)))

    const resetView = () => {
        window.graph.nodes.forEach(node => {node.hidden = false; node.bubble = null})
        window.graph.edges.forEach(edge => edge.hidden = false)
    }

    const closeView = () => {
        resetView()
        props.setView(false)
    }

    useEffect(() => {
        const g = generateAdjacencyList()
        const start = window.graph.nodes.find(node => node.id === src)
        const result = dijkstra(g, start)
        setResult(result)
    }, [src])

    console.log(result, src, dst)

    useEffect(() => {
        resetView()
        paintResult()        
    }, [dst])

    useEffect(() => {
        resetView()
        paintResult()
    }, [result])

    const copyTable = () => {
        const data = Object.entries(result).map(([node, data]) => ({node, ...data}))
        navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    }

    const paintResult = () => {
        if (dst === "all") {
            const predecessors = Object.fromEntries(Object.entries(result).map(([node, data]) => [node, data.prevNode]))
            const edges = generateEdgesByPredecessors(predecessors)
            window.graph.nodes.forEach(node => node.bubble = result[node.id].distance === Infinity ? "∞" : result[node.id].distance)
            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
        } else {
            const target = window.graph.nodes.find(node => node.id === dst)
            const prevs = Object.entries(result).map(([node, data]) => [node, data.prevNode])
            const edges = generateEdgesPathByPredecessors(Object.fromEntries(prevs), src, dst)
            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
            target.bubble = result[dst].distance
        }
    }

    return !props.hiddenView && <div className={[scss.menu_options_view_msg, scss.select_nodes].join(" ")}>
            <span>Choose an initial node and a destination node</span>
            <div className={scss.inputs}>
                <div className={scss.nodes_selector_group}>
                    <label>Initial node</label>
                    <select onChange={e => setSrc(e.target.value)} defaultValue={src}>
                        {window.graph.nodes.map((node, index) => <option key={index} value={node.id} >{node.id}</option>)}
                    </select>
                </div>
                <ArrowR />
                <div className={scss.nodes_selector_group}>
                    <label>Dst. node</label>
                    <select onChange={e => setDst(e.target.value)} defaultValue={dst}>
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
                                <tr key={index} className={src===node && scss.initial || dst===node && scss.dst}>
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
            <button onClick={()=>props.setHiddenView(true)}>Hide menu</button>
            <hr />
            <button onClick={closeView}>Close view</button>
    </div>
}