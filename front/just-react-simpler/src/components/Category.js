
import { useSelectedCategory } from "../utils/AppContext"
import ColorMarker from "./ColorMarker"

export default function Category({ data }) {
    data.name = data.name ? data.name : ''
    data.color = data.color ? data.color : 'ffabd5'
    data.level = data.level ? data.level : '1'

    const { selectedCategory, setSelectedCategory } = useSelectedCategory()
    const selected = selectedCategory === data.id

    const handleSelect = () => {
        if (selectedCategory === data.id) {
            setSelectedCategory(null)
        } else {
            setSelectedCategory(data.id)
        }
    }

    return (
        <div className={`category level-${data.level} ${selected ? 'selected' : ''}`} onClick={handleSelect}>
            <input type="checkbox"></input>
            <span>{data.name}</span>
            <ColorMarker name={data.name} color={data.color} />
        </div>
    )
}