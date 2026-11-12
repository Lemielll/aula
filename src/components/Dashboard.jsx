import React, { useEffect, useMemo, useRef, useState } from "react";
import { mediaItems as initialMediaItems } from "../data/mediaItems.js";
import BrandMark from "./BrandMark.jsx";
import MediaCard, { ART_OPTIONS } from "./MediaCard.jsx";
import { SearchIcon } from "./Icons.jsx";

const STORAGE_KEY = "aula.mediaItems.v1";

function loadStoredItems() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialMediaItems;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialMediaItems;
  } catch {
    return initialMediaItems;
  }
}

export default function Dashboard({ webId, onLogout }) {
  const [items, setItems] = useState(loadStoredItems);
  const [view, setView] = useState("watch");
  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("recent");
  const [showAccount, setShowAccount] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newYear, setNewYear] = useState(String(new Date().getFullYear()));
  const [newGenre, setNewGenre] = useState("DRAMA");
  const [newArt, setNewArt] = useState(ART_OPTIONS[0]);
  const [newWatchNext, setNewWatchNext] = useState(true);
  const searchRef = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota / private mode errors
    }
  }, [items]);

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
        !isEditing &&
        !showAddModal
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        setShowAccount(false);
        setShowAddModal(false);
        searchRef.current?.blur();
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [showAddModal]);

  const genres = useMemo(() => {
    const unique = new Set(items.map((item) => item.genre));
    return ["ALL", ...Array.from(unique).sort()];
  }, [items]);

  const visibleItems = useMemo(
    () =>
      items
        .filter((item) => view === "collection" || item.watchNext)
        .filter((item) => genreFilter === "ALL" || item.genre === genreFilter)
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
    [genreFilter, items, query, sortBy, view],
  );

  function handleToggleWatchNext(id) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, watchNext: !item.watchNext } : item,
      ),
    );
  }

  function handleRemoveItem(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function handleAddItem(event) {
    event.preventDefault();
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return;

    const parsedYear = Number.parseInt(newYear, 10);
    const maxAdded = items.reduce((max, item) => Math.max(max, item.added), 0);

    const created = {
      id: `${trimmedTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      title: trimmedTitle,
      year: Number.isFinite(parsedYear) ? parsedYear : new Date().getFullYear(),
      genre: (newGenre.trim() || "DRAMA").toUpperCase(),
      art: newArt,
      added: maxAdded + 1,
      watchNext: newWatchNext,
    };

    setItems((current) => [created, ...current]);
    setNewTitle("");
    setShowAddModal(false);
  }

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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="m-0 text-xl font-medium tracking-tight text-stone-900" id="dashboard-title">
              {view === "watch" ? "Watch next:" : "My Collection"}
            </h1>
            <p className="mb-0 mt-1 text-[11px] text-stone-400">
              {visibleItems.length}{" "}
              {visibleItems.length === 1 ? "title" : "titles"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <label>
              <span className="sr-only">Filter by genre</span>
              <select
                className="max-w-[150px] cursor-pointer border-0 bg-transparent py-2 pl-2 pr-1 text-[13px] text-stone-800 outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                onChange={(event) => setGenreFilter(event.target.value)}
                value={genreFilter}
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === "ALL" ? "All genres" : genre}
                  </option>
                ))}
              </select>
            </label>
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
            <button
              className="rounded-lg bg-[#e85c5c] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
              onClick={() => setShowAddModal(true)}
              type="button"
            >
              + Add title
            </button>
          </div>
        </div>

        {visibleItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-5">
            {visibleItems.map((item) => (
              <MediaCard
                item={item}
                key={item.id}
                onRemove={handleRemoveItem}
                onToggleWatchNext={handleToggleWatchNext}
              />
            ))}
          </div>
        ) : (
          <p className="px-3 py-10 text-center text-sm text-stone-500">
            {query.trim()
              ? `No titles match “${query}”. Try a different search.`
              : view === "watch"
                ? "Nothing in Watch next yet. Switch to My Collection or add a title."
                : "No titles in your collection yet."}
          </p>
        )}
      </section>

      {showAddModal && (
        <div
          aria-labelledby="add-title-heading"
          aria-modal="true"
          className="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setShowAddModal(false);
          }}
          role="dialog"
        >
          <form
            className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-5 shadow-2xl"
            onSubmit={handleAddItem}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="m-0 text-base font-semibold text-stone-900"
                id="add-title-heading"
              >
                Add title
              </h2>
              <button
                aria-label="Close modal"
                className="grid size-7 place-items-center rounded-full text-lg text-stone-500 hover:bg-rose-50"
                onClick={() => setShowAddModal(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-stone-700">
                  Title
                </span>
                <input
                  autoFocus
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-rose-400"
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="e.g. Solaris"
                  required
                  type="text"
                  value={newTitle}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-stone-700">
                    Year
                  </span>
                  <input
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-rose-400"
                    max={2100}
                    min={1900}
                    onChange={(event) => setNewYear(event.target.value)}
                    type="number"
                    value={newYear}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-stone-700">
                    Genre
                  </span>
                  <input
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm uppercase text-stone-900 outline-none focus:border-rose-400"
                    onChange={(event) => setNewGenre(event.target.value)}
                    placeholder="SCI-FI"
                    type="text"
                    value={newGenre}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-stone-700">
                  Poster style
                </span>
                <select
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm capitalize text-stone-900 outline-none focus:border-rose-400"
                  onChange={(event) => setNewArt(event.target.value)}
                  value={newArt}
                >
                  {ART_OPTIONS.map((art) => (
                    <option key={art} value={art}>
                      {art}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 pt-1 text-xs font-medium text-stone-700">
                <input
                  checked={newWatchNext}
                  className="size-4 accent-[#e85c5c]"
                  onChange={(event) => setNewWatchNext(event.target.checked)}
                  type="checkbox"
                />
                Add to Watch next
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                className="rounded-lg px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100"
                onClick={() => setShowAddModal(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-[#e85c5c] px-4 py-2 text-xs font-semibold text-white hover:bg-rose-600"
                type="submit"
              >
                Save title
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
