import scss1 from "../elementEditor.module.scss"
import scss2 from "../widgets.module.scss"
const scss = {...scss1, ...scss2}
import { useEffect, useState } from "react"

// Functions
import { saveToCache } from "@components/graph-manager/utils/cache"
import { recordMemento } from "@components/graph-manager/utils/memento"

// Icons
import RevertIcon from "@assets/revert.svg?react"
import CloseIcon from "@assets/close.svg?react"


/**
 * Checkbox input
 * 
 * @param {Object} props
 * @param {String} props.label - Label for the input
 * @param {String} props.type - Type of input
 * @param {String} props.initial - Initial value of the input
 * @param {String} props.default - Default value of the input (used for reset)
 * @param {Boolean} props.disabled - If the input is disabled
 * @param {Object} props.options - Additional options for the input
 * @param {Object} props.labelStyle - Style for the label
 * @param {Function} props.callback - Callback function for the input
 * @param {Function} props.checkError - Function to check for errors
 * 
 * @returns {JSX.Element}
 */
export default function Checkbox(props) {
    const [value, setValue] = useState(props.initial ?? "")
    const [errorMsg, setErrorMsg] = useState("")

    // Handle the input change event (true/false)
    const handleChange = e => {
        data = e.target.checked  // Checked is true/false

        // If the user has defined a validation function
        if (props.checkError) {
            // Validate the input, return true if valid, otherwise return an error message
            const error = props.checkError(data)

            // If no error message is returned, call the callback function
            if (!error) {
                // Memento
                recordMemento()

                props.callback(data)
                setErrorMsg("")
            } 
            // If an error message is returned, set the error message
            else {
                setErrorMsg(error ?? "")
            }

            // Update the value in any case
            setValue(data)
        } 
        // If no validation function is defined
        else {
            // Memento
            recordMemento()

            props.callback(data)
            setValue(data)
        }
        
        // Cache in any case
        saveToCache()
    }

    // Set the value of the input every time the initial value changes (external component changed the value)
    useEffect(() => {
        setValue(props.initial ?? "")
    }, [props.initial])

    const id = Math.random().toString(36).substring(7) // Random id for the input

    // Reset the value to the default value
    const resetDefault = () => {
        const defValue = props.default || props.initial  // If no default value is defined, use the initial value
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
            <div className={scss.inputs}>
                <input 
                    value={value}
                    onChange={handleChange}
                    disabled={props.disabled}
                    type={props.type}
                    {...props.options}
                    checked={value}
                    id={id}
                    placeholder={errorMsg}
                ></input>
            </div>
        </div>
    )
}
