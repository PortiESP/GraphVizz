import { useState, useEffect } from "react"
import scss1 from "./elementEditor.module.scss"
import scss2 from "./widgets.module.scss"
import SlashCircleIcon from "../../../assets/slash-circle"
import generateOptions from "./generateEditorOptions"

const scss = {...scss1, ...scss2}

export default function ElementEditor(props) {

    const [selectedElements, setSelectedElements] = useState([])
    const [menu, setMenu] = useState(null)
    
    useEffect(() => {
        const sections = generateOptions(selectedElements)
        setMenu(sections)
    }, [selectedElements])

    useEffect(() => {
        window.setSelectedElements = setSelectedElements
    }, [])

    return (
        <div className={scss.wrap}>
            {
                // No element selected
                menu === null &&
                <div className={scss.no_selection}>
                    <SlashCircleIcon />
                    Select an element to edit
                </div>
                || 

                <>
                <div className={scss.selected_label}>
                    Selected elements: {selectedElements.length}
                    <div>{menu.e?.id}</div>
                </div>

                {
                    menu?.map((section, i) => (
                        <SectionTitle key={i} title={section.title}>
                            {
                                section.fields.map((field, i) => (
                                    <Input key={i} {...field} />
                                ))
                            }
                        </SectionTitle>
                    ))
                }
                </>
            }
        </div>
    )
}



function Input(props) {
    const [value, setValue] = useState(props.initial ?? "")

    const handleChange = e => {
        let data = e.target.value ?? ""

        if (props.type === "checkbox") data = e.target.checked

        setValue(data)
        props.callback(data)
    }

    useEffect(() => {
        setValue(props.initial ?? "")
    }, [props.initial])

    const id = Math.random().toString(36).substring(7)
    const colorThumbnail = {
        background: props.type === "color" ? value : null,
        
    }

    return (
        <div className={[scss.input_wrap, scss[props.type]].join(" ")} >
            <label htmlFor={id}>{props.label}</label>
            <div className={scss.inputs} style={colorThumbnail}>
                <input value={value} onChange={handleChange} disabled={props.disabled} type={props.type} {...props.options} checked={value} id={id} />
                {
                    props.type === "range" &&
                    <input value={value} onChange={handleChange} disabled={props.disabled} type="number" {...props.options}/>
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