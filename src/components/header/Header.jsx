import scss from "./header.module.scss"
{/* Import svg */ }
import ListIcon from "../../assets/list"
import { useState } from "react"
import { useEffect } from "react"
import Logo from "../../assets/logo"

export default function Header(props) {

    const [zoom, setZoom] = useState(window.cvs?.zoom)

    useEffect(() => {
        window.setZoom = setZoom
    }, [])

    return (
        <header className={scss.header_wrap}>
            <nav>
                <div className={scss.menu_logo}>
                    <div className={scss.list_icon}>
                        <ListIcon />
                    </div>
                    <div className={scss.logo}>
                        <Logo />
                    </div>
                </div>
                <div className={scss.menu_options}>
                    <ul>
                        <li>Load graph</li>
                        <li>Algorithms</li>
                        <li>Settings</li>
                        <li>Help</li>
                    </ul>
                </div>
                <div className={scss.menu_info}>
                    <button className={scss.share}>Share</button>
                    <span className={scss.zoom}>{Math.round(zoom*100)}%</span>
                </div>
            </nav>
        </header>
    )
}
