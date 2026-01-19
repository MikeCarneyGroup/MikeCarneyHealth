import Image from 'next/image';
import { Clock, MapPin, Dumbbell, Users, Calendar, Award } from 'lucide-react';

export const metadata = {
  title: 'Mike Carney Health - Wellbeing Hub',
  description: 'Learn about Mike Carney Health gym and fitness facilities',
};

export default function MCHPage() {
  return (
    <div>
      <section className="bg-linear-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/MCH-Logo.png"
              alt="Mike Carney Health"
              width={80}
              height={80}
              className="bg-white rounded-lg p-2"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Mike Carney Health</h1>
              <p className="text-xl opacity-90 mt-2">Your Staff Fitness Centre</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome to Your Gym</h2>
            <p className="text-lg text-gray-600">
              Mike Carney Health is our dedicated fitness facility, exclusively available to Mike Carney Group staff 
              and their families. We&apos;re committed to supporting your health and fitness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Dumbbell className="h-8 w-8" />}
              title="Modern Equipment"
              description="State-of-the-art cardio and strength training equipment"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Group Classes"
              description="Diverse range of fitness classes for all levels"
            />
            <FeatureCard
              icon={<Award className="h-8 w-8" />}
              title="Personal Training"
              description="One-on-one sessions with qualified trainers"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Flexible Hours"
              description="Extended opening hours to suit your schedule"
            />
            <FeatureCard
              icon={<MapPin className="h-8 w-8" />}
              title="Convenient Location"
              description="Easily accessible for all staff members"
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Programs & Challenges"
              description="Regular fitness challenges and wellness programs"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Membership Information</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Staff Membership</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complimentary membership for all staff</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>24/7 gym access with your staff ID</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Access to all group fitness classes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free fitness assessment and program design</span>
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Family Membership</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Same great facilities and classes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Contact HR for family membership details</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 card bg-primary-50 border-primary-200">
              <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
              <p className="text-gray-700 mb-4">
                Ready to start your fitness journey? Contact our team to activate your membership and schedule 
                your free fitness assessment.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="mailto:health@mikecarney.com.au" className="btn-primary px-6 py-2">
                  Contact MCH Team
                </a>
                <a href="/downloads" className="btn-outline px-6 py-2">
                  Download Class Schedule
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card text-center">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mb-4 mx-auto" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
