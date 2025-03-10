import React, { useState } from "react";
import { Share2, Heart, BookmarkPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface DailyQuoteProps {
  quote?: string;
  author?: string;
  backgroundImage?: string;
}

const DailyQuote = ({
  quote = "The future belongs to those who believe in the beauty of their dreams.",
  author = "Eleanor Roosevelt",
  backgroundImage = "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
}: DailyQuoteProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="w-[350px] h-[200px] overflow-hidden relative bg-white">
      <div
        className="absolute inset-0 opacity-20 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-lg font-medium text-purple-800">
          Daily Inspiration
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="text-base italic text-gray-700 font-medium">"{quote}"</p>
        <p className="text-sm text-gray-500 mt-2">— {author}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-full p-2 h-8 w-8"
          onClick={() =>
            window.alert("Share functionality would be implemented here")
          }
        >
          <Share2 size={16} />
          <span className="sr-only">Share quote</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-full p-2 h-8 w-8"
          onClick={() =>
            window.alert(
              "Save to favorites functionality would be implemented here",
            )
          }
        >
          <BookmarkPlus size={16} />
          <span className="sr-only">Save to favorites</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-full p-2 h-8 w-8",
            isFavorite
              ? "text-red-500 hover:text-red-600 hover:bg-red-50"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50",
          )}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          <span className="sr-only">Like quote</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyQuote;
