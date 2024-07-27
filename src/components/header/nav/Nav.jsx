import scss1 from "./nav.module.scss"
import scss2 from "./views.module.scss"
const scss = { ...scss1, ...scss2 } 
import { Link } from "react-router-dom";

// Components & functions
import AlgorithmsSubMenu from "./AlgorithmsSubMenu";
import SubMenu, { SubMenuItem } from "./nav-sub-menu/SubMenu";

// Views
import AlertView from "./views/AlertView";
import SelectNodesView from "./views/SelectNodesView";
import SelectNodeView from "./views/SelectNodeView";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";

/**
 * The navigation bar.
 */
export default function Nav() {

    const location = useLocation()  // Get the current location

    const [view, setView] = useState(false)  // The current view. Can be [false, "alert", "select-nodes", "select-node"]
    const [viewProps, setViewProps] = useState(false)
    const [hiddenView, setHiddenView] = useState(false)

    // Close the view when the location changes
    useEffect(() => {
        setHiddenView(false)
        setView(null)
        setViewProps(null)
    }, [location])

    // Reset the hidden state when the view changes
    useEffect(() => {
        setHiddenView(false)
    }, [view])

    // Close the view by resetting hidden nodes and edges and other decorations
    const closeView = () => {
        window.graph.nodes.forEach(node => node.hidden = false)
        window.graph.nodes.forEach(node => node.bubble = null)
        window.graph.edges.forEach(edge => edge.hidden = false)
        setView(false)
    }

    return (
        <nav>
            <ul className={scss.wrapper}>
                <li className={location.pathname === "/" ? scss.current : undefined}><Link to="/">Graph Editor</Link></li>
                <li>
                    Algorithms
                    <AlgorithmsSubMenu setView={setView} setViewProps={setViewProps} setHiddenView={setHiddenView} />
                </li>
                <li className={location.pathname === "/examples" ? scss.current : undefined}><Link to="/examples">Examples</Link></li>
                <li className={location.pathname === "/help" ? scss.current : undefined}><Link to="/help">Help</Link></li>
                {
                    // Additional nav item "View" when a view is open
                    view && <>
                        <hr />
                        <li className={scss.view_item}>View<SubMenu>
                            {<>
                                <div>
                                    {view !== "alert" && <SubMenuItem title="Open view menu" callback={() => setHiddenView(false)} />}
                                    <SubMenuItem title="Close view" callback={() => closeView()} />
                                </div>
                            </>}
                        </SubMenu>
                        </li></>
                }
            </ul>
            {
                // Views
                !hiddenView && <> {// If the view is not hidden ...
                    view === "alert" && <AlertView setView={setView} setHiddenView={setHiddenView} options={viewProps} /> ||
                    view === "select-nodes" && <SelectNodesView setView={setView} setHiddenView={setHiddenView} options={viewProps} /> ||
                    view === "select-node" && <SelectNodeView setView={setView} setHiddenView={setHiddenView} options={viewProps} />
                }</>
            }
        </nav>
    )
}
