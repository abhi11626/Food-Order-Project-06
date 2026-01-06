export default function Button({ textOnly, children, className, ...props }) {
  const cssClasses = textOnly
    ? "text-button " + className
    : "button " + className;

  return (
    <button className={cssClasses} {...props}>
      {children}
    </button>
  );
}
