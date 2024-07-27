import scss1 from "./elementEditor.module.scss"
import scss2 from "./widgets.module.scss"
const scss = {...scss1, ...scss2}
import { useState, useEffect } from "react"

// Utils
import generateOptions from "./generateEditorOptions"

// Icons
import CloseIcon from "@assets/close.svg?react"
import RevertIcon from "@assets/revert.svg?react"

// Editor widgets
import Text from "./widgets/Text"
import Number from "./widgets/Number"
import Color from "./widgets/Color"
import Range from "./widgets/Range"


export default function ElementEditor() {

    const [selectedElements, setSelectedElements] = useState([])  // Selected elements of the graph, to show the corresponding options
    const [forceUpdate, setForceUpdate] = useState(0) // Force update when the selected elements change (increase the value to force a rerender) (bad practice fix for the issue: when a node is displaced, the editor does not update the position since the selected elements are the same, its the attributes that change)
    const [menu, setMenu] = useState(null)  // Array of sections with the corresponding fields. See `generateEditorOptions.js` for more info
    
    // Add a listener to update the selected elements and forceUpdate values
    useEffect(() => {
        window.graph.graphListeners.push(() => {
            setForceUpdate(old=> old + 1)  // To update element position
            setSelectedElements(window.graph.selected)  // To update selected elements
        })
    }, [])

    // Update the menu when the selected elements change or the forceUpdate value changes (usually when the user moves a node)
    useEffect(() => {
        const sections = generateOptions(selectedElements)
        setMenu(sections)
    }, [selectedElements, forceUpdate])

    return (
        <div className={scss.wrap}>
                <div className={scss.selected_label}>
                    Selected elements: {selectedElements.length}
                </div>
                {
                    menu?.map((section, i) => (
                        <SectionTitle key={i} title={section.title}>
                            {
                                section.fields.map((field, i) => (
                                    // Render the corresponding widget based on the field type
                                    field.type === "text" && <Text key={field.label + i} {...field}/> ||        // Text input
                                    field.type === "number" && <Number key={field.label + i} {...field}/> ||    // Number input
                                    field.type === "color" && <Color key={field.label + i} {...field}/> ||      // Color input
                                    field.type === "range" && <Range key={field.label + i} {...field}/> ||      // Range input
                                    field.type === "checkbox" && <Input key={field.label + i} {...field} /> ||  // Checkbox input
                                    <Input key={field.label + i} {...field} />                                  // Default input (text)
                                ))
                            }
                        </SectionTitle>
                    ))
                }
        </div>
    )
}



function Input(props) {
    const [value, setValue] = useState(props.initial ?? "")
    const [errorMsg, setErrorMsg] = useState("")

    const handleChange = e => {
        let data = e.target.value ?? ""
        if (props.type === "checkbox") data = e.target.checked

        if (props.checkError) {
            // Validate the input, return true if valid, otherwise return an error message
            const error = props.checkError(data)

            if (!error) {
                props.callback(data)
                setErrorMsg("")
            } else {
                setErrorMsg(error ?? "")
            }

            setValue(data)
        } else {
            props.callback(data)
            setValue(data)
        }


    }

    useEffect(() => {
        setValue(props.initial ?? "")
    }, [props.initial])

    const id = Math.random().toString(36).substring(7)
    const colorThumbnail = {
        background: props.type === "color" ? value : null,
        
    }

    const resetDefault = () => {
        const defValue = props.default || props.initial
        setValue(defValue)
        props.callback(defValue)
    }

    return (
        <div className={[scss.input_wrap, scss[props.type]].join(" ")} onClick={props.disabled ? props.callback: undefined}>
            <label htmlFor={id} style={props.labelStyle}>{props.label}  
                <div className={scss.label_info}>
                    <span className={scss.revert} onClick={resetDefault}><RevertIcon /></span>
                    {errorMsg && <span className={scss.error} title={errorMsg}><CloseIcon /></span>}
                </div>
            </label>
            <div className={scss.inputs} style={colorThumbnail}>
                <input value={value} onChange={handleChange} disabled={props.disabled} type={props.type} {...props.options} checked={value} id={id} placeholder={errorMsg}></input>
                {
                    props.type === "range" &&
                    <input value={value} onChange={handleChange} disabled={props.disabled} type="number" {...props.options} tabIndex={null}/>
                }
            </div>
        </div>
    )
}


function SectionTitle(props){
    return (
        <div className={scss.section}>
            <div className={scss.title}>{props.title}</div>
            {props.children}
        </div>
    )
}