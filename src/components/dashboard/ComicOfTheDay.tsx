
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Book } from "lucide-react";

// This would typically be fetched from an API, but we'll use a static image for now
const comicData = {
  title: "Comic of the Day",
  image: "/lovable-uploads/1485827404703-89b55fcc595e.png", // Using a placeholder image
  caption: "Sometimes technology has a mind of its own!"
};

export function ComicOfTheDay() {
  return (
    <Card className="h-full bg-gray-800 flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Book className="h-5 w-5" />
          {comicData.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex-1 flex flex-col min-h-0">
        <div className="flex flex-col items-center h-full">
          <div className="w-full mb-2 flex-1 min-h-0">
            <AspectRatio ratio={9 / 5} className="bg-gray-700 rounded-md overflow-hidden h-full">
              <img 
                src={comicData.image} 
                alt="Comic of the Day" 
                className="w-full h-full object-contain bg-white p-1"
              />
            </AspectRatio>
          </div>
          <p className="text-center text-sm text-gray-300 font-medium flex-shrink-0">
            {comicData.caption}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
