import { Sidebar } from "@components/Sidebar.tsx";
import { Table } from "@components/generic/Table/index.tsx";
import { PageLayout } from "@components/PageLayout.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { useMemo } from "react";

const FishDataPage = () => {
  const { fishData } = useDevice();

  const tableRows = useMemo(
    () =>
      fishData.map((entry) => [
        <span key={`${entry.id}-species`}>{entry.species}</span>,
        <span key={`${entry.id}-quantity`}>{entry.quantity}</span>,
        <span key={`${entry.id}-pressure`}>
          {entry.pressure !== undefined ? `${entry.pressure.toFixed(2)} hPa` : "-"}
        </span>,
        <span key={`${entry.id}-temperature`}>
          {entry.temperature !== undefined
            ? `${entry.temperature.toFixed(1)} °C`
            : "-"}
        </span>,
        <span key={`${entry.id}-timestamp`}>{entry.timestamp}</span>,
        <span key={`${entry.id}-coordinates`}>
          {entry.latitude !== undefined && entry.longitude !== undefined
            ? `${entry.latitude.toFixed(5)}, ${entry.longitude.toFixed(5)}`
            : "Lokasi tidak tersedia"}
        </span>,
        <span key={`${entry.id}-source`}>
          {entry.nodeName ?? (entry.source === "dummy" ? "Nelayan 1" : "-")}
        </span>,
      ]),
    [fishData],
  );

  return (
    <>
      <Sidebar />
      <PageLayout label="Data Ikan">
        <div className="p-4">
          <Table
            headings={[
              { title: "Jenis Ikan", type: "normal", sortable: true },
              { title: "Kuantitas", type: "normal", sortable: false },
              { title: "Tekanan Udara", type: "normal", sortable: true },
              { title: "Temperatur", type: "normal", sortable: true },
              { title: "Waktu", type: "normal", sortable: true },
              { title: "Koordinat", type: "normal", sortable: false },
              { title: "Dari Node", type: "normal", sortable: true },
            ]}
            rows={tableRows}
          />
        </div>
      </PageLayout>
    </>
  );
};

export default FishDataPage;
