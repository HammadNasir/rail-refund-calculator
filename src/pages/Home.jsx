import { Calculator, AlertCircle, Train, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

      {/* HEADER (same as Calculator) */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-3">
          <Train className="w-10 h-10" />
          <div>
            <h1 className="text-3xl font-bold">Rail Refund Calculator</h1>
            <p className="text-indigo-100 text-sm">
              Understand IRCTC refund rules before cancelling
            </p>
          </div>
        </div>
      </div>

      {/* DISCLAIMER BANNER */}
      <div className="bg-red-50 border-t-4 border-red-500">
        <div className="max-w-6xl mx-auto px-4 py-4 flex gap-3">
          <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900 mb-1">
              Important Notice: Not Affiliated with IRCTC
            </p>
            <p className="text-xs text-red-800">
              This website is an independent informational tool and is NOT
              associated with IRCTC or Indian Railways.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* TOP CTA */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            IRCTC Refund Rules & Train Ticket Cancellation Guide
          </h2>
          <p className="text-gray-700 mb-6">
            Learn how Indian Railways calculates refunds and instantly estimate
            your cancellation refund using our calculator.
          </p>
          <a
            href="/calculator"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            <Calculator size={18} />
            Calculate My Refund
          </a>
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white rounded-xl shadow-xl p-8 space-y-6">

          <h3 className="text-2xl font-bold text-gray-900">
            Indian Railways Ticket Refund Rules Guide (2025 Updated)
          </h3>

          <p className="text-gray-700 leading-relaxed">
            Indian Railway refunds depend on ticket status, timing of cancellation,
            and travel class. This calculator gives you an accurate estimate based
            on official rules defined in the Railway Passengers (Cancellation of
            Tickets and Refund of Fare) Rules, 2015.
          </p>

          <h4 className="text-xl font-semibold">Tatkal Refund Rules</h4>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>No refund for confirmed Tatkal tickets.</li>
            <li>RAC/WL Tatkal tickets are refunded after cancellation as per normal rules.</li>
            <li>Full refund allowed if train is cancelled by Indian Railways.</li>
          </ul>

          <h4 className="text-xl font-semibold">RAC & Waitlisted Refund Rules</h4>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>RAC tickets: refund available if cancelled before chart preparation.</li>
            <li>Waitlisted tickets: refund is automatic if not confirmed after charting.</li>
          </ul>

          <h4 className="text-xl font-semibold">Time-Based Cancellation Charges</h4>
          <p className="text-gray-700 leading-relaxed">
            Cancellation fees vary based on how early the ticket is cancelled
            before the train's departure. Deduction ranges from minimum charges
            to 100% forfeiture.
          </p>

          <h4 className="text-xl font-semibold">Refund Timeline</h4>
          <p className="text-gray-700 leading-relaxed">
            Refund is typically credited back to the source account within 3–7
            working days for online payments. Bank turnaround time may vary.
          </p>

          {/* FAQ — RESTORED */}
          <h4 className="text-xl font-semibold mt-8">
            Frequently Asked Questions (FAQ)
          </h4>

          <div className="space-y-4 text-gray-700">
            <p><strong>1. Do I get a refund if my ticket remains WL?</strong><br />
              Yes. If WL status persists after chart preparation, a full refund is automatically processed.
            </p>

            <p><strong>2. Do I get a refund if the train is cancelled?</strong><br />
              Yes. Full fare refund is initiated by Indian Railways for all ticket types.
            </p>

            <p><strong>3. Do I get a refund for Tatkal tickets?</strong><br />
              Confirmed Tatkal tickets do not get a refund except in special circumstances like train cancellation.
            </p>

            <p><strong>4. What if the train is late by more than 3 hours?</strong><br />
              Full refund is allowed under IRCTC rules if an e-ticket passenger chooses not to travel.
            </p>

            <p><strong>5. What if a ticket is partially confirmed?</strong><br />
              The confirmed portion is refunded based on normal deduction. The waitlisted part is refunded in full.
            </p>

            <p><strong>6. How long does a refund take?</strong><br />
              Typically 3–7 banking days for online tickets. UPI refunds may be faster.
            </p>

            <p><strong>7. Is GST refundable?</strong><br />
              GST paid on services is <strong>not refunded</strong> on ticket cancellations.
            </p>
          </div>

          {/* DISCLAIMER */}
          <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6 mt-8">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <AlertCircle size={18} />
              Important Disclaimer
            </h4>
            <p className="text-sm text-gray-700">
              This is a simplified guide for easy understanding. Always verify
              final refund details with official IRCTC sources.
            </p>
          </div>

          {/* BOTTOM CTA */}
          <div className="text-center pt-6">
            <a
              href="/calculator"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              <Calculator size={18} />
              Calculate My Refund Now
            </a>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center text-sm text-gray-600 space-x-4">
          <a href="/">Home</a>
          <a href="/calculator">Calculator</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </div>
  );
}
