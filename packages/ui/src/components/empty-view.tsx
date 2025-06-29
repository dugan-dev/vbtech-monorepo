type props = {
  description: string;
  title: string;
  actionText?: string;
  icon: React.ReactElement;
  children?: React.ReactNode;
};

export function EmptyView({
  description,
  title,
  actionText,
  icon,
  children,
}: props) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {children}
      {actionText && <p className="text-sm text-gray-500 mt-4">{actionText}</p>}
    </div>
  );
}