import { db } from '@/lib/db';
import { policies } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { FileText, Download } from 'lucide-react';

export const metadata = {
  title: 'Policies - Mike Carney Wellbeing Hub',
  description: 'Company policies and documentation',
};

export default async function PoliciesPage() {
  const allPolicies = await db
    .select()
    .from(policies)
    .where(eq(policies.published, true))
    .orderBy(desc(policies.createdAt));

  // Group policies by category
  const policiesByCategory = allPolicies.reduce((acc, policy) => {
    if (!acc[policy.category]) {
      acc[policy.category] = [];
    }
    acc[policy.category].push(policy);
    return acc;
  }, {} as Record<string, typeof allPolicies>);

  const categories = Object.keys(policiesByCategory).sort();

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Company Policies</h1>
          <p className="text-gray-600">Access important company policies and documentation</p>
        </div>

        {categories.length > 0 ? (
          <div className="space-y-8">
            {categories.map((category) => (
              <section key={category}>
                <h2 className="text-2xl font-semibold mb-4 capitalize">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {policiesByCategory[category].map((policy) => (
                    <article key={policy.id} className="card flex items-start gap-4 group hover:shadow-md transition-shadow">
                      <div className="text-primary-600 mt-1" aria-hidden="true">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 group-hover:text-primary-600 transition-colors">
                          {policy.title}
                        </h3>
                        {policy.description && (
                          <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                        )}
                        {policy.fileUrl && (
                          <a
                            href={policy.fileUrl}
                            download
                            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                            aria-label={`Download ${policy.title}`}
                          >
                            <Download className="h-4 w-4" aria-hidden="true" />
                            Download PDF
                          </a>
                        )}
                        <time className="block text-xs text-gray-500 mt-2">
                          Updated: {new Date(policy.updatedAt).toLocaleDateString('en-AU')}
                        </time>
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
            <p className="text-gray-500">No policies available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
