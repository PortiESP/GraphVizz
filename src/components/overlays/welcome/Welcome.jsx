import { useState } from "react"
import scss from "./welcome.module.scss"

// Icons
import LogoIcon from "@assets/logo.svg?react"
import { Link } from "react-router-dom"

export default function Welcome(props) {

    const [show, setShow] = useState(localStorage.getItem("show-welcome") === null)
    const hide = () => {
        setShow(false)
        localStorage.setItem("show-welcome", false)
    }

    return show ? (
        <div className={scss.wrap}>
            <div className={scss.central}>
                <LogoIcon />
                <h2>Quick Guide</h2>
                <hr />
                <p>Use the <kbd>mouse</kbd> to select and drag the nodes</p>
                <p>Use the <kbd>n</kbd> key to activate the node creation tool</p>
                <p>Use the <kbd>e</kbd> key to activate the edge creation tool</p>
                <p>Delete the selected nodes with <kbd>supr</kbd> or activate the deletion tool with <kbd>d</kbd></p>
                <span className={scss.hint}>Visit the <Link to="/help">help</Link> section for more info</span>
                <hr />
                <button onClick={hide}>Start now!</button>
            </div>
        </div>
    ) : null
}
