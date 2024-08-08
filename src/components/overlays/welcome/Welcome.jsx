import { useState } from "react"
import scss from "./welcome.module.scss"

export default function Welcome(props) {

    // const [show, setShow] = useState(localStorage.getItem("show-welcome") === null)
    const [show, setShow] = useState(false)

    return show ? (
        <div className={scss.wrap}>


            <button>Start now!</button>
        </div>
    ) : null
}
