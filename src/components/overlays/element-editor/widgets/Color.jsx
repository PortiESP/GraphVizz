import scss1 from "../elementEditor.module.scss";
import scss2 from "../widgets.module.scss";
const scss = { ...scss1, ...scss2 };
import { useEffect, useState } from "react";

// Functions
import { saveToCache } from "@components/graph-manager/utils/cache";
import { recordMemento } from "@components/graph-manager/utils/memento";

// Icons
import RevertIcon from "@assets/revert.svg?react";
import CloseIcon from "@assets/close.svg?react";

/**
 * Color input field
 * 
 * @param {string} props.label - Label for the input field
 * @param {string} props.type - Type of input field
 * @param {string} props.initial - Initial value of the input field
 * @param {string} props.default - Default value of the input field
 * @param {function} props.callback - Callback function to handle the input change
 * @param {function} props.checkError - Function to validate the input
 * @param {object} props.options - Additional options for the input field
 * @param {object} props.labelStyle - Style for the label
 * @param {boolean} props.disabled - If the input field is disabled
 * 
 * @returns {JSX.Element}
 */
export default function Color(props) {
    const [value, setValue] = useState(props.initial ?? "");
    const [errorMsg, setErrorMsg] = useState("");

    // Handle the input change event
    const handleChange = e => {
        let data = e.target.value ?? "";

        // If the user has defined a validation function
        if (props.checkError) {
            // Validate the input, return true if valid, otherwise return an error message
            const error = props.checkError(data);

            // If no error message is returned, call the callback function
            if (!error) {
                props.callback(data);
                setErrorMsg("");
            } 
            // If an error message is returned, set the error message
            else {
                setErrorMsg(error ?? "");
            }

            // Update the value in any case
            setValue(data);
        } 
        // If no validation function is defined
        else {
            props.callback(data);
            setValue(data);
        }
    };

    // Set the value of the input every time the initial value changes (external component changed the value)
    useEffect(() => {
        setValue(props.initial ?? "");
    }, [props.initial]);

    const id = Math.random().toString(36).substring(7); // Random id for the input

    // Style for the color thumbnail
    const colorThumbnail = {
        background: props.type === "color" ? value : null,
    };

    // Reset the value to the default value
    const resetDefault = () => {
        const defValue = props.default || props.initial;  // If no default value is defined, use the initial value
        setValue(defValue);
        props.callback(defValue);
    };

    return (
        <div className={[scss.input_wrap, scss[props.type]].join(" ")} onClick={props.disabled ? props.callback : undefined}>
            <label htmlFor={id} style={props.labelStyle}>{props.label}  
                <div className={scss.label_info}>
                    <span className={scss.revert} onClick={resetDefault}><RevertIcon /></span>
                    {errorMsg && <span className={scss.error} title={errorMsg}><CloseIcon /></span>}
                </div>
            </label>
            <div className={scss.inputs} style={colorThumbnail}>
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
            </div>
        </div>
    );
}