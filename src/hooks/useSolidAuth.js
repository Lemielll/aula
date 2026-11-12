import { useEffect, useState } from "react";
import {
  getDefaultSession,
  handleIncomingRedirect,
  login,
} from "@inrupt/solid-client-authn-browser";

const defaultIssuer = "https://solidcommunity.net";
const issuerStorageKey = "solidcommunity:oidc-issuer";
let pendingSessionRestore;

function normalizeIssuer(value) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("Enter a valid Solid provider URL.");
  }

  const isLocalHttp =
    url.protocol === "http:" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1");
  if (url.protocol !== "https:" && !isLocalHttp) {
    throw new Error("Solid provider URLs must use HTTPS.");
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error("Enter the provider URL without credentials or URL parameters.");
  }

  return url.toString().replace(/\/+$/, "");
}

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : "Solid sign-in could not be completed. Please try again.";
}

function restoreSession() {
  if (!pendingSessionRestore) {
    pendingSessionRestore = handleIncomingRedirect({
      restorePreviousSession: true,
    }).finally(() => {
      pendingSessionRestore = undefined;
    });
  }
  return pendingSessionRestore;
}

export function useSolidAuth() {
  const [issuer, setIssuer] = useState(
    () => window.localStorage.getItem(issuerStorageKey) || defaultIssuer,
  );
  const [webId, setWebId] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let active = true;

    restoreSession()
      .then(() => {
        const session = getDefaultSession();
        if (active) {
          setWebId(session.info.isLoggedIn ? session.info.webId : null);
        }
      })
      .catch((cause) => {
        if (active) {
          setError(getErrorMessage(cause));
        }
      })
      .finally(() => {
        if (active) {
          setIsChecking(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function signIn(event) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsSubmitting(true);

    try {
      const oidcIssuer = normalizeIssuer(issuer);
      window.localStorage.setItem(issuerStorageKey, oidcIssuer);
      await login({
        oidcIssuer,
        redirectUrl: new URL("/", window.location.origin).toString(),
        clientName: "Aula",
      });
    } catch (cause) {
      setError(getErrorMessage(cause));
      setIsSubmitting(false);
    }
  }

  async function signOut() {
    setError(null);
    setNotice(null);
    setIsSubmitting(true);

    try {
      await getDefaultSession().logout();
      setWebId(null);
      setNotice("You’re signed out of Solid.");
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    error,
    isChecking,
    isSubmitting,
    issuer,
    notice,
    onIssuerChange: setIssuer,
    signIn,
    signOut,
    webId,
  };
}
