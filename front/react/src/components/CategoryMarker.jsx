export default function CategoryMarker({ name, color }) {
    // move all to index.css except color
    const style = {
        width: '1rem',
        height: '1rem',
        borderRadius: '50%',
        backgroundColor: '#' + color,
        cursor: 'pointer'
    }
    return <div className="CategoryMarker" name={name} title={name} style={style}></div>
}