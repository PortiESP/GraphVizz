import { useState } from "react";
import scss from "./zoomBar.module.scss"

// Icons
import ZoomInIcon from "@assets/zoom-in.svg?react"
import ZoomOutIcon from "@assets/zoom-out.svg?react"
import { useEffect } from "react"
import { zoomCenterBy, zoomCenterTo } from "@components/graph-manager/canvas-component/utils/zoom"

export default function ZoomBar(props) {

    const [zoom, setZoom] = useState(100);

    // Store the zoom function in the window object
    useEffect(() => {
        window.ui.set("setZoomLabel", (v) => setZoom((v*100).toFixed(0)+"%"))
    }, [])

    const handleZoom = (e) => {
        const zoomTargetPctg = parseFloat(e.target.value.replace("%", "")) || ""
        setZoom(zoomTargetPctg+"%")

        if (zoomTargetPctg > 0) zoomCenterTo(zoomTargetPctg/100)
    }

    return (
        <div className={scss.zoom_wrap}>
            <div className={scss.zoom_tool}>
                <button className={scss.zoom_out} onClick={() => zoomCenterBy(.9)}><ZoomOutIcon /></button>
                <input className={scss.zoom_value} value={zoom} onChange={handleZoom} />
                <button className={scss.zoom_in} onClick={() => zoomCenterBy(1.1)}><ZoomInIcon /></button>
            </div>
        </div>
    )
}
