"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import {
  getStateNameFromCountyId,
  getStatusForStateFips,
  type TerritoryStatus,
} from "@/lib/fips";

type GeoFeature = {
  rsmKey: string;
  id: string;
  properties: { name?: string };
};

const STATUS_COLOR: Record<TerritoryStatus, string> = {
  open: "#ffffff",
  "coming-soon": "rgba(240, 240, 250, 0.34)",
  locked: "rgba(240, 240, 250, 0.13)",
};

const STATUS_HOVER: Record<TerritoryStatus, string> = {
  open: "#f0f0fa",
  "coming-soon": "rgba(240, 240, 250, 0.55)",
  locked: "rgba(240, 240, 250, 0.18)",
};

const STATUS_LABEL: Record<TerritoryStatus, string> = {
  open: "Open",
  "coming-soon": "Coming Soon",
  locked: "Not Yet Available",
};

type Selected = { name: string; state: string; status: TerritoryStatus };

export default function CountyMap({
  center = [-96, 38],
  zoom = 1,
  scale = 1000,
  heightClass = "h-[420px] sm:h-[520px] lg:h-[600px]",
  emphasizeStateFips,
  onlyStateFips,
  strokeWidth = 0.3,
  projection = "geoAlbersUsa",
  projectionConfig,
}: {
  center?: [number, number];
  zoom?: number;
  scale?: number;
  heightClass?: string;
  emphasizeStateFips?: string;
  /** When set, render only this state's counties on a fitted projection. */
  onlyStateFips?: string;
  strokeWidth?: number;
  projection?: string;
  projectionConfig?: { scale?: number; center?: [number, number] };
}) {
  const [geographies, setGeographies] = useState<object | null>(null);
  const [selected, setSelected] = useState<Selected | null>(null);

  useEffect(() => {
    fetch("/data/counties-10m.json")
      .then((res) => res.json())
      .then(setGeographies)
      .catch(() => setGeographies(null));
  }, []);

  // The county layer is memoized independently of `selected`, so hovering only
  // updates the tooltip — it never re-renders the thousands of county paths.
  // That single change is what removes the cursor lag on the maps.
  const geoLayer = useMemo(() => {
    if (!geographies) return null;
    return (
      <Geographies geography={geographies}>
        {({ geographies: geos }: { geographies: GeoFeature[] }) =>
          geos
            .filter(
              (geo) => !onlyStateFips || geo.id.slice(0, 2) === onlyStateFips
            )
            .map((geo) => {
              const stateFips = geo.id.slice(0, 2);
              const status = getStatusForStateFips(stateFips);
              const stateName = getStateNameFromCountyId(geo.id);
              const dim =
                emphasizeStateFips && stateFips !== emphasizeStateFips
                  ? 0.4
                  : 1;
              const pick = () =>
                setSelected({
                  name: geo.properties.name ?? "County",
                  state: stateName,
                  status,
                });

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={pick}
                  onClick={pick}
                  style={{
                    default: {
                      fill: STATUS_COLOR[status],
                      stroke: "#0f1112",
                      strokeWidth,
                      strokeLinejoin: "round",
                      outline: "none",
                      cursor: "pointer",
                      opacity: dim,
                      transition: "fill 150ms ease",
                    },
                    hover: {
                      fill: STATUS_HOVER[status],
                      stroke: "#0f1112",
                      strokeWidth,
                      strokeLinejoin: "round",
                      outline: "none",
                      cursor: "pointer",
                      opacity: 1,
                    },
                    pressed: {
                      fill: STATUS_HOVER[status],
                      outline: "none",
                    },
                  }}
                />
              );
            })
        }
      </Geographies>
    );
  }, [geographies, onlyStateFips, emphasizeStateFips, strokeWidth]);

  const mapBody = onlyStateFips ? (
    geoLayer
  ) : (
    <ZoomableGroup center={center} zoom={zoom} minZoom={1} maxZoom={8}>
      {geoLayer}
    </ZoomableGroup>
  );

  return (
    <div className="relative overflow-hidden rounded-sm border border-line bg-ink">
      <ComposableMap
        projection={projection}
        projectionConfig={projectionConfig ?? { scale }}
        className={`w-full ${heightClass}`}
      >
        {mapBody}
      </ComposableMap>

      <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-sm bg-ink/80 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-bone-dim backdrop-blur-sm">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white" /> Open
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-bone-dim/60" /> Coming Soon
        </span>
      </div>

      {selected && (
        <div className="absolute right-4 top-4 max-w-[220px] rounded-sm border border-line bg-ink/90 px-4 py-3 text-sm backdrop-blur-sm">
          <p className="font-serif text-base text-bone">
            {selected.name}, {selected.state}
          </p>
          <p
            className={
              selected.status === "open"
                ? "mt-1 text-xs uppercase tracking-[0.14em] text-white"
                : "mt-1 text-xs uppercase tracking-[0.14em] text-bone-dim"
            }
          >
            {STATUS_LABEL[selected.status]}
          </p>
        </div>
      )}
    </div>
  );
}
