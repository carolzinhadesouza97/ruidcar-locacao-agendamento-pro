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

type PanelView = "list" | "details" | "schedule";

const Index = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [workshopsToDisplay, setWorkshopsToDisplay] = useState<Workshop[]>(allWorkshops.slice(0, 5));
  const [currentView, setCurrentView] = useState<PanelView>("list");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSelectWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setCurrentView("details");
    setIsSheetOpen(true);
  };

  const handleUpdateWorkshops = (workshops: Workshop[]) => {
    console.log("Recebendo oficinas para exibir:", workshops);
    setWorkshopsToDisplay(workshops.length > 0 ? workshops : allWorkshops.slice(0, 5));
    setIsSheetOpen(true);
    setCurrentView("list");
  };

  const handleBackToList = () => {
    setCurrentView("list");
  };

  const handleGoToSchedule = () => {
    setCurrentView("schedule");
  };

  const handleScheduleSuccess = () => {
    setCurrentView("list");
    setSelectedWorkshop(null);
  };

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-brand-gray">
            Localize e agende serviços nas melhores oficinas
          </h1>
          <p className="text-brand-gray mt-2">
            Encontre oficinas próximas, compare preços e agende serviços de forma rápida e fácil.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[500px] lg:h-auto relative rounded-xl overflow-hidden shadow-md">
            <WorkshopMap
              onSelectWorkshop={handleSelectWorkshop}
              workshops={allWorkshops}
              onSchedule={handleGoToSchedule}
              onUpdateNearestWorkshops={handleUpdateWorkshops}
            />
            
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
