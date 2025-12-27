export default function Loading({ text }) {
  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
