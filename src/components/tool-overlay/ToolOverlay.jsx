import GraphEditor from "./overlay-nodes/OverlayLiveEditor"
import scss from "./toolsOverlay.module.scss"

export default function ToolOverlay(props) {

  return (
      <div className={scss.wrap}>
        <div className={scss.canvas_wrap}>
        {
            props.children
        }
        </div>
        <div className={[scss.overlay, scss.overlay_left].join(" ")}>
            <GraphEditor />
        </div>
        <div className={[scss.overlay, scss.overlay_right].join(" ")}>
        </div>
      </div>
  )
}
