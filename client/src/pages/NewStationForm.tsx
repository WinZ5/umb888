import { useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface StationFormData {
  name: string;
  capacity: number | null;
  latitude: number;
  longitude: number;
}

const customDivIcon = L.divIcon({
  html: `<div class="custom-marker w-8 h-8"><img class="w-full h-full object-cover" src="/src/assets/placeholder.png" alt="icon" /></div>`,
  iconSize: [32, 32],
  className: 'custom-div-icon',
});

const NewStationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StationFormData>({
    name: '',
    capacity: null,
    latitude: 0,
    longitude: 0
  });


  const MapClick: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
    useMapEvents({
      click: (e) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6))
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const stationData = {
      StationName: formData.name,
      Longitude: formData.longitude,
      Latitude: formData.latitude,
      Capacity: formData.capacity,
    };

    try {
        const response = await fetch('http://localhost:3000/api/stations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stationData),
        });

        if (!response.ok) {
            throw new Error('Failed to add new station');
        }

        const data = await response.json();
        console.log('New station added:', data);
        handleBack();
    } catch (error) {
        console.error('Error adding new station:', error);
    }
};

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
              placeholder="Enter Name"
            />
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity !== null ? formData.capacity : ''}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Enter Capacity"
            />
          </div>

          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              step="0.01"
              value={formData.latitude}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-white"
            />
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              step="0.01"
              value={formData.longitude}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit
          </Button>
        </form>

        <div className="mt-8">
          <MapContainer
            center={[18.796635262099006, 98.95327438130093]}
            zoom={16}
            maxZoom={19}
            className="h-80"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
            <MapClick onLocationSelect={handleLocationSelect} />
            {formData.latitude !== 0 && formData.longitude !== 0 && (
              <Marker position={[formData.latitude, formData.longitude]} icon={customDivIcon} />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default NewStationForm