
import { Workshop } from '@/data/workshops';

export const createWorkshopMarker = (
  workshop: Workshop,
  map: google.maps.Map,
  isNearest: boolean,
  onSelectWorkshop: (workshop: Workshop) => void
): google.maps.Marker => {
  const marker = new google.maps.Marker({
    position: { lat: workshop.lat, lng: workshop.lng },
    map,
    title: workshop.name,
    icon: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${isNearest ? '#FF6600' : '#666666'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      `),
      scaledSize: new google.maps.Size(isNearest ? 40 : 32, isNearest ? 40 : 32),
      anchor: new google.maps.Point(isNearest ? 20 : 16, isNearest ? 40 : 32),
    },
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div class="p-2">
        <h3 class="font-semibold text-lg">${workshop.name}</h3>
        <p>${workshop.address}</p>
        <p>${workshop.city}, ${workshop.state}</p>
        <p>${workshop.phone}</p>
      </div>
    `,
  });

  marker.addListener('click', () => {
    onSelectWorkshop(workshop);
    infoWindow.open(map, marker);
    map.setCenter(marker.getPosition()!);
    map.setZoom(15);
  });

  return marker;
};

export const createUserLocationMarker = (
  position: { lat: number; lng: number },
  map: google.maps.Map
): google.maps.Marker => {
  return new google.maps.Marker({
    position,
    map,
    icon: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      `),
      scaledSize: new google.maps.Size(36, 36),
      anchor: new google.maps.Point(18, 18),
    },
    title: 'Sua localização',
  });
};
