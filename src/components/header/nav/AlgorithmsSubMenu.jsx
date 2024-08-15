import scss from "./views.module.scss"

// Components & functions
import SubMenu, { SubMenuItem } from "./nav-sub-menu/SubMenu"
import { useNavigate } from "react-router-dom"
import { focusOnAllNodes } from "@components/graph-manager/utils/view"

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
import { colorGenerator, heatmapColorGenerator } from "@components/graph-manager/utils/algorithms/algorithm_utils/color_generator"
import nodes_deg from "@components/graph-manager/utils/algorithms/nodes_deg"
import { criticalNodes } from "@components/graph-manager/utils/algorithms/critical-nodes"
import conexComps from "@components/graph-manager/utils/algorithms/conex-comp"

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
import DegIcon from "@assets/deg.svg?react"
import WifiOffIcon from "@assets/wifi-off.svg?react"
import RevertIcon from "@assets/revert.svg?react"
import toast from "react-hot-toast"


export function copyToClipboard(data) {
    const parser = (key, value) => {
        const eType = value?.constructor?.name
        if (eType === "Node") return value.id
        if (eType === "Edge") return {src: value.src.id, dst: value.dst.id, weight: value.weight, directed: value.directed}
        return value
    }
    navigator.clipboard.writeText(JSON.stringify(data, parser, 2))
    .then(() => window.cvs.debug && console.log("Data copied to clipboard", data))
    .catch((e) => console.error("Failed to copy data to clipboard", data, e))
}

export default function AlgorithmsSubMenu() {

    const navigate = useNavigate()

    const getNodeIDs = () => window.graph.nodes.map(node => node.id)
    const generateTable = (data) => {
        return <table>
            <thead>
                {data.headings && <tr>
                    {data.headings.map((heading, index) => <th key={index}>{heading}</th>)}
                </tr>}
            </thead>
            <tbody>
                {data.rows.map((row, index) => <tr key={index}>
                    {row.map((cell, index) => <td key={index}>{cell}</td>)}
                </tr>)}
            </tbody>
        </table>
    }
                    

    const algorithms = [
        {
            title: "Paths",
            heading: true
        },
        {
            title: "Breadth First Search (BFS)",
            icon: () => <BFSIcon />,
            callback: () => {
                const nodes = getNodeIDs()
                window.ui.call("setView", {
                    type: "1-select",
                    title: "Breadth First Search (BFS)",
                    tip: "Select the starting node",
                    label: "Starting node",
                    options: nodes,
                    onChange: (selectedNode) => {
                        // Algorithm
                        const data = bfs(generateAdjacencyList(), selectedNode)
                        // Paint the result
                        const edges = generateEdgesByPredecessors(data.prevNode)
                        const steps = {}
                        data.result.forEach((node, i) => {
                            steps[node] = i
                            node.bubble = i
                        })
                        window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        // Save result
                        const parsedData = {}
                        nodes.map(node => {
                            const step = steps[node] ?? "-"
                            const prev = data.prevNode[node]?.id ?? "-"
                            const visited = data.visited[node]
                            parsedData[node] = {step, prev, visited}
                        })
                        // Store the result that can be copied to clipboard
                        window.ui.call("setLastResult", parsedData)
                        // Display additional JSX alongside the result
                        return generateTable({
                            headings: ["Node", "Step", "Prev. node"],
                            rows: nodes.map(node => {
                                const step = parsedData[node].step
                                const prev = parsedData[node].prev
                                return [node, step, prev]
                            })
                        })
                    }
                })
            }
        },
        {
            title: "Depth First Search (DFS)",
            icon: () => <DFSIcon />,
            callback: () => {
                const nodes = getNodeIDs()
                window.ui.call("setView", {
                    type: "1-select",
                    title: "Depth First Search (DFS)",
                    tip: "Select the starting node",
                    label: "Starting node",
                    options: nodes,
                    onChange: (selectedNode) => {
                        // Algorithm
                        const data = dfs(generateAdjacencyList(), selectedNode)
                        // Paint the result
                        const edges = generateEdgesByPredecessors(data.prevNode)
                        const steps = {}
                        data.result.forEach((node, i) => {
                            steps[node] = i
                            node.bubble = i
                        })
                        window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        // Save result
                        const parsedData = {}
                        nodes.map(node => {
                            const step = steps[node] ?? "-"
                            const prev = data.prevNode[node]?.id ?? "-"
                            const visited = data.visited[node]
                            parsedData[node] = {step, prev, visited}
                        })
                        // Store the result that can be copied to clipboard
                        window.ui.call("setLastResult", parsedData)
                        // Display additional JSX alongside the result
                        return generateTable({
                            headings: ["Node", "Step", "Prev. node"],
                            rows: nodes.map(node => {
                                const step = parsedData[node].step
                                const prev = parsedData[node].prev
                                return [node, step, prev]
                            })
                        })
                    }
                })
            }
        },
        {
            title: "Dijkstra",
            icon: () => <MapIcon />,
            callback: () => {
                const nodes = getNodeIDs()
                window.ui.call("setView", {
                    title: "Dijkstra's algorithm",
                    type: "2-select",
                    tip: "Select the initial and destination nodes",
                    labelA: "Initial node",
                    optionsA: [...nodes],
                    labelB: "Destination node",
                    optionsB: ["all", ...nodes],
                    defaultB: "all",
                    labelAB: "to",
                    onChange: (v, sID, values) => {
                        // Algorithm
                        const node1 = values[0]
                        const node2 = values[1]
                        const g = generateAdjacencyList()
                        const result = dijkstra(g, node1)
                        if (window.cvs.debug) console.log("Dijkstra result", result)
                        // Save result
                        window.ui.call("setLastResult", result)
                        // Paint the result
                        const disabled = result[node2]?.distance === Infinity
                        if (node2 === "all") {
                            const predecessors = Object.fromEntries(Object.entries(result).map(([node, data]) => [node, data.prevNode]))
                            const edges = generateEdgesByPredecessors(predecessors)
                            window.graph.nodes.forEach(node => node.bubble = result[node.id].distance === Infinity ? "∞" : result[node.id].distance)
                            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        } else {
                            const target = window.graph.findNodeById(node2)
                            const prevs = Object.entries(result).map(([node, data]) => [node, data.prevNode])
                            const edges = disabled ? [] : generateEdgesPathByPredecessors(Object.fromEntries(prevs), node1, node2)
                            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                            target.bubble = result[node2].distance === Infinity ? "∞" : result[node2].distance
                        }

                        // Display additional JSX alongside the result
                        return generateTable({
                            headings: ["Node", "Distance", "Prev. node"],
                            rows: nodes.map(node => {
                                const distance = result[node].distance === Infinity ? "∞" : result[node].distance
                                const prev = result[node].prevNode ?? "-"
                                return [node, distance, prev]
                            })
                        })
                    },
                })
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
                window.ui.call("setView", {
                    title: "Choose the initial node",
                    callback: (selectedNode) => {
                        const paintPath = (path) => {
                            const edges = generateEdgesByNodesPath(path)
                            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        }
                        // Algorithm
                        const adjList = generateAdjacencyList()
                        const startNode = window.graph.findNodeById(selectedNode)
                        const data = hamiltonianPath(adjList, startNode, true)
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
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
            }
        },
        {
            title: "Hamiltonian Path (one)",
            icon: () => <PathIcon />,
            callback: () => {

                window.ui.call("setView", {
                    title: "Choose the initial node",
                    callback: (selectedNode) => {
                        const paintPath = (path) => {
                            const edges = generateEdgesByNodesPath(path)
                            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        }
                        // Algorithm
                        const adjList = generateAdjacencyList()
                        const startNode = window.graph.findNodeById(selectedNode)
                        const data = hamiltonianPath(adjList, startNode)
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
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
            }
        },
        {
            title: "Hamiltonian Cycle (all)",
            icon: () => <CycleIcon />,
            callback: () => {
                window.ui.call("setView", {
                    title: "Choose the initial node",
                    callback: (selectedNode) => {
                        const paintPath = (path) => {
                            const edges = generateEdgesByNodesPath(path)
                            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        }
                        // Algorithm
                        const adjList = generateAdjacencyList()
                        const data = hamiltonianCycle(adjList, selectedNode, true, true)
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
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
            }
        },
        {
            title: "Hamiltonian Cycle (one)",
            icon: () => <CycleIcon />,
            callback: () => {
                window.ui.call("setView", {
                    title: "Choose the initial node",
                    callback: (selectedNode) => {
                        const paintPath = (path) => {
                            const edges = generateEdgesByNodesPath(path)
                            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                        }
                        // Algorithm
                        const adjList = generateAdjacencyList()
                        const data = hamiltonianCycle(adjList, selectedNode, false, true)
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
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
            }
        },
        {
            title: "Spanning Trees",
            heading: true
        },
        {
            title: "Min. Spanning Tree (Kruskal)",
            icon: () => <FilterIcon />,
            callback: () => {
                // Algorithm
                const data = kruskal(generateAdjacencyList())
                toast(`Min. weight: ${data.totalWeight}`, {duration: 5000, icon: "👁️"})
                // Save result
                window.ui.call("setLastResult", data)
                // Paint result
                window.graph.edges.forEach(edge => edge.hidden = !data.result.some(e => e.id === edge.id))

            }
        },
        {
            title: "Max. Spanning Tree (Kruskal)",
            icon: () => <FilterIcon />,
            callback: () => {
                // Algorithm
                const data = kruskal(generateAdjacencyList(), true)
                toast("Max. weight: " + data.totalWeight, {duration: 5000, icon: "👁️"})
                // Save result
                window.ui.call("setLastResult", data)
                // Paint result
                window.graph.edges.forEach(edge => edge.hidden = !data.result.some(e => e.id === edge.id))
            }
        },
        {
            title: "Other algorithms",
            heading: true
        },
        {
            title: "Chromatic number",
            icon: () => <ColorsIcon />,
            callback: () => {
                window.ui.call("setView", {
                    title: "Choose the initial node",
                    callback: (selectedNode) => {
                        // Algorithm
                        const g = generateAdjacencyList()
                        const data = selectedNode === "all" ? colorBorders(g) : colorBorders(g, selectedNode)
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
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
            }
        },
        {
            title: "Nodes degree",
            icon: () => <DegIcon />,
            callback: () => {
                // Algorithm
                const data = nodes_deg(window.graph)
                toast("Nodes degrees displayed", {duration: 5000, icon: "👁️"})
                // Save result
                window.ui.call("setLastResult", data)
                // Paint result
                window.graph.nodes.forEach(node => node.bubble = data[node.id])
            }
        }
    ]

    const arrangements = [
        {
            title: "Shapes",
            heading: true
        },
        {
            title: "Circular",
            icon: () => <CircularIcon />,
            callback: () => {
                // Arrange
                circularArrange(window.graph.nodes)
            }
        },
        {
            title: "Grid",
            icon: () => <GridIcon />,
            callback: () => {
                // Arrange
                gridArrange(window.graph.nodes)
            }
        },
        {
            title: "Trees",
            heading: true
        },
        {
            title: "Tree (bfs)",
            icon: () => <BFSIcon />,
            callback: () => {
                window.ui.call("setView", {
                    title: "Select the root node",
                    callback: (value) => {
                        // Arrange
                        const start = window.graph.findNodeById(value)
                        const data = treeArrange(start, "bfs")
                        const edges = generateEdgesByPredecessors(data.prevNode)
                        window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                    }
                })
            }
        },
        {
            title: "Tree (dfs)",
            icon: () => <DFSIcon />,
            callback: () => {
                window.ui.call("setView", {
                    title: "Select the root node",
                    callback: (value) => {
                        // Arrange
                        const start = window.graph.findNodeById(value)
                        const data = treeArrange(start, "dfs")
                        const edges = generateEdgesByPredecessors(data.prevNode)
                        window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                    }
                })
            }
        },
        {
            title: "Toposort",
            icon: () => <BrokenLinkIcon />,
            callback: () => {
                // Arrange
                const g = generateAdjacencyList()
                const result = toposortArrange(g)

                if (result.hasCycle) {
                    toast.error("The graph has a cycle")
                } else {
                    const edges = generateEdgesByPredecessors(result.prevNode)
                    toast.success("Success")
                    
                    window.graph.nodes.forEach(node => node.bubble = result.levels[node.id])
                    window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                }
            }
        },
        {
            title: "Unordered",
            heading: true
        },
        {
            title: "Organic",
            icon: () => <AtomIcon />,
            callback: () => {
                // Arrange
                organicArrange()
            }
        },
        {
            title: "Random",
            icon: () => <RandomIcon />,
            callback: () => {
                // Arrange
                randomArrange(window.graph.nodes)
            }
        },
    ]

    const views = [
        {
            title: "Color",
            heading: true
        },
        {
            title: "Chromatic neighbors",
            icon: () => <ColorsIcon />,
            callback: () => {
                window.ui.call("setView", {
                    title: "Choose the initial node",
                    callback: (selectedNode) => {
                        // Algorithm
                        const g = generateAdjacencyList()
                        const data = selectedNode === "all" ? colorBorders(g) : colorBorders(g, selectedNode)
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
                        const COLORS = colorGenerator(Math.max(...Object.values(data))+1)

                        Object.entries(data).forEach(([node, color]) => {
                            const nodeElement = window.graph.nodes.find(n => n.id === node)
                            nodeElement.style.backgroundColor = COLORS[color]
                        })
                    }
                })
            }
        },
        {
            title: "Heatmaps",
            heading: true
        },
        {
            title: "Degree",
            icon: () => <DegIcon />,
            callback: () => {
                // Algorithm
                const data = nodes_deg(window.graph)
                const max = Math.max(...Object.values(data))
                const min = Math.min(...Object.values(data))                
                window.ui.call("setView", {
                    title: "Degree heatmap",
                    message: `Min: ${min}, Max: ${max}`,
                    type: "info"
                })
                toast(`Degree heatmap: min[${min}] max[${max}]`, {duration: 5000, icon: "👁️"})
                // Save result
                window.ui.call("setLastResult", data)
                // Paint result
                const COLORS = heatmapColorGenerator(max-min+1)
                Object.entries(data).forEach(([node, color]) => {
                    const nodeElement = window.graph.findNodeById(node)
                    nodeElement.style.backgroundColor = COLORS[color-min]
                })
            }
        },
        {
            title: "Critical nodes",
            icon: () => <WifiOffIcon />,
            callback: () => {
                // Algorithm
                const nodes = criticalNodes(generateAdjacencyList())
                toast(`Critical nodes: ${nodes.length}`, {duration: 5000, icon: "👁️"})
                // Save result
                window.ui.call("setLastResult", nodes)
                // Paint result
                window.graph.nodes.forEach(node => {
                    const critical = nodes.includes(node)
                    node.style.backgroundColor = critical ? "red" : "hsl(120, 100%, 45%)"
                })
            }
        },
        {
            title: "Conex components",
            icon: () => <AtomIcon />,
            callback: () => {
                // Algorithm
                const g = generateAdjacencyList()
                const result = conexComps(g)
                const n = result.length
                const colors = colorGenerator(n).reverse()
                toast(`Conex components: ${n}`, {duration: 5000, icon: "👁️"})
                // Save result
                window.ui.call("setLastResult", result)
                // Paint result
                result.forEach((comp, index) => {
                    comp.forEach(node => {
                        const nodeElement = window.graph.findNodeById(node.id)
                        nodeElement.style.backgroundColor = colors[index]
                    })
                })

            }
        },
        {
            title: "Reset",
            heading: true,
        },
        {
            title: "Default style",
            icon: () => <RevertIcon />,
            callback: () => {
                window.ui.call("setView", null)
                window.graph.getElements().forEach(element => element.resetStyle())
            }
        },
    ]

    const algorithmCallbackDecorator = cbk => () => {
        // PRE -->
        if (window.graph.isGraphEmpty()) return
        // <-- PRE
        cbk()
        // POST -->
        // <-- POST
    }

    const arrangementCallbackDecorator = cbk => () => {
        // PRE -->
        if (window.graph.isGraphEmpty()) return
        // <-- PRE
        cbk()
        // POST -->
        focusOnAllNodes()
        // <-- POST
    }

    const viewCallbackDecorator = cbk => () => {
        // PRE -->
        if (window.graph.isGraphEmpty()) return
        // <-- PRE
        cbk()
        // POST -->
        // <-- POST
    }

    return (
        <SubMenu>
            {
                location.pathname === "/" 
                ? <>
                    <div>
                        <h4>Algorithms</h4>
                        {algorithms.map((algorithm, index) => <SubMenuItem key={index} {...algorithm} callback={algorithmCallbackDecorator(algorithm.callback)} />)}
                    </div>
                    <div>
                        <h4>Arrangements</h4>
                        {arrangements.map((arrangement, index) => <SubMenuItem key={index} {...arrangement} callback={arrangementCallbackDecorator(arrangement.callback)}/>)}
                    </div>
                    <div>
                        <h4>Views</h4>
                        {views.map((view, index) => <SubMenuItem key={index} {...view} callback={viewCallbackDecorator(view.callback)}/>)}
                    </div>
                </> 
                : <SubMenuItem title="Go back to the graph" icon={BackArrow} callback={() => navigate("/")} />
            }
        </SubMenu>
    )
}
