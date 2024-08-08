import { useNavigate } from "react-router-dom"
import scss from "./help-menu.module.scss"

// Icons
import InfoIcon from '@assets/info.svg?react'

export default function HelpMenu() {

    const nav = useNavigate()

    return (
        <div className={scss.help_menu_wrap}>
            <div className={scss.icon_wrap}>
                <InfoIcon />
            </div>
            <div className={scss.help_menu_wrap}>
                <div className={scss.help_menu}>
                    <Item callback={() => nav("/help#to-shortcuts")}>Shortcuts</Item>
                    <Item callback={() => nav("/help#to-how-to")}>FAQ</Item>
                    <Item callback={() => nav("/help#to-contact")}>Feedback</Item>
                </div>
            </div>
        </div>
    )
}


function Item(props) {
    return (
        <div className={scss.item} onClick={props.callback}>
            {props.children}
        </div>
    )
}