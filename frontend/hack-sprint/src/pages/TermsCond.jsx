import React from "react";

export default function LegalSupportPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6">
      <main className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Terms & Conditions</h1>
          <p className="text-gray-300">Platform Terms &amp; Conditions, Privacy summary, and an FAQ to answer quick queries.</p>
        </header>

        <article className="space-y-8">
          <section>
            <h2 className="text-2xl font-medium mb-2">A. Terms &amp; Conditions</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>Accounts: You’re responsible for account security and for the activity under your account.</li>
              <li>Submissions &amp; IP: You retain ownership of your code unless the event requires otherwise. By submitting, you grant organizers a non-exclusive license to evaluate and showcase your work. Any transfer/assignment of IP must be explicit and accepted at registration.</li>
              <li>Responsibilities: HackSprint provides platform services; organizers are responsible for prize fulfillment and contest-specific rules. HackSprint is not responsible for organizer failure to deliver prizes except where explicitly stated.</li>
              <li>Termination: HackSprint may suspend or terminate accounts for violations of policies.</li>
              <li>Dispute &amp; Governing Law: Disputes will follow the event’s published dispute process. Platform-level disputes are subject to HackSprint’s dispute resolution policy (specify jurisdiction in the full legal text).</li>
              <li>Liability: HackSprint’s liability is limited to the maximum extent allowed by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">B. Privacy Policy</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>What we collect: Account info (email, display name), submission content (repo links, uploaded files), usage analytics, and optional profile data (GitHub link, bio).</li>
              <li>How we use it: To operate contests, notify winners, process payouts, investigate abuse, and improve the platform.</li>
              <li>Sharing: We share minimum necessary data with event organizers (contact info for prize distribution) and with payment processors when required for payouts. We never publish your contact details without explicit consent.</li>
              <li>Retention: Submission data is retained per event rules; platform retains account data while active. Full policy should explain retention timelines and user rights (export/delete requests).</li>
              <li>Security: We follow industry-standard controls. Report breaches to <a href="mailto:security@hacksprint.example" className="underline">security@hacksprint.example</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">C. FAQ (concise)</h2>
            <div className="space-y-2 text-gray-200">
              <p><strong>How to claim prizes?</strong> Winners will be contacted by the organizer or platform. Provide requested details within the claim window.</p>
              <p><strong>Can I use external libraries?</strong> Yes unless the event forbids them. Declare third-party libraries.</p>
              <p><strong>What happens if a tiebreak is disputed?</strong> File a ticket within the appeal window; follow the organizer’s appeals process; if unresolved, escalate to HackSprint mediation.</p>
              <p><strong>Who pays taxes?</strong> Winners are responsible for local taxes unless stated otherwise.</p>
              <p><strong>How do I report cheating?</strong> Submit details to <a href="mailto:security@hacksprint.example" className="underline">security@hacksprint.example</a> with evidence and timestamps.</p>
            </div>
          </section>
        </article>

        <footer className="mt-12 text-sm text-gray-400">
          <p>Adapt these legal summaries into your full legal documents. This page is a summary and not a substitute for formal legal text.</p>
        </footer>
      </main>
    </div>
  );
}
