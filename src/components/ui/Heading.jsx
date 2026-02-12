export function Heading({ children }) {
  return (
    <h2
      className={
        "text-2xl font-bold text-center mb-6 text-gray-800 "
      }
    >
      {children}
    </h2>
  );
}