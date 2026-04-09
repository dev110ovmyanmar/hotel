
const PriceTag = ({value}) =>{
    return (
        <div className="text-end">{value?.toLocaleString()}</div>
    )
}

export default PriceTag;