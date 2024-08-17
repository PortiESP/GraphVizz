import scss1 from "./elementEditor.module.scss"
import scss2 from "./widgets.module.scss"
const scss = {...scss1, ...scss2}
import { useState, useEffect } from "react"

// Utils
import generateOptions from "./generateEditorOptions"

// Editor widgets
import Text from "./widgets/Text"
import Number from "./widgets/Number"
import Color from "./widgets/Color"
import Range from "./widgets/Range"
import Checkbox from "./widgets/Checkbox"
import { useRef } from "react"


export default function ElementEditor() {

    const [selectedElements, setSelectedElements] = useState([])  // Selected elements of the graph, to show the corresponding options
    const [forceUpdate, setForceUpdate] = useState(0) // Force update when the selected elements change (increase the value to force a rerender) (bad practice fix for the issue: when a node is displaced, the editor does not update the position since the selected elements are the same, its the attributes that change)
    const [menu, setMenu] = useState(null)  // Array of sections with the corresponding fields. See `generateEditorOptions.js` for more info
    const $editor = useRef(null)
    
    const updateMenu = () => {setMenu(generateOptions(selectedElements))}

    // Add a listener to update the selected elements and forceUpdate values
    useEffect(() => {
        window.graph.allListeners.push(() => {
            setForceUpdate(old=> old + 1)  // To update element position
            setSelectedElements(window.graph.selected)  // To update selected elements
        })
    }, [])

    // Update the menu when the selected elements change or the forceUpdate value changes (usually when the user moves a node)
    useEffect(() => {
        if ($editor.current.contains(document.activeElement)) return  // If the user is typing in an input, do not update the menu 

        setMenu(null)
        setTimeout(() => updateMenu(), 0)  // Timeout to let all the inputs to be destroyed in order to avoid a bug that makes the inputs to show the values of the previous selected element instead of the new one
    }, [selectedElements, forceUpdate])

    return (
        <div className={scss.wrap} ref={$editor}>
                <div className={scss.selected_label}>
                    Selected elements: {selectedElements.length}
                </div>
                {
                    menu?.map((section, i) => (
                        <SectionTitle key={i} title={section.title}>
                            {
                                section.fields.map((field, i) => {
                                    const parseField = (field) => {
                                        return field.type === "title" && <h3 key={field.label + i} className={scss.section_title}>{field.label}</h3> ||    // Title
                                        field.type === "text" && <Text key={field.label + i} {...field}/> ||        // Text input
                                        field.type === "number" && <Number key={field.label + i} {...field}/> ||    // Number input
                                        field.type === "color" && <Color key={field.label + i} {...field}/> ||      // Color input
                                        field.type === "range" && <Range key={field.label + i} {...field}/> ||      // Range input
                                        field.type === "checkbox" && <Checkbox key={field.label + i} {...field} /> ||  // Checkbox input
                                        field.type === "row" && <div key={"row" + i} className={scss.row}>{
                                            field.cols.map((f, i) => {
                                                return parseField(f)
                                            })
                                        }</div> || null
                                    }

                                    // Render the corresponding widget based on the field type
                                    return parseField(field)
                                })
                            }
                        </SectionTitle>
                    ))
                }
        </div>
    )
}


function SectionTitle(props){
    const [closed, setClosed] = useState(false)

    return (
        <div className={scss.section}>
            <div className={[scss.title, closed && scss.closed].join(" ")} onClick={() => setClosed(old => !old)}><span>{props.title}</span></div>
            { !closed && props.children }
        </div>
    )
}