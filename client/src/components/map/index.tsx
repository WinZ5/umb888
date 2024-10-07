/* eslint-disable @typescript-eslint/no-explicit-any */
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";

import MarkerClusterGroup from "react-leaflet-cluster";
import { HeatmapLayerFactory } from "@vgrid/react-leaflet-heatmap-layer";

interface MapProps {
  posix: LatLngExpression | LatLngTuple,
  zoom?: number,
  markers?: MarkerData[],
  heatmapDatas?: LatLngExpression[]
}

export interface MarkerData {
  id: number;
  name: string;
  geocode: LatLngTuple;
};

const defaults = {
  zoom: 19,
}

const customDivIcon = L.divIcon({
  html: `<div class="custom-marker w-8 h-8"><img class="w-full h-full object-cover" src="/src/assets/placeholder.png" alt="icon" /></div>`,
  iconSize: [32, 32],
  className: 'custom-div-icon',
});

const Map = (Map: MapProps) => {
  const { zoom = defaults.zoom, posix, markers = [], heatmapDatas = [] } = Map

  const HeatmapLayer = HeatmapLayerFactory<LatLngExpression>()

  const heatmapOptions = {
    radius: 20,
    blur: 20,
    maxZoom: 18,
    minOpacity: 0.5,
    maxOpacity: 1,
  };

  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      maxZoom={19}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      className="z-40"
    >
      <LayersControl>
        <LayersControl.BaseLayer name="OpenStreetMap" checked>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Google Mape">
          <TileLayer
            url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            attribution='&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps.html">Google Maps</a> contributors'
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay name="Marker" checked>
          <MarkerClusterGroup
            chunkedLoading
          // iconCreateFunction={createCustomClusterIcon}
          >
            <LayersControl.Overlay name="Heatmap" checked>
              <HeatmapLayer
                points={heatmapDatas}
                longitudeExtractor={(m: any) => m[1]}
                latitudeExtractor={(m: any) => m[0]}
                intensityExtractor={(m: any) => parseFloat(m[2])}
                {...heatmapOptions}
              />
            </LayersControl.Overlay>
            {markers.map((marker, index) => (
              <Marker key={index} position={marker.geocode} icon={customDivIcon}>
                <Popup>
                  {marker.name}
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  )
}

export default Map