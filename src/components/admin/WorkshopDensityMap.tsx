
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface RegionMapData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  count: number;
}

interface WorkshopDensityMapProps {
  data: RegionMapData[];
}

export const WorkshopDensityMap = ({ data }: WorkshopDensityMapProps) => {
  const defaultCenter: [number, number] = [-15.7801, -47.9292]; // Brazil center coordinates
  
  // Function to get color based on count
  const getColor = (count: number) => {
    if (count < 10) return '#FFA07A'; // Light salmon
    if (count < 20) return '#FF7F50'; // Coral
    if (count < 30) return '#FF6347'; // Tomato
    if (count < 40) return '#FF4500'; // OrangeRed
    return '#FF0000'; // Red
  };
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Concentração de Oficinas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <MapContainer
            style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
            /* @ts-ignore */
            center={defaultCenter}
            /* @ts-ignore */
            zoom={4}
          >
            <TileLayer
              /* @ts-ignore */
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              /* @ts-ignore */
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {data.map((region) => (
              <Circle
                key={region.id}
                /* @ts-ignore */
                center={[region.lat, region.lng]}
                /* @ts-ignore */
                radius={region.count * 5000}
                /* @ts-ignore */
                pathOptions={{
                  fillColor: getColor(region.count),
                  color: getColor(region.count),
                  fillOpacity: 0.6,
                  weight: 1
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold mb-1">{region.name}</h3>
                    <p className="text-sm">{region.count} oficinas</p>
                  </div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkshopDensityMap;
