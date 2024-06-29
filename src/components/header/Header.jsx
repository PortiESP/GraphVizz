import { Link } from "react-router-dom"
import scss from "./header.module.scss"
import ListIcon from "../../assets/list"
import { useState } from "react"
import { useEffect } from "react"
import Logo from "../../assets/logo"
import { generateEdgeAndNodesList } from "../graph-manager/utils/algorithms/algorithm_utils/generate_graph"
import SharePopup from "./share-popup/SharePopup"

export default function Header(props) {

    const [zoom, setZoom] = useState(window.cvs?.zoom)
    const [showSharePopup, setShowSharePopup] = useState(false)

    useEffect(() => {
        window.setZoom = setZoom
    }, [])

    const handleShare = () => {
        setShowSharePopup(true)
    }

    return (<>
        <header className={scss.header_wrap}>
            <nav>
                <div className={scss.menu_logo}>
                    <div className={scss.list_icon}>
                        <ListIcon />
                    </div>
                    <Link to="/">
                        <div className={scss.logo}>
                            <Logo />
                        </div>
                    </Link>
                </div>
                <div className={scss.menu_options}>
                    <ul>
                        <li>Load graph</li>
                        <li>Algorithms</li>
                        <li>Settings</li>
                        <li><Link to="/help">Help</Link></li>
                    </ul>
                </div>
                <div className={scss.menu_info}>
                    <button className={scss.share} onClick={handleShare}>Share</button>
                    <span className={scss.zoom}>{Math.round(zoom*100)}%</span>
                </div>
            </nav>
        </header>
        { showSharePopup && <SharePopup close={()=>setShowSharePopup(false)}/> }
        </>)
}
