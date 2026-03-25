import { Tag } from "antd";

const BooleanTag = ({ value, trueText = "Yes", falseText = "No" }) => {

    const isPositive = value === true ||
        value === "Yes" ||
        value === "true" ||
        value === 1 ||
        value === "True";

    return (
        <Tag
            color={isPositive ? "#389E0D" : "#CF1322"}
            style={{
                width: '75px',
                textAlign: 'center',
                fontWeight: 500,
                borderRadius: '4px',
            }}
        >
            {isPositive ? trueText : falseText}
        </Tag>
    );
};

export default BooleanTag;