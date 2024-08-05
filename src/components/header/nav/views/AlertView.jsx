import scss from "../views.module.scss"

// Icons
import XCircleIcon from "@assets/x-circle.svg?react"
import InfoIcon from "@assets/info-circle.svg?react"
import CheckIcon from "@assets/check-circle.svg?react"


/**
 * Shows an alert message.
 * 
 * @param {Object} options - The alert options.
 * @param {string} options.title - The alert title.
 * @param {string} options.message - The alert message.
 * @param {string} options.type - The alert type: ["error", "info", "success"], this will change the icon and the color, if not provided, the color will be taken from the color option.
 * @param {string} options.color - The alert color.
 * @param {JSX.Element} options.icon - The alert icon.
 */
export default function AlertView({options}) {

    const style = {
        backgroundColor: options.color,
    }

    if (options.type){
        if (options.type === "error") options.icon = <XCircleIcon />
        else if (options.type === "info") options.icon = <InfoIcon />
        else if (options.type === "success") options.icon = <CheckIcon />
        else options.icon = null
    }
    
    return <div className={[scss.menu_options_view_msg, scss.alert, scss[options.type]].join(" ")} style={style}>
        {options.icon}<span><strong>{options.title}:</strong> {options.message}</span>
    </div>
}