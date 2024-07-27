import scss from "./sharePopup.module.scss"

// Components & functions
import { generateURL } from "@components/graph-manager/utils/algorithms/algorithm_utils/generate_graph"

// Icons
import CloseIcon from "@assets/close.svg?react"
import { useState } from "react"


/**
 * Share popup component
 * 
 * @param {Object} props
 * @param {Function} props.close - Function to close the share popup
 * 
 * @returns {JSX.Element}
 */
export default function SharePopup(props) {

    const [text, setText] = useState("Copy!")

    // Generate the URL of the current graph
    const url = generateURL()

    // Copy the URL to the clipboard
    const handleShare = () => {
        navigator.clipboard.writeText(url)
        setText("Copied!")
    }

    return (
        <div className={scss.wrap} onClick={e => e.target.className === scss.wrap && props.close()}>
            <div className={scss.container}>
                <h3 className={scss.title}>Share your graph</h3>
                <p>Copy the link below and share it with your friends</p>
                <div className={scss.link}>
                    <input type="text" value={url} readOnly onClick={handleShare} />
                    <button onClick={handleShare}>{text}</button>
                </div>
                <button onClick={props.close} className={scss.close}><CloseIcon /></button>
            </div>
        </div>
    )
}
