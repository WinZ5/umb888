import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StationFormData } from './NewStationForm';

const customDivIcon = L.divIcon({
  html: `<div class="custom-marker w-8 h-8"><img class="w-full h-full object-cover" src="/src/assets/placeholder.png" alt="icon" /></div>`,
  iconSize: [32, 32],
  className: 'custom-div-icon',
});

const MapClick: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const ConfigStationForm = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<StationFormData>({
    name: '',
    capacity: 0,
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/stations/${stationId}`);

        console.log('Response:', response);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch station data: ${errorText}`);
        }

        const text = await response.text();
        console.log('Response Body:', text);

        const data = JSON.parse(text);
        setFormData({
          name: data.StationName,
          capacity: data.Capacity,
          latitude: data.Latitude,
          longitude: data.Longitude
        });
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An error occurred');

        const mockData = {
          StationID: 0,
          StationName: 'Station 0',
          Latitude: 18.795,
          Longitude: 98.952,
          Capacity: 100,
          CurrentStock: 100
        };

        setFormData({
          name: mockData.StationName,
          capacity: mockData.Capacity,
          latitude: mockData.Latitude,
          longitude: mockData.Longitude,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStationData();
  }, [stationId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }));
  };

  const handleUpdateStation = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/stations/${stationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          StationName: formData.name,
          Capacity: formData.capacity,
          Latitude: formData.latitude,
          Longitude: formData.longitude,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update station');
      }

      const updatedData = await response.json();
      console.log('Updated Station:', updatedData);

      handleBack();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating the station');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(JSON.stringify(formData))
    await handleUpdateStation();
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6))
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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

      <div className="max-w-2xl mx-auto mt-4 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Configure Station</h1>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

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
              value={formData.capacity}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              step="0.000001"
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
              step="0.000001"
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
            Update Station
          </Button>
        </form>

        <div className="mt-8">
          <MapContainer
            center={[formData.latitude || 18.796635262099006, formData.longitude || 98.95327438130093]}
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
};

export default ConfigStationForm;