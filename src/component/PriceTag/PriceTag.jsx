const PriceTag = ({ value, align = 'end' }) => {
  return (
    <div className={`text-${align}`}>
      {value?.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </div>
  );
};

export default PriceTag;


export const priceFormatter = (value) =>
  value ? new Intl.NumberFormat("en-US").format(value) : "";

export const priceParser = (value) => (value ? value.replace(/,/g, "") : "");
