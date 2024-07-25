import { Link } from "react-router-dom"
import scss from "./header.module.scss"
import { useState } from "react"
import { useEffect } from "react"
import Logo from "../../assets/logo.svg?react"
import SharePopup from "./share-popup/SharePopup"
import HamburgerMenu from "./hamburger-menu/Hamburger"
import { resetZoom } from "../graph-manager/canvas-component/utils/zoom"
import { focusOnAllNodes } from "../graph-manager/utils/view"
import { useLocation } from "react-router-dom"
import SubMenu, { SubMenuItem } from "./sub-menu/SubMenu"

import BFSIcon from "../../assets/bfs.svg?react"
import DFSIcon from "../../assets/dfs.svg?react"
import MapIcon from "../../assets/map.svg?react"
import GridIcon from "../../assets/grid.svg?react"
import RandomIcon from "../../assets/shuffle.svg?react"
import CircularIcon from "../../assets/circle-dashed.svg?react"
import BackArrow from "../../assets/bend-arrow-left.svg?react"
import HomeIcon from "../../assets/home.svg?react"
import DataTreeIcon from "../../assets/data-tree.svg?react"
import DataTree2Icon from "../../assets/data-tree2.svg?react"

import { useNavigate } from "react-router-dom"
import { generateAdjacencyList } from "../graph-manager/utils/algorithms/algorithm_utils/generate_graph"
import bfs from "../graph-manager/utils/algorithms/bfs"
import dfs from "../graph-manager/utils/algorithms/dfs"
import { generateEdgesByPredecessors, generateEdgesPathByPredecessors } from "../graph-manager/utils/algorithms/algorithm_utils/convertions"
import { circularArrange, gridArrange, randomArrange, treeArrange } from "../graph-manager/utils/arrangements"
import SelectNodesView from "./views/SelectNodesView"
import SelectNodeView from "./views/SelectNodeView"
import dijkstra from "../graph-manager/utils/algorithms/dijkstra"


export default function Header(props) {

    const [zoom, setZoom] = useState(window.cvs?.zoom)
    const [showSharePopup, setShowSharePopup] = useState(false)
    const [view, setView] = useState(false)
    const [viewProps, setViewProps] = useState(false)
    const [hiddenView, setHiddenView] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const [isGraphPage, setIsGraphPage] = useState(location.pathname === "/")

    const algorithms = [
        {
            title: "Breadth First Search (BFS)",
            icon: () => <BFSIcon />,
            callback: () => {
                const adjList = generateAdjacencyList()
                const { result, prevNode } = bfs(adjList, window.graph.nodes[0])
                const edges = generateEdgesByPredecessors(prevNode)
                result.forEach((node, i) => node.bubble = i)
                window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                setView("alert")
                setHiddenView(null)
            }
        },
        {
            title: "Depth First Search (DFS)",
            icon: () => <DFSIcon />,
            callback: () => {
                const adjList = generateAdjacencyList()
                const { result, prevNode } = dfs(adjList, window.graph.nodes[0])
                const edges = generateEdgesByPredecessors(prevNode)
                result.forEach((node, i) => node.bubble = i)
                window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
                setView("alert")
                setHiddenView(null)
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
        }
    ]

    const arrangements = [
        {
            title: "Circular",
            icon: () => <CircularIcon />,
            callback: () => {
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
                randomArrange(window.graph.nodes)
                focusOnAllNodes()
            }
        },
        {
            title: "Tree (bfs)",
            icon: () => <DataTree2Icon />,
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
            icon: () => <DataTreeIcon />,
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
        }
    ]


    // ===================================================

    useEffect(() => {
        setIsGraphPage(location.pathname === "/")
        setShowMenu(false)
        setHiddenView(false)
        setView(null)
        setShowSharePopup(false)
        setViewProps(null)
    }, [location])

    useEffect(() => {
        window.setZoom = setZoom
    }, [])

    const handleShare = () => {
        setShowSharePopup(true)
    }

    const handleResetZoom = () => {
        resetZoom()
        focusOnAllNodes(false)  // Focus on all nodes without zooming
    }

    const closeView = () => {
        window.graph.nodes.forEach(node => node.hidden = false)
        window.graph.nodes.forEach(node => node.bubble = null)
        window.graph.edges.forEach(edge => edge.hidden = false)
        setView(false)
    }

    useEffect(() => {
        setHiddenView(false)
    }, [view])

    return (<>
        <header className={scss.header_wrap}>
            <nav>
                <div className={scss.menu_logo}>
                    {
                        isGraphPage &&
                        <div className={scss.list_icon} onClick={() => setShowMenu(old => !old)}>
                            <HomeIcon />
                        </div>
                    }
                    <Link to="/">
                        <div className={scss.logo}>
                            <Logo />
                        </div>
                    </Link>
                </div>
                <div className={scss.menu_options}>
                    <ul>
                        <li className={location.pathname === "/" ? scss.current : undefined}><Link to="/">Graph Editor</Link></li>
                        <li>Algorithms
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
                        </li>
                        <li className={location.pathname === "/examples" ? scss.current : undefined}><Link to="/examples">Examples</Link></li>
                        <li className={location.pathname === "/help" ? scss.current : undefined}><Link to="/help">Help</Link></li>
                        {
                            view && <>
                                <hr />
                                <li className={scss.view_item}>View<SubMenu>
                                    {<>
                                        <div>
                                            {view !== "alert" && <SubMenuItem title="Open view menu" callback={() => setHiddenView(false)} />}
                                            <SubMenuItem title="Close view" callback={() => closeView()} />
                                        </div>
                                    </>}
                                </SubMenu>
                                </li></>
                        }
                    </ul>
                    {
                        view === "select-nodes" && <SelectNodesView options={viewProps} /> ||
                        view === "select-node" && <SelectNodeView options={viewProps} />
                    }
                </div>

                <div className={scss.menu_info}>
                    {
                        isGraphPage &&
                        <>
                            <button className={scss.share} onClick={handleShare}>Share</button>
                            <span className={scss.zoom} onClick={handleResetZoom}>{Math.round(zoom * 100)}%</span>
                        </>
                    }
                </div>
            </nav>
        </header>
        {showMenu && <HamburgerMenu close={() => setShowMenu(false)} />}
        {showSharePopup && <SharePopup close={() => setShowSharePopup(false)} />}
    </>)
}
