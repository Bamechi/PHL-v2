"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const PASSWORD = "vanta";

export default function AboutInvoiceButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();
  }, [isOpen]);

  function openGate() {
    setError("");
    setPassword("");
    setIsOpen(true);
  }

  function closeGate() {
    setIsOpen(false);
    setError("");
    setPassword("");
  }

  function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.trim() !== PASSWORD) {
      setError("Password required to enter.");
      return;
    }

    window.sessionStorage.setItem("phlInvoiceAccess", "true");
    window.location.assign("/about/receipt");
  }

  return (
    <>
      <button className="footer-link-button" type="button" onClick={openGate}>Invoice</button>
      {isOpen ? (
        <div className="invoice-gate" role="dialog" aria-modal="true" aria-labelledby="invoice-gate-title">
          <button className="invoice-gate-backdrop" type="button" aria-label="Close invoice password prompt" onClick={closeGate} />
          <form className="invoice-gate-panel" onSubmit={submitPassword}>
            <p className="eyebrow">PRIVATE TOOL</p>
            <h2 id="invoice-gate-title">Enter invoice access password.</h2>
            <label htmlFor="invoice-password">Password</label>
            <input
              id="invoice-password"
              ref={inputRef}
              type="password"
              autoComplete="off"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error ? <p className="invoice-error" role="alert">{error}</p> : null}
            <div className="invoice-gate-actions">
              <button className="button button-gold" type="submit">Enter</button>
              <button className="text-link invoice-cancel" type="button" onClick={closeGate}>Cancel</button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
