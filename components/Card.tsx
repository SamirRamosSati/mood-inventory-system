export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-fill bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
      {children}
    </div>
  );
}
