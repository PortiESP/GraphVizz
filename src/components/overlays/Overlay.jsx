import scss from "./overlay.module.scss"
import { useState } from "react"

// Components
import LiveEditor from "./live-editor/OverlayLiveEditor"
import ElementEditor from "./element-editor/OverlayElementEditor"
import ToolBarOverlay from "./tool-bar/ToolBar"

// Icons
import CloseIcon from "@assets/close.svg?react"
import PaletteIcon from "@assets/palette.svg?react"
import KbdIcon from "@assets/keyboard.svg?react"
import HelpIcon from "@assets/info.svg?react"
import Welcome from "./welcome/Welcome"
import { useNavigate } from "react-router-dom"


/**
 * ToolOverlay component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The children of the component. The canvas
 */
export default function ToolOverlay(props) {

    return (
        <div className={scss.wrap}>
            <div className={scss.canvas_wrap}>
                {props.children}
            </div>
            <AsideOverlay title="Live Editor" closeIcon={<KbdIcon />} help="to-live-editor">
                <LiveEditor />
            </AsideOverlay>
            <AsideOverlay title="Element Editor" right closeIcon={<PaletteIcon />} help="to-element-editor">
                <ElementEditor />
            </AsideOverlay>
            <ToolBarOverlay />
            <Welcome/>
        </div>
    )
}


/**
 * AsideOverlay component
 * 
 * @param {Object} props
 * @param {String} props.title - The title of the overlay
 * @param {React.ReactNode} props.children - The children of the overlay
 * @param {React.ReactNode} props.closeIcon - The icon to show when the overlay is closed
 * @param {Boolean} props.right - If the overlay should be on the right side. Left side by default
 */
function AsideOverlay(props) {
    const [closed, setClosed] = useState(true)
    const nav = useNavigate()

    const closedClass = props.right ? scss.closed_right : scss.closed_left
    const className = props.right ? scss.overlay_right : scss.overlay_left

    return (<>
        <div className={[scss.overlay, className, closed ? closedClass : ""].join(" ")}>
            <div className={scss.title}>
                {props.title}
                <HelpIcon onClick={e => nav("/help#"+props.help)}/>
                <div className={scss.toggle} onClick={() => setClosed(old => !old)}>
                    <CloseIcon />
                </div>
            </div>
            <div className={scss.widget_wrap}>
                {props.children}
            </div>
        </div>
        {
            closed &&
            <div className={[scss.closed_overlay, closedClass].join(" ")} onClick={() => setClosed(false)}>
                {props.closeIcon}
            </div>
        }
    </>)
}

