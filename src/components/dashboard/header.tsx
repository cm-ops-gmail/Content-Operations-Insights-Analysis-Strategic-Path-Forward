import Alerts from './alerts';

export default function DashboardHeader() {
  return (
    <header className="bg-card/50 backdrop-blur-lg shadow-sm sticky top-0 z-10">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6">
        <div className="w-28"></div> {/* Spacer to help with centering */}
        <div className="text-center">
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 pb-2">
            Pulse of Content Operations
          </h1>
          <p className="text-xs text-muted-foreground tracking-wider uppercase">
            Insights, Analysis & Strategic Path Forward
          </p>
        </div>
        <div className="w-28 flex justify-end">
          <Alerts />
        </div>
      </div>
    </header>
  );
}
