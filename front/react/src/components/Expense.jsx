import { useNavigate } from "react-router-dom";
import CategoryMarker from "./CategoryMarker";

export default function Expense({ data }) {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate(`/expenses/${data.id}`)
    }
    return (
        <div className="Expense" onClick={handleClick}>
            {data.name} {data.symbol + data.sum}
            <CategoryMarker name={data.category_name} color={data.color} />
        </div>
    )
}