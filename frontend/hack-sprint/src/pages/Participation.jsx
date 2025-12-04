import React from "react";

export default function ParticipantPoliciesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6">
      <main className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Participant Policies</h1>
          <p className="text-gray-300">Clear rules and fair-play guarantees for participants: eligibility, submission rules, scoring, prizes, appeals and community standards.</p>
        </header>

        <article className="space-y-8">
          <section>
            <h2 className="text-2xl font-medium mb-2">A. User agreement</h2>
            <p className="text-gray-200">By registering on HackSprint you agree to follow platform rules, event-specific guidelines, and this Participant Policies summary. You are responsible for the security of your account and for providing accurate contact details used for winner notifications and prize fulfillment.</p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">B. Eligibility &amp; registration</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>Follow event-level eligibility (age, region, student status). If unspecified, the event is open globally.</li>
              <li>Register before the event deadline. Team registration must list all members and confirm each person’s consent.</li>
              <li>One account per person. Creating multiple accounts to manipulate results will lead to disqualification.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">C. Submissions — permitted &amp; required</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>Submissions must follow event instructions (repo link, ZIP, demo video). Always verify required files before submission.</li>
              <li>Unless an event explicitly permits pre-work, solutions must be created within the contest period. If pre-existing code is used, declare it in your submission.</li>
              <li>Use of public/open-source libraries is allowed unless the event disallows them — always list dependencies and licenses.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">D. Scoring &amp; tiebreakers</h2>
            <p className="text-gray-200">Each event publishes its scoring rubric. Common components: correctness/automated tests, performance, design, creativity, and judge scores.</p>
            <p className="text-gray-200 mt-2">Standard tiebreakers (if event does not specify otherwise):</p>
            <ol className="list-decimal list-inside text-gray-200 space-y-1 mt-2">
              <li>Shorter total time / lower penalty (for timed coding contests).</li>
              <li>Earliest submission that achieved the final score.</li>
              <li>Secondary judge metric (pre-declared) or judge panel decision.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">E. Prizes &amp; rewards</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>Organizers declare prize types (cash, vouchers, interviews, swag), quantities and payout timelines on the event page.</li>
              <li>Winners must respond within the stated window to claim prizes and provide verification/payment details. Failure may forfeit the prize.</li>
              <li>Taxes and local withholding: winners are responsible for local tax obligations unless otherwise stated.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">F. Fair Play &amp; enforcement</h2>
            <p className="text-gray-200">Prohibited: plagiarism, sharing answers, impersonation, automated cheating, DDoS or infrastructure attacks.</p>
            <p className="text-gray-200 mt-2">Reports are reviewed; confirmed violations can lead to score removal, disqualification, and account suspension. Severe or repeated violations may be permanently banned and reported to sponsors or institutions as needed.</p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">G. Appeals &amp; dispute process</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>File a ticket within 7 days of result publication with evidence.</li>
              <li>Organizer/judges reply within 7–14 days.</li>
              <li>If unresolved, escalate to HackSprint moderation for neutral review. HackSprint’s decision is final for platform policy issues; organizers are responsible for prize fulfillment.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">H. Code of Conduct (community expectations)</h2>
            <p className="text-gray-200">Treat others with respect. No harassment, hate speech, doxxing or threats. Maintain professional behavior in forums, chats and during presentations. Violations can result in warnings, removal or bans.</p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">I. Quick tips (participants)</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>Read the event rules carefully before building.</li>
              <li>Keep your repo tidy and include a README, license &amp; deployment link.</li>
              <li>Keep communication channels professional and check notifications frequently.</li>
            </ul>
          </section>

        </article>

        <footer className="mt-12 text-sm text-gray-400">
          <p>Generated for HackSprint — adapt event-level details as needed.</p>
        </footer>
      </main>
    </div>
  );
}
