import type { MetaFunction } from "@react-router/node";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Help & Support - DQR" },
    {
      name: "description",
      content:
        "Get help with DQR. Find answers to common questions and contact our support team.",
    },
  ];
};

export default function HelpPage() {
  return (
    <div className="container mx-auto">
      <Header />

      <div className="bg-white p-4 md:p-8 lg:p-12 rounded-2xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6">Help & Support</h1>

          <div className="bg-base-300 p-4 md:p-8 lg:p-12 rounded-2xl mb-8">
            <h5 className="mb-4">
              Have feedback or want to report a technical issue?
            </h5>
            <a
              href="https://form.typeform.com/to/lwviiIS2"
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Let us know
            </a>
          </div>

          <h2 className="mb-4">Frequently Asked Questions</h2>

          <section className="section" id="1">
            <h3 className="mb-4">Getting Started</h3>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="getting-started-accordion" />
              <div className="collapse-title text-lg font-medium">
                What is DQR?
              </div>
              <div className="collapse-content">
                <p>
                  DQR is a mobile app that allows teachers to quickly scan a
                  class of student's answers to multiple choice questions and
                  identify individual misconceptions using ArUco markers.
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="getting-started-accordion" />
              <div className="collapse-title text-lg font-medium">
                How do I get access to DQR?
              </div>
              <div className="collapse-content">
                <p>
                  DQR is currently in a closed pilot program. If you're
                  interested in joining our waitlist, please contact us at{" "}
                  <a href="mailto:dqr@eedi.co.uk" className="link link-primary">
                    dqr@eedi.co.uk
                  </a>
                  .
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="getting-started-accordion" />
              <div className="collapse-title text-lg font-medium">
                What do I need to use DQR?
              </div>
              <div className="collapse-content">
                <p>
                  You'll need the DQR mobile app and printed ArUco markers for
                  each student. The web companion allows you to project
                  questions on a screen or interactive whiteboard.
                </p>
              </div>
            </div>
          </section>

          <section className="section" id="2">
            <h3 className="mb-4">Using the Web App</h3>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="web-app-accordion" />
              <div className="collapse-title text-lg font-medium">
                How do I enter a quiz code?
              </div>
              <div className="collapse-content">
                <p>
                  Enter the 6-character quiz code in the input field on the
                  homepage and click the arrow button.
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="web-app-accordion" />
              <div className="collapse-title text-lg font-medium">
                Where do I find the quiz code?
              </div>
              <div className="collapse-content">
                <p>
                  The quiz code is displayed in the DQR mobile app when a
                  teacher starts a quiz session. Look for the 6-character code
                  at the top of the screen.
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="web-app-accordion" />
              <div className="collapse-title text-lg font-medium">
                What if the quiz code doesn't work?
              </div>
              <div className="collapse-content">
                <p>
                  Make sure you're entering the correct 6-character code. If it
                  still doesn't work, ask your teacher to restart the quiz
                  session or contact support.
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="web-app-accordion" />
              <div className="collapse-title text-lg font-medium">
                Can I use this on my phone?
              </div>
              <div className="collapse-content">
                <p>
                  Yes! The web app is mobile-friendly and works on phones,
                  tablets, and computers.
                </p>
              </div>
            </div>
          </section>

          <section className="section" id="3">
            <h3 className="mb-4">Technical Issues</h3>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="technical-accordion" />
              <div className="collapse-title text-lg font-medium">
                The page won't load
              </div>
              <div className="collapse-content">
                <p>
                  Check your internet connection and try refreshing the page. If
                  the problem persists, contact support.
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="technical-accordion" />
              <div className="collapse-title text-lg font-medium">
                QR code not displaying
              </div>
              <div className="collapse-content">
                <p>
                  Make sure you have a stable internet connection. The QR code
                  is generated in real-time and requires connectivity.
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="technical-accordion" />
              <div className="collapse-title text-lg font-medium">
                Questions not updating
              </div>
              <div className="collapse-content">
                <p>
                  The web app automatically updates when the teacher moves to
                  the next question. If it's not updating, try refreshing the
                  page.
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="technical-accordion" />
              <div className="collapse-title text-lg font-medium">
                Connection lost
              </div>
              <div className="collapse-content">
                <p>
                  If you see a "Connection lost" message, check your internet
                  connection and refresh the page to reconnect.
                </p>
              </div>
            </div>
          </section>

          <section className="section" id="4">
            <h3 className="mb-4">Account & Access</h3>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="account-accordion" />
              <div className="collapse-title text-lg font-medium">
                Do I need an account?
              </div>
              <div className="collapse-content">
                <p>
                  An account isn't need for the web app. Just enter the quiz
                  code provided to sync with the mobile app.
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="account-accordion" />
              <div className="collapse-title text-lg font-medium">
                How do I get teacher access?
              </div>
              <div className="collapse-content">
                <p>
                  Teacher access is currently limited to our pilot schools.
                  Contact us if you're interested in teacher access for your
                  school.
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="account-accordion" />
              <div className="collapse-title text-lg font-medium">
                Can students use this independently?
              </div>
              <div className="collapse-content">
                <p>
                  No, students cannot access the app. They need a teacher to
                  start the quiz session in the mobile app.
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="account-accordion" />
              <div className="collapse-title text-lg font-medium">
                How do I delete my account?
              </div>
              <div className="collapse-content">
                <p>
                  You can delete your account in the app settings or by emailing
                  us. For detailed instructions, see our{" "}
                  <a href="/help/delete-account" className="link link-primary">
                    account deletion guide
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          <section className="section" id="6">
            <h3 className="mb-4">Privacy & Data</h3>
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="privacy-accordion" />
              <div className="collapse-title text-lg font-medium">
                Is my data secure?
              </div>
              <div className="collapse-content">
                <p>
                  Yes, we take data security seriously. All data is encrypted
                  and we comply with UK data protection laws. See our{" "}
                  <a href="/privacy" className="link link-primary">
                    Privacy Policy
                  </a>{" "}
                  for more details.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
