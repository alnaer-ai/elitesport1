import { useRouter } from "next/router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Place } from "@/lib/placeTypes";
import { PlaceModal } from "./PlaceModal";

type PlaceModalContextType = {
  openModal: (place: Place, categoryLabel?: string) => void;
  closeModal: () => void;
  isOpen: boolean;
  selectedPlace: Place | null;
  categoryLabel: string | undefined;
};

const PlaceModalContext = createContext<PlaceModalContextType | undefined>(
  undefined
);

export const usePlaceModal = () => {
  const context = useContext(PlaceModalContext);
  if (!context) {
    throw new Error("usePlaceModal must be used within PlaceModalProvider");
  }
  return context;
};

export const PlaceModalProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [categoryLabel, setCategoryLabel] = useState<string | undefined>(
    undefined
  );

  const openModal = (place: Place, label?: string) => {
    setSelectedPlace(place);
    setCategoryLabel(label);
  };

  const closeModal = useCallback(() => {
    setSelectedPlace(null);
    setCategoryLabel(undefined);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => closeModal();
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [closeModal, router.events]);

  return (
    <PlaceModalContext.Provider
      value={{
        openModal,
        closeModal,
        isOpen: selectedPlace !== null,
        selectedPlace,
        categoryLabel,
      }}
    >
      {children}
      <PlaceModal
        place={selectedPlace}
        isOpen={selectedPlace !== null}
        onClose={closeModal}
        categoryLabel={categoryLabel}
      />
    </PlaceModalContext.Provider>
  );
};
