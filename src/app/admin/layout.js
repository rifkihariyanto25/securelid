export default function AdminLayout({ children }) {
  return (
    <div className="flex-1 overflow-auto">
      {children}
    </div>
  );
}