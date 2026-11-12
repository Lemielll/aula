import React, { useEffect, useMemo, useRef, useState } from "react";
import { mediaItems } from "../data/mediaItems.js";
import BrandMark from "./BrandMark.jsx";
import MediaCard from "./MediaCard.jsx";
import { SearchIcon } from "./Icons.jsx";

export default function Dashboard({ webId, onLogout }) {
  const [view, setView] = useState("watch");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showAccount, setShowAccount] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleShortcut(event) {
      const target = event.target;
      const isEditing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (
        event.key.toLowerCase() === "s" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !isEditing
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        setShowAccount(false);
        searchRef.current?.blur();
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const visibleItems = useMemo(
    () =>
      mediaItems
        .filter((item) => view === "collection" || item.watchNext)
        .filter((item) =>
          `${item.title} ${item.genre} ${item.year}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
        )
        .sort((first, second) =>
          sortBy === "title"
            ? first.title.localeCompare(second.title)
            : second.added - first.added,
        ),
    [query, sortBy, view],
  );

  return (
    <main className="min-h-screen bg-[#fff7f7] px-4 pb-16 pt-3 text-[#242323] sm:px-7 lg:px-[3.6vw]">
      <header className="mx-auto flex min-h-16 max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-2">
        <a
          aria-label="Aula home"
          className="order-0 inline-flex shrink-0 items-center gap-2.5 text-[17px] font-bold tracking-tight text-stone-900 no-underline"
          href="/"
        >
          <BrandMark className="size-[43px] text-[#e85c5c]" />
          <span>Aula</span>
        </a>

        <label className="order-3 flex h-10 w-full min-w-0 items-center gap-2.5 text-stone-500 md:order-none md:h-11 md:max-w-[520px] md:flex-1">
          <SearchIcon className="size-[19px] shrink-0" />
          <input
            ref={searchRef}
            aria-label="Search your collection"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-stone-800 outline-none placeholder:text-stone-400"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={'Press "s" to start searching'}
            type="search"
            value={query}
          />
          {query && (
            <button
              aria-label="Clear search"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-transparent text-xl text-stone-500 hover:bg-rose-100"
              onClick={() => setQuery("")}
              type="button"
            >
              ×
            </button>
          )}
        </label>

        <div className="order-1 ml-auto flex items-center gap-3.5 sm:gap-6">
          <button
            className="whitespace-nowrap border-0 bg-transparent py-2 text-sm font-semibold text-rose-700 hover:text-rose-900"
            onClick={() =>
              setView((current) =>
                current === "watch" ? "collection" : "watch",
              )
            }
            type="button"
          >
            {view === "watch" ? "My Collection" : "Watch next"}
          </button>
          <div className="relative">
            <button
              aria-expanded={showAccount}
              aria-label="Account menu"
              className="grid size-11 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-950 via-teal-700 to-orange-200 text-xs font-bold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              onClick={() => setShowAccount((visible) => !visible)}
              type="button"
            >
              <span className="grid size-6 place-items-center rounded-full bg-black/25">
                A
              </span>
            </button>
            {showAccount && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-20 w-[min(300px,calc(100vw-40px))] rounded-xl border border-rose-100 bg-white p-3 shadow-xl">
                <p className="mb-3 mt-1 break-all px-1 text-[11px] leading-relaxed text-stone-500">
                  {webId}
                </p>
                <button
                  className="w-full rounded-lg bg-rose-50 px-3 py-2 text-left text-xs font-medium text-rose-800 hover:bg-rose-100"
                  onClick={onLogout}
                  type="button"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section
        aria-labelledby="dashboard-title"
        className="mx-auto mt-7 max-w-[1440px]"
      >
        <div className="mb-4 flex items-center justify-between gap-5">
          <div>
            <h1 className="m-0 text-xl font-medium tracking-tight text-stone-900" id="dashboard-title">
              {view === "watch" ? "Watch next:" : "My Collection"}
            </h1>
            <p className="mb-0 mt-1 text-[11px] text-stone-400">
              {visibleItems.length}{" "}
              {visibleItems.length === 1 ? "title" : "titles"}
            </p>
          </div>
          <label>
            <span className="sr-only">Sort titles</span>
            <select
              className="max-w-[190px] cursor-pointer border-0 bg-transparent py-2 pl-2 pr-1 text-[13px] text-stone-800 outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              onChange={(event) => setSortBy(event.target.value)}
              value={sortBy}
            >
              <option value="recent">Most recent first</option>
              <option value="title">Title A–Z</option>
            </select>
          </label>
        </div>

        {visibleItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-5">
            {visibleItems.map((item) => (
              <MediaCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <p className="px-3 py-10 text-center text-sm text-stone-500">
            No titles match “{query}”. Try a different search.
          </p>
        )}
      </section>
    </main>
  );
}
