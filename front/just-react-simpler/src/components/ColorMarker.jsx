export default function ColorMarker({ name = '', color, ref, onClick }) {
    const style = {}
    if (color) {
        style.backgroundColor = '#' + color
    }
    return <div className="color-marker" name={name} title={name} style={style} onClick={onClick} ref={ref}></div>
}