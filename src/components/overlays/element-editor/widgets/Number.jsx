import scss1 from "../elementEditor.module.scss"
// import scss2 from "../widgets.module.scss"
import scss2 from "./number.module.scss"
const scss = { ...scss1, ...scss2 }
import { useEffect, useState } from "react"

// Functions
import { saveToCache } from "@components/graph-manager/utils/cache"
import { recordMemento } from "@components/graph-manager/utils/memento"

// Icons
import RevertIcon from "@assets/revert.svg?react"

export default function Number(props) {
    const [value, setValue2] = useState(props.initial ?? "")
    const setValue = (v) => setValue2(String(v).split(".")[1]?.length > 2 ? parseFloat(v).toFixed(2): parseFloat(v))
    const [errorMsg, setErrorMsg] = useState("")

    // Update the value using the callback function and the checkError function
    const handleChange = e => {
        let data = e.target.value ?? ""

        // If error checking is enabled, check the input for errors
        if (props.checkError) {
            // Validate the input, return true if valid, otherwise return an error message
            const error = props.checkError(data)

            // If there are no errors, update the value and clear the error message
            if (!error) {
                props.callback(data)
                setErrorMsg("")
            } 
            // If there are errors, set the error message
            else setErrorMsg(error ?? "")

            setValue(data)
        } 
        // If error checking is disabled, update the value without checking for errors
        else {
            props.callback(data)
            setValue(data)
        }
    }

    // Update the value when `initial` changes (e.g. when the user selects a new element, or the element is updated from other menu)
    useEffect(() => {
        setValue(props.initial ?? "")
    }, [props.initial])

    // Generate a random ID for the input element (to link the label with the input)
    const id = Math.random().toString(36).substring(7)

    // Reset the value to the default value
    const resetDefault = () => {
        const defValue = props.default || props.initial
        setValue(defValue)
        props.callback(defValue)
    }

    return (
        <div className={[scss.input_wrap, scss[props.type]].join(" ")} onClick={props.disabled ? props.callback: undefined}>
            <label htmlFor={id} style={props.labelStyle}>{props.label}  
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
                    onFocus={() => recordMemento()}
                    onBlur={() => saveToCache()}
                ></input>
                <div className={scss.input_info} onClick={resetDefault}>
                    <span className={scss.revert} ><RevertIcon /></span>
                </div>
            </div>
        </div>
    )
}