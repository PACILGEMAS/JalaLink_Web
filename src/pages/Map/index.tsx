import { NodeDetail } from "../../components/PageComponents/Map/NodeDetail.tsx";
import { Avatar } from "../../components/UI/Avatar.tsx";
import { useTheme } from "../../core/hooks/useTheme.ts";
import { PageLayout } from "@components/PageLayout.tsx";
import { Sidebar } from "@components/Sidebar.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import type { FishDataEntry } from "@core/stores/deviceStore.ts";
import type { Protobuf } from "@meshtastic/core";
import { bbox, lineString } from "@turf/turf";
import { MapPinIcon, FishIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AttributionControl,
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
  useMap,
} from "react-map-gl/maplibre";
import MapGl from "react-map-gl/maplibre";

type NodePosition = {
  latitude: number;
  longitude: number;
};

const convertToLatLng = (position: {
  latitudeI?: number;
  longitudeI?: number;
}): NodePosition => ({
  latitude: (position.latitudeI ?? 0) / 1e7,
  longitude: (position.longitudeI ?? 0) / 1e7,
});

const MapPage = () => {
  const { nodes, waypoints, fishData } = useDevice();
  const { theme } = useTheme();
  const { default: map } = useMap();
  const [showIkanMarkers, setShowIkanMarkers] = useState(true);
  const [selectedFish, setSelectedFish] = useState<FishDataEntry | null>(null);

  const darkMode = theme === "dark";

  const [selectedNode, setSelectedNode] = useState<
    Protobuf.Mesh.NodeInfo | null
  >(null);

  // Filter out nodes without a valid position
  const validNodes = useMemo(
    () =>
      Array.from(nodes.values()).filter(
        (node): node is Protobuf.Mesh.NodeInfo =>
          Boolean(node.position?.latitudeI),
      ),
    [nodes],
  );

  const handleMarkerClick = useCallback(
    (node: Protobuf.Mesh.NodeInfo, event: { originalEvent: MouseEvent }) => {
      event?.originalEvent?.stopPropagation();

      setSelectedNode(node);

      if (map) {
        const position = convertToLatLng(node.position);
        map.easeTo({
          center: [position.longitude, position.latitude],
          zoom: map?.getZoom(),
        });
      }
    },
    [map],
  );

  // Get the bounds of the map based on the nodes furtherest away from center
  const getMapBounds = useCallback(() => {
    if (!map) {
      return;
    }

    if (!validNodes.length) {
      return;
    }
    if (validNodes.length === 1) {
      map.easeTo({
        zoom: map.getZoom(),
        center: [
          (validNodes[0].position?.longitudeI ?? 0) / 1e7,
          (validNodes[0].position?.latitudeI ?? 0) / 1e7,
        ],
      });
      return;
    }
    const line = lineString(
      validNodes.map((n) => [
        (n.position?.latitudeI ?? 0) / 1e7,
        (n.position?.longitudeI ?? 0) / 1e7,
      ]),
    );
    const bounds = bbox(line);
    const center = map.cameraForBounds(
      [
        [bounds[1], bounds[0]],
        [bounds[3], bounds[2]],
      ],
      { padding: { top: 10, bottom: 10, left: 10, right: 10 } },
    );
    if (center) {
      map.easeTo(center);
    }
  }, [validNodes, map]);

  // Generate all markers
  const markers = useMemo(
    () =>
      validNodes.map((node) => {
        const position = convertToLatLng(node.position);
        return (
          <Marker
            key={`marker-${node.num}`}
            longitude={position.longitude}
            latitude={position.latitude}
            anchor="bottom"
            onClick={(e) => handleMarkerClick(node, e)}
          >
            <Avatar
              text={node.user?.shortName?.toString() ?? node.num.toString()}
              className="border-[1.5px] border-slate-600 shadow-xl shadow-slate-600"
            />
          </Marker>
        );
      }),
    [validNodes, handleMarkerClick],
  );

  const fishMarkers = useMemo(
    () =>
      fishData
        .filter((entry): entry is FishDataEntry & { latitude: number; longitude: number } =>
          entry.latitude !== undefined && entry.longitude !== undefined
        )
        .map((entry) => (
          <Marker
            key={`ikan-marker-${entry.id}`}
            longitude={entry.longitude}
            latitude={entry.latitude}
            anchor="bottom"
            onClick={(event) => {
              event?.originalEvent?.stopPropagation();
              setSelectedFish(entry);
            }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 rounded-full w-4 h-4 border-2 border-white shadow-md" />
              <span className="text-xs text-black dark:text-white mt-1 bg-white dark:bg-gray-800 px-1 rounded shadow">
                Ikan {entry.species}
              </span>
            </div>
          </Marker>
        )),
    [fishData]
  );

  useEffect(() => {
    map?.on("load", () => {
      getMapBounds();
    });
  }, [map, getMapBounds]);

  useEffect(() => {
    if (!showIkanMarkers) {
      setSelectedFish(null);
    }
  }, [showIkanMarkers]);

  return (
    <>
      <Sidebar />
      <PageLayout
        label="Peta"
        noPadding
        actions={[
          {
            icon: FishIcon,
            iconClasses: showIkanMarkers ? "text-blue-600" : "text-gray-400",
            onClick: () => setShowIkanMarkers((v) => !v),
          },
        ]}
      >
        <MapGl
          mapStyle="https://raw.githubusercontent.com/hc-oss/maplibre-gl-styles/master/styles/osm-mapnik/v8/default.json"
          attributionControl={false}
          renderWorldCopies={false}
          maxPitch={0}
          style={{
            filter: darkMode ? "brightness(0.9)" : "",
          }}
          dragRotate={false}
          touchZoomRotate={false}
          initialViewState={{
            zoom: 11,
            latitude: -6.05,
            longitude: 106.8,
          }}
        >
          <AttributionControl
            style={{
              background: darkMode ? "#ffffff" : "",
              color: darkMode ? "black" : "",
            }}
          />
          <GeolocateControl
            position="top-right"
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation
          />
          <NavigationControl position="top-right" showCompass={false} />

          <ScaleControl />
          {waypoints.map((wp) => (
            <Marker
              key={wp.id}
              longitude={(wp.longitudeI ?? 0) / 1e7}
              latitude={(wp.latitudeI ?? 0) / 1e7}
              anchor="bottom"
            >
              <div>
                <MapPinIcon size={16} />
              </div>
            </Marker>
          ))}
          {markers}
          {showIkanMarkers && fishMarkers}
          {selectedNode
            ? (
              <Popup
                anchor="top"
                longitude={convertToLatLng(selectedNode.position).longitude}
                latitude={convertToLatLng(selectedNode.position).latitude}
                onClose={() => setSelectedNode(null)}
              >
                <NodeDetail node={selectedNode} />
              </Popup>
            )
            : null}
          {showIkanMarkers && selectedFish && selectedFish.latitude !== undefined &&
            selectedFish.longitude !== undefined && (
            <Popup
              anchor="top"
              longitude={selectedFish.longitude}
              latitude={selectedFish.latitude}
              onClose={() => setSelectedFish(null)}
            >
              <div className="text-sm text-slate-900 dark:text-black space-y-1">
                <h3 className="font-semibold text-base">Data Ikan: {selectedFish.species}</h3>
                <p>Kuantitas: {selectedFish.quantity}</p>
                <p>
                  Tekanan Udara:{" "}
                  {selectedFish.pressure !== undefined
                    ? `${selectedFish.pressure.toFixed(2)} hPa`
                    : "Tidak tersedia"}
                </p>
                <p>
                  Temperatur:{" "}
                  {selectedFish.temperature !== undefined
                    ? `${selectedFish.temperature.toFixed(1)} °C`
                    : "Tidak tersedia"}
                </p>
                <p>Waktu: {selectedFish.timestamp}</p>
                <p>
                  Lokasi: {selectedFish.latitude.toFixed(5)},{" "}
                  {selectedFish.longitude.toFixed(5)}
                </p>
                {selectedFish.nodeName && (
                  <p>Sumber: {selectedFish.nodeName}</p>
                )}
              </div>
            </Popup>
          )}
        </MapGl>
      </PageLayout>
    </>
  );
};

export default MapPage;
