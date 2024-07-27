import scss from "../header.module.scss"

import SubMenu, { SubMenuItem } from "../nav-sub-menu/SubMenu"
import { useNavigate } from "react-router-dom"

// Algorithms & arrangements
import { generateEdgesByNodesPath, generateEdgesByPredecessors, generateEdgesPathByPredecessors } from "@components/graph-manager/utils/algorithms/algorithm_utils/convertions"
import { generateAdjacencyList } from "@components/graph-manager/utils/algorithms/algorithm_utils/generate_graph"
import dijkstra from "@components/graph-manager/utils/algorithms/dijkstra"
import kruskal from "@components/graph-manager/utils/algorithms/kruskal"
import hamiltonianPath from "@components/graph-manager/utils/algorithms/hamiltonian-path"
import hamiltonianCycle from "@components/graph-manager/utils/algorithms/hamiltonian-cycle"
import colorBorders from "@components/graph-manager/utils/algorithms/color-borders"
import bfs from "@components/graph-manager/utils/algorithms/bfs"
import dfs from "@components/graph-manager/utils/algorithms/dfs"
import { circularArrange, gridArrange, organicArrange, randomArrange, toposortArrange, treeArrange } from "@components/graph-manager/utils/arrangements"

// Icons
import BFSIcon from "@assets/bfs.svg?react"
import DFSIcon from "@assets/dfs.svg?react"
import MapIcon from "@assets/map.svg?react"
import GridIcon from "@assets/grid.svg?react"
import RandomIcon from "@assets/shuffle.svg?react"
import CircularIcon from "@assets/circle-dashed.svg?react"
import BackArrow from "@assets/bend-arrow-left.svg?react"
import AtomIcon from "@assets/atom.svg?react"
import BrokenLinkIcon from "@assets/link-broken.svg?react"
import FilterIcon from "@assets/filter.svg?react"
import PathIcon from "@assets/path.svg?react"
import CycleIcon from "@assets/cycle.svg?react"
import ColorsIcon from "@assets/colors.svg?react"


