import { useState } from "react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { ArUcoGrid } from "../components/ArUcoGrid";

export function meta() {
  return [
    { title: "DQR - Make your own card" },
    {
      name: "description",
      content:
        "Find a student number and create your own card with this interactive reference tool.",
    },
  ];
}


export default function BlanksPage() {
  const [markerId, setMarkerId] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("0");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 999) {
      setMarkerId(numValue);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto">
      <Header />

      <div className="text-center mb-6">
        <label
          htmlFor="marker-id"
          className="block text-lg font-semibold text-gray-700 mb-4"
        >
          Card number:
        </label>
        <input
          id="marker-id"
          type="number"
          min="0"
          max="999"
          value={inputValue}
          onChange={handleInputChange}
          className="input input-bordered w-32 text-center text-xl font-mono"
          placeholder="0"
        />
      </div>

      <div className="p-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center">
            <ArUcoGrid markerId={markerId} grid={true} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
