import LiveEditor from "./overlay-nodes/OverlayLiveEditor"
import CloseIcon from "../../assets/close"
import ArrowLeft from "../../assets/arrow-left"
import scss from "./toolsOverlay.module.scss"
import { useState } from "react"

export default function ToolOverlay(props) {

  return (
      <div className={scss.wrap}>
        <div className={scss.canvas_wrap}>
          {props.children}
        </div>
        <Overlay className={scss.overlay_left}>
          <LiveEditor />
        </Overlay>
        {/* <div className={[scss.overlay, scss.overlay_right].join(" ")}>
        </div> */}
      </div>
  )
}


function Overlay(props){
  const [closed, setClosed] = useState(false)

  const closedClass = props.closedRight ? scss.closed_right : scss.closed_left

  return (
    <div className={[scss.overlay, props.className, closed ? closedClass: ""].join(" ")}>
        {props.children}
        <div className={scss.toggle} onClick={() => setClosed(old => !old)}>
          {!closed ? <CloseIcon /> : <ArrowLeft />}
        </div>
    </div>

  )
}