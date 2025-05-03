export function SiteCardSkeleton() {
    return (
        <div className="rounded-lg border bg-gray-100 p-4 shadow-sm animate-pulse">
            <div className="h-5 w-3/4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 w-1/2 bg-gray-300 rounded mb-4"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
        </div>
    );
}  