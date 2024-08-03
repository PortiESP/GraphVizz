import scss1 from "./nav.module.scss"
import scss2 from "./views.module.scss"
const scss = { ...scss1, ...scss2 } 
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Components & functions
import AlgorithmsSubMenu from "./AlgorithmsSubMenu";
import SubMenu, { SubMenuItem } from "./nav-sub-menu/SubMenu";

// Views
import AlertView from "./views/AlertView";
import SelectNodesView from "./views/SelectNodesView";
import SelectNodeView from "./views/SelectNodeView";


const DEFAULT_VIEW = null  // The default view
const DEFAULT_VIEW_PROPS = null  // The default view props


/**
 * The navigation bar.
 */
export default function Nav() {

    const location = useLocation()  // Get the current location

    const [view, setView] = useState(DEFAULT_VIEW)  // The current view. Can be [false, "alert", "select-nodes", "select-node"]
    const [viewProps, setViewProps] = useState(DEFAULT_VIEW_PROPS)
    const [hiddenView, setHiddenView] = useState(false)
    const [resetViewStyles, setResetViewStyles] = useState(null) // Allow the view to run a callback when it closes. E.G.: [{node: "A", color: "red", r: 30}, ...]

    // Close the view when the location changes
    useEffect(() => {
        setHiddenView(false)
        setView(DEFAULT_VIEW)
        setViewProps(DEFAULT_VIEW_PROPS)
    }, [location])

    // Reset the hidden state when the view changes
    useEffect(() => {
        if (!view) closeView()
        setHiddenView(false)
    }, [view])

    // Close the view by resetting hidden nodes and edges and other decorations
    const closeView = () => {
        if (!window.graph) return  // If the graph is not loaded, return

        window.graph.nodes.forEach(node => node.hidden = false)
        window.graph.nodes.forEach(node => node.bubble = null)
        window.graph.edges.forEach(edge => edge.hidden = false)

        // Reset the styles modified by the view
        if (resetViewStyles && !view) {
            if (window.cvs.debug) console.log("resetting view styles", resetViewStyles)
            resetViewStyles.map(({ node, ...styles}) => {
                Object.entries(styles).forEach(([k, v]) => {
                    node[k] = v
                })
            })
            setResetViewStyles(null)
        }

        setView(false)
    }

    return (
        <nav>
            <ul className={scss.wrapper}>
                <li className={location.pathname === "/" ? scss.current : undefined}><Link to="/">Graph Editor</Link></li>
                <li>
                    Algorithms
                    <AlgorithmsSubMenu setView={setView} setViewProps={setViewProps} setHiddenView={setHiddenView} setResetViewStyles={setResetViewStyles}/>
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
                    // Render a different component based on the value of the view state
                    view === "alert" && <AlertView setView={setView} setHiddenView={setHiddenView} options={viewProps} /> ||
                    view === "select-nodes" && <SelectNodesView setView={setView} setHiddenView={setHiddenView} options={viewProps} /> ||
                    view === "select-node" && <SelectNodeView setView={setView} setHiddenView={setHiddenView} options={viewProps} />
                }</>
            }
        </nav>
    )
}