export default function AlgorithmsSubMenu({view, viewProps, hiddenView, setHiddenView, setView, setViewProps}) {

    const navigate = useNavigate()

    const algorithms = [
        {
            title: "Breadth First Search (BFS)",
            icon: () => <BFSIcon />,
            callback: () => {
                setViewProps({
                    title: "Choose the initial node",
                    setView,
                    hiddenView,
                    setHiddenView,
                    callback: (selectedNode) => {
                        const adjList = generateAdjacencyList()
                        const startNode = window.graph.nodes.find(node => node.id === selectedNode)
                        const { result, prevNode } = bfs(adjList, startNode)
                        const edges = generateEdgesByPredecessors(prevNode)
                        result.forEach((node, i) => node.bubble = i)
                        window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                    }
                })
                setView("select-node")
            }
        },
        {
            title: "Depth First Search (DFS)",
            icon: () => <DFSIcon />,
            callback: () => {
                setViewProps({
                    title: "Choose the initial node",
                    setView,
                    hiddenView,
                    setHiddenView,
                    callback: (selectedNode) => {
                        const adjList = generateAdjacencyList()
                        const startNode = window.graph.nodes.find(node => node.id === selectedNode)
                        const { result, prevNode } = dfs(adjList, startNode)
                        const edges = generateEdgesByPredecessors(prevNode)
                        result.forEach((node, i) => node.bubble = i)
                        window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                    }
                })
                setView("select-node")
            }
        },
        {
            title: "Dijkstra",
            icon: () => <MapIcon />,
            callback: () => {
                setViewProps({
                    setView,
                    hiddenView,
                    setHiddenView,
                    title: "Select the source node and the destination node (or all)",
                    allNodes: true,
                    callback: (node1, node2) => {
                        const g = generateAdjacencyList()
                        const result = dijkstra(g, window.graph.nodes.find(node => node.id === node1))
                        const disabled = result[node2]?.distance === Infinity
                        setView("select-nodes")

                        if (node2 === "all") {
                            const predecessors = Object.fromEntries(Object.entries(result).map(([node, data]) => [node, data.prevNode]))
                            const edges = generateEdgesByPredecessors(predecessors)
                            window.graph.nodes.forEach(node => node.bubble = result[node.id].distance === Infinity ? "∞" : result[node.id].distance)
                            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        } else {
                            const target = window.graph.nodes.find(node => node.id === node2)
                            const prevs = Object.entries(result).map(([node, data]) => [node, data.prevNode])
                            const edges = disabled ? [] : generateEdgesPathByPredecessors(Object.fromEntries(prevs), node1, node2)
                            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                            target.bubble = result[node2].distance === Infinity ? "∞" : result[node2].distance
                        }

                        const copyTable = () => {
                            const data = Object.entries(result).map(([node, data]) => ({node, ...data}))
                            navigator.clipboard.writeText(JSON.stringify(data, null, 2))
                        }

                        return result && <><table>
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
                    },
                })
                setView("select-nodes")
            }
        },
        {
            title: "Min. Spanning Tree (Kruskal)",
            icon: () => <FilterIcon />,
            callback: () => {
                const data = kruskal(generateAdjacencyList())
                window.graph.edges.forEach(edge => edge.hidden = !data.result.some(e => e.id === edge.id))

                setViewProps({
                    title: "Result",
                    message: `The minimum spanning tree was calculated. The total weight is ${data.totalWeight}. The number of edges is ${data.result.length}.`,
                    color: "#cc62fc44"
                })
                setView("alert")

            }
        },
        {
            title: "Paths and Cycles",
            heading: true
        },
        {
            title: "Hamiltonian Path (all)",
            icon: () => <PathIcon />,
            callback: () => {
                setViewProps({
                    title: "Choose the initial node",
                    setView,
                    hiddenView,
                    setHiddenView,
                    callback: (selectedNode) => {
                        const paintPath = (path) => {
                            const edges = generateEdgesByNodesPath(path)
                            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        }
                        
                        const adjList = generateAdjacencyList()
                        const startNode = window.graph.nodes.find(node => node.id === selectedNode)
                        const data = hamiltonianPath(adjList, startNode, true)
                        const copyAsJSON = () => {
                            const paths = data.all.map(path => path.map(node => node.id))
                            const str = JSON.stringify(paths, null, 2)
                            navigator.clipboard.writeText(str)
                        }

                        if (data) paintPath(data.path)
                        else window.graph.edges.forEach(edge => edge.hidden = true)

                        return data ? <>
                        <span className={scss.info}>Paths found: {data.all.length}</span>
                        <button onClick={copyAsJSON}>Copy as JSON</button>
                        <table>
                            <thead>
                                <tr>
                                    <th>Path(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.all.map((path, index) => (
                                        <tr key={index} onClick={() => paintPath(path)} className={scss.clickable}>
                                            <td>{path.map(node => node.id).join(" → ")}</td>
                                        </tr>
                                    )) 
                                }
                            </tbody>
                        </table>
                        </>: <span className={scss.error}>No valid path found, try changing the starting point</span>
                    }
                })
                setView("select-node")
            }
        },
        {
            title: "Hamiltonian Path (one)",
            icon: () => <PathIcon />,
            callback: () => {
                setViewProps({
                    title: "Choose the initial node",
                    setView,
                    hiddenView,
                    setHiddenView,
                    callback: (selectedNode) => {
                        const paintPath = (path) => {
                            const edges = generateEdgesByNodesPath(path)
                            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        }
                        
                        const adjList = generateAdjacencyList()
                        const startNode = window.graph.nodes.find(node => node.id === selectedNode)
                        const data = hamiltonianPath(adjList, startNode)
                        const copyAsJSON = () => {
                            const nodePath = data.path.map(node => node.id)
                            const str = JSON.stringify(nodePath, null, 2)
                            navigator.clipboard.writeText(str)
                        }

                        if (data) paintPath(data.path)
                        else window.graph.edges.forEach(edge => edge.hidden = true)

                        return data ? <>
                        <p className={scss.info}>{data.path.map(node => node.id).join(" → ")}</p>
                        <button onClick={copyAsJSON}>Copy as JSON</button>
                        </>: <span className={scss.error}>No valid path found, try changing the starting point</span>
                    }
                })
                setView("select-node")
            }
        },
        {
            title: "Hamiltonian Cycle (all)",
            icon: () => <CycleIcon />,
            callback: () => {
                setViewProps({
                    title: "Choose the initial node",
                    setView,
                    hiddenView,
                    setHiddenView,
                    callback: (selectedNode) => {
                        const paintPath = (path) => {
                            const edges = generateEdgesByNodesPath(path)
                            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        }
                        
                        const adjList = generateAdjacencyList()
                        const startNode = window.graph.nodes.find(node => node.id === selectedNode)
                        const data = hamiltonianCycle(adjList, startNode, true, true)
                        const copyAsJSON = () => {
                            const paths = data.all.map(path => path.map(node => node.id))
                            const str = JSON.stringify(paths, null, 2)
                            navigator.clipboard.writeText(str)
                        }

                        if (data) paintPath(data.path)
                        else window.graph.edges.forEach(edge => edge.hidden = true)

                        return data ? <>
                        <span className={scss.info}>Cycles found: {data.all.length}</span>
                        <button onClick={copyAsJSON}>Copy as JSON</button>
                        <table>
                            <thead>
                                <tr>
                                    <th>Path(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.all.map((path, index) => (
                                        <tr key={index} onClick={() => paintPath(path)} className={scss.clickable}>
                                            <td>{path.map(node => node.id).join(" → ")}</td>
                                        </tr>
                                    )) 
                                }
                            </tbody>
                        </table>
                        </>: <span className={scss.error}>No valid cycle found, try changing the starting point</span>
                    }
                })
                setView("select-node")
            }
        },
        {
            title: "Hamiltonian Cycle (one)",
            icon: () => <CycleIcon />,
            callback: () => {
                setViewProps({
                    title: "Choose the initial node",
                    setView,
                    hiddenView,
                    setHiddenView,
                    callback: (selectedNode) => {
                        const paintPath = (path) => {
                            const edges = generateEdgesByNodesPath(path)
                            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        }
                        
                        const adjList = generateAdjacencyList()
                        const startNode = window.graph.nodes.find(node => node.id === selectedNode)
                        const data = hamiltonianCycle(adjList, startNode, false, true)
                        const copyAsJSON = () => {
                            const nodePath = data.path.map(node => node.id)
                            const str = JSON.stringify(nodePath, null, 2)
                            navigator.clipboard.writeText(str)
                        }

                        if (data) paintPath(data.path)
                        else window.graph.edges.forEach(edge => edge.hidden = true)

                        return data ? <>
                        <p className={scss.info}>{data.path.map(node => node.id).join(" → ")}</p>
                        <button onClick={copyAsJSON}>Copy as JSON</button>
                        </>: <span className={scss.error}>No valid cycle found, try changing the starting point</span>
                    }
                })
                setView("select-node")
            }
        },
        {
            title: "Map border colors",
            icon: () => <ColorsIcon />,
            callback: () => {
                setViewProps({
                    title: "Choose the initial node",
                    setView,
                    hiddenView,
                    setHiddenView,
                    callback: (selectedNode) => {
                        const g = generateAdjacencyList()
                        const data = selectedNode === "all" ? colorBorders(g) : colorBorders(g, selectedNode)
                        console.log(data)
                        window.graph.nodes.forEach(node => node.bubble = data[node.id])

                        const copyAsJSON = () => {
                            const str = JSON.stringify(data, null, 2)
                            navigator.clipboard.writeText(str)
                        }

                        return <>
                        <p className={scss.info}>Number of groups: {Math.max(...Object.values(data))+1}</p>
                        <button onClick={copyAsJSON}>Copy as JSON</button>
                        </>
                    }
                })
                setView("select-node")
            }
        }
    ]

    const arrangements = [
        {
            title: "Circular",
            icon: () => <CircularIcon />,
            callback: () => {
                setView(null)
                circularArrange(window.graph.nodes)
                focusOnAllNodes()
            }
        },
        {
            title: "Grid",
            icon: () => <GridIcon />,
            callback: () => {
                gridArrange(window.graph.nodes)
                focusOnAllNodes()
            }
        },
        {
            title: "Random",
            icon: () => <RandomIcon />,
            callback: () => {
                setView(null)
                randomArrange(window.graph.nodes)
                focusOnAllNodes()
            }
        },
        {
            title: "Tree (bfs)",
            icon: () => <BFSIcon />,
            callback: () => {
                setViewProps({
                    setView,
                    hiddenView,
                    setHiddenView,
                    title: "Select the root node",
                    callback: (value) => {
                        const data = treeArrange(value, "bfs")
                        const edges = generateEdgesByPredecessors(data.prevNode)
                        window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        focusOnAllNodes()
                    }
                })
                setView("select-node")
            }
        },
        {
            title: "Tree (dfs)",
            icon: () => <DFSIcon />,
            callback: () => {
                setViewProps({
                    setView,
                    hiddenView,
                    setHiddenView,
                    title: "Select the root node",
                    callback: (value) => {
                        const data = treeArrange(value, "dfs")
                        const edges = generateEdgesByPredecessors(data.prevNode)
                        window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        focusOnAllNodes()
                    }
                })
                setView("select-node")
            }
        },
        {
            title: "Organic",
            icon: () => <AtomIcon />,
            callback: () => {
                setView(null)
                organicArrange()
                focusOnAllNodes()
            }
        },
        {
            title: "Toposort",
            icon: () => <BrokenLinkIcon />,
            callback: () => {
                const g = generateAdjacencyList()
                const result = toposortArrange(g)

                if (result.hasCycle) {
                    setViewProps({
                        title: "Error",
                        message: "The graph has a cycle. The topological sort is not possible.",
                        color: "#f004"
                    })
                    setView("alert")
                } else {
                    const edges = generateEdgesByPredecessors(result.prevNode)
                    window.graph.nodes.forEach(node => node.bubble = result.levels[node.id])
                    window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                    focusOnAllNodes()
                    setViewProps({
                        title: "Toposort",
                        message: "The graph was arranged using the topological sort algorithm.",
                        color: "#0f044"
                    })
                    setView("alert")
                }
            }
        }
    ]

    return (
        <SubMenu>
            {
                location.pathname === "/" ? <>
                    <div>
                        <h4>Algorithms</h4>
                        {algorithms.map((algorithm, index) => <SubMenuItem key={index} {...algorithm} />)}
                    </div>
                    <div>
                        <h4>Arrangements</h4>
                        {arrangements.map((arrangement, index) => <SubMenuItem key={index} {...arrangement} />)}
                    </div>
                </> :
                    <SubMenuItem title="Go back to the graph" icon={BackArrow} callback={() => navigate("/")} />
            }
        </SubMenu>
    )
}
