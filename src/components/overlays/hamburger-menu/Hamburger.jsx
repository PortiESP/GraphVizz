import scss from "./hamburger.module.scss"
import { useNavigate } from "react-router-dom"

// Components & functions
import { redo, undo } from "@components/graph-manager/utils/memento"
import { focusOnAllNodes } from "@components/graph-manager/utils/view"
import { zoomCenterBy } from "@components/graph-manager/canvas-component/utils/zoom"
import { clearCache } from "@components/graph-manager/utils/cache"

// Icons
import NoteIcon from "@assets/note.svg?react"
import SaveIcon from "@assets/save.svg?react"
import ImportIcon from "@assets/import.svg?react"
import ExportIcon from "@assets/export.svg?react"
import UndoIcon from "@assets/undo.svg?react"
import RedoIcon from "@assets/redo.svg?react"
import FocusAllIcon from "@assets/focus-all.svg?react"
import InfoIcon from "@assets/info.svg?react"
import ZoomIn from "@assets/zoom-in.svg?react"
import ZoomOut from "@assets/zoom-out.svg?react"
import BugIcon from "@assets/bug.svg?react"
import Logo from "@assets/logo.svg?react"
import HomeIcon from "@assets/home.svg?react"
import { useState } from "react"
import toast from "react-hot-toast"

/**
 * Hamburger menu component
 * 
 * @returns {JSX.Element} 
 */
export default function HamburgerMenu() {

    const navigator = useNavigate()  // Hook to navigate between routes
    const [isShowHamburgerMenu, setIsShowHamburgerMenu] = useState(false)
    const close = () => { setIsShowHamburgerMenu(false) }

    // Callback functions of the menu items
    const resetGraph = () => { close(); window.graph.reset(); clearCache(); navigator("/"); toast.success("Empty graph loaded") } // Function to reset the graph
    const loadModal = () => { window.ui.call("setModal", "load_graph") } // Function to open the load graph modal
    const saveModal = () => { window.ui.call("setModal", "save_graph") } // Function to open the save graph modal
    const exportModal = () => { window.ui.call("setModal", "export_graph") } // Function to open the export graph modal
    const visitHelp = () => { close(); navigator("/help") } // Function to navigate to the help page
    const visitGithub = () => { close(); window.open("https://github.com/PortiESP/GraphVizz/issues", "_blank"); } // Function to navigate to the help page
    
    return (
        <>
            <div className={scss.menu_wrap}>
                <div className={scss.menu_icon} onClick={() => setIsShowHamburgerMenu(old => !old)}><HomeIcon /></div>
                {
                    isShowHamburgerMenu && 
                    <div className={scss.wrap} onClick={e => e.target.className === scss.wrap && setIsShowHamburgerMenu(false)}>
                        <menu >
                            <MenuItem label="New empty graph" shortcut="Ctrl+Alt+N" onClick={resetGraph} icon={NoteIcon}></MenuItem>
                            <MenuItem label="Save as..." shortcut="Ctrl+Shift+S" onClick={saveModal} icon={SaveIcon}></MenuItem>
                            <MenuItem label="Load from..." shortcut="Ctrl+O" onClick={loadModal} icon={ImportIcon}></MenuItem>
                            <MenuItem label="Export as..." shortcut="Ctrl+Shift+E" onClick={exportModal} icon={ExportIcon}></MenuItem>
                            <hr />
                            <MenuItem label="Undo" shortcut="Ctrl+Z" onClick={undo} icon={UndoIcon}></MenuItem>
                            <MenuItem label="Redo" shortcut="Ctrl+Shift+Z" onClick={redo} icon={RedoIcon}></MenuItem>
                            <MenuItem label="Zoom In" shortcut="wheelUp" onClick={() => zoomCenterBy(1.1)} icon={ZoomIn}></MenuItem>
                            <MenuItem label="Zoom Out" shortcut="wheelDown" onClick={() => zoomCenterBy(0.9)} icon={ZoomOut}></MenuItem>
                            <MenuItem label="Focus All" shortcut="Ctrl+Shift+F" onClick={focusOnAllNodes} icon={FocusAllIcon}></MenuItem>
                            <hr />
                            <MenuItem label="Help & About" onClick={visitHelp} icon={InfoIcon}></MenuItem>
                            <MenuItem label="Report" onClick={visitGithub} icon={BugIcon}></MenuItem>
                            <hr />  
                            <div className={scss.logo}><Logo /></div>
                        </menu>
                    </div>
                }
            </div>
        </>
    )
}


/**
 * Menu item component
 * 
 * @param {Object} props
 * @param {JSX.Element} props.icon - Icon of the menu item
 * @param {String} props.label - Label of the menu item
 * @param {String} props.shortcut - Shortcut of the menu item
 * @param {Function} props.onClick - Function to execute when the menu item is clicked
 * 
 * @returns {JSX.Element}
 */
function MenuItem(props) {


    return (
        <div className={scss.menu_item} onClick={props.onClick}>
            <div className={scss.menu_icon}><props.icon /></div>
            <div className={scss.menu_label}>
                {props.label}
                {props.shortcut && <kbd>{props.shortcut}</kbd>}
            </div>
        </div>
    )
}
