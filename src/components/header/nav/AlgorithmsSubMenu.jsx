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
                {data.rows.map((row, index) => <tr key={index} onClick={() => data.rowsClick && data.rowsClick(index)}>
                    {row.map((cell, index) => <td key={index}>{cell}</td>)}
                </tr>)}
            </tbody>
        </table>
    }
    const paintPath = (path) => {
        const edges = generateEdgesByNodesPath(path)
        window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
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
                            parsedData[node] = { step, prev, visited }
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
                            parsedData[node] = { step, prev, visited }
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
                const nodes = getNodeIDs()
                window.ui.call("setView", {
                    type: "1-select",
                    title: "Choose the initial node",
                    tip: "Select the starting node",
                    label: "Starting node",
                    options: nodes,
                    onChange: (selectedNode) => {
                        // Algorithm
                        const adjList = generateAdjacencyList()
                        const startNode = window.graph.findNodeById(selectedNode)
                        const data = hamiltonianPath(adjList, startNode, true)
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result

                        if (data) paintPath(data.path)
                        else window.graph.edges.forEach(edge => edge.hidden = true)

                        return data ?
                            generateTable({
                                headings: ["Path"],
                                rows: data.all.map(path => [path.map(node => node.id).join(" → ")]),
                                rowsClick: (i) => paintPath(data.all[i])
                            })
                            : <span className={scss.error}>No valid path found, try changing the starting point</span>
                    }
                })
            }
        },
        {
            title: "Hamiltonian Path (one)",
            icon: () => <PathIcon />,
            callback: () => {
                const nodes = getNodeIDs()
                window.ui.call("setView", {
                    type: "1-select",
                    title: "Choose the initial node",
                    tip: "Select the starting node",
                    label: "Starting node",
                    options: nodes,
                    onChange: (selectedNode) => {
                        // Algorithm
                        const adjList = generateAdjacencyList()
                        const startNode = window.graph.findNodeById(selectedNode)
                        const data = hamiltonianPath(adjList, startNode)
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
                        if (data) paintPath(data.path)
                        else window.graph.edges.forEach(edge => edge.hidden = true)

                        return data ?
                            generateTable({
                                headings: ["Path"],
                                rows: [[data.path.map(node => node.id).join(" → ")]]
                            })
                            : <span className={scss.error}>No valid path found, try changing the starting point</span>
                    }
                })
            }
        },
        {
            title: "Hamiltonian Cycle (all)",
            icon: () => <CycleIcon />,
            callback: () => {
                window.ui.call("setView", {
                    type: "1-select",
                    title: "Choose the initial node",
                    tip: "Select the starting node",
                    label: "Starting node",
                    options: getNodeIDs(),
                    onChange: (selectedNode) => {
                        // Algorithm
                        const adjList = generateAdjacencyList()
                        const data = hamiltonianCycle(adjList, selectedNode, true, true)
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
                        if (data) paintPath(data.path)
                        else window.graph.edges.forEach(edge => edge.hidden = true)

                        return data ?
                            generateTable({
                                headings: ["Path"],
                                rows: data.all.map(path => [path.map(node => node.id).join(" → ")]),
                                rowsClick: (i) => paintPath(data.all[i])
                            })
                            : <span className={scss.error}>No valid cycle found, try changing the starting point</span>
                    }
                })
            }
        },
        {
            title: "Hamiltonian Cycle (one)",
            icon: () => <CycleIcon />,
            callback: () => {
                window.ui.call("setView", {
                    type: "1-select",
                    title: "Choose the initial node",
                    tip: "Select the starting node",
                    label: "Starting node",
                    options: getNodeIDs(),
                    onChange: (selectedNode) => {
                        // Algorithm
                        const adjList = generateAdjacencyList()
                        const data = hamiltonianCycle(adjList, selectedNode, false, true)
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
                        if (data) paintPath(data.path)
                        else window.graph.edges.forEach(edge => edge.hidden = true)

                        return data ?
                            generateTable({
                                headings: ["Path"],
                                rows: [[data.path.map(node => node.id).join(" → ")]],
                            })
                            : <span className={scss.error}>No valid cycle found, try changing the starting point</span>
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
                window.ui.call("setView", {
                    type: "info",
                    title: "Minimum Spanning Tree (Kruskal)",
                    info: "Minimum Spanning Tree (MST) calculated using Kruskal's algorithm",
                    setup: () => {
                        // Algorithm
                        const data = kruskal(generateAdjacencyList())
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
                        window.graph.edges.forEach(edge => edge.hidden = !data.result.some(e => e.id === edge.id))
                        return generateTable({
                            headings: ["Min. weight"],
                            rows: [[data.totalWeight]],
                        })
                    }
                })
            },
        },
        {
            title: "Max. Spanning Tree (Kruskal)",
            icon: () => <FilterIcon />,
            callback: () => {
                window.ui.call("setView", {
                    type: "info",
                    title: "Maximum Spanning Tree (Kruskal)",
                    info: "Maximum Spanning Tree (MST) calculated using Kruskal's algorithm",
                    setup: () => {
                        // Algorithm
                        const data = kruskal(generateAdjacencyList(), true)
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
                        window.graph.edges.forEach(edge => edge.hidden = !data.result.some(e => e.id === edge.id))
                        return generateTable({
                            headings: ["Max. weight"],
                            rows: [[data.totalWeight]],
                        })
                    }
                })
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
                    type: "1-select",
                    title: "Choose the initial node",
                    tip: "Here the nodes are just grouped using numbers, for a visual representation, use the view 'Chromatic neighbors' view",
                    label: "Starting node",
                    options: getNodeIDs(),
                    onChange: (selectedNode) => {
                        // Algorithm
                        const g = generateAdjacencyList()
                        const data = selectedNode === "all" ? colorBorders(g) : colorBorders(g, selectedNode)
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
                        window.graph.nodes.forEach(node => node.bubble = data[node.id])

                        return <>
                        <div data-widget-type="quote">Total colors: <kbd>{Math.max(...Object.values(data))+1}</kbd></div>
                        {generateTable({
                            headings: ["Node", "Group"],
                            rows: Object.entries(data).map(([node, color]) => [node, color])
                        })}
                        </>
                    }
                })
            }
        },
        {
            title: "Nodes degree",
            icon: () => <DegIcon />,
            callback: () => {
                window.ui.call("setView", {
                    title: "Nodes degree",
                    message: "The nodes are colored by their degree",
                    type: "info",
                    info: "Nodes degree is the number of incident edges to a node",
                    setup: () => {
                        // Algorithm
                        const data = nodes_deg(window.graph)
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
                        window.graph.nodes.forEach(node => node.bubble = data[node.id])
                        return generateTable({
                            headings: ["Node", "Degree"],
                            rows: Object.entries(data).map(([node, degree]) => [node, degree])
                        })
                    }
                })
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
                    type: "1-select",
                    title: "Tree arrange (bfs)",
                    tip: "This will arrange the graph as a tree using Breadth First Search from the selected node",
                    label: "Root node",
                    options: getNodeIDs(),
                    onChange: (value) => {
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
                    type: "1-select",
                    title: "Tree arrange (dfs)",
                    tip: "This will arrange the graph as a tree using Depth First Search from the selected node",
                    label: "Root node",
                    options: getNodeIDs(),
                    onChange: (value) => {
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
                window.ui.call("setView", {
                    type: "info",
                    title: "Topological sort",
                    info: "The nodes are arranged in a topological order",
                    setup: () => {
                        // Arrange
                        const g = generateAdjacencyList()
                        const result = toposortArrange(g)
                        if (result.hasCycle) {
                            return <div data-widget-type="error">Unable to arrange. The graph <strong>has a cycle</strong></div>
                        } else {
                            const edges = generateEdgesByPredecessors(result.prevNode)
                            window.graph.nodes.forEach(node => node.bubble = result.levels[node.id])
                            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                            return generateTable({
                                headings: ["Node", "Level"],
                                rows: Object.entries(result.levels).map(([node, level]) => [node, level])
                            })
                        }
                    }
                })
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
                    type: "1-select",
                    title: "Chromatic neighbors",
                    tip: "The nodes are colored by their group",
                    label: "Starting node",
                    options: getNodeIDs(),
                    onChange: (selectedNode) => {
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
                window.ui.call("setView", {
                    type: "info",
                    title: "Degree heatmap",
                    info: "The nodes are colored by their degree",
                    setup: () => {
                        // Algorithm
                        const data = nodes_deg(window.graph)
                        const max = Math.max(...Object.values(data))
                        const min = Math.min(...Object.values(data))
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
                        const COLORS = heatmapColorGenerator(max-min+1)
                        Object.entries(data).forEach(([node, color]) => {
                            const nodeElement = window.graph.findNodeById(node)
                            nodeElement.style.backgroundColor = COLORS[color-min]
                        })
                        return <>
                            {generateTable({
                                headings: ["Min", "Max"],
                                rows: [[min, max]]
                            })}
                            {generateTable({
                                headings: ["Node", "Degree"],
                                rows: Object.entries(data).map(([node, degree]) => [node, degree])
                            })}
                        </>
                    }
                })
            }
        },
        {
            title: "Critical nodes",
            icon: () => <WifiOffIcon />,
            callback: () => {
                window.ui.call("setView", {
                    type: "info",
                    title: "Critical nodes",
                    info: "The nodes are colored by their degree",
                    setup: () => {
                        // Algorithm
                        const data = criticalNodes(generateAdjacencyList())
                        // Save result
                        window.ui.call("setLastResult", data)
                        // Paint result
                        data.forEach(node => {
                            const nodeElement = window.graph.findNodeById(node.id)
                            nodeElement.style.backgroundColor = "red"
                        })
                        return data.length ? generateTable({
                            headings: ["Node"],
                            rows: data.map(node => [node.id])
                        }): <div data-widget-type="quote">No critical nodes found</div>
                    }
                })
            }
        },
        {
            title: "Conex components",
            icon: () => <AtomIcon />,
            callback: () => {
                window.ui.call("setView", {
                    type: "info",
                    title: "Conex components",
                    info: "The nodes are colored by their conex component",
                    setup: () => {
                        // Algorithm
                        const g = generateAdjacencyList()
                        const result = conexComps(g)
                        const n = result.length
                        const colors = colorGenerator(n).reverse()
                        // Save result
                        window.ui.call("setLastResult", result)
                        // Paint result
                        result.forEach((comp, index) => {
                            comp.forEach(node => {
                                const nodeElement = window.graph.findNodeById(node.id)
                                nodeElement.style.backgroundColor = colors[index]
                            })
                        })
                        return generateTable({
                            headings: ["Node", "Conex. Component (group ID)"],
                            rows: result.map((comp, index) => comp.map(node => [node.id, index])).flat()
                        })
                    }
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
        window.ui.call("setLastResult", null)
        // <-- PRE
        cbk()
        // POST -->
        // <-- POST
    }

    const arrangementCallbackDecorator = cbk => () => {
        // PRE -->
        if (window.graph.isGraphEmpty()) return
        window.ui.call("setLastResult", null)
        // <-- PRE
        cbk()
        // POST -->
        focusOnAllNodes()
        // <-- POST
    }

    const viewCallbackDecorator = cbk => () => {
        // PRE -->
        if (window.graph.isGraphEmpty()) return
        window.ui.call("setLastResult", null)
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
