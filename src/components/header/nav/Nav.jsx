import scss from "../header.module.scss"


import { Link } from "react-router-dom";
import AlgorithmsSubMenu from "./AlgorithmsSubMenu";
import SubMenu, { SubMenuItem } from "../nav-sub-menu/SubMenu";

// Views
import AlertView from "../views/AlertView";
import SelectNodesView from "../views/SelectNodesView";
import SelectNodeView from "../views/SelectNodeView";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function Nav(props) {

    const location = useLocation()

    const [view, setView] = useState(false)
    const [viewProps, setViewProps] = useState(false)
    const [hiddenView, setHiddenView] = useState(false)

    useEffect(() => {
        setHiddenView(false)
        setView(null)
        setViewProps(null)
    }, [location])

    useEffect(() => {
        setHiddenView(false)
    }, [view])


    const closeView = () => {
        window.graph.nodes.forEach(node => node.hidden = false)
        window.graph.nodes.forEach(node => node.bubble = null)
        window.graph.edges.forEach(edge => edge.hidden = false)
        setView(false)
    }

    return (
        <nav>
            <ul>
                <li className={location.pathname === "/" ? scss.current : undefined}><Link to="/">Graph Editor</Link></li>
                <li>Algorithms
                    <AlgorithmsSubMenu view={view} setView={setView} setViewProps={setViewProps} viewProps={viewProps} setHiddenView={setHiddenView} hiddenView={hiddenView} />
                </li>
                <li className={location.pathname === "/examples" ? scss.current : undefined}><Link to="/examples">Examples</Link></li>
                <li className={location.pathname === "/help" ? scss.current : undefined}><Link to="/help">Help</Link></li>
                {
                    // Additional nav items when a view is open
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
                view === "alert" && <AlertView hiddenView={hiddenView} options={viewProps} /> ||
                view === "select-nodes" && <SelectNodesView hiddenView={hiddenView} options={viewProps} /> ||
                view === "select-node" && <SelectNodeView hiddenView={hiddenView} options={viewProps} />
            }
        </nav>
    )
}
