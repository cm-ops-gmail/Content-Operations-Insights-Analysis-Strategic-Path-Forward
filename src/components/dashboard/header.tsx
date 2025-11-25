import Alerts from './alerts';

export default function DashboardHeader() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-10">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6">
        <div className="w-28"></div> {/* Spacer to help with centering */}
        <div className="text-center">
          <h1 className="font-headline text-xl md:text-2xl font-bold text-foreground">
            Performance Analytics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            10MS Content Operations Team
          </p>
        </div>
        <div className="w-28 flex justify-end">
          <Alerts />
        </div>
      </div>
    </header>
  );
}
