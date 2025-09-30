import { db } from '@/lib/db';
import { downloads } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { FileText, Download } from 'lucide-react';

export const metadata = {
  title: 'Downloads - Mike Carney Wellbeing Hub',
  description: 'Download forms, policies, and important documents',
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export default async function DownloadsPage() {
  const allDownloads = await db
    .select()
    .from(downloads)
    .where(eq(downloads.published, true))
    .orderBy(desc(downloads.createdAt));

  // Group downloads by category
  const downloadsByCategory = allDownloads.reduce((acc, download) => {
    if (!acc[download.category]) {
      acc[download.category] = [];
    }
    acc[download.category].push(download);
    return acc;
  }, {} as Record<string, typeof allDownloads>);

  const categories = Object.keys(downloadsByCategory).sort();

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Downloads</h1>
          <p className="text-gray-600">Access forms, policies, and important documents</p>
        </div>

        {categories.length > 0 ? (
          <div className="space-y-8">
            {categories.map((category) => (
              <section key={category}>
                <h2 className="text-2xl font-semibold mb-4 capitalize">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {downloadsByCategory[category].map((download) => (
                    <article key={download.id} className="card hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="text-primary-600" aria-hidden="true">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{download.title}</h3>
                        </div>
                      </div>
                      {download.description && (
                        <p className="text-sm text-gray-600 mb-4">{download.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <a
                          href={download.fileUrl}
                          download={download.fileName}
                          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                          aria-label={`Download ${download.title}`}
                        >
                          <Download className="h-4 w-4" aria-hidden="true" />
                          Download
                        </a>
                        {download.fileSize && (
                          <span className="text-xs text-gray-500">
                            {formatFileSize(download.fileSize)}
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-500">No downloads available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
