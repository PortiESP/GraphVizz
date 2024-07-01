import { Link } from "react-router-dom"
import scss from "./header.module.scss"
import ListIcon from "../../assets/list"
import { useState } from "react"
import { useEffect } from "react"
import Logo from "../../assets/logo"
import SharePopup from "./share-popup/SharePopup"
import HamburgerMenu from "./hamburger-menu/Hamburger"
import { resetZoom } from "../graph-manager/canvas-component/utils/zoom"
import { focusOnAllNodes } from "../graph-manager/utils/view"
import { useLocation } from "react-router-dom"
const HomeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.77778 10.2222V18C5.77778 19.1046 6.67321 20 7.77778 20H12M5.77778 10.2222L11.2929 4.70711C11.6834 4.31658 12.3166 4.31658 12.7071 4.70711L17.5 9.5M5.77778 10.2222L4 12M18.2222 10.2222V18C18.2222 19.1046 17.3268 20 16.2222 20H12M18.2222 10.2222L20 12M18.2222 10.2222L17.5 9.5M17.5 9.5V6M12 20V15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>

export default function Header(props) {

    const [zoom, setZoom] = useState(window.cvs?.zoom)
    const [showSharePopup, setShowSharePopup] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const location = useLocation()
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
                        <li><Link to="/">Graph</Link></li>
                        <li><Link to="/algorithms">Algorithms</Link></li>
                        <li><Link to="/examples">Examples</Link></li>
                        <li><Link to="/help">Help</Link></li>
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
