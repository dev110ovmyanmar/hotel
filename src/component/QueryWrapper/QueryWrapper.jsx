export default function QueryWrapper({
  isLoading,
  error,
  children,
}) {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong</div>;

  return children;
}