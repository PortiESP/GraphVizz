import scss from "./submenu.module.scss"


/**
 * The submenu component is used on the nav bar to display submenus when the user hovers over a menu item
 * 
 * @param {Object} props
 * @param {JSX.Element} props.children - Submenu items
 */
export default function SubMenu(props) {

    return (
        <div className={scss.submenu_wrap}>
            <div className={scss.submenu}>
                {
                    props.children
                }
            </div>
            <div className={scss.arrow} />
        </div>
    )
}


/**
 * Submenu item component
 * 
 * @param {Object} props
 * @param {String} props.title - Title of the submenu item
 * @param {Function} props.callback - Function to call when the submenu item is clicked
 * @param {Boolean} props.heading - If the submenu item is a heading or not. If true, the title will be displayed with a different style and the callback will not be called
 * @param {JSX.Element} props.icon - Icon to display next to the title
 */
export function SubMenuItem(props) {

    // Call the callback function when the submenu item is clicked
    const handleClick = () => {
        if (props.heading) return // If the submenu item is a heading, do not call the callback function

        // If a callback function is provided, call it
        props.callback && props.callback()
    }

    return props.heading ? <div className={scss.submenu_heading}><h3>{props.title}</h3></div> : (
        <div className={scss.submenu_item} onClick={handleClick}>
            {
                props.icon && <div className={scss.submenu_icon}><props.icon /></div>
            }
            <span className={scss.submenu_title}>{props.title}</span>
        </div>
    )
}