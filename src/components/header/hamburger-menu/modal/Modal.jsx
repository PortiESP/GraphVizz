import { useState } from "react"
import scss from "./modal.module.scss"

// Scenes
import LoadGraph from "./scenes/LoadGraph"
import SaveGraph from "./scenes/saveGraph"
import ExportGraph from "./scenes/ExportGraph"

// Icons
import CloseIcon from "@assets/close.svg?react"


/**
 * # Scene management
 * 
 * The scenes of the modal are defined here. Each scene is a component that will be rendered in the modal.
 * 
 * The **keys** of the object are the **scene ids** and the values are the components.
 * 
 * To **choose a scene**, pass the scene id by the prop `scene` to the Modal component.
 */
const SCENES = {
    load_graph: LoadGraph,
    save_graph: SaveGraph,
    export_graph: ExportGraph
}

// Default scene
const DEFAULT_SCENE = "load_graph"


/**
 * Modal component
 * 
 * @param {Object} props
 * @param {String} props.scene - The scene id to render
 * @param {Function} props.close - Function to close the modal
 * 
 * @returns {JSX.Element} 
 */
export default function Modal(props) {

    const [sceneId, setSceneId] = useState(props.scene || DEFAULT_SCENE) // The scene id to render
    const Scene = SCENES[sceneId]  // The specific scene component to render

    return (
        <div className={scss.wrap}>
            <div className={scss.container}>
                <Scene setScene={setSceneId} close={props.close} />
                <span className={scss.close} onClick={props.close} >
                    <CloseIcon />
                </span>
            </div>
        </div>
    )
}
