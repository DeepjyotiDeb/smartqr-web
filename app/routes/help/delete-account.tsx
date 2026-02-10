import Footer from "~/components/Footer";
import Header from "~/components/Header";

export function meta() {
  return [
    { title: "Delete Account - DQR Help" },
    {
      name: "description",
      content: "How to delete your DQR account and associated data",
    },
  ];
}

export default function DeleteAccountPage() {
  return (
    <div className="container max-w-6xl mx-auto">
      <Header />

      <div className="bg-white p-4 md:p-8 lg:p-12 rounded-2xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-4">Account &amp; Data Deletion</h1>
          <p>
            Last updated: <time datetime="2025-09-22">22 September 2025</time>
          </p>
          <p>
            Use this page to request deletion of your DQR account and associated
            personal data. You don't need to have the app installed to make a
            request.
          </p>

          <section id="in-app">
            <h2 className="mb-4">In-app</h2>
            <ul>
              <li>
                You can delete your account by opening the app and going to{" "}
                <em>Settings → Delete account</em>
              </li>
              <li>
                Enter your password to confirm and click "Delete account".
              </li>
            </ul>
          </section>

          <section id="by-email">
            <h2 className="mb-4">By email (no app required)</h2>
            <ul>
              <li>
                Email{" "}
                <a href="mailto:hello@eedi.co.uk?subject=DQR%20Deletion%20Request">
                  hello@eedi.co.uk
                </a>{" "}
                or{" "}
                <a href="mailto:dpo@eedi.co.uk?subject=DQR%20Deletion%20Request">
                  dpo@eedi.co.uk
                </a>{" "}
                from the email address linked to your DQR account with subject{" "}
                <em>"DQR Deletion Request"</em>.
              </li>
            </ul>
            <p>
              <strong>Important:</strong> Uninstalling the app does <em>not</em>{" "}
              delete your account or cloud data.
            </p>
          </section>

          <section id="what-to-include">
            <h3 className="mb-4">What to include in your email</h3>
            <ol>
              <li>
                The DQR <strong>account email</strong> (should match the sender
                for verification).
              </li>
              <li>
                Your <strong>name</strong> and, if applicable,{" "}
                <strong>school name</strong>.
              </li>
              <li>
                What you want us to do:
                <ul>
                  <li>
                    "Delete my account and all associated data", <em>or</em>
                  </li>
                  <li>
                    "Export my data first, then delete", <em>or</em>
                  </li>
                  <li>"Delete specific class/results" (include details).</li>
                </ul>
              </li>
            </ol>
            <p>
              We'll reply to confirm identity and next steps. For security, we
              may ask for limited additional verification (e.g., confirming
              recent class or quiz names).
            </p>
          </section>

          <section id="what-we-delete">
            <h2 className="mb-4">What we delete</h2>
            <ul>
              <li>
                Your DQR <strong>account profile</strong>.
              </li>
              <li>
                <strong>Classes</strong> you created (including student
                identifiers you entered).
              </li>
              <li>
                <strong>Quiz sessions and results</strong> associated with your
                account.
              </li>
              <li>
                App-scoped identifiers (e.g., device/app install IDs, push
                tokens).
              </li>
              <li>
                Any other personal data we hold about you for DQR, except what
                we must retain by law.
              </li>
            </ul>
            <p>
              <strong>Images/photo:</strong> Eedi does not store any images of
              scanned codes or AI scanned photos of registers; only the{" "}
              <strong>extracted class fields</strong> (e.g., names/IDs) are
              saved and will be deleted with your account/classes.
            </p>
          </section>

          <section id="retention">
            <h2 className="mb-4">What we may retain temporarily</h2>
            <ul>
              <li>
                <strong>Billing/transaction records</strong> (typically up to 6
                years under UK law).
              </li>
              <li>
                <strong>Security and anti-abuse logs</strong> (short, limited
                periods).
              </li>
              <li>
                <strong>Aggregated, anonymised analytics</strong> that do not
                identify you.
              </li>
            </ul>
          </section>

          <section id="school-managed">
            <h2 className="mb-4">
              School-managed accounts (controller/processor)
            </h2>
            <p>
              If your use of DQR is <strong>provisioned by a school</strong>,
              the school is the <strong>data controller</strong> and Eedi acts
              as <strong>processor</strong> under our Data Processing Agreement.
            </p>
            <ul>
              <li>
                Please contact your <strong>school</strong> first to request
                deletion.
              </li>
              <li>
                If you email us directly, we'll notify the school and act on
                their instruction.
              </li>
            </ul>
          </section>

          <section id="timing">
            <h2 className="mb-4">Timing</h2>
            <ul>
              <li>
                We acknowledge your request promptly and aim to complete
                verified deletions within <strong>30 days</strong> (sooner where
                possible).
              </li>
              <li>
                If we need more time due to complexity or school coordination,
                we'll let you know.
              </li>
            </ul>
          </section>

          <section id="export">
            <h2 className="mb-4">Data export (optional)</h2>
            <p>
              If you want a copy of your data before deletion, include "
              <strong>Export my data first</strong>" in your email. We'll
              provide a machine-readable export (e.g., CSV/JSON) where feasible.
            </p>
          </section>

          <section id="after-deletion">
            <h2 className="mb-4">After deletion</h2>
            <ul>
              <li>
                You'll receive a confirmation email when deletion is complete.
              </li>
              <li>
                Deletion is <strong>permanent</strong> and cannot be undone.
              </li>
              <li>
                Local data on your device is removed when you{" "}
                <strong>uninstall</strong> the app; cloud data is removed
                through this process.
              </li>
            </ul>
          </section>

          <section id="help">
            <h2 className="mb-4">Questions or help</h2>
            <ul>
              <li>
                General support:{" "}
                <a href="mailto:hello@eedi.co.uk">hello@eedi.co.uk</a>
              </li>
              <li>
                Data Protection Officer (DPO):{" "}
                <a href="mailto:dpo@eedi.co.uk">dpo@eedi.co.uk</a>
              </li>
              <li>
                Privacy Notice:{" "}
                <a href="/privacy">https://dqr.eedi.com/privacy</a>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
