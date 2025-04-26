
import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import WorkshopMap from "@/components/WorkshopMap";
import WorkshopList from "@/components/WorkshopList";
import WorkshopDetails from "@/components/WorkshopDetails";
import ScheduleForm from "@/components/ScheduleForm";
import { allWorkshops, Workshop } from "@/data/workshops";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type PanelView = "list" | "details" | "schedule";

const Index = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [workshopsToDisplay, setWorkshopsToDisplay] = useState<Workshop[]>(allWorkshops.slice(0, 5));
  const [currentView, setCurrentView] = useState<PanelView>("list");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Auto-open sheet on mobile when selecting a workshop
    if (isMobile && selectedWorkshop) {
      setIsSheetOpen(true);
    }
  }, [selectedWorkshop, isMobile]);

  const handleSelectWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setCurrentView("details");
    if (isMobile) {
      setIsSheetOpen(true);
    }
  };

  const handleUpdateWorkshops = (workshops: Workshop[]) => {
    console.log("Recebendo oficinas para exibir:", workshops);
    setWorkshopsToDisplay(workshops.length > 0 ? workshops : allWorkshops.slice(0, 5));
    if (isMobile) {
      setIsSheetOpen(true);
    }
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
      
      <main className="flex-1 container mx-auto py-4 px-4 md:py-6 md:px-6 flex flex-col">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-gray">
            Localize e agende serviços nas melhores oficinas
          </h1>
          <p className="text-brand-gray mt-1 md:mt-2 text-sm md:text-base">
            Encontre oficinas próximas, compare preços e agende serviços de forma rápida e fácil.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 h-[400px] md:h-[500px] lg:h-auto relative rounded-xl overflow-hidden shadow-md">
            <WorkshopMap
              onSelectWorkshop={handleSelectWorkshop}
              workshops={allWorkshops}
              onSchedule={handleGoToSchedule}
              onUpdateNearestWorkshops={handleUpdateWorkshops}
            />
            
            {isMobile && (
              <div className="absolute bottom-4 left-4 z-10">
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
                  <SheetContent 
                    side="bottom" 
                    className="h-[70vh] max-h-[700px] pt-6 px-0 sm:px-0 rounded-t-xl overflow-hidden"
                  >
                    <div className="h-full overflow-y-auto px-4">
                      {renderPanelContent()}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-y-auto max-h-[calc(100vh-300px)] pr-2 rounded-xl bg-white p-4 shadow-md">
            {renderPanelContent()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
