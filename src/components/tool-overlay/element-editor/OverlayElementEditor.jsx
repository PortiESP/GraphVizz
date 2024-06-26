import { useState } from "react"
import { useEffect } from "react"
import scss1 from "./elementEditor.module.scss"
import scss2 from "./widgets.module.scss"
import SlashCircleIcon from "../../../assets/slash-circle"

const scss = {...scss1, ...scss2}

export default function ElementEditor(props) {

    const [selectedElements, setSelectedElements] = useState([])
    const [menu, setMenu] = useState(null)
    
    useEffect(() => {

        if (selectedElements.length === 0) {
            setMenu(null)
            return
        }


        if (selectedElements.length === 1) {
            // Common fields
            const sections = [
                {
                    title: "Data",
                    fields: [
                        {
                            label: "ID",
                            initial: selectedElements[0].id,
                            disabled: true,
                        }
                    ]
                }
            ]

            const e = selectedElements[0]
            const type = e.constructor.name

            // Node specific fields
            if (type === "Node") {
                sections[0].fields.push({
                    label: "Label",
                    initial: e.label,
                    callback: data => e.label = data
                },
                {
                    label: "X",
                    initial: e.x,
                    callback: data => e.x = parseFloat(data)
                },
                {
                    label: "Y",
                    initial: e.y,
                    callback: data => e.y = parseFloat(data)
                },
                {
                    label: "Radius",
                    initial: e.r,
                    callback: data => e.r = parseFloat(data)
                
                })
            }


            // Edge specific fields
            if (type === "Edge") {
                sections[0].fields.push({
                    label: "Source node",
                    initial: e.src.id,
                    disabled: true,
                },
                {
                    label: "Destination node",
                    initial: e.dst.id,
                    disabled: true,
                })
            }

            setMenu(sections)
            return
        }
    }, [selectedElements])

    console.log(menu)

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
    const [value, setValue] = useState(props.initial || "")

    const handleChange = e => {
        const data = e.target.value

        setValue(data)
        props.callback(data)
    }

    useEffect(() => {
        setValue(props.initial)
    }, [props.initial])

    console.log("VALUE", value)
    console.log("PROPS", props.initial)

    return (
        <div className={scss.input_wrap}>
            <label>{props.label}</label>
            <input value={value} onChange={handleChange} disabled={props.disabled}/>
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