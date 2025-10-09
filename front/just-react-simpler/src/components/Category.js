import ColorMarker from "./ColorMarker"

export default function Category({ data }) {
    data.name = data.name ? data.name : ''
    data.color = data.color ? data.color : 'ffabd5'
    data.level = data.level ? data.level : '1'
    return (
        <div className={`category level-${data.level}`}>
            <input type="checkbox"></input>
            <span>{data.name}</span>
            <ColorMarker name={data.name} color={data.color} />
        </div>
    )
}