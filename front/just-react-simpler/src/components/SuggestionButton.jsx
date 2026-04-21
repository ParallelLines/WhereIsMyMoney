export default function SuggestionButton({ value, color, onClick }) {
    const style = {}
    if (color) {
        style.backgroundColor = '#' + color
    }
    return <button className="suggestion-btn" title={value} style={style} onClick={onClick}>{value}</button>
}