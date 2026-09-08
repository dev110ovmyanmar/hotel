import StepsComponent from "../../component/Steps/StepsComponent";

const CheckBookingHeader = ({
    colorClick,
}) => {
    
    return (
        <div className="my-5">
            <StepsComponent stepValue={colorClick} />
        </div>
    )
}

export default CheckBookingHeader


