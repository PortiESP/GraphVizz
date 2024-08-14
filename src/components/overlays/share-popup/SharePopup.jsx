import scss from "./sharePopup.module.scss"

// Components & functions
import { generateURL } from "@components/graph-manager/utils/algorithms/algorithm_utils/generate_graph"

// Icons
import CloseIcon from "@assets/close.svg?react"
import { useState } from "react"
import toast from "react-hot-toast"


/**
 * Share popup component
 * 
 * @param {Object} props
 * @param {Function} props.close - Function to close the share popup
 * 
 * @returns {JSX.Element}
 */
export default function SharePopup(props) {

    const [isShowSharePopup, setIsShowSharePopup] = useState(false)  // Share popup visibility

    // Generate the URL of the current graph
    const url = isShowSharePopup && generateURL()

    // Copy the URL to the clipboard
    const handleShare = () => { 
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
    }

    return <div className={scss.menu_info}>
        <button className={scss.share} onClick={() => setIsShowSharePopup(true)}>Share</button>
        {
            isShowSharePopup ? (
                <div className={scss.wrap} onClick={e => e.target.className === scss.wrap && setIsShowSharePopup(false)}>
                    <div className={scss.container}>
                        <h3 className={scss.title}>Share your graph</h3>
                        <p>Copy the link below and share it with your friends</p>
                        <p className={scss.warning}>The link just store the nodes & edges. If you want to keep also the style, share the JSON using the <strong>save as</strong> menu</p>
                        <div className={scss.link}>
                            <input type="text" value={url} readOnly onClick={handleShare} />
                            <button onClick={handleShare}>Copy!</button>
                        </div>
                        <button onClick={() => setIsShowSharePopup(false)} className={scss.close}><CloseIcon /></button>
                    </div>
                </div>
            ) : null
        }
    </div>
}
