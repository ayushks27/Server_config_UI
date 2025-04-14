import ServerWizard from '@/components/server-wizard/ServerWizard';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="sr-only">MCP Server Configuration Wizard</h1>
        <ServerWizard />
      </div>
    </main>
  );
}
