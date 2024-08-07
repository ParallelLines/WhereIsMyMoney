export default function ColorMarker({ name, color }) {
    // move all to index.css except color
    const style = {
        backgroundColor: '#' + color
    }
    return <div className="color-marker" name={name} title={name} style={style}></div>
}