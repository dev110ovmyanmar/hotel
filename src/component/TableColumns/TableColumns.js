
export const TableColumns = (
  columns,
  defaultProps = { align: "center" }
) => {
  return columns.map((col) => ({
    ...defaultProps,
    ...col, 
  }));
};