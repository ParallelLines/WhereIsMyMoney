import ColorMarker from "./ColorMarker"

export default function Category({ data }) {
    data.name = data.name ? data.name : ''
    data.color = data.color ? data.color : 'ffabd5'
    data.level = data.level ? data.level : '1'
    const className = 'category' + ' ' + 'level-' + data.level
    return (
        <div className={className}>
            <span>{data.name}</span>
            <ColorMarker name={data.name} color={data.color} />
        </div>
    )
}