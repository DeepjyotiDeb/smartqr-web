import Header from "~/components/Header";
import Footer from "~/components/Footer";

export function meta() {
  return [
    { title: "Privacy Policy - DQR" },
    { name: "description", content: "Privacy Policy for DQR" },
  ];
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-6xl mx-auto">
      <Header />

      <div className="bg-white p-4 md:p-8 lg:p-12 rounded-2xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-4">Privacy Policy</h1>
          <p className="muted">Last updated: 18 September 2025 • Version 2.1</p>

          <section className="section" id="intro">
            <p>
              <strong>Eedi Ltd</strong> is an advanced EdTech learning platform
              for schools, parents and students created to ensure that every
              learner has access to great teaching.
            </p>
            <p>
              This privacy notice explains what we do with your personal data
              when you use our website, make contact with us, use one of our
              services, or use our mobile applications.
            </p>
          </section>

          <section className="section" id="controller">
            <h2 className="mb-4">Who we are (Controller / Processor)</h2>
            <p>
              <strong>Controller:</strong> Eedi Ltd is the data controller.
            </p>
            <p>
              <strong>Processor:</strong> Where we have been engaged by a school
              or education provider, we process student personal data on their
              instructions and our <em>Data Processing Agreement</em> applies.
            </p>
            <div className="callout">
              <p>
                <strong>Eedi Ltd</strong>
                <br />
                86–90 Paul Street, London, EC2A 4NE, England
              </p>
            </div>
          </section>

          <section className="section" id="dpo">
            <h2 className="mb-4">How to contact us</h2>
            <p>
              We have appointed a Data Protection Officer (DPO). You can contact
              the DPO with any questions or concerns about how we process your
              data:
            </p>
            <ul>
              <li>
                Email: <a href="mailto:dpo@eedi.co.uk">dpo@eedi.co.uk</a>
              </li>
              <li>
                Mail: Data Protection Officer, Eedi Ltd, 86-90 Paul Street,
                London, EC2A 4NE, England
              </li>
            </ul>
          </section>

          <section className="section" id="scope">
            <h2 className="mb-4">Who this notice applies to</h2>
            <ul>
              <li>
                Employees using Eedi on behalf of their educational provider
                (e.g., teachers and faculty).
              </li>
              <li>Students enrolled by their teacher for use of DQR.</li>
              <li>Visitors to our website.</li>
            </ul>
            <p>
              We may continue to process information derived from student and
              customer data that has been{" "}
              <strong>de-identified, anonymised and/or aggregated</strong> so it
              no longer identifies individuals or the customer, to improve our
              systems and services and for research and commercial purposes.
            </p>
          </section>

          <section className="section" id="what-we-collect">
            <h2 className="mb-4">What information we collect</h2>
            <h3 className="mb-4">From teachers</h3>
            <ul>
              <li>
                <strong>Identity</strong>: name
              </li>
              <li>
                <strong>Contact</strong>: email address
              </li>
              <li>
                <strong>Educational</strong>: name of school, school address,
                class name(s)
              </li>
            </ul>

            <h3 className="mb-4">From teachers on behalf of their students</h3>
            <ul>
              <li>
                <strong>Identity</strong>: name
              </li>
              <li>
                <strong>Educational</strong>: class name
              </li>
            </ul>

            <h3 className="mb-4">From website visitors</h3>
            <ul>
              <li>
                <strong>Technical</strong>: IP address, log-on information,
                browser type/version, time zone, plug-ins, OS, device,
                dates/times, error logs, page interactions and session duration
              </li>
              <li>
                <strong>Cookies</strong>: Only essential cookies are enabled by
                default. Non-essential cookies are used with consent.
              </li>
            </ul>
          </section>

          <section className="section" id="how-we-collect">
            <h2 className="mb-4">How we collect and use your information</h2>
            <p>We receive your information when:</p>
            <ul>
              <li>
                You visit our website and consent to cookies (e.g., Google
                Analytics, Mixpanel, Sentry).
              </li>
              <li>You make an enquiry or contact us.</li>
              <li>You sign up to and use our services (teachers).</li>
            </ul>
            <h3 className="mb-4">Purposes of processing</h3>
            <ul>
              <li>Set up your account and deliver our services.</li>
              <li>Respond to enquiries and provide support.</li>
              <li>
                Manage our relationship with you, including notifying you about
                changes.
              </li>
              <li>
                Maintain accurate records and keep information up to date.
              </li>
              <li>Run feedback surveys and, with consent, send marketing.</li>
              <li>
                Improve our website and service offering (including analytics
                and diagnostics).
              </li>
              <li>
                Conduct research relating to our services (using
                anonymised/aggregated data where possible).
              </li>
            </ul>

            <h3 className="mb-4">Lawful bases we rely on</h3>
            <table className="small">
              <thead>
                <tr>
                  <th>Purpose</th>
                  <th>Lawful basis (UK GDPR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Provide services, manage account, SSO integrations</td>
                  <td>Article 6(1)(b) — Contract</td>
                </tr>
                <tr>
                  <td>Respond to enquiries and support</td>
                  <td>Article 6(1)(f) — Legitimate interests</td>
                </tr>
                <tr>
                  <td>Essential cookies and security logs</td>
                  <td>Article 6(1)(f) — Legitimate interests</td>
                </tr>
                <tr>
                  <td>Non-essential cookies/analytics</td>
                  <td>Article 6(1)(a) — Consent</td>
                </tr>
                <tr>
                  <td>Marketing communications</td>
                  <td>Article 6(1)(a) — Consent</td>
                </tr>
                <tr>
                  <td>Payment processing and billing</td>
                  <td>Article 6(1)(b) — Contract</td>
                </tr>
                <tr>
                  <td>
                    Research and service improvement using anonymised/aggregated
                    data
                  </td>
                  <td>Article 6(1)(f) — Legitimate interests</td>
                </tr>
                <tr>
                  <td>School deployments (student data)</td>
                  <td>
                    Processor acting on school's instructions; DPA applies
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="section" id="sharing">
            <h2 className="mb-4">Who we share your data with</h2>
            <p>
              We may share personal data with trusted third parties for the
              purposes below:
            </p>
            <ul>
              <li>Hosting our systems and data.</li>
              <li>Facilitating transfer of school data and integrations.</li>
              <li>Security monitoring and incident response.</li>
              <li>
                Service administration, product analytics and performance.
              </li>
              <li>Payment processing.</li>
              <li>Email delivery and communications.</li>
              <li>Customer support and feedback tools.</li>
              <li>Website analytics and interaction tools.</li>
              <li>
                Legal and professional advisers; to comply with legal
                obligations.
              </li>
              <li>
                Research partners (using anonymised/aggregated data where
                applicable).
              </li>
              <li>Corporate transactions (e.g., merger or acquisition).</li>
              <li>Any other purpose with your consent.</li>
            </ul>
            <p>
              These providers act under our instructions with appropriate
              contracts, confidentiality commitments and security controls.
            </p>
          </section>

          <section className="section" id="location">
            <h2 className="mb-4">Where we process data and international transfers</h2>
            <p>
              Our platform is hosted on{" "}
              <strong>
                Microsoft Azure Cloud SQL within the European Union (EU)
              </strong>
              .
            </p>
            <p>
              As an EdTech business, we may transfer personal data outside the
              UK/EEA. Where we do, we use appropriate safeguards such as the{" "}
              <strong>UK International Data Transfer Addendum</strong>,{" "}
              <strong>EU Standard Contractual Clauses</strong>, and additional
              technical and organisational measures as needed.
            </p>
            <p>
              Contact our DPO for an up-to-date list of international transfers
              relevant to your use of our services.
            </p>
          </section>

          <section className="section" id="security">
            <h2 className="mb-4">How we keep your information safe</h2>
            <ul>
              <li>Staff training on privacy and security.</li>
              <li>24-hour backups via Microsoft Azure.</li>
              <li>
                Role-based access; least-privilege; need-to-know controls.
              </li>
              <li>Encryption in transit and at rest; strong TLS for APIs.</li>
              <li>Patch management and up-to-date software.</li>
              <li>
                Strong password and MFA policies; quarterly access reviews.
              </li>
              <li>
                PCI-DSS compliant handling by payment providers; we do not store
                full card PANs.
              </li>
              <li>
                Internal penetration testing every 3–6 months; external testing
                annually.
              </li>
            </ul>
          </section>

          <section className="section" id="retention">
            <h2 className="mb-4">How long we keep your information</h2>
            <p>
              We retain personal data only as long as necessary for the purposes
              collected, including legal, accounting and reporting requirements.
            </p>
            <ul>
              <li>
                <strong>Contract and billing records:</strong> typically 6 years
                after contract end.
              </li>
              <li>
                <strong>Cookies and similar technologies:</strong> see our
                Cookies page for specific lifetimes.
              </li>
            </ul>
          </section>

          <section className="section" id="rights">
            <h2 className="mb-4">Your rights</h2>
            <p>Under UK data protection law, you have the following rights:</p>
            <ol>
              <li>
                <strong>Right to be informed</strong> about how we use your
                data.
              </li>
              <li>
                <strong>Right of access</strong> to a copy of your personal
                data.
              </li>
              <li>
                <strong>Right to rectification</strong> of inaccurate data.
              </li>
              <li>
                <strong>Right to erasure</strong> in certain circumstances.
              </li>
              <li>
                <strong>Right to restrict processing</strong> in certain
                circumstances.
              </li>
              <li>
                <strong>Right to data portability</strong> in certain
                circumstances.
              </li>
              <li>
                <strong>Right to object</strong> to certain processing
                (including direct marketing).
              </li>
              <li>
                <strong>
                  Rights related to automated decision-making and profiling
                </strong>
                .
              </li>
            </ol>
            <p>
              Please note some rights are not absolute. Where we act as a
              processor for a school, we may ask you to contact the school to
              exercise your rights.
            </p>
          </section>

          <section className="section" id="complaints">
            <h2 className="mb-4">Questions or complaints</h2>
            <p>
              Please contact our DPO if you are unhappy with any aspect of our
              data processing. You also have the right to complain to the UK
              Information Commissioner's Office (ICO):{" "}
              <a href="https://www.ico.org.uk" rel="noopener">
                www.ico.org.uk
              </a>
              . We would appreciate the chance to address your concerns before
              you contact the ICO.
            </p>
          </section>

          <section className="section" id="mobile">
            <h2 className="mb-4">Mobile Applications — Additional Privacy Information</h2>

            <h3 className="mb-4">What additional information the Apps collect</h3>
            <ul>
              <li>
                <strong>Device &amp; App data:</strong> device model, OS
                version, app version, language, time zone, crash logs,
                performance and diagnostic events.
              </li>
              <li>
                <strong>Identifiers:</strong> app-scoped install ID and{" "}
                <strong>push notification token</strong> (for notifications). We
                do <em>not</em> collect Apple IDFA or Google Advertising ID for
                advertising purposes.
              </li>
              <li>
                <strong>Usage data:</strong> screens viewed, feature
                interactions, session duration, anonymised analytics.
              </li>
              <li>
                <strong>Permissions:</strong> camera (e.g., scanning/uploading
                roster photos), photo library (uploading images). You can revoke
                permissions anytime in device settings.
              </li>
            </ul>
            <p>
              We do not collect precise location or Bluetooth data unless
              explicitly requested and you grant permission.
            </p>

            <h3 className="mb-4">How we collect this information in the Apps</h3>
            <p>
              Directly from your device when you use the App and via{" "}
              <strong>mobile SDKs</strong> for analytics, crash reporting,
              performance monitoring and messaging. These providers act under
              our instructions as processors where applicable.
            </p>

            <h3 className="mb-4">Camera and Image Processing</h3>
            <p>
              Camera (required for scanning): The App uses your
              device camera to detect QR/ArUco markers so you can record student
              responses. No photos or videos are saved and frames are processed
              on-device solely for marker detection. Optional roster photo
              upload: If you choose to photograph or upload an image of a class
              register/list to auto-add students, the image may be transiently
              transmitted to our processing provider to extract text
              (names/IDs). Eedi does not store the image; we keep only the
              extracted roster data (e.g., student names/IDs) in your class.
              Please avoid including unnecessary personal data (e.g., addresses,
              phone numbers, health data).
            </p>

            <h3 className="mb-4">Purposes &amp; lawful bases in the Apps</h3>
            <table className="small">
              <thead>
                <tr>
                  <th>Purpose</th>
                  <th>Lawful basis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Provide functionality, security, diagnostics</td>
                  <td>
                    Art. 6(1)(b) Contract; Art. 6(1)(f) Legitimate interests
                  </td>
                </tr>
                <tr>
                  <td>App analytics &amp; improvement</td>
                  <td>Art. 6(1)(f) Legitimate interests</td>
                </tr>
                <tr>
                  <td>Push notifications</td>
                  <td>
                    Art. 6(1)(a) Consent (where required) or 6(1)(f) Legitimate
                    interests
                  </td>
                </tr>
                <tr>
                  <td>In-app purchases/subscription entitlement</td>
                  <td>Art. 6(1)(b) Contract</td>
                </tr>
                <tr>
                  <td>Research using anonymised/aggregated data</td>
                  <td>Art. 6(1)(f) Legitimate interests</td>
                </tr>
              </tbody>
            </table>

            <h3 className="mb-4">Children's privacy in the Apps</h3>
            <ul>
              <li>
                <strong>School use:</strong> the school provides pupil data and
                is responsible for lawful basis and parent/guardian
                notices/consents where required.
              </li>
            </ul>

            <h3 className="mb-4">In-app purchases and app stores</h3>
            <p>
              When you subscribe in the App, transactions are processed by the{" "}
              <strong>Apple App Store</strong> or <strong>Google Play</strong>.
              We receive purchase confirmations and subscription status to
              provide access, but not your full card details. Refunds and
              cancellations are managed in your app store account settings.
            </p>

            <h3 className="mb-4">Mobile SDKs and third parties</h3>
            <p>
              We use providers for crash reporting/diagnostics, product
              analytics/performance, push notifications/in-app messaging, image
              processing and subscription entitlement/receipt validation.
              Contracts impose confidentiality, security and processing only
              under our instructions. A current list of categories and purposes
              is available on request.
            </p>

            <h3 className="mb-4">International transfers for the Apps</h3>
            <p>
              Where App telemetry or SDK providers process data outside the
              UK/EEA, we use appropriate safeguards (UK IDTA, EU SCCs, and
              additional measures where relevant). Contact the DPO for details
              of current transfers.
            </p>

            <h3 className="mb-4">How long we keep App-specific data</h3>
            <ul>
              <li>
                <strong>Crash/diagnostic logs:</strong> up to 12 months.
              </li>
              <li>
                <strong>Push tokens:</strong> while notifications are enabled or
                until you uninstall or disable notifications.
              </li>
              <li>
                <strong>App analytics:</strong> typically 12–24 months in
                aggregated form.
              </li>
            </ul>

            <h3 className="mb-4">Your choices in the Apps</h3>
            <ul>
              <li>
                Manage camera, microphone, photo library and notifications via
                device settings.
              </li>
              <li>
                We do not send push marketing without your consent (where
                required). You can opt out in settings.
              </li>
              <li>
                We do not use IDFA/GAID for advertising or cross-app tracking.
                If this changes, we will seek explicit consent and update this
                notice and our store disclosures.
              </li>
            </ul>

            <h3 className="mb-4">Security — mobile specifics</h3>
            <ul>
              <li>
                OS keychain/keystore for secrets; strict TLS for API calls;
                certificate pinning where appropriate.
              </li>
              <li>Scoped tokens and role-based API access.</li>
              <li>Regular SDK reviews and security updates.</li>
            </ul>

            <h3 className="mb-4">Platform disclosures</h3>
            <p>
              We publish <strong>Apple App Privacy</strong> labels and{" "}
              <strong>Google Play Data Safety</strong> disclosures. These
              summaries are for app store transparency and do not replace this
              notice. If there is any inconsistency, this notice prevails.
            </p>

            <div className="callout">
              <p>
                <strong>Cookies &amp; SDKs note:</strong> In our mobile Apps we
                use software development kits (SDKs) that serve similar purposes
                to cookies in browsers (analytics, diagnostics, messaging). SDKs
                do not place cookies but process data within the App
                environment.
              </p>
            </div>
          </section>

          <section className="section" id="changes">
            <h2 className="mb-4">Updates to this notice</h2>
            <p>
              We may update this notice from time to time. Please check back
              regularly. Material changes may be notified on our website and/or
              in-app.
            </p>
            <p className="muted">
              Version: 2.1 • Last updated: 18 September 2025
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
