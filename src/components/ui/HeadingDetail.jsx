export function HeadingDetail({ children}) {
  return (
    <h3
      className={
        "text-sm text-center mb-10 text-gray-700 "
      }
    >
      {children}
    </h3>
  );
}