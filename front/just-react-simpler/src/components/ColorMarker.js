export default function ColorMarker({ name = '', color, onClick }) {
    const style = {}
    if (color) {
        style.backgroundColor = '#' + color
    }
    return <div className="color-marker" name={name} title={name} style={style} onClick={onClick}></div>
}