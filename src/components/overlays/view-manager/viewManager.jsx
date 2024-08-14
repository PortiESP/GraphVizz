import { useState, useEffect } from "react"
import scss from "./viewManager.module.scss"
import { useRef } from "react"

// Icons
import CloseIcon from "@assets/close.svg?react"
import DashIcon from "@assets/dash.svg?react"
import DotsIcon from "@assets/6-dots.svg?react"
import toast from "react-hot-toast"

// DEBUG
const DEFAULT_VIEW = {
    title: "Example view",
    tip: "This is an example view",

    // type: "info",
    // info: "This is an example info view"

    type: "1-select",
    label: "Select a node",
    options: ["A", "B", "C", "D"],
    placeholderOption: true,
    // Run when an option is selected
    setup: () => <table><thead><tr><th>Data</th></tr></thead><tr><td>Setup</td></tr><tr><td>Setup</td></tr><tr><td>Setup</td></tr><tr><td>Setup</td></tr></table>,
    // Run when an option is selected
    onChange: selected => console.log("selected", selected) || <p data-widget-type="code">{selected}</p>  // Run when an option is selected

}

export default function ViewManager(props) {

    const [allowDrag, setAllowDrag] = useState(false)
    const [pos, setPos] = useState({ x: null, y: null })
    const [show, setShow] = useState(true)
    const [minimized, setMinimized] = useState(false)
    const $container = useRef(null)
    const [data, setData] = useState(DEFAULT_VIEW) // DEBUG
    const [output, setOutput] = useState(null)
    const [lastResult, setLastResult] = useState(null)

    useEffect(() => {
        window.ui.set("setView", data => {
            // If data is null/false/undefined, hide the view
            if (!!data) {
                setShow(false)
                return
            }

            // Otherwise, show the view and set the data
            setData(data)
            setShow(true)

        })
        window.ui.set("setLastResult", result => setLastResult(result))
    }, [])

    function addPos(x, y) {
        setPos(old => {
            const newX = old.x + x
            const newY = old.y + y
            $container.current.style.left = newX + "px"
            $container.current.style.top = newY + "px"
            return { x: newX, y: newY }
        })
    }
    function handleMouseMove(e) {
        if (allowDrag) addPos(e.movementX, e.movementY)
    }
    function handleMouseDown(e) {
        setAllowDrag(true)
        console.log("mousedown", e)
    }
    function handleMouseUp(e) {
        setAllowDrag(false)
        console.log("mouseup", e)
    }
    function handleCopy() {
        if (!lastResult) {
            toast.error("No result to copy")
            return
        }

        navigator.clipboard.writeText(lastResult)
        toast.success("Copied to clipboard")
    }


    return (show ?
        <div className={scss.wrap} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
            <div className={scss.view_wrap} ref={$container} >
                <div className={scss.header} onMouseDown={handleMouseDown}>
                    <div className={scss.view_title}>
                        <DotsIcon />
                        {data.title}
                    </div>
                    <div className={scss.window_buttons}>
                        <div className={scss.window_button} onClick={() => setMinimized(old => !old)}><DashIcon /></div>
                        <div className={scss.window_button} onClick={() => setShow(false)}><CloseIcon /></div>
                    </div>
                </div>
                {
                    // Show content if not minimized
                    !minimized &&
                    <div className={scss.view_content}>
                        {
                            // Show tip if it exists
                            data.tip &&
                            <div className={scss.tip}>
                                <p>{data.tip}</p>
                            </div>
                        }
                        <div className={scss.view_specific_content}>
                            {
                                // Show the correct view based on the type
                                data.type === "info" ? <Info data={data} setOutput={setOutput} />
                                : data.type === "1-select" ? <SelectNode data={data} setOutput={setOutput} />
                                : data.type === "2-select" ? <SelectNodes data={data} setOutput={setOutput} />
                                : null
                            }
                        </div>
                        {
                            // Show output if it exists
                            output && <>
                            <div className={scss.output}>
                                {output}
                            </div>
                            <div className={scss.copy_wrap}>
                                <button onClick={handleCopy}>Copy to clipboard</button>
                            </div>
                            </>
                        }
                    </div>
                }
            </div>
        </div>
        : <></>
    )
}



function Info({ data }) {
    return <p className={scss.info}>{data.info}</p>
}

function SelectNode({ data, setOutput }) {


    useEffect(() => {
        // Run the setup function if it exists
        if (data.setup) {
            const result = data.setup()
            setOutput(result)
        }
    }, [])

    const handleChange = e => {
        const selected = e.target.value
        if (data.onChange) {
            const result = data.onChange(selected)
            setOutput(result)
        }
    }

    return (
        <div className={scss.select1}>
            {data.label && <label htmlFor="view-select">{data.label}</label>}
            <select name="nodes-select" id="view-select" onChange={handleChange}>
                {data.placeholderOption && <option value="" disabled selected>-</option>}
                {data.options.map((option, index) => <option key={index} value={option}>{option}</option>)}
            </select>
        </div>
    )
}


function SelectNodes({ data, setOutput }) {
    return (
        <div>
            <div>Nodes</div>
            <div>Nodes</div>
            <div>Nodes</div>
            <div>Nodes</div>
        </div>
    )
}