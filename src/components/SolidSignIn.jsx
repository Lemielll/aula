import React from "react";
import BrandMark from "./BrandMark.jsx";

export default function SolidSignIn({ auth }) {
  const {
    error,
    isChecking,
    isSubmitting,
    issuer,
    notice,
    onIssuerChange,
    signIn,
  } = auth;

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#fff7f7] px-5 py-16 text-stone-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-44 -top-56 size-[360px] rounded-full border border-rose-100/70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-60 -right-52 size-[440px] rounded-full border border-rose-100/70"
      />

      <section
        aria-labelledby="login-heading"
        className="relative z-10 w-full max-w-[390px] text-center"
      >
        <BrandMark className="mx-auto size-[88px] text-[#e85c5c] drop-shadow-[0_10px_18px_rgba(232,92,92,0.17)]" />

        <h1
          className="text-[clamp(29px,7vw,36px)] font-bold leading-tight tracking-[-1.7px]"
          id="login-heading"
        >
          Aula
        </h1>
        <p className="mb-7 mt-3 text-sm leading-7 text-stone-500">
          Solid Online Library and Forum
        </p>

        <form className="flex flex-col text-left" onSubmit={signIn}>
          <label
            className="mb-2 text-xs font-semibold text-stone-700"
            htmlFor="issuer"
          >
            Solid provider URL
          </label>
          <input
            autoCapitalize="none"
            autoComplete="url"
            autoCorrect="off"
            className="h-[49px] w-full rounded-lg border border-[#eadcda] bg-white px-3.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:bg-stone-100"
            disabled={isChecking || isSubmitting}
            id="issuer"
            onChange={(event) => onIssuerChange(event.target.value)}
            placeholder="https://solidcommunity.net"
            required
            spellCheck="false"
            type="url"
            value={issuer}
          />
          <button
            className="mt-3 flex min-h-[49px] w-full items-center justify-center gap-2.5 rounded-lg bg-violet-600 px-4 text-[13px] font-semibold text-white shadow-md shadow-violet-200 transition hover:-translate-y-px hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-wait disabled:opacity-70"
            disabled={isChecking || isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <>
                <span
                  aria-hidden="true"
                  className="size-[15px] animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
                Redirecting to Solid...
              </>
            ) : (
              <>
                <span className="grid size-[21px] place-items-center rounded-full bg-white font-serif text-sm font-bold text-violet-600">
                  S
                </span>
                Log in with Solid
              </>
            )}
          </button>
        </form>

        {error && (
          <p
            aria-live="polite"
            className="mt-4 text-xs leading-relaxed text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}
        {notice && (
          <p aria-live="polite" className="mt-4 text-xs text-green-700" role="status">
            {notice}
          </p>
        )}
      </section>

      <footer className="absolute inset-x-5 bottom-5 flex justify-center gap-2 text-[10px] tracking-wide text-[#b39b99]">
        <span>Aula</span>
        <span aria-hidden="true" className="text-[#d29d9a]">
          ·
        </span>
        <span>Powered by Solid</span>
      </footer>
    </main>
  );
}
