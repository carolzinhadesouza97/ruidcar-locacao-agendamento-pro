
import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import WorkshopMap from "@/components/WorkshopMap";
import WorkshopList from "@/components/WorkshopList";
import WorkshopDetails from "@/components/WorkshopDetails";
import ScheduleForm from "@/components/ScheduleForm";
import { workshopsData, Workshop } from "@/data/workshops";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

// Define the possible views for the right panel
type PanelView = "list" | "details" | "schedule";

const Index = () => {
  // State for tracking the selected workshop
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  // State for the workshops to display in the list
  const [workshopsToDisplay, setWorkshopsToDisplay] = useState<Workshop[]>([]);
  // State for the current view in the panel
  const [currentView, setCurrentView] = useState<PanelView>("list");
  // State for mobile sheet open
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Handle workshop selection
  const handleSelectWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setCurrentView("details");
    setIsSheetOpen(true);
  };

  // Handle updating the workshops list (e.g., when finding nearest)
  const handleUpdateWorkshops = (workshops: Workshop[]) => {
    console.log("Recebendo oficinas para exibir:", workshops);
    setWorkshopsToDisplay(workshops);
    setIsSheetOpen(true); // Open the sheet on mobile when workshops are found
    setCurrentView("list"); // Ensure we're showing the list view
  };

  // Handle going back to the list view
  const handleBackToList = () => {
    setCurrentView("list");
  };

  // Handle going to the schedule view
  const handleGoToSchedule = () => {
    setCurrentView("schedule");
  };

  // Handle successful scheduling
  const handleScheduleSuccess = () => {
    setCurrentView("list");
    setSelectedWorkshop(null);
  };

  // Render the content based on the current view
  const renderPanelContent = () => {
    switch (currentView) {
      case "details":
        return selectedWorkshop ? (
          <WorkshopDetails
            workshop={selectedWorkshop}
            onBack={handleBackToList}
            onSchedule={handleGoToSchedule}
          />
        ) : (
          <WorkshopList
            workshops={workshopsToDisplay}
            onSelectWorkshop={handleSelectWorkshop}
            selectedWorkshop={selectedWorkshop || undefined}
          />
        );
      case "schedule":
        return selectedWorkshop ? (
          <ScheduleForm
            workshop={selectedWorkshop}
            onScheduleSuccess={handleScheduleSuccess}
          />
        ) : (
          <WorkshopList
            workshops={workshopsToDisplay}
            onSelectWorkshop={handleSelectWorkshop}
            selectedWorkshop={selectedWorkshop || undefined}
          />
        );
      case "list":
      default:
        return (
          <WorkshopList
            workshops={workshopsToDisplay}
            onSelectWorkshop={handleSelectWorkshop}
            selectedWorkshop={selectedWorkshop || undefined}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-1 container py-6 flex flex-col">
        {/* Welcome section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-brand-gray">
            Localize e agende serviços nas melhores oficinas
          </h1>
          <p className="text-brand-gray mt-2">
            Encontre oficinas próximas, compare preços e agende serviços de forma rápida e fácil.
          </p>
        </div>

        {/* Main content area - Map and Panel */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map area (desktop: 2/3, mobile: full) */}
          <div className="lg:col-span-2 h-[500px] lg:h-auto relative rounded-xl overflow-hidden shadow-md">
            <WorkshopMap
              onSelectWorkshop={handleSelectWorkshop}
              workshops={workshopsData}
              onSchedule={handleGoToSchedule}
              onUpdateNearestWorkshops={handleUpdateWorkshops}
            />
            
            {/* Mobile trigger for the panel */}
            <div className="lg:hidden absolute bottom-4 left-4 z-10">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button 
                    className="bg-white text-brand-gray shadow-lg hover:bg-gray-100"
                    size="sm"
                  >
                    <MenuIcon className="w-4 h-4 mr-1" />
                    {workshopsToDisplay.length > 0 
                      ? `Ver ${workshopsToDisplay.length} Oficinas` 
                      : "Ver Oficinas"}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80%] pt-6 px-0 sm:px-0">
                  <div className="h-full overflow-y-auto px-4">
                    {renderPanelContent()}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Panel area (desktop only) */}
          <div className="hidden lg:block overflow-y-auto max-h-[calc(100vh-300px)] pr-2">
            {renderPanelContent()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
