import React from "react";

export default function OrganizerPlaybookPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6">
      <main className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Organizer Playbook</h1>
          <p className="text-gray-300">Everything an organizer needs: event setup checklist, scoring & tiebreakers, payout guidance, and dispute handling to run trustworthy contests.</p>
          <p className="text-sm text-gray-400 mt-2">Contact (organizers): <a href="mailto:hacksprint@iitj.ac.in" className="underline">hacksprint@iitj.ac.in</a> — or use the organizer dashboard Support link</p>
        </header>

        <article className="space-y-8">
          <section>
            <h2 className="text-2xl font-medium mb-2">A. Event setup checklist (must include)</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>Title & Description: Clear theme, target audience and expected deliverables.</li>
              <li>Timeline: Start / submission / judging / result dates and timezones.</li>
              <li>Eligibility: Geographic, student/pro/employment constraints, age limits.</li>
              <li>Team rules: Team size, substitutions, single-person entries permitted?</li>
              <li>Submission format: Repo links, zipped source, binaries, demo video requirements.</li>
              <li>Scoring rubric: Exact scoring formula and weight for each metric (functionality, design, originality, documentation). Publish verbatim.</li>
              <li>Prizes: Types, values, number of winners, payout timeline and required docs.</li>
              <li>Tiebreakers & penalties: Pre-declare tiebreak rules and any late/format penalties.</li>
              <li>Contact & Support: Organizer contact and dispute channel.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">B. Recommended scoring model</h2>
            <p className="text-gray-200">For coding problems: Use a mix of automatic verification (correctness) and secondary metrics (time, memory). Provide sample test IO and whether tests are public/hidden.</p>
            <p className="text-gray-200 mt-2">For project hackathons: Define points for idea, execution, demo, user experience and impact. Use 2–3 judges to average subjective scores.</p>
            <p className="text-gray-200 mt-2">Add an “audience vote” only if you disclose weight and prevent duplicate votes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">C. Tiebreaker examples (pick &amp; publish one)</h2>
            <ol className="list-decimal list-inside text-gray-200 space-y-1">
              <li>Time-based: Lower cumulative time penalty wins (ICPC-style).</li>
              <li>Earliest correct: Earlier timestamp for the final accepted submission.</li>
              <li>Judge secondary metric: Pre-declared (e.g., “execution quality”) used to break ties.</li>
              <li>Panel review: If still tied, the organizing panel provides a final decision (document rationale).</li>
            </ol>
            <p className="text-gray-200 mt-2">Publish the chosen tiebreak steps on the event page before the contest starts.</p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">D. Prize disbursement &amp; verification</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>Timeline: Recommended: organizers disburse cash prizes within 30 days of winner confirmation. Declare this on the event page.</li>
              <li>Verification: Require winners to provide identification/payment details within a stated window; keep sensitive data secure.</li>
              <li>Failure to claim: If winners fail to respond within the window, prize may be forfeited per event rules.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">E. Anti-cheat &amp; integrity guidelines</h2>
            <p className="text-gray-200">Use a mix of automatic detection (plagiarism checks, abnormal submission patterns) and manual review. Log submission meta (timestamps, IP addresses) for audits (notify participants in privacy policy). Maintain a clear evidence-based appeals process.</p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">F. Disputes &amp; moderation</h2>
            <p className="text-gray-200">Encourage organizers to resolve issues in 7–14 days. Provide HackSprint mediation for unresolved platform-level disputes. Keep all judging comments and scores archived for audit purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-2">G. Organizer best practices (to run a “premium” event)</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>Provide a sample submission and a public test case set (if coding tasks).</li>
              <li>Host live Q&A / office hours and publish FAQs.</li>
              <li>Provide sample rubrics and scoring examples.</li>
              <li>Use a judge calibration session to align scoring standards.</li>
              <li>Offer clear communications: timelines, support, acceptance criteria and data retention policy.</li>
            </ul>
          </section>
        </article>

        <footer className="mt-12 text-sm text-gray-400">
          <p>Generated for HackSprint organizers — adapt operational details to your legal and regional requirements.</p>
        </footer>
      </main>
    </div>
  );
}
