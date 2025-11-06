import { useSelectedCategory } from "../utils/AppContext"

export default function PieChart() {
    const { selectedCategory } = useSelectedCategory()

    return (
        <div className="pie-chart">
            {`Chosen category: ${selectedCategory}`}
        </div>
    )
}