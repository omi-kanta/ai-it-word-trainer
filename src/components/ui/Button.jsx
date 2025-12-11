export function Button({
  children,
  className = "",
  ...props
}) {
  return (

    <div className="flex justify-center">
          <button
      className={
        "rounded-lg text-white px-4 py-2 text-sm " +
        "bg-gradient-to-br from-blue-600 to-purple-600 " +
        "hover:from-blue-400 hover:to-purple-400 hover:shadow-lg " +
        "disabled:opacity-10 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  </div>
  );
}