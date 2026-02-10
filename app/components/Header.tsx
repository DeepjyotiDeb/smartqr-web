import { useState } from "react";
import Logo from "~/components/Logo";

export default function Header() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center py-4">
        <a
          href="/"
          className="group flex items-center justify-center bg-primary rounded-2xl p-3 h-14 w-14 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:rotate-3 relative overflow-hidden"
        >
          <Logo
            className="w-10 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
            color="white"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div className="absolute inset-0 bg-primary/50 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </a>
        <button onClick={() => setShowModal(true)} className="btn">
          Get the app
        </button>
      </div>

      <dialog className={`modal ${showModal ? "modal-open" : ""}`}>
        <div className="modal-box flex flex-col items-center justify-center relative">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost"
            aria-label="Close modal"
          >
            ✕
          </button>
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
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowModal(false)}>close</button>
        </form>
      </dialog>
    </>
  );
}
