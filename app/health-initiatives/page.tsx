import { Heart, Activity, Apple, Users } from 'lucide-react';

export const metadata = {
  title: 'Health Initiatives - Mike Carney Wellbeing Hub',
  description: 'Discover our staff health and wellbeing initiatives',
};

export default function HealthInitiativesPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Health Initiatives</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            We're committed to supporting the health and wellbeing of our staff through various programs and initiatives.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <InitiativeCard
              icon={<Heart className="h-10 w-10" />}
              title="Mental Health Support"
              description="Access to confidential counselling services and mental health resources for you and your family."
              features={[
                'Employee Assistance Program (EAP)',
                'Mental health first aid training',
                'Stress management workshops',
                'Work-life balance initiatives',
              ]}
            />
            <InitiativeCard
              icon={<Activity className="h-10 w-10" />}
              title="Physical Fitness"
              description="Stay active with our fitness programs and gym facilities."
              features={[
                'Mike Carney Health gym membership',
                'Group fitness classes',
                'Personal training sessions',
                'Wellness challenges and competitions',
              ]}
            />
            <InitiativeCard
              icon={<Apple className="h-10 w-10" />}
              title="Nutrition & Wellness"
              description="Learn about healthy eating and lifestyle choices."
              features={[
                'Nutrition workshops and seminars',
                'Healthy eating guides',
                'Regular health screenings',
                'Preventive health programs',
              ]}
            />
            <InitiativeCard
              icon={<Users className="h-10 w-10" />}
              title="Team Wellbeing"
              description="Build connections and support each other."
              features={[
                'Social events and team activities',
                'Peer support networks',
                'Recognition programs',
                'Community involvement opportunities',
              ]}
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Your Wellbeing Matters</h2>
            <p className="text-lg text-gray-700 mb-8">
              At Mike Carney Group, we believe that healthy, happy employees are the foundation of our success. 
              Our comprehensive wellbeing programs are designed to support you in all aspects of your life.
            </p>
            <p className="text-gray-600">
              For more information about our health initiatives or to access staff-only resources, please log in to the staff portal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function InitiativeCard({
  icon,
  title,
  description,
  features,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <article className="card">
      <div className="text-primary-600 mb-4" aria-hidden="true">
        {icon}
      </div>
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <svg
              className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
