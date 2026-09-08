const PriceTag = ({ value, align = 'end' }) => {
  return (
    <span className={`text-${align}`}>
      {value?.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
};

export default PriceTag;


export const priceFormatter = (value) =>
  value !== null && value !== undefined && value !== ""
    ? new Intl.NumberFormat("en-US").format(value)
    : "";

export const priceParser = (value) => (value ? value.replace(/,/g, "") : "");
