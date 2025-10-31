import { Briefcase, TrendingUp, Users, Award } from 'lucide-react';

export const metadata = {
  title: 'Careers - Mike Carney Wellbeing Hub',
  description: 'Join the Mike Carney Group team',
};

export default function CareersPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Careers at Mike Carney Group</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Join our growing team and build a rewarding career in the automotive industry.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Work With Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re more than just a workplace—we&apos;re a community dedicated to excellence, growth, and wellbeing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Career Growth"
              description="Opportunities for advancement and professional development"
            />
            <BenefitCard
              icon={<Award className="h-8 w-8" />}
              title="Competitive Benefits"
              description="Industry-leading salary packages and benefits"
            />
            <BenefitCard
              icon={<Users className="h-8 w-8" />}
              title="Great Culture"
              description="Supportive team environment and inclusive workplace"
            />
            <BenefitCard
              icon={<Briefcase className="h-8 w-8" />}
              title="Work-Life Balance"
              description="Flexible working arrangements and wellbeing focus"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <BrandCard name="Lexus of Townsville" />
            <BrandCard name="Mike Carney Toyota" />
            <BrandCard name="Ingham Toyota" />
            <BrandCard name="Charters Towers Toyota" />
            <BrandCard name="Charters Towers Mahindra" />
            <BrandCard name="Mike Carney Mahindra" />
            <BrandCard name="4WD Central" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Current Opportunities</h2>
            <p className="text-lg text-gray-600 mb-8">
              We&apos;re always looking for talented individuals to join our team. Whether you&apos;re experienced in automotive sales, 
              service, parts, or administration, we have opportunities across our brands.
            </p>

            <div className="card bg-primary-50 border-primary-200">
              <h3 className="text-xl font-semibold mb-4">How to Apply</h3>
              <ol className="space-y-3 list-decimal list-inside">
                <li className="text-gray-700">Browse current vacancies on our careers portal</li>
                <li className="text-gray-700">Submit your resume and cover letter</li>
                <li className="text-gray-700">Our recruitment team will review your application</li>
                <li className="text-gray-700">Shortlisted candidates will be contacted for an interview</li>
              </ol>
              <div className="mt-6">
                <a
                  href="mailto:careers@mikecarney.com.au"
                  className="btn-primary px-6 py-3"
                >
                  Contact Recruitment Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mb-4" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function BrandCard({ name }: { name: string }) {
  return (
    <div className="card text-center hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">{name}</h3>
    </div>
  );
}
