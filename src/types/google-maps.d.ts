
// This file ensures TypeScript recognizes the Google Maps global namespace
// It's not needed if @types/google.maps is correctly installed and configured
// But we're adding it as a safeguard

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      fitBounds(bounds: LatLngBounds): void;
      getZoom(): number;
      setZoom(zoom: number): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(point: LatLng): LatLngBounds;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      [key: string]: any;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    namespace event {
      function addListenerOnce(
        instance: any,
        eventName: string,
        handler: (...args: any[]) => void
      ): MapsEventListener;
    }

    interface MapsEventListener {
      remove(): void;
    }

    namespace geometry {
      namespace spherical {
        function computeDistanceBetween(from: LatLng, to: LatLng): number;
      }
    }
  }
}
