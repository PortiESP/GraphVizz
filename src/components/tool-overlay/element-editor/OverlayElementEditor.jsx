import { useState, useEffect } from "react"
import scss1 from "./elementEditor.module.scss"
import scss2 from "./widgets.module.scss"
import generateOptions from "./generateEditorOptions"
import CloseIcon from "../../../assets/close.svg?react"
import RevertIcon from "../../../assets/revert.svg?react"

const scss = {...scss1, ...scss2}

export default function ElementEditor(props) {

    const [selectedElements, setSelectedElements] = useState([])
    const [forceUpdate, setForceUpdate] = useState(0) // Force update when the selected elements change
    const [menu, setMenu] = useState(null)
    
    useEffect(() => {
        const sections = generateOptions(selectedElements)
        setMenu(sections)
    }, [selectedElements, forceUpdate])

    useEffect(() => {
        window.graph.allListeners.push(() => {
            setForceUpdate(old=> old + 1)  // To update element position
            setSelectedElements(window.graph.selected)  // To update selected elements
        })
    }, [])

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
                                    <Input key={field.label + i} {...field} />
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