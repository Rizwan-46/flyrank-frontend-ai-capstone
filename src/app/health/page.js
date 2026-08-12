import { vaccinations } from '@/data/vaccinations';
export default function HealthCheckPage() {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-8">
      <div>
        <h1 className="text-3xl font-bold">System Health Check</h1>
        <p className="text-slate-500 mt-2">Verifying data connections and dynamic date logic.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">Vaccination Status Engine</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vaccinations.map((vaccine) => {
            // Determine status based on dates
            let status = 'UPCOMING';
            let badgeColors = 'bg-green-100 text-green-700';
            let cardColors = 'bg-green-50 border-green-200';

            if (vaccine.nextDueDate < today) {
              status = 'OVERDUE';
              badgeColors = 'bg-red-100 text-red-700';
              cardColors = 'bg-red-50 border-red-200';
            } else if (vaccine.nextDueDate === today) {
              status = 'DUE TODAY';
              badgeColors = 'bg-orange-100 text-orange-700';
              cardColors = 'bg-orange-50 border-orange-200';
            }
            
            return (
              <div 
                key={vaccine.id} 
                className={`p-4 border rounded-md ${cardColors}`}
              >
                <h3 className="font-bold text-slate-800">{vaccine.name}</h3>
                <p className="text-sm mt-1 text-slate-600">Due: {vaccine.nextDueDate}</p>
                <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${badgeColors}`}>
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}