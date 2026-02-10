import { useMemo } from "react";
import { dictionary } from "~/libs/aruco-dictionary";

interface ArUcoGridProps {
  markerId: number;
  grid?: boolean;
}

export function ArUcoGrid({ markerId, grid = false }: ArUcoGridProps) {
  const gridData = useMemo(() => {
    if (markerId >= dictionary.length) {
      return null;
    }

    const bytes = dictionary[markerId];
    const width = 4;
    const height = 4;
    const bitsCount = width * height;
    const bits: number[] = [];

    // Parse marker's bytes using the same logic as example.js
    for (const byte of bytes) {
      const start = bitsCount - bits.length;
      for (let i = Math.min(7, start - 1); i >= 0; i--) {
        bits.push((byte >> i) & 1);
      }
    }

    // Create 6x6 grid data (4x4 data area with black border)
    const grid: boolean[][] = [];
    for (let row = 0; row < 6; row++) {
      grid[row] = [];
      for (let col = 0; col < 6; col++) {
        // Border (outer ring) is always black
        if (row === 0 || row === 5 || col === 0 || col === 5) {
          grid[row][col] = false; // false = black
        } else {
          // For card number 0, show empty grid (all white)
          if (markerId === 0) {
            grid[row][col] = true; // true = white (empty)
          } else {
            // Inner 4x4 area uses the pattern
            const patternRow = row - 1;
            const patternCol = col - 1;
            const bitIndex = patternRow * height + patternCol;
            grid[row][col] = bits[bitIndex] === 1; // true = white, false = black
          }
        }
      }
    }

    return grid;
  }, [markerId]);

  if (!gridData) {
    return <div className="text-center text-red-500">Invalid marker ID</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <div className="grid grid-rows-[8%_1fr_8%] h-full aspect-square gap-[6%] p-[6%]">
        <div className="flex items-center justify-center">
          <A />
        </div>

        <div className="grid grid-cols-[8%_1fr_8%] gap-[6%]">
          <div className="flex items-center justify-center">
            <D />
          </div>

          <div
            className={`grid grid-cols-6 rounded-xl overflow-hidden bg-black/80 ${
              grid ? "gap-[1px] bg-black/80" : ""
            }`}
          >
            {gridData.map((row, rowIndex) =>
              row.map((isWhite, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square ${
                    isWhite
                      ? "bg-white"
                      : !grid ||
                        rowIndex === 0 ||
                        rowIndex === 5 ||
                        colIndex === 0 ||
                        colIndex === 5
                      ? "bg-black"
                      : "bg-white/30"
                  }`}
                />
              ))
            )}
          </div>

          <div className="flex items-center justify-center">
            <B />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <C />
        </div>
      </div>
    </div>
  );
}

const A = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 33 35"
    className="text-gray-500 w-full h-full max-w-full max-h-full"
    preserveAspectRatio="xMidYMid meet"
  >
    <path
      d="m6.926 35 2.88-8.608h13.126L25.829 35h6.75L20.272.091h-7.806L.176 35zm4.585-13.687L16.233 7.25h.272l4.722 14.063z"
      fill="currentColor"
    />
  </svg>
);

const B = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 35 27"
    className="text-gray-500 w-full h-full max-w-full max-h-full"
    preserveAspectRatio="xMidYMid meet"
  >
    <path
      d="M.011.523v14.13c0 7.995 4.074 11.915 9.512 11.915 5.284 0 8.386-3.75 8.573-7.466h.341c.801 3.41 3.188 6.103 7.432 6.103 5.199 0 9.051-3.75 9.051-11.318V.523zm5.284 6.324h10.228v6.971c0 3.904-2.387 6.324-5.506 6.324-2.778 0-4.722-1.909-4.722-6.494zm14.779 0h9.63v6.392c0 3.716-1.96 5.642-4.653 5.642-3.068 0-4.977-2.489-4.977-5.779z"
      fill="currentColor"
    ></path>
  </svg>
);

const C = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 37"
    className="text-gray-500 w-full h-full max-w-full max-h-full"
    preserveAspectRatio="xMidYMid meet"
  >
    <path
      d="M.557 24.222c1.074 7.755 7.04 12.255 14.778 12.255 9.12 0 15.988-6.647 15.988-17.931C31.323 7.279 24.54.614 15.335.614 7.034.614 1.528 5.984.557 12.648l6.375.034c.8-4.09 4.142-6.392 8.318-6.392 5.659 0 9.716 4.244 9.716 12.256 0 7.875-4.023 12.255-9.733 12.255-4.245 0-7.568-2.403-8.301-6.58z"
      fill="currentColor"
    ></path>
  </svg>
);

const D = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 29"
    className="text-gray-500 w-full h-full max-w-full max-h-full"
    preserveAspectRatio="xMidYMid meet"
  >
    <path
      d="M35.284 17.102C35.284 6.466 28.704.16 17.795.16 6.92.16.375 6.466.375 16.864v12.068h34.909zm-5.472 5.506H5.847v-5.386c0-7.091 3.954-10.79 11.948-10.79 8.029 0 12.017 3.699 12.017 10.977z"
      fill="currentColor"
    ></path>
  </svg>
);
