import { ArrowPathIcon } from "@heroicons/react/24/outline";

export function LoadingSpinner({ big = false }: { big?: boolean }) {
  const sizeClasses = big ? "w-16 h-16" : "w-10 h-10";

  return (
    <div className="flex justify-center p-2">
      <ArrowPathIcon className={`animate-spin text-gray-500 ${sizeClasses}`} />
    </div>
  );
}
