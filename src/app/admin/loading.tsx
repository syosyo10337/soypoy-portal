export default function AdminLoading() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    </div>
  );
}
