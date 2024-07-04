import { useNavigate } from "react-router-dom"
import scss from "./hamburger.module.scss"
import Modal from "../../modal/Modal"
import { useState } from "react"
import { redo, undo } from "../../graph-manager/utils/memento"
import { focusOnAllNodes } from "../../graph-manager/utils/view"

import NoteIcon from "../../../assets/note.svg?react"
import SaveIcon from "../../../assets/save.svg?react"
import ImportIcon from "../../../assets/import.svg?react"
import ExportIcon from "../../../assets/export.svg?react"
import UndoIcon from "../../../assets/undo.svg?react"
import RedoIcon from "../../../assets/redo.svg?react"
import FocusAllIcon from "../../../assets/focus-all.svg?react"
import SettingsIcon from "../../../assets/settings.svg?react"
import InfoIcon from "../../../assets/info.svg?react"
import ZoomIn from "../../../assets/zoom-in.svg?react"
import ZoomOut from "../../../assets/zoom-out.svg?react"
import { zoomCenterBy, zoomIn, zoomOut } from "../../graph-manager/canvas-component/utils/zoom"

export default function HamburgerMenu(props) {
  const [modal, setModal] = useState(null)

  const navigator = useNavigate()
  const visitHelp = () => {props.close(); navigator("/help")}
  const resetGraph = () => {props.close(); window.graph.reset(); navigator("/"); window.graph.triggerGraphListeners()}
  const loadModal = () => {setModal("load_graph")}
  const saveModal = () => {setModal("save_graph")}
  const exportModal = () => {setModal("export_graph")}
  const focusAll = () => focusOnAllNodes()

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
        <MenuItem label="Zoom In" onClick={()=>zoomCenterBy(1.1)}><ZoomIn /></MenuItem>
        <MenuItem label="Zoom Out" onClick={()=>zoomCenterBy(0.9)}><ZoomOut /></MenuItem>
        <MenuItem label="Focus All" onClick={focusAll}><FocusAllIcon /></MenuItem>
        <hr />
        <MenuItem label="Settings" onClick={() => console.log("btn")}><SettingsIcon /></MenuItem>
        <MenuItem label="Help & About" onClick={visitHelp}><InfoIcon /></MenuItem>
      </menu>
    </div>
    {modal && <Modal scene={modal} close={()=> setModal(null)}/>}
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
