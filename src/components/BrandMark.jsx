import React from "react";

export default function BrandMark({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 64 64"
      fill="none"
    >
      <rect width="64" height="64" rx="22" fill="currentColor" />
      <circle cx="32" cy="21" r="5" fill="#FFF7F7" />
      <circle cx="21" cy="41" r="5" fill="#FFF7F7" />
      <circle cx="43" cy="41" r="5" fill="#FFF7F7" />
      <path
        d="m29.5 25.5-6 10m11 0-5-10m4 14h4"
        stroke="#FFF7F7"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
