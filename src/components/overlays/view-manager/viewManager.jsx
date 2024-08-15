import { useState, useEffect } from "react"
import scss from "./viewManager.module.scss"
import { useRef } from "react"

// Icons
import CloseIcon from "@assets/close.svg?react"
import DashIcon from "@assets/dash.svg?react"
import DotsIcon from "@assets/6-dots.svg?react"
import toast from "react-hot-toast"
import { useLayoutEffect } from "react"

// DEBUG
const DEFAULT_VIEW = {
    title: "Example view",
    tip: "This is an example view",

    // type: "info",
    // info: "This is an example info view"

    // type: "1-select",
    // label: "Select a node",
    // options: ["A", "B", "C", "D"],
    // // Run when an option is selected
    // setup: () => <table><thead><tr><th>Data</th></tr></thead><tr><td>Setup</td></tr><tr><td>Setup</td></tr><tr><td>Setup</td></tr><tr><td>Setup</td></tr></table>,
    // // Run when an option is selected
    // onChange: selected => console.log("selected", selected) || <p data-widget-type="code">{selected}</p>,  // Run when an option is selected

    type: "2-select",
    labelA: "Select node A",
    labelB: "Select node B",
    labelAB: "to",
    optionsA: ["A1", "A2", "A3", "A4"],
    optionsB: ["B1", "B2", "B3", "B4"],
    // Run when an option is selected
    setup: () => <table><thead><tr><th>Data</th></tr></thead><tbody>
        <tr><td>Setup</td></tr><tr><td>Setup</td></tr><tr><td>Setup</td></tr><tr><td>Setup</td></tr>
    </tbody></table>,
    // Run when an option is selected in any of the selects
    onChange: (selected, select) => console.log("selected", selected, select) || <p data-widget-type="code">{selected}</p>,  // Run when an option is selected

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

    const addPos = (x, y) => {
        setPos(old => {
            const newX = old.x + x
            const newY = old.y + y
            $container.current.style.left = newX + "px"
            $container.current.style.top = newY + "px"
            return { x: newX, y: newY }
        })
    }
    const handleMouseMove = (e) => {
        console.log("moving ", allowDrag)
        if (allowDrag) {
            console.log("moving")
            addPos(e.movementX, e.movementY)
        }
    }
    const handleMouseDown = (e) => {
        setAllowDrag(true)
        console.log("!!! allowed")
    }
    const handleMouseUp = (e) => {
        setAllowDrag(false)
        console.log("!!! disabled")
    }
    const handleCopy = () => {
        if (!lastResult) {
            toast.error("No result to copy")
            return
        }

        navigator.clipboard.writeText(lastResult)
        toast.success("Copied to clipboard")
    }

    useLayoutEffect(() => {
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [allowDrag])

    return (show ?
        <div className={scss.wrap} >
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
                                : data.type === "1-select" ? <SelectNode1 data={data} setOutput={setOutput} />
                                : data.type === "2-select" ? <SelectNode2 data={data} setOutput={setOutput} />
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

function SelectNode1({ data, setOutput }) {


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
            <select name="select" id="view-select" onChange={handleChange}>
                <option value="" disabled selected>-</option>
                {data.options.map((option, index) => <option key={index} value={option}>{option}</option>)}
            </select>
        </div>
    )
}


function SelectNode2({ data, setOutput }) {


    useEffect(() => {
        // Run the setup function if it exists
        if (data.setup) {
            const result = data.setup()
            setOutput(result)
        }
    }, [])

    const handleChange = e => {
        const selected = e.target.value
        const selectId = e.target.name === "selectA" ? "A" : "B"
        if (data.onChange) {
            const result = data.onChange(selected, selectId)
            setOutput(result)
        }
    }

    return (
        <div className={scss.select2}>
            <div className={scss.select_group}>
                {data.labelA && <label htmlFor="view-selectA">{data.labelB}</label>}
                <select name="selectA" id="view-selectA" onChange={handleChange} defaultValue="-">
                    <option value="-" disabled>-</option>
                    {data.optionsA.map((option, index) => <option key={index} value={option}>{option}</option>)}
                </select>
            </div>
            { data.labelAB && <div className={scss.labelAB}>{data.labelAB}</div> }
            <div className={scss.select_group}>
                {data.labelB && <label htmlFor="view-selectB">{data.labelB}</label>}
                <select name="selectB" id="view-selectB" onChange={handleChange} defaultValue="-">
                    <option value="-" disabled>-</option>
                    {data.optionsB.map((option, index) => <option key={index} value={option}>{option}</option>)}
                </select>
            </div>
        </div>
    )
}
