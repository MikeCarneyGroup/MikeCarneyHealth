export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
