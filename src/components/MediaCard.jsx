import React from "react";
import { WatchIcon } from "./Icons.jsx";

const posterBackgrounds = {
  garden: "from-emerald-950 via-emerald-700 to-lime-200",
  rain: "from-rose-950 via-rose-400 to-slate-700",
  orbit: "from-slate-950 via-slate-700 to-sky-300",
  moons: "from-violet-950 via-fuchsia-800 to-orange-200",
  water: "from-sky-200 via-cyan-700 to-slate-900",
  fires: "from-zinc-950 via-rose-900 to-orange-300",
  north: "from-slate-800 via-teal-600 to-amber-100",
  meridian: "from-teal-950 via-cyan-500 to-emerald-100",
};

const posterShapes = {
  garden:
    "left-[22%] top-[20%] h-[52%] w-[56%] rotate-12 rounded-[50%_8%_50%_8%] bg-lime-100/35",
  rain:
    "left-[32%] top-[17%] h-[54%] w-[38%] rotate-6 rounded-[48%_48%_12%_12%] bg-gradient-to-r from-slate-900 via-orange-100 to-slate-800",
  orbit:
    "left-[8%] top-[30%] h-[20%] w-[84%] -rotate-24 rounded-[50%] border-[3px] border-amber-100/70",
  moons:
    "left-[24%] top-[19%] h-[40%] w-[52%] rotate-20 rounded-full bg-gradient-to-br from-orange-100/60 to-violet-900/20",
  water:
    "left-[-9%] top-[49%] h-[19%] w-[120%] -rotate-6 rounded-[50%] border-t-2 border-white/70",
  fires:
    "left-[31%] top-[35%] h-[37%] w-[38%] rounded-[46%_46%_15%_15%] bg-gradient-to-b from-orange-200 to-stone-800",
  north:
    "left-[-12%] top-[30%] h-[36%] w-[125%] rounded-[50%_50%_0_0] bg-gradient-to-b from-stone-100 to-teal-800",
  meridian:
    "left-[46%] top-[17%] h-[55%] w-[8%] rotate-14 rounded-full bg-white/45",
};

export default function MediaCard({ item }) {
  return (
    <article className="min-w-0">
      <div
        className={`relative isolate flex aspect-[2/3] flex-col justify-between overflow-hidden bg-gradient-to-br text-white ${posterBackgrounds[item.art]}`}
      >
        <div
          aria-hidden="true"
          className={`absolute z-0 border border-white/30 shadow-xl ${posterShapes[item.art]}`}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent"
        />
        <span className="relative z-10 ml-2.5 mt-3 text-[7px] font-bold tracking-[1.6px] text-white/85">
          AULA PICTURES
        </span>
        <div className="absolute right-2 top-0 z-20 rounded-b-md bg-sky-300 px-1.5 py-2 text-sky-800">
          <WatchIcon className="size-4" />
        </div>
        <div className="relative z-10 px-3 pb-3.5 [text-shadow:0_1px_8px_rgb(0_0_0/35%)]">
          <span className="mb-1.5 block text-[7px] font-bold tracking-[1.5px] text-white/85">
            {item.genre}
          </span>
          <h2 className="m-0 text-[clamp(14px,1.7vw,22px)] font-extrabold uppercase leading-none tracking-tight">
            {item.title}
          </h2>
          <small className="mt-2 block text-[9px] text-white/80">
            {item.year}
          </small>
        </div>
      </div>
      <p className="mb-0 mt-2.5 truncate text-xs font-semibold text-stone-800">
        {item.title}
      </p>
      <p className="mb-0 mt-0.5 text-[10px] text-stone-400">
        {item.genre} · {item.year}
      </p>
    </article>
  );
}
