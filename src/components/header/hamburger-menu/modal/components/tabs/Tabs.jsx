import { useEffect } from "react"
import { useState } from "react"
import scss from "./tabs.module.scss"

const DEFAULT_TAB = 0

/**
 * Tabs component
 * 
 * This component displays a set of tabs with different tabs that can be selected.
 * 
 * @param {Object} props
 * @param {Array<Function>} props.tabs - An array of functions that return the JSX of the tabs
 * @param {Array<String>} props.titles - An array of titles for the tabs
 * @param {Function} props.closeModal - Function to close the modal
 * 
 * @returns {JSX.Element}
 */
export default function Tabs({tabs, titles, closeModal}) {

    const [tabIndex, setTabIndex] = useState(DEFAULT_TAB)  // The current section index
    const [CurrentTab, setCurrentTab] = useState(tabs[tabIndex])  // The current section component

    // Set the current section based on the tab index
    useEffect(() => {
        setCurrentTab(tabs[tabIndex])
    }, [tabIndex])

  return (
      <div className={scss.wrap}>
        <div className={scss.header}>
            {titles.map((title, i) => (
                <span key={i} className={[scss.tab_title, i === tabIndex && scss.active].join(" ")} onClick={() => setTabIndex(i)}>{title}</span>
            ))}
        </div>
        <div className={scss.body}>
            <CurrentTab closeModal={closeModal}/>
        </div>
      </div>
  )
}
