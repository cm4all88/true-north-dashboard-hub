
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
    <Card className="h-full bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-2xl">
          <Book className="h-6 w-6" />
          {comicData.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          <div className="w-full mb-4">
            <AspectRatio ratio={9 / 5} className="bg-gray-700 rounded-md overflow-hidden">
              <img 
                src={comicData.image} 
                alt="Comic of the Day" 
                className="w-full h-full object-contain bg-white p-2"
              />
            </AspectRatio>
          </div>
          <p className="text-center text-xl text-gray-300 font-medium">
            {comicData.caption}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
