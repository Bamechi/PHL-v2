"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const ACCESS_KEY = "phlInvoiceAccess";
const PASSWORD = "vanta";

const paymentOptions = [
  {
    label: "Name your contribution",
    amount: "",
    url: "https://buy.stripe.com/aFa00j78U0vh9GF9AM1Nu04",
    description: "Flexible mission support",
  },
  {
    label: "$250 support program delivery",
    amount: "250.00",
    url: "https://buy.stripe.com/cNi4gzfFq4Lx0657sE1Nu03",
    description: "Build momentum",
  },
  {
    label: "$1,000 expand reach and resources",
    amount: "1000.00",
    url: "https://buy.stripe.com/7sY7sL0Kwem73ih5kw1Nu02",
    description: "Back the work",
  },
  {
    label: "$10,000 strengthen a full program",
    amount: "10000.00",
    url: "https://buy.stripe.com/28E8wPdxicdZ8CB9AM1Nu01",
    description: "Underwrite impact",
  },
  {
    label: "Custom payment link",
    amount: "",
    url: "",
    description: "Paste a specific checkout link",
  },
];

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function defaultReceiptNumber(dateValue = todayInputValue()) {
  return `PHL-${dateValue.replaceAll("-", "")}-001`;
}

function formatDate(dateValue: string) {
  if (!dateValue) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateValue}T12:00:00`));
}

function formatCurrency(amount: string) {
  const numberValue = Number(amount);
  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return "Custom amount";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numberValue);
}

export default function ContributionReceiptTool() {
  const [hasAccess, setHasAccess] = useState(() => typeof window !== "undefined" && window.sessionStorage.getItem(ACCESS_KEY) === "true");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [dateValue, setDateValue] = useState(todayInputValue());
  const [receiptNumber, setReceiptNumber] = useState(defaultReceiptNumber());
  const [documentType, setDocumentType] = useState("request");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [paymentOptionIndex, setPaymentOptionIndex] = useState(0);
  const [customPaymentLink, setCustomPaymentLink] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("General mission support for Project High-Lvl programming.");
  const [goodsStatement, setGoodsStatement] = useState("No goods or services were provided in exchange for this contribution.");

  const paymentOption = paymentOptions[paymentOptionIndex];
  const paymentLink = paymentOption.url || customPaymentLink;
  const documentTitle = documentType === "receipt" ? "Contribution Receipt" : "Contribution Request";
  const amountLabel = useMemo(() => formatCurrency(amount), [amount]);

  function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.trim() !== PASSWORD) {
      setPasswordError("Enter the private tool password.");
      return;
    }

    window.sessionStorage.setItem(ACCESS_KEY, "true");
    setHasAccess(true);
    setPassword("");
    setPasswordError("");
  }

  function updatePaymentOption(nextIndex: number) {
    const nextOption = paymentOptions[nextIndex];
    setPaymentOptionIndex(nextIndex);
    setAmount(nextOption.amount);
    if (nextOption.url) {
      setCustomPaymentLink("");
    }
  }

  function updateDate(nextDate: string) {
    setDateValue(nextDate);
    setReceiptNumber(defaultReceiptNumber(nextDate));
  }

  function clearReceipt() {
    const nextDate = todayInputValue();
    setDateValue(nextDate);
    setReceiptNumber(defaultReceiptNumber(nextDate));
    setDocumentType("request");
    setDonorName("");
    setDonorEmail("");
    setPaymentOptionIndex(0);
    setCustomPaymentLink("");
    setAmount("");
    setMemo("General mission support for Project High-Lvl programming.");
    setGoodsStatement("No goods or services were provided in exchange for this contribution.");
  }

  function savePdf() {
    window.print();
  }

  if (!hasAccess) {
    return (
      <main className="receipt-lock">
        <form className="receipt-lock-panel" onSubmit={submitPassword}>
          <Link className="receipt-back-link" href="/about">Back to About</Link>
          <img src="/logo.png" alt="" />
          <p className="eyebrow">PRIVATE PROJECT HIGH-LVL TOOL</p>
          <h1>Contribution receipt access.</h1>
          <p>Enter the password to create branded contribution requests and donor receipts.</p>
          <label htmlFor="receipt-tool-password">Password</label>
          <input
            id="receipt-tool-password"
            type="password"
            autoComplete="off"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {passwordError ? <p className="invoice-error" role="alert">{passwordError}</p> : null}
          <button className="button button-gold" type="submit">Unlock tool</button>
        </form>
      </main>
    );
  }

  return (
    <main className="receipt-tool">
      <section className="receipt-controls" aria-label="Contribution receipt controls">
        <div className="receipt-control-heading">
          <Link href="/about">Back to About</Link>
          <p className="eyebrow">PRIVATE TOOL</p>
          <h1>Build a contribution document.</h1>
          <p>Use this for donor support requests before payment or contribution receipts after payment. No entries are saved.</p>
        </div>

        <div className="receipt-form-grid">
          <label>
            Document type
            <select value={documentType} onChange={(event) => setDocumentType(event.target.value)}>
              <option value="request">Contribution request</option>
              <option value="receipt">Contribution receipt</option>
            </select>
          </label>
          <label>
            Receipt / request number
            <input value={receiptNumber} onChange={(event) => setReceiptNumber(event.target.value)} />
          </label>
          <label>
            Date
            <input type="date" value={dateValue} onChange={(event) => updateDate(event.target.value)} />
          </label>
          <label>
            Donor name / business
            <input value={donorName} onChange={(event) => setDonorName(event.target.value)} placeholder="Donor or company name" />
          </label>
          <label>
            Donor email
            <input value={donorEmail} onChange={(event) => setDonorEmail(event.target.value)} placeholder="Optional" />
          </label>
          <label>
            Contribution type / payment link
            <select value={paymentOptionIndex} onChange={(event) => updatePaymentOption(Number(event.target.value))}>
              {paymentOptions.map((option, index) => (
                <option key={option.label} value={index}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            Amount
            <input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Leave blank for name-your-own-price" />
          </label>
          <label>
            Custom payment link
            <input value={customPaymentLink} onChange={(event) => setCustomPaymentLink(event.target.value)} placeholder="Paste a Stripe link when needed" />
          </label>
          <label className="wide-field">
            Contribution memo
            <input value={memo} onChange={(event) => setMemo(event.target.value)} />
          </label>
          <label className="wide-field">
            Goods / services statement
            <select value={goodsStatement} onChange={(event) => setGoodsStatement(event.target.value)}>
              <option>No goods or services were provided in exchange for this contribution.</option>
              <option>Goods or services were provided; add the good-faith value before sending.</option>
              <option>This is a pending contribution request and not a receipt of payment.</option>
            </select>
          </label>
        </div>

        <div className="receipt-actions">
          <button className="button button-gold" type="button" onClick={savePdf}>Save to PDF</button>
          <button className="button button-outline-light" type="button" onClick={clearReceipt}>Clear</button>
        </div>
      </section>

      <section className="receipt-paper-wrap" aria-label="Contribution document preview">
        <article className="receipt-paper">
          <header className="receipt-paper-header">
            <div className="receipt-brand">
              <img src="/logo.png" alt="" />
              <div>
                <strong>PROJECT HIGH-LVL</strong>
                <span>Wellness · Literacy · AI</span>
              </div>
            </div>
            <div className="receipt-title-block">
              <h2>{documentTitle}</h2>
              <p>{receiptNumber || "PHL-YYYYMMDD-001"}</p>
            </div>
          </header>

          <div className="receipt-meta">
            <div>
              <span>Issued to</span>
              <strong>{donorName || "Donor / Business Name"}</strong>
              {donorEmail ? <p>{donorEmail}</p> : null}
            </div>
            <div>
              <span>Date</span>
              <strong>{formatDate(dateValue) || "Contribution date"}</strong>
            </div>
          </div>

          <div className="receipt-line-items">
            <div className="receipt-line receipt-line-head">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div className="receipt-line">
              <div>
                <strong>{paymentOption.label}</strong>
                <p>{memo || paymentOption.description}</p>
              </div>
              <b>{amountLabel}</b>
            </div>
          </div>

          <div className="receipt-total">
            <span>{documentType === "receipt" ? "Contribution received" : "Contribution requested"}</span>
            <strong>{amountLabel}</strong>
          </div>

          {paymentLink ? (
            <div className="receipt-payment">
              <span>Payment link</span>
              <a href={paymentLink} target="_blank" rel="noreferrer">Pay online</a>
              <p>{paymentLink}</p>
            </div>
          ) : null}

          <div className="receipt-note">
            <p>{goodsStatement}</p>
            <p>Project High-Lvl is a 501(c)(3) nonprofit organization. EIN 33-2614564. Contributions are tax-deductible to the extent allowed by law.</p>
          </div>

          <div className="receipt-business">
            <div>
              <strong>Project High-Lvl</strong>
              <span>Los Angeles, CA</span>
            </div>
            <div>
              <span>phlnonprofit@gmail.com</span>
              <span>EIN 33-2614564</span>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
