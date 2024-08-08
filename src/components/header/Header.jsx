import scss from "./header.module.scss"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

// Components & functions
import SharePopup from "./share-popup/SharePopup"
import { focusOnAllNodes } from "@components/graph-manager/utils/view"
import { resetZoom } from "@components/graph-manager/canvas-component/utils/zoom"
import Nav from "./nav/Nav"


export default function Header() {

    const location = useLocation()

    const [isShowSharePopup, setIsShowSharePopup] = useState(false)  // Share popup visibility
    const [isGraphPage, setIsGraphPage] = useState(location.pathname === "/")  // Check if the user is on the graph page
    const [zoom, setZoom] = useState(window.cvs?.zoom || 1)  // Zoom level in %


    // Store the zoom function in the window object
    useEffect(() => {
        window.ui.set("setZoomLabel", setZoom)
    }, [])

    // When the user navigates to a different page, close the hamburger menu, share popup, etc.
    useEffect(() => {
        setIsGraphPage(location.pathname === "/")
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
        {isShowSharePopup && <SharePopup close={() => setIsShowSharePopup(false)} />}
    </>)
}
