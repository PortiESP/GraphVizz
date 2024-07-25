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
import ArrowR from "../../assets/arrow-right.svg?react"
import { useNavigate } from "react-router-dom"
import { generateAdjacencyList } from "../graph-manager/utils/algorithms/algorithm_utils/generate_graph"
import bfs from "../graph-manager/utils/algorithms/bfs"
import dfs from "../graph-manager/utils/algorithms/dfs"
import { generateEdgesByPredecessors, generateEdgesPathByPredecessors } from "../graph-manager/utils/algorithms/algorithm_utils/convertions"
import { circularArrange } from "../graph-manager/utils/arrangements"
import dijkstra from "../graph-manager/utils/algorithms/dijkstra"


export default function Header(props) {

    const [zoom, setZoom] = useState(window.cvs?.zoom)
    const [showSharePopup, setShowSharePopup] = useState(false)
    const [view, setView] = useState(false)
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
            }
        },
        {
            title: "Dijkstra",
            icon: () => <MapIcon />,
            callback: () => {
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
            callback: () => { }
        },
        {
            title: "Random",
            icon: () => <RandomIcon />,
            callback: () => { }
        }
    ]


    // ===================================================

    useEffect(() => {
        setIsGraphPage(location.pathname === "/")
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
                    </ul>
                    {
                        view === "alert" && <AlertView setView={setView} /> ||
                        view === "select-nodes" && <SelectNodesView setView={setView} />
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




function AlertView({setView}) {
    
    const resetView = () => {
        window.graph.nodes.forEach(node => node.hidden = false)
        window.graph.nodes.forEach(node => node.bubble = null)
        window.graph.edges.forEach(edge => edge.hidden = false)
        setView(false)
    }

    return <div className={[scss.menu_options_view_msg, scss.alert].join(" ")}>
        <span><strong>Warning: </strong> some elements may be hidden/shown in the current view</span>
        <button onClick={resetView}>Close view</button>
    </div>
}



function SelectNodesView(props) {

    const [src, setSrc] = useState(window.graph.nodes[0]?.id)  // Default source node (first node)
    const [dst, setDst] = useState("all")  // Default destination node (option: all)
    const [hide, setHide] = useState(false)
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
            window.graph.nodes.forEach(node => node.bubble = result[node.id].distance)
            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
        } else {
            const target = window.graph.nodes.find(node => node.id === dst)
            const prevs = Object.entries(result).map(([node, data]) => [node, data.prevNode])
            const edges = generateEdgesPathByPredecessors(Object.fromEntries(prevs), src, dst)
            window.graph.edges.forEach(edge => edge.hidden = !edges.includes(edge))
            target.bubble = result[dst].distance
        }
    }

    return <div className={[scss.menu_options_view_msg, scss.select_nodes].join(" ")}>
        {
            !hide ? <>
            <span>Choose an initial node and a target node</span>
            <div className={scss.inputs}>
                <div className={scss.nodes_selector_group}>
                    <label>Initial node</label>
                    <select onChange={e => setSrc(e.target.value)} defaultValue={src}>
                        {window.graph.nodes.map((node, index) => <option key={index} value={node.id}>{node.id}</option>)}
                    </select>
                </div>
                <ArrowR />
                <div className={scss.nodes_selector_group}>
                    <label>Dst. node</label>
                    <select onChange={e => setDst(e.target.value)} defaultValue={dst}>
                        <option value="all">All</option>
                        {window.graph.nodes.map((node, index) => <option key={index} value={node.id}>{node.id}</option>)}
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
            <button onClick={()=>setHide(true)}>Hide menu</button>
            <hr />
            <button onClick={closeView}>Close view</button>
            </> : 
            <div className={scss.hidden_menu} onClick={()=>setHide(false)}>
                <span>Dijkstra's view</span>
                <div>
                    <button onClick={() => setHide(false)}>Show menu</button>
                    <button onClick={closeView}>Reset view</button>
                </div>
            </div>
        }
    </div>
}