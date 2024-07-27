import scss from "../views.module.scss"

/**
 * Shows an alert message.
 * 
 * @param {Object} options - The alert options.
 * @param {string} options.title - The alert title.
 * @param {string} options.message - The alert message.
 * @param {string} options.color - The alert color.
 */
export default function AlertView({options}) {

    const style = {
        backgroundColor: options.color || "#f4433644",
    }
    
    return <div className={[scss.menu_options_view_msg, scss.alert].join(" ")} style={style}>
        <span><strong>{options.title}:</strong> {options.message}</span>
    </div>
}