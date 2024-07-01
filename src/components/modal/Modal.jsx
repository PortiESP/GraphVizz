import { useState } from "react"
import scss from "./modal.module.scss"
import LoadGraph from "./scenes/LoadGraph"
import CloseIcon from "../../assets/close"
import SaveGraph from "./scenes/saveGraph"
import ExportGraph from "./scenes/ExportGraph"

const SCENES = {
    load_graph: LoadGraph,
    save_graph: SaveGraph,
    export_graph: ExportGraph
}

export default function Modal(props) {

    const [sceneId, setSceneId] = useState(props.scene || SCENES.load_graph)
    const Scene = SCENES[sceneId]

    return (
        <div className={scss.wrap} onClick={e => e.target.className === scss.wrap && props.close()}>
            <div className={scss.container}>
                <Scene setScene={setSceneId} close={props.close}/>
                <span className={scss.close} onClick={props.close} >
                    <CloseIcon />
                </span>
            </div>
        </div>
    )
}
