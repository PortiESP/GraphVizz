import scss from "./header.module.scss"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"

// Components & functions
import SharePopup from "./share-popup/SharePopup"
import { focusOnAllNodes } from "@components/graph-manager/utils/view"
import HamburgerMenu from "./hamburger-menu/Hamburger"
import { resetZoom } from "@components/graph-manager/canvas-component/utils/zoom"
import Nav from "./nav/Nav"

// Icons
import Logo from "@assets/logo.svg?react"
import HomeIcon from "@assets/home.svg?react"
import Modal from "./hamburger-menu/modal/Modal"

export default function Header() {

    const location = useLocation()

    const [isShowSharePopup, setIsShowSharePopup] = useState(false)  // Share popup visibility
    const [isShowHamburgerMenu, setIsShowHamburgerMenu] = useState(false)  // Hamburger menu visibility
    const [isGraphPage, setIsGraphPage] = useState(location.pathname === "/")  // Check if the user is on the graph page
    const [modal, setModal] = useState(null)  // Modal scene. Can be ["load_graph", "save_graph", "export_graph"]
    const [zoom, setZoom] = useState(window.cvs?.zoom || 1)  // Zoom level in %


    // Store the zoom function in the window object
    useEffect(() => {
        window.ui.setZoomLabel = setZoom
        window.ui.setModal = setModal
    }, [])

    // When the user navigates to a different page, close the hamburger menu, share popup, etc.
    useEffect(() => {
        setIsGraphPage(location.pathname === "/")
        setIsShowHamburgerMenu(false)
        setIsShowSharePopup(false)
    }, [location])

    // Show the share popup
    const showSharePopup = () => {
        setIsShowSharePopup(true)
    }

    // Reset the zoom level
    const handleResetZoom = () => {
        resetZoom()
        focusOnAllNodes(false)  // Focus on all nodes without zooming
    }

    return (<>
        <header className={scss.header_wrap}>
            <div className={scss.container}>
                {/* Left */}
                <div className={scss.menu_logo}>
                    {
                        // Display the hamburger menu icon only on the graph page
                        isGraphPage && <div className={scss.list_icon} onClick={() => setIsShowHamburgerMenu(old => !old)}><HomeIcon /></div>
                    }
                    <Link to="/"><div className={scss.logo}><Logo /></div></Link>
                </div>

                {/* Middle */}
                <div className={scss.menu_options}>
                    <Nav />
                </div>

                {/* Right */}
                <div className={scss.menu_info}>
                    {
                        // Hide share and zoom buttons when the user is not on the graph page
                        isGraphPage &&
                        <>
                            <button className={scss.share} onClick={showSharePopup}>Share</button>
                            <span className={scss.zoom} onClick={handleResetZoom}>{Math.round(zoom * 100)}%</span>
                        </>
                    }
                </div>
            </div>
        </header>
        {isShowHamburgerMenu && <HamburgerMenu close={() => setIsShowHamburgerMenu(false)} />}
        {isShowSharePopup && <SharePopup close={() => setIsShowSharePopup(false)} />}
        {modal && <Modal scene={modal} close={() => setModal(null)} />}
        </>)
}
