import scss1 from "./nav.module.scss"
import scss2 from "./views.module.scss"
const scss = { ...scss1, ...scss2 } 
import { Link, useLocation } from "react-router-dom";

// Components & functions
import AlgorithmsSubMenu from "./AlgorithmsSubMenu";



/**
 * The navigation bar.
 */
export default function Nav() {

    const location = useLocation()  // Get the current location

    return (
        <nav>
            <ul className={scss.wrapper}>
                <h1 className={location.pathname === "/" ? scss.current : undefined}><Link to="/">Graph Editor</Link></h1>
                <li>
                    Algorithms
                    <AlgorithmsSubMenu />
                </li>
                <li className={location.pathname === "/examples" ? scss.current : undefined}><Link to="/examples">Examples</Link></li>
                <li className={location.pathname === "/help" ? scss.current : undefined}><Link to="/help">Help</Link></li>
            </ul>
        </nav>
    )
}
