import LiveEditor from "./live-editor/OverlayLiveEditor"
import CloseIcon from "../../assets/close"
import ArrowLeft from "../../assets/arrow-left"
import scss from "./toolsOverlay.module.scss"
import { useState } from "react"
import ElementEditor from "./element-editor/OverlayElementEditor"

export default function ToolOverlay(props) {

  return (
      <div className={scss.wrap}>
        <div className={scss.canvas_wrap}>
          {props.children}
        </div>
        <Overlay title="Live Editor">
          <LiveEditor />
        </Overlay>
        <Overlay title="Custom style" right>
          <ElementEditor />
        </Overlay>
      </div>
  )
}


function Overlay(props){
  const [closed, setClosed] = useState(false)

  const closedClass = props.right ? scss.closed_right : scss.closed_left
  const className = props.right ? scss.overlay_right: scss.overlay_left

  return (
    <div className={[scss.overlay, className, closed ? closedClass: ""].join(" ")}>
      <div className={scss.title}>
        {props.title}
        <div className={scss.toggle} onClick={() => setClosed(old => !old)}>
          {!closed ? <CloseIcon /> : <ArrowLeft />}
        </div>
      </div>
      <div className={scss.widget_wrap}>
        {props.children}
      </div>
    </div>

  )
}