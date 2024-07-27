import scss from "./hamburger.module.scss"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

// Components & functions
import Modal from "@components/modal/Modal"
import { redo, undo } from "@components/graph-manager/utils/memento"
import { focusOnAllNodes } from "@components/graph-manager/utils/view"
import { zoomCenterBy } from "@components/graph-manager/canvas-component/utils/zoom"

// Icons
import NoteIcon from "@assets/note.svg?react"
import SaveIcon from "@assets/save.svg?react"
import ImportIcon from "@assets/import.svg?react"
import ExportIcon from "@assets/export.svg?react"
import UndoIcon from "@assets/undo.svg?react"
import RedoIcon from "@assets/redo.svg?react"
import FocusAllIcon from "@assets/focus-all.svg?react"
import SettingsIcon from "@assets/settings.svg?react"
import InfoIcon from "@assets/info.svg?react"
import ZoomIn from "@assets/zoom-in.svg?react"
import ZoomOut from "@assets/zoom-out.svg?react"

/**
 * Hamburger menu component
 * 
 * @param {Object} props
 * @param {Function} props.close - Function to close the hamburger menu
 * 
 * @returns {JSX.Element} 
 */
export default function HamburgerMenu(props) {
    const [modal, setModal] = useState(null)  // Modal scene. Can be ["load_graph", "save_graph", "export_graph"]

    const navigator = useNavigate()  // Hook to navigate between routes
    const visitHelp = () => { props.close(); navigator("/help") } // Function to navigate to the help page
    const resetGraph = () => { props.close(); window.graph.reset(); navigator("/") } // Function to reset the graph
    const loadModal = () => { setModal("load_graph") } // Function to open the load graph modal
    const saveModal = () => { setModal("save_graph") } // Function to open the save graph modal
    const exportModal = () => { setModal("export_graph") } // Function to open the export graph modal

    return (
        <>
            <div className={scss.wrap} onClick={e => e.target.className === scss.wrap && props.close()}>
                <menu >
                    <MenuItem label="New empty graph" onClick={resetGraph}><NoteIcon /></MenuItem>
                    <MenuItem label="Save as..." shortcut="Ctrl+Shift+S" onClick={saveModal}><SaveIcon /></MenuItem>
                    <MenuItem label="Load from..." onClick={loadModal}><ImportIcon /></MenuItem>
                    <MenuItem label="Export as..." onClick={exportModal}><ExportIcon /></MenuItem>
                    <hr />
                    <MenuItem label="Undo" shortcut="Ctrl+Z" onClick={undo}><UndoIcon /></MenuItem>
                    <MenuItem label="Redo" shortcut="Ctrl+Shift+Z" onClick={redo}><RedoIcon /></MenuItem>
                    <MenuItem label="Zoom In" onClick={() => zoomCenterBy(1.1)}><ZoomIn /></MenuItem>
                    <MenuItem label="Zoom Out" onClick={() => zoomCenterBy(0.9)}><ZoomOut /></MenuItem>
                    <MenuItem label="Focus All" onClick={focusOnAllNodes}><FocusAllIcon /></MenuItem>
                    <hr />
                    <MenuItem label="Settings" onClick={() => console.log("btn")}><SettingsIcon /></MenuItem>
                    <MenuItem label="Help & About" onClick={visitHelp}><InfoIcon /></MenuItem>
                </menu>
            </div>
            {modal && <Modal scene={modal} close={() => setModal(null)} />}
        </>
    )
}



function MenuItem(props) {


    return (
        <div className={scss.menu_item} onClick={props.onClick}>
            <div className={scss.menu_icon}>{props.children}</div>
            <div className={scss.menu_label}>
                {props.label}
                {props.shortcut && <kbd>{props.shortcut}</kbd>}
            </div>
        </div>
    )
}
