import { useState } from "react"
import scss from "./modal.module.scss"
import LoadGraph from "./scenes/LoadGraph"
import CloseIcon from "../../assets/close"

const SCENES = {
    load_graph: LoadGraph,
}

export default function Modal(props) {

    const [sceneId, setSceneId] = useState(props.scene || SCENES.load_graph)
    const Scene = SCENES[sceneId]

    return (
        <div className={scss.wrap}>
            <div className={scss.container}>
                <Scene setScene={setSceneId}/>
                <span className={scss.close} onClick={props.close} >
                    <CloseIcon />
                </span>
            </div>
        </div>
    )
}
