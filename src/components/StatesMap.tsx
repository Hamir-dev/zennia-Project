"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { feature } from "topojson-client";
import {
  geoAlbersUsa,
  geoCentroid,
  type ExtendedFeature,
  type ExtendedFeatureCollection,
  type GeoProjection,
} from "d3-geo";
import {
  STATE_ABBR,
  STATE_FIPS,
  getStatusForStateFips,
  type TerritoryStatus,
} from "@/lib/fips";

type GeoFeature = {
  rsmKey: string;
  id: string;
  properties: { name?: string };
};

type LabelData = {
  fips: string;
  abbr: string;
  coords: [number, number];
  open: boolean;
};

// Visible gray tiles separated by dark ink gaps, Florida lifted to white —
// every state reads as its own distinct shape, not one merged mass.
const STATUS_COLOR: Record<TerritoryStatus, string> = {
  open: "#ffffff",
  "coming-soon": "#363b43",
  locked: "#363b43",
};

const STATUS_HOVER: Record<TerritoryStatus, string> = {
  open: "#ffffff",
  "coming-soon": "#474d57",
  locked: "#474d57",
};

const STATUS_LABEL: Record<TerritoryStatus, string> = {
  open: "Open",
  "coming-soon": "Coming Soon",
  locked: "Coming Soon",
};

// Shrink each state around its own center so real gaps open between them;
// Florida grows past full size to stand out as the live territory.
const TILE_BASE: CSSProperties = {
  transformBox: "fill-box",
  transformOrigin: "center",
};
const scaleFor = (open: boolean) => (open ? "scale(1.07)" : "scale(0.9)");

type Selected = { name: string; status: TerritoryStatus };

/**
 * US map rendered at the state level. Each state is shrunk to open clear gaps
 * between tiles, labeled with its abbreviation, and Florida is enlarged + white
 * to read as the open territory.
 */
export default function StatesMap({
  heightClass = "h-[460px] sm:h-[560px] lg:h-[640px]",
}: {
  heightClass?: string;
}) {
  const [states, setStates] = useState<object | null>(null);
  const [labels, setLabels] = useState<LabelData[]>([]);
  const [projection, setProjection] = useState<GeoProjection | null>(null);
  const [selected, setSelected] = useState<Selected | null>(null);

  useEffect(() => {
    fetch("/data/counties-10m.json")
      .then((res) => res.json())
      .then((topo) => {
        const fc = feature(topo, topo.objects.states);
        setStates(fc as unknown as object);

        // Auto-fit the whole composite (incl. Florida's tip + AK/HI insets)
        // into the viewBox with padding, so nothing gets clipped.
        setProjection(() =>
          geoAlbersUsa().fitExtent(
            [
              [26, 26],
              [774, 574],
            ],
            fc as unknown as ExtendedFeatureCollection
          )
        );

        const features =
          (fc as unknown as { features: ExtendedFeature[] }).features ?? [];
        const next: LabelData[] = [];
        for (const f of features) {
          const fips = String(f.id ?? "");
          const abbr = STATE_ABBR[fips];
          if (!abbr) continue;
          // Florida's true centroid is pulled toward the panhandle/coast, so a
          // centered label spills onto the dark gulf — pin it to the peninsula.
          const coords: [number, number] =
            fips === "12"
              ? [-81.7, 28.2]
              : (geoCentroid(f) as [number, number]);
          next.push({
            fips,
            abbr,
            coords,
            open: getStatusForStateFips(fips) === "open",
          });
        }
        setLabels(next);
      })
      .catch(() => setStates(null));
  }, []);

  // Memoized independently of `selected` so hovering never re-renders the map.
  const geoLayer = useMemo(() => {
    if (!states) return null;
    return (
      <Geographies geography={states}>
        {({ geographies }: { geographies: GeoFeature[] }) => {
          // Render open states last so Florida's enlarged tile sits on top.
          const ordered = [...geographies].sort((a, b) => {
            const ao = getStatusForStateFips(String(a.id)) === "open" ? 1 : 0;
            const bo = getStatusForStateFips(String(b.id)) === "open" ? 1 : 0;
            return ao - bo;
          });
          return ordered.map((geo) => {
            const status = getStatusForStateFips(String(geo.id));
            const open = status === "open";
            const name =
              geo.properties.name ?? STATE_FIPS[String(geo.id)] ?? "State";
            const transform = scaleFor(open);
            const pick = () => setSelected({ name, status });
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={pick}
                onClick={pick}
                style={{
                  default: {
                    ...TILE_BASE,
                    transform,
                    fill: STATUS_COLOR[status],
                    stroke: "#05070a",
                    strokeWidth: 1,
                    strokeLinejoin: "round",
                    outline: "none",
                    cursor: "pointer",
                    transition: "fill 160ms ease",
                  },
                  hover: {
                    ...TILE_BASE,
                    transform,
                    fill: STATUS_HOVER[status],
                    stroke: "#05070a",
                    strokeWidth: 1,
                    strokeLinejoin: "round",
                    outline: "none",
                    cursor: "pointer",
                  },
                  pressed: {
                    ...TILE_BASE,
                    transform,
                    fill: STATUS_HOVER[status],
                    outline: "none",
                  },
                }}
              />
            );
          });
        }}
      </Geographies>
    );
  }, [states]);

  const markerLayer = useMemo(
    () =>
      labels.map((l) => (
        <Marker key={l.fips} coordinates={l.coords}>
          <text
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fill: l.open ? "#0f1112" : "rgba(240, 240, 250, 0.6)",
              fontSize: l.open ? 11 : 9,
              fontWeight: 600,
              letterSpacing: "0.05em",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {l.abbr}
          </text>
        </Marker>
      )),
    [labels]
  );

  return (
    <div className="relative overflow-hidden">
      {projection ? (
        <ComposableMap
          projection={projection as unknown as () => GeoProjection}
          className={`w-full ${heightClass}`}
        >
          {geoLayer}
          {markerLayer}
        </ComposableMap>
      ) : (
        <div className={`w-full ${heightClass}`} />
      )}

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
          <p className="font-serif text-base text-bone">{selected.name}</p>
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
