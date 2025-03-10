import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Search } from "lucide-react";

interface FlowerProfile {
  id: string;
  name: string;
  image: string;
  color?: string;
}

interface FlowerProfileSelectionProps {
  onProfileSelect?: (profile: FlowerProfile) => void;
  onBack?: () => void;
}

const FlowerProfileSelection = ({
  onProfileSelect = () => {},
  onBack = () => {},
}: FlowerProfileSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const profiles: FlowerProfile[] = [
    {
      id: "1",
      name: "Carnation",
      image:
        "https://images.unsplash.com/photo-1588671782819-afa25eb791be?w=200&q=80",
      color: "bg-white",
    },
    {
      id: "2",
      name: "Orchid",
      image:
        "https://images.unsplash.com/photo-1566907225472-514215c9e5fd?w=200&q=80",
      color: "bg-emerald-700",
    },
    {
      id: "3",
      name: "Hortensia",
      image:
        "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=200&q=80",
      color: "bg-emerald-700",
    },
    {
      id: "4",
      name: "Sunflowers",
      image:
        "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=200&q=80",
      color: "bg-emerald-700",
    },
    {
      id: "5",
      name: "Mum",
      image:
        "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=200&q=80",
      color: "bg-white",
    },
    {
      id: "6",
      name: "Peony",
      image:
        "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=200&q=80",
      color: "bg-emerald-700",
    },
    {
      id: "7",
      name: "Lily",
      image:
        "https://images.unsplash.com/photo-1588625500633-a0cd518f0f60?w=200&q=80",
      color: "bg-emerald-700",
    },
    {
      id: "8",
      name: "Tulips",
      image:
        "https://images.unsplash.com/photo-1589994160839-163cd867cfe8?w=200&q=80",
      color: "bg-white",
    },
    {
      id: "9",
      name: "Gerbera",
      image:
        "https://images.unsplash.com/photo-1596437956789-8612b954a3f1?w=200&q=80",
      color: "bg-white",
    },
  ];

  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleProfileSelect = (profile: FlowerProfile) => {
    setSelectedProfile(profile.id);
  };

  const handleNext = () => {
    const profile = profiles.find((p) => p.id === selectedProfile);
    if (profile) {
      onProfileSelect(profile);
    }
  };

  return (
    <div className="w-full h-full max-w-md mx-auto bg-white overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex-1 flex justify-center">
            <div className="w-32 h-1 bg-gray-200 rounded-full flex items-center">
              <div className="w-1/3 h-1 bg-emerald-700 rounded-full"></div>
            </div>
          </div>
          <div className="w-9"></div> {/* Spacer to balance the back button */}
        </div>

        <h1 className="text-2xl font-serif text-emerald-800 mb-6">
          Your favorite flowers
        </h1>

        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search for flowers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-10 py-2 rounded-lg border-gray-200 bg-gray-50 text-sm"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {filteredProfiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleProfileSelect(profile)}
              className={`relative rounded-lg overflow-hidden aspect-square ${profile.color || "bg-white"} ${selectedProfile === profile.id ? "ring-2 ring-purple-500" : ""}`}
            >
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-1 text-xs text-center">
                {profile.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        <Button
          onClick={handleNext}
          disabled={!selectedProfile}
          className="w-full h-12 rounded-lg bg-purple-400 hover:bg-purple-500 text-white font-medium"
        >
          NEXT
        </Button>
      </div>
    </div>
  );
};

export default FlowerProfileSelection;
