import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="thank-you">
      <div className="thank-you-photo" />
      <div className="thank-you-card">
        <img src="/logo.png" alt="Project High-Lvl" />
        <p className="eyebrow">THE NEXT LEVEL STARTS HERE</p>
        <h1>Your seat<br />is funded.</h1>
        <p>Thank you. Your receipt will arrive by email from Stripe. Your gift helps put practical AI and financial literacy within reach.</p>
        <div className="thank-actions">
          <a className="button button-green" href="mailto:partnerships@projecthighlvl.org?subject=Project%20High-Lvl%20Monthly%20Giving">Make it monthly <span aria-hidden="true" className="arrow"><i /></span></a>
          <a className="text-link" href="mailto:?subject=I%20funded%20a%20Project%20High-Lvl%20seat&body=AI%20literacy%20is%20the%20new%20financial%20literacy.%20I%20just%20funded%20a%20seat%20at%20Project%20High-Lvl.%20https%3A%2F%2Fprojecthighlvl.org">Share the climb <span aria-hidden="true" className="arrow"><i /></span></a>
        </div>
        <Link href="/#join">Want a free seat yourself? Join the next Lab.</Link>
      </div>
    </main>
  );
}
