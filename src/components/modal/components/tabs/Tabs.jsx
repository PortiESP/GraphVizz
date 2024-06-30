import { useEffect } from "react"
import { useState } from "react"
import scss from "./tabs.module.scss"

export default function ({sections, titles, closeModal}) {

    const [section, setSection] = useState(0)
    const [CurrentSection, setCurrentSection] = useState(sections[0])

    useEffect(() => {
        setCurrentSection(sections[section])
    }, [section])

  return (
      <div className={scss.wrap}>
        <div className={scss.header}>
            {titles.map((title, i) => (
                <span key={i} className={[scss.tab_title, i === section && scss.active].join(" ")} onClick={() => setSection(i)}>{title}</span>
            ))}
        </div>
        <div className={scss.body}>
            <CurrentSection closeModal={closeModal}/>
        </div>
      </div>
  )
}
