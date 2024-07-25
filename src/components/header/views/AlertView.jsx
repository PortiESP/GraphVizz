import scss from "../header.module.scss"


export default function AlertView({options}) {

    const style = {
        backgroundColor: options.color,
    }
    
    return <div className={[scss.menu_options_view_msg, scss.alert].join(" ")} style={style}>
        <span><strong>{options.title}:</strong> {options.message}</span>
    </div>
}