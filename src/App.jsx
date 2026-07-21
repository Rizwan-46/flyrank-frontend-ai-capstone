import SettingsForm from './components/SettingsForm';

export default function App() {
  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors duration-200">
      <div className="w-full max-w-xl">
        <SettingsForm />
      </div>
    </main>
  );
}