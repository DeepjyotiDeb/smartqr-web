import { ArUcoGrid } from "../components/ArUcoGrid";
import { useState, useEffect } from "react";
import Shuffle from "../components/icons/Shuffle";

export function meta() {
  return [
    { title: "Test Class" },
    {
      name: "description",
      content: "Test class",
    },
  ];
}

export default function TestPage() {
  const [cardCount, setCardCount] = useState<number>(20);
  const [markerIds, setMarkerIds] = useState<number[]>([]);
  const [rotatedMarkers, setRotatedMarkers] = useState<Map<number, number>>(new Map());
  const [initialRotations, setInitialRotations] = useState<Map<number, number>>(new Map());
  const [markerPositions, setMarkerPositions] = useState<Map<number, { x: number; y: number }>>(new Map());
  const [dragging, setDragging] = useState<{ markerId: number; startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const [perspectiveOrigin, setPerspectiveOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 }); // Percentage values
  const [backgroundDragging, setBackgroundDragging] = useState<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const [hasDragged, setHasDragged] = useState<boolean>(false);
  const [activeLetters, setActiveLetters] = useState<string[]>([]);

  // Generate marker IDs based on card count
  useEffect(() => {
    const generateRandomMarkers = () => {
      const randomIds: number[] = [];
      const initialRotationsMap = new Map<number, number>();
      
      // Create array of all available marker IDs (1-20, cycling if needed)
      const availableIds = Array.from({ length: 20 }, (_, i) => i + 1);
      
      // Generate the requested number of cards, cycling through available IDs
      for (let i = 0; i < cardCount; i++) {
        const markerId = availableIds[i % availableIds.length];
        randomIds.push(markerId);
        
        // Generate random initial rotation (0°, 90°, 180°, or 270°)
        const randomRotation = Math.floor(Math.random() * 4) * 90;
        initialRotationsMap.set(markerId, randomRotation);
      }
      
      // Shuffle to randomize order
      const shuffledIds = randomIds.sort(() => Math.random() - 0.5);
      
      setMarkerIds(shuffledIds);
      setInitialRotations(initialRotationsMap);
    };

    generateRandomMarkers();
  }, [cardCount]);

  // Function to handle marker click and rotation
  const handleMarkerClick = (markerId: number) => {
    setRotatedMarkers(prev => {
      const newMap = new Map(prev);
      const currentRotation = newMap.get(markerId) || 0;
      const nextRotation = currentRotation - 90; // Rotate -90 degrees each click
      
      newMap.set(markerId, nextRotation);
      return newMap;
    });
  };

  // Function to handle button group clicks
  const handleButtonClick = (letter: string) => {
    if (letter === 'random') {
      // Randomize all markers and clear active letters
      const newInitialRotations = new Map<number, number>();
      markerIds.forEach(markerId => {
        const randomRotation = Math.floor(Math.random() * 4) * 90; // 0°, 90°, 180°, or 270°
        newInitialRotations.set(markerId, randomRotation);
      });
      setInitialRotations(newInitialRotations);
      setRotatedMarkers(new Map()); // Clear any individual rotations
      setActiveLetters([]); // Clear active letters
    } else {
      // Toggle letter in active letters
      const newActiveLetters = activeLetters.includes(letter) 
        ? activeLetters.filter(l => l !== letter) // Remove if present
        : [...activeLetters, letter]; // Add if not present
      
      setActiveLetters(newActiveLetters);
      
      if (newActiveLetters.length === 0) {
        // If no letters active, randomize all markers
        const newInitialRotations = new Map<number, number>();
        markerIds.forEach(markerId => {
          const randomRotation = Math.floor(Math.random() * 4) * 90; // 0°, 90°, 180°, or 270°
          newInitialRotations.set(markerId, randomRotation);
        });
        setInitialRotations(newInitialRotations);
        setRotatedMarkers(new Map());
      } else {
        // Distribute markers across remaining active letters
        const letterRotations: { [key: string]: number } = {
          'A': 0,    // No rotation
          'B': 270,   // 90° clockwise
          'C': 180,  // 180°
          'D': 90   // 270° clockwise (90° counter-clockwise)
        };
        
        const newInitialRotations = new Map<number, number>();
        const markersPerLetter = Math.floor(markerIds.length / newActiveLetters.length);
        const remainder = markerIds.length % newActiveLetters.length;
        
        let markerIndex = 0;
        newActiveLetters.forEach((activeLetter, letterIndex) => {
          const markersForThisLetter = markersPerLetter + (letterIndex < remainder ? 1 : 0);
          const rotation = letterRotations[activeLetter];
          
          for (let i = 0; i < markersForThisLetter; i++) {
            if (markerIndex < markerIds.length) {
              newInitialRotations.set(markerIds[markerIndex], rotation);
              markerIndex++;
            }
          }
        });
        
        setInitialRotations(newInitialRotations);
        setRotatedMarkers(new Map()); // Clear any individual rotations
      }
    }
  };

  // Function to handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent, markerId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentPosition = markerPositions.get(markerId) || { x: 0, y: 0 };
    setDragging({
      markerId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentPosition.x,
      initialY: currentPosition.y
    });
    setHasDragged(false); // Reset drag flag
  };

  // Function to handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    
    const deltaX = e.clientX - dragging.startX;
    const deltaY = e.clientY - dragging.startY;
    
    // Set drag flag if mouse has moved more than 5 pixels (prevents accidental drags)
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      setHasDragged(true);
    }
    
    // Constrain movement within viewable bounds (±200px)
    const newX = Math.max(-200, Math.min(200, dragging.initialX + deltaX));
    const newY = Math.max(-200, Math.min(200, dragging.initialY + deltaY));
    
    setMarkerPositions(prev => {
      const newMap = new Map(prev);
      newMap.set(dragging.markerId, { x: newX, y: newY });
      return newMap;
    });
  };

  // Function to handle mouse up for dragging
  const handleMouseUp = () => {
    setDragging(null);
    setBackgroundDragging(null);
  };

  // Function to handle background mouse down for perspective shifting
  const handleBackgroundMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setBackgroundDragging({
      startX: e.clientX,
      startY: e.clientY,
      initialX: perspectiveOrigin.x,
      initialY: perspectiveOrigin.y
    });
  };

  // Function to handle background mouse move for perspective shifting
  const handleBackgroundMouseMove = (e: MouseEvent) => {
    if (!backgroundDragging) return;
    
    const deltaX = e.clientX - backgroundDragging.startX;
    const deltaY = e.clientY - backgroundDragging.startY;
    
    // Convert mouse movement to perspective origin percentage
    // Scale factor: 0.1 means 100px mouse movement = 10% perspective change
    const scaleFactor = 0.1;
    const newX = Math.max(0, Math.min(100, backgroundDragging.initialX + deltaX * scaleFactor));
    const newY = Math.max(0, Math.min(100, backgroundDragging.initialY + deltaY * scaleFactor));
    
    setPerspectiveOrigin({ x: newX, y: newY });
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (dragging || backgroundDragging) {
      document.addEventListener('mousemove', dragging ? handleMouseMove : handleBackgroundMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', dragging ? handleMouseMove : handleBackgroundMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, backgroundDragging]);

  // Generate random perspective properties for each marker
  const getMarkerStyle = (index: number, markerId: number) => {
    // Create a pseudo-random but consistent seed based on index
    const seed = (index * 2 + 13) % 100;

    // Distance from viewer (affects scale and z-index)
    const distance = 0.5 + (seed / 100) * 0.5; // 0.4 to 0.8 (smaller range for better fit)

    // Random rotation for more realistic effect
    const rotationX = ((seed % 20) - 10) * 2; // -20 to 20 degrees
    const rotationY = (((seed * 3) % 20) - 10) * 2; // -20 to 20 degrees
    const rotationZ = (((seed * 5) % 20) - 10) * 1; // -10 to 10 degrees

    // Add initial rotation and click-based rotation
    const initialRotation = initialRotations.get(markerId) || 0;
    const clickRotation = rotatedMarkers.get(markerId) || 0;
    const totalRotation = initialRotation + clickRotation;

    // Random position offset for more natural placement
    const baseOffsetX = ((seed % 30) - 15) * 2; // -30 to 30px
    const baseOffsetY = (((seed * 2) % 30) - 15) * 2; // -30 to 30px
    
    // Add drag position offset
    const dragPosition = markerPositions.get(markerId) || { x: 0, y: 0 };
    const offsetX = baseOffsetX + dragPosition.x;
    const offsetY = baseOffsetY + dragPosition.y;

    return {
      transform: `
        perspective(1000px) 
        translate3d(${offsetX}px, ${offsetY}px, ${(1 - distance) * 30}px) 
        scale(${distance}) 
        rotateX(${rotationX}deg) 
        rotateY(${rotationY}deg) 
        rotateZ(${rotationZ + totalRotation}deg)
      `,
      zIndex: Math.floor(distance * 100),
      transition: dragging?.markerId === markerId ? 'none' : 'transform 0.3s ease', // No transition when dragging
    };
  };

  return (
    <div 
      className="min-h-screen overflow-y-auto relative"
      style={{
        backgroundImage: 'url(/class.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div
        className="relative w-full min-h-screen cursor-grab select-none flex items-center justify-center"
        style={{
          perspective: "1000px",
          perspectiveOrigin: `${perspectiveOrigin.x}% ${perspectiveOrigin.y}%`,
        }}
        onMouseDown={handleBackgroundMouseDown}
      >
         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 items-center justify-center">
           {markerIds.map((markerId, index) => (
             <div
               key={`${markerId}-${index}`}
               className={`relative hover:scale-110 cursor-pointer select-none ${
                 dragging?.markerId === markerId ? 'cursor-grabbing' : 'cursor-grab'
               }`}
               style={getMarkerStyle(index, markerId)}
               onMouseDown={(e) => handleMouseDown(e, markerId)}
               onClick={(e) => {
                 // Only rotate if not dragging and no drag occurred
                 if (!dragging && !hasDragged) {
                   handleMarkerClick(markerId);
                 }
               }}
             >
               <ArUcoGrid key={markerId} markerId={markerId} />
             </div>
           ))}
        </div>

        <div className="fixed top-2 right-2 flex flex-col gap-2 z-[100]">
          <div className="flex">
            <div className="flex">
              <button
                onClick={() => handleButtonClick('A')}
                className={`px-3 py-2 text-sm font-medium transition-all ${
                  activeLetters.includes('A')
                    ? 'bg-black/20 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                } rounded-l-lg border-r border-white/10`}
              >
                A
              </button>
              <button
                onClick={() => handleButtonClick('B')}
                className={`px-3 py-2 text-sm font-medium transition-all ${
                  activeLetters.includes('B')
                    ? 'bg-black/20 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                } border-r border-white/10`}
              >
                B
              </button>
              <button
                onClick={() => handleButtonClick('C')}
                className={`px-3 py-2 text-sm font-medium transition-all ${
                  activeLetters.includes('C')
                    ? 'bg-black/20 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                } border-r border-white/10`}
              >
                C
              </button>
              <button
                onClick={() => handleButtonClick('D')}
                className={`px-3 py-2 text-sm font-medium transition-all ${
                  activeLetters.includes('D')
                    ? 'bg-black/20 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                } rounded-r-lg`}
              >
                D
              </button>
            </div>
            
            <button
              onClick={() => handleButtonClick('random')}
              className={`ml-2 px-3 py-2 rounded-lg text-sm font-medium transition-all bg-white/20 text-white hover:bg-white/30`}
            >
              <Shuffle />
            </button>

            <div className="ml-2 flex flex-col items-center justify-center">
              <button
                onClick={() => setCardCount(prev => Math.min(50, prev + 1))}
                disabled={cardCount >= 50}
                className="px-2 py-1 rounded-t-lg text-xs font-medium transition-all bg-white/20 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed leading-none"
              >
                +
              </button>
              <button
                onClick={() => setCardCount(prev => Math.max(1, prev - 1))}
                disabled={cardCount <= 1}
                className="px-2 py-1 rounded-b-lg text-xs font-medium transition-all bg-white/20 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed leading-none"
              >
                −
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
