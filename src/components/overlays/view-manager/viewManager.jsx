import { useState, useEffect } from "react"
import scss from "./viewManager.module.scss"
import { useRef } from "react"

// Icons
import CloseIcon from "@assets/close.svg?react"
import DashIcon from "@assets/dash.svg?react"
import DotsIcon from "@assets/6-dots.svg?react"
import toast from "react-hot-toast"
import { useLayoutEffect } from "react"


export default function ViewManager(props) {

    // States
    const [allowDrag, setAllowDrag] = useState(false)  // Set to true when the user clicks on the header
    const [pos, setPos] = useState({ x: null, y: null })  // Position of the view (relative to the center of the screen)
    const [minimized, setMinimized] = useState(false)  // Set to true when the view is minimized
    const $container = useRef(null)  // Reference to the view container
    const fixPos = () => {  // When the header is out of the screen, bring it back
        const pos = $container.current?.getBoundingClientRect()?.top
        if (pos < 0) addPos(0, -pos + 80)
    }
    const [data, setData] = useState(null) // Parameters of the view. E.g. {title: "Title", type: "1-select", options: ["A", "B"], ...}
    const [output, setOutput] = useState(null)  // Result of the callback executed by the view. Return a JSX element that is stored here
    const [lastResult, setLastResult] = useState(null)  // Last result to copy to clipboard (object)
    const [show, setShow2] = useState(false)  // Show the view
    const setShow = (value) => {  // Every time the view is shown/hidden, reset the position, the parameters, and the output
        // If the value is false, remove the view parameters
        if (!value) {
            setData(null)
        }
        // Both cases
        setOutput(null)  // Remove the output from the previous view
        setShow2(value)  // Show/hide the view
    }

    // Initial setup: set the global functions
    useEffect(() => {
        // View config function (allows the user to set a view from anywhere in the code)
        window.ui.set("setView", options => {
            // If data is null/false/undefined, hide the view
            if (!options) {
                setShow(false)
                return
            }

            // Otherwise, show the view and set the data
            setData(options)  // Set the parameters of the view
            setShow(true)  // Show the view
            setPos({ x: 0, y: 0 })  // Reset the position
        })
        // View output function (allows the user to set the output of the view from anywhere in the code)
        window.ui.set("setLastResult", result => setLastResult(result))
    }, [])

    // When the view parameters change, reset the view
    useEffect(() => {
        resetView()  // Reset the style of the nodes and edges
        setAllowDrag(false)  // Reset the drag state
        setMinimized(false)  // Reset the minimized state
    }, [data])

    // Ensure the view is always visible
    useLayoutEffect(() => {
        fixPos()
    }, [minimized, show, output])

    // Update the position of the view when the position state changes
    useEffect(() => {   
        if (!$container.current) return
        $container.current.style.left = pos.x + "px"
        $container.current.style.top = pos.y + "px"
    }, [pos])

    // --- Functions ---
    // Add the movement to the position
    const addPos = (x, y) => {
        setPos(old => ({ x: old.x + x, y: old.y + y }))
    }
    // Handle the mouse events
    const handleMouseMove = (e) => {
        if (allowDrag) addPos(e.movementX, e.movementY)
    }
    const handleMouseDown = (e) => {
        setAllowDrag(true)
    }
    const handleMouseUp = (e) => {
        setAllowDrag(false)
    }
    // Copy the last result to the clipboard
    const handleCopy = () => {
        copyToClipboard(lastResult)
    }

    // Setup the event listeners
    useLayoutEffect(() => {
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [allowDrag])  // Need this dependency since the handlers use the state in its code

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
                                {/* Show the output of the algorithm */}
                                <div className={scss.output}>
                                    {output}
                                </div>
                                {/* Show the copy button */}
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

// =================================================[ Views ]=================================================>>>

/*
    View options `window.ui.set("setView", options)`:
    - type: "info" 
    - title: string
    - tip: string
    - info: string|JSX
    - setup: function
*/
function Info({ data, setOutput }) {
    // Update the output when the data changes (e.g. first load and when another view is opened)
    useEffect(() => {
        // Run the setup function if it exists
        if (data.setup) {
            const result = data.setup()
            setOutput(result)
        }
    }, [data])

    return data.info instanceof String 
            ? <p className={scss.info}>{data.info}</p>
            : data.info
}

/*
    View options `window.ui.set("setView", options)`:
    - type: "1-select" 
    - title: string
    - tip: string
    - label: string
    - options: string[]
    - default: string
    - setup: function
    - onChange: function
*/
function SelectNode1({ data, setOutput }) {
    const [selected, setSelected] = useState("-")
    // Reset the selected value when the data changes (e.g. when another view is opened)
    useEffect(() => setSelected(data.default || "-"), [data])

    // Update the output when the data changes (e.g. first load and when another view is opened)
    useEffect(() => {
        // Run the setup function if it exists
        if (data.setup) {
            const result = data.setup()
            setOutput(result)
        }
    }, [data])

    // Handle the change event
    const handleChange = e => {
        const selected = e.target.value
        setSelected(selected)  // Update the state
        // Run the onChange function if it exists
        if (data.onChange) {
            const result = data.onChange(selected)
            setOutput(result)
        }
    }

    return (
        <div className={scss.select1}>
            {data.label && <label htmlFor="view-select">{data.label}</label>}
            <select name="select" id="view-select" onChange={handleChange} value={selected}>
                <option value="-" disabled>-</option>
                {data.options.map((option, index) => <option key={index} value={option}>{option}</option>)}
            </select>
        </div>
    )
}


/*
    View options `window.ui.set("setView", options)`:
    - type: "2-select"
    - title: string
    - tip: string
    - labelA: string
    - labelB: string
    - labelAB: string
    - optionsA: string[]
    - optionsB: string[]
    - defaultA: string
    - defaultB: string
    - setup: function
    - onChange: function(newValue, changedSelectID, [selectedA, selectedB])
*/
function SelectNode2({ data, setOutput }) {

    const [selectedA, setSelectedA] = useState(data.defaultA || "-")
    const [selectedB, setSelectedB] = useState(data.defaultB || "-")
    // Reset the selected values when the data changes (e.g. first load and when another view is opened)
    useEffect(() => {
        setSelectedA(data.defaultA || "-")
        setSelectedB(data.defaultB || "-")

        // Run the setup function if it exists
        if (data.setup) {
            const result = data.setup()
            setOutput(result)
        }
    }, [data])

    // Handle the change event
    const handleChange = e => {
        const selected = e.target.value
        const selectId = e.target.name === "selectA" ? "A" : "B"
        const values = [selectedA, selectedB]

        // Update the corresponding state
        if (selectId === "A") {
            setSelectedA(selected)
            values[0] = selected
        }
        if (selectId === "B") {
            setSelectedB(selected)
            values[1] = selected
        }

        // Run the onChange function if it exists
        if (data.onChange) {
            const result = data.onChange(selected, selectId, values)
            setOutput(result)
        }
    }

    return (
        <div className={scss.select2}>
            <div className={scss.select_group}>
                {data.labelA && <label htmlFor="view-selectA">{data.labelB}</label>}
                <select name="selectA" id="view-selectA" onChange={handleChange} value={selectedA}>
                    <option value="-" disabled>-</option>
                    {data.optionsA.map((option, index) => <option key={index} value={option}>{option}</option>)}
                </select>
            </div>
            {data.labelAB && <div className={scss.labelAB}>{data.labelAB}</div>}
            <div className={scss.select_group}>
                {data.labelB && <label htmlFor="view-selectB">{data.labelB}</label>}
                <select name="selectB" id="view-selectB" onChange={handleChange} value={selectedB}>
                    <option value="-" disabled>-</option>
                    {data.optionsB.map((option, index) => <option key={index} value={option}>{option}</option>)}
                </select>
            </div>
        </div>
    )
}


// =================================================[ Utils ]=================================================>>>

// Copy the data to the clipboard (for the Nodes and Edges, it will copy just the ID)
function copyToClipboard(data) {
    // Custom parser to handle the Nodes and Edges
    const parser = (key, value) => {
        const eType = value?.constructor?.name
        if (eType === "Node") return value.id
        if (eType === "Edge") return {src: value.src.id, dst: value.dst.id, weight: value.weight, directed: value.directed}
        return value ?? null
    }
    // Copy the data to the clipboard
    navigator.clipboard.writeText(JSON.stringify(data, parser, 2))
    .then(() => {
        window.cvs.debug && console.log("Data copied to clipboard", data)
        toast.success("Data copied to clipboard")
    })
    .catch((e) => {
        console.error("Failed to copy data to clipboard", data, e)
        toast.error("Failed to copy data to clipboard")
    })
}


// Reset the style of the nodes and edges
function resetView(){
    if (!window.graph) return  // If the graph is not loaded, return

    window.graph.nodes.forEach(node => {node.hidden = false; node.bubble = null; node.resetStyle()})
    window.graph.edges.forEach(edge => {edge.hidden = false; edge.resetStyle()})
}