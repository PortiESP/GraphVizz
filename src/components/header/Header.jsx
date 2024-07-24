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
import BackArrow from "../../assets/bend-arrow-left.svg?react"
import HomeIcon from "../../assets/home.svg?react"
import { useNavigate } from "react-router-dom"


const algorithms = [
    {
        title: "Breadth First Search (BFS)",
        icon: () => <BFSIcon />,
        callback: () => {}
    },
    {
        title: "Depth First Search (DFS)",
        icon: () => <DFSIcon />,
        callback: () => {}
    },
    {
        title: "Dijkstra",
        icon: () => <MapIcon />,
        callback: () => {}
    }
]

const arrangements = [
    {
        title: "Circular",
        icon: () => <BFSIcon />,
        callback: () => {}
    },
    {
        title: "Grid",
        icon: () => <DFSIcon />,
        callback: () => {}
    },
    {
        title: "Random",
        icon: () => <MapIcon />,
        callback: () => {}
    }
]


export default function Header(props) {

    const [zoom, setZoom] = useState(window.cvs?.zoom)
    const [showSharePopup, setShowSharePopup] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const [isGraphPage, setIsGraphPage] = useState(location.pathname === "/")

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
                        <li className={location.pathname === "/" ? scss.current: undefined}><Link to="/">Graph Editor</Link></li>
                        <li>Algorithms
                            <SubMenu>
                                {
                                    location.pathname === "/" ? <>
                                        <div>
                                            <h4>Algorithms</h4>
                                            {algorithms.map((algorithm, index) => <SubMenuItem key={index} {...algorithm}/>) }
                                        </div>
                                        <div>
                                            <h4>Arrangements</h4>
                                            {arrangements.map((arrangement, index) => <SubMenuItem key={index} {...arrangement}/>)}
                                        </div>
                                    </> :
                                    <SubMenuItem title="Go back to the graph" icon={BackArrow} callback={() => navigate("/")}/>
                                }
                            </SubMenu>
                        </li>
                        <li className={location.pathname === "/examples" ? scss.current: undefined}><Link to="/examples">Examples</Link></li>
                        <li className={location.pathname === "/help" ? scss.current: undefined}><Link to="/help">Help</Link></li>
                    </ul>
                </div>
                <div className={scss.menu_info}>
                    {
                        isGraphPage && 
                        <>
                        <button className={scss.share} onClick={handleShare}>Share</button>
                        <span className={scss.zoom} onClick={handleResetZoom}>{Math.round(zoom*100)}%</span>
                        </>
                    }
                </div>
            </nav>
        </header>
        { showMenu && <HamburgerMenu close={()=>setShowMenu(false)}/> }
        { showSharePopup && <SharePopup close={()=>setShowSharePopup(false)}/> }
        </>)
}


