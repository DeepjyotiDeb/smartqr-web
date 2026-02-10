import { useEffect, useState } from "react";

import QRCode from "qrcode";
import { useNavigate } from "react-router";
import { useQuizQrNew } from "~/libs/api/AssignmentApi";
import { useQrSse } from "~/libs/hooks/useQrSse";
import ReloadSvg from "~/components/ReloadSvg";
import ScreenShareIcon from "~/components/icons/ScreenShareIcon";
import Arrow from "~/components/icons/Arrow";
import Footer from "~/components/Footer";
import Header from "~/components/Header";

export function meta() {
  return [
    { title: "DQR - Real-time Diagnostic Question Scanning" },
    {
      name: "description",
      content: "Scan or enter a code to access your maths diagnostic quiz.",
    },
  ];
}

export default function PublicAssignmentForm() {
  const [assignmentId, setAssignmentId] = useState("");
  const { qrCode, error, isLoading, mutate: refetch } = useQuizQrNew();
  const {
    connectionStatus,
    encodedAssignmentId,
    error: sseError,
  } = useQrSse({ uuid: qrCode });
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") refetch();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refetch]);

  useEffect(() => {
    if (!qrCode) return;
    QRCode.toDataURL(qrCode, { width: 320, margin: 0 }, (err, url) => {
      if (!err && url) setQrCodeUrl(url);
    });
  }, [qrCode]);

  useEffect(() => {
    if (encodedAssignmentId) {
      navigate(`${encodedAssignmentId}`, { viewTransition: true });
    }
  }, [encodedAssignmentId, navigate]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (assignmentId.trim()) {
      navigate(`${assignmentId}`);
    }
  }

  const showRetry = connectionStatus === "closed" || sseError;
  return (
    <>
      <div className="container max-w-6xl mx-auto px-4">
        <Header />
        <div className="bg-primary rounded-2xl mb-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="lg:w-2/3">
              <div className="p-8 lg:p-12">
                <form onSubmit={handleSubmit} className="w-full mb-4">
                  <h3 className="mb-4 text-center text-gray-200 text-lg md:text-xl">
                    Enter your quiz code
                  </h3>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 md:pl-8 flex items-center pointer-events-none text-slate-600">
                      <ScreenShareIcon
                        className="z-10 md:w-12 md:h-12"
                        width={32}
                        height={32}
                      />
                    </div>

                    <input
                      type="text"
                      className="input input-primary w-full h-16 md:h-20 lg:h-24 text-2xl md:text-4xl lg:text-5xl pl-16 md:pl-24 pr-16 md:pr-20 rounded-2xl text-center font-semibold bg-slate-200 border-slate-400/50"
                      placeholder="ABCDEF"
                      value={assignmentId}
                      onChange={(e) => setAssignmentId(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="absolute inset-y-0 right-0 my-1 md:my-2 mr-1 md:mr-2 btn btn-primary h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 flex items-center justify-center rounded-xl z-10"
                      aria-label="Go"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 12h14M13 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
                <p className="text-gray-300 text-center text-sm md:text-base mb-0">
                  Start a quiz and enter the quiz code to present it to the
                  class
                </p>
              </div>
            </div>
            <div className="divider divider-vertical lg:divider-horizontal text-gray-300 px-4">
              OR
            </div>
            <div className="lg:w-1/3">
              <div className="card p-8 lg:p-12 h-full">
                <div className="flex flex-col items-center text-center space-y-4 h-full justify-center">
                  <h3 className="text-gray-200 text-lg md:text-xl">
                    Scan the code
                  </h3>
                  <div className="p-4 bg-white rounded-xl relative flex-shrink-0">
                    {isLoading || !qrCodeUrl ? (
                      <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center">
                        <div className="loading loading-spinner text-primary"></div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={qrCodeUrl}
                          alt="QR Code for Assignment Access"
                          className={`w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 ${
                            showRetry ? "blur-sm brightness-75" : ""
                          }`}
                        />
                        {showRetry && (
                          <button
                            type="button"
                            className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                            onClick={refetch}
                          >
                            {isLoading ? (
                              <div className="loading loading-spinner" />
                            ) : (
                              <ReloadSvg className="cursor-pointer" />
                            )}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 lg:p-12 mb-6 overflow-hidden">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
              <div className="w-48 md:w-60 md:-mb-12">
                <img
                  src="/screenshot.png"
                  alt="Example quiz code"
                  className="rounded-t-3xl shadow-2xl w-full"
                />
              </div>

              <div className="flex-1 space-y-3 relative">
                <div className="absolute -left-8 md:-left-14 top-8 transform -translate-y-1/2 text-primary -rotate-10 hidden md:block">
                  <Arrow height={40} width={40} className="md:h-12 md:w-12" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-4">
                  How to find the quiz code
                </h3>
                <div className="text-base md:text-lg">
                  <span className="font-semibold text-blue-600">1.</span> View
                  an assigned quiz in the DQR mobile app
                </div>
                <div className="text-base md:text-lg">
                  <span className="font-semibold text-blue-600">2.</span> Look
                  for a six digit (letters and numbers) code on the top right
                </div>
                <div className="text-base md:text-lg mb-4">
                  <span className="font-semibold text-blue-600">3.</span> Enter
                  the code above or click and scan the QR code
                </div>

                <a href="/help" className="btn btn-sm md:btn-md">
                  Need more help?
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="bg-[#6567E4] rounded-2xl p-8 lg:p-12 text-center h-120 md:h-175 overflow-hidden">
            <h3 className="text-white mb-4 md:mb-6 text-sm md:text-base lg:text-lg">
              Browse ready-made, high quality maths diagnostic questions
            </h3>
            <img
              src="/question.png"
              alt="Question"
              className="shadow-xl rounded-3xl w-full max-w-xs mx-auto"
            />
          </div>

          <div className="bg-[#0DC18A] rounded-2xl p-8 lg:p-12 text-center h-120 md:h-175 overflow-hidden">
            <h3 className="text-white mb-4 md:mb-6 text-sm md:text-base lg:text-lg">
              Sync with a display to present to the class
            </h3>
            <img
              src="/present.png"
              alt="Display"
              className="shadow-xl rounded-1xl w-full max-w-xs mx-auto"
            />
            <div className="flex justify-center m-2 md:m-3 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="lucide lucide-arrow-up-down-icon lucide-arrow-up-down md:w-8 md:h-8"
                viewBox="0 0 24 24"
              >
                <path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16"></path>
              </svg>
            </div>
            <img
              src="/question.png"
              alt="Question"
              className="shadow-xl rounded-3xl w-full max-w-xs mx-auto"
            />
          </div>

          <div className="bg-[#E68CA4] rounded-2xl p-8 lg:p-12 text-center h-120 md:h-175 overflow-hidden">
            <h3 className="text-white mb-4 md:mb-6 text-sm md:text-base lg:text-lg">
              Use your phone's camera to collect answers in real-time
            </h3>
            <img
              src="/scan.png"
              alt="Scan"
              className="shadow-xl rounded-3xl w-full max-w-xs mx-auto"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 lg:p-12 overflow-hidden">
          <div className="flex flex-col items-center justify-center">
            <h3 className="font-bold text-lg mb-4 text-center max-w-xs">
              Interested trying DQR or working with us?
            </h3>
            <a
              className="btn btn-primary"
              href="https://form.typeform.com/to/Eg4Ohjhy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tell us more about you
            </a>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
