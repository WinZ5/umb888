import { useEffect, useState } from "react";
import Map, { MarkerData } from "../components/map";
import { LatLngExpression, LatLngTuple } from "leaflet"
import MainLayout from "@/components/mainLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [heatmaps, setHeatmaps] = useState<LatLngExpression[]>([]);
   const navigate = useNavigate();

  useEffect(() => {
    const fetchMarkerData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/stations');
        const data = await response.json();

        const convertedMarkers: MarkerData[] = data.map((item: { StationID: number; StationName: string; Latitude: number; Longitude: number }) => ({
          id: item.StationID,
          name: item.StationName,
          geocode: [item.Latitude, item.Longitude] as LatLngTuple,
        }));

        console.log(convertedMarkers)
        setMarkers(convertedMarkers);
      } catch (error) {
        console.error("Error fetching station data:", error);
      }
    };

    fetchMarkerData();
  }, []);

  useEffect(() => {
    const fetchHeatMapData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/heatmap-data');
        const data = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedData: LatLngExpression[] = data.flatMap((item: any) => [
          [item.StartLatitude, item.StartLongitude, 1],
          [item.DestinationLatitude, item.DestinationLongitude, 1],
        ]);

        console.log('Formatted rental station locations:', formattedData);
        setHeatmaps(formattedData);
      } catch (error) {
        console.error('Error fetching rental station locations:', error);
      }
    };

    fetchHeatMapData();
  }, []);

  return (
    <MainLayout title="Home" buttonRedirect="/station/create">
      <Map posix={[18.796635262099006, 98.95327438130093]} zoom={16} markers={markers} heatmapDatas={heatmaps} />
    </MainLayout>
  )
}

export default Home 
