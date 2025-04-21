
import React from "react";
import { Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const accomplishments = [
  {
    id: 1,
    text: "Completed downtown Seattle survey ahead of schedule",
    date: "Apr 21",
  },
  {
    id: 2,
    text: "Successful completion of Bellevue project",
    date: "Apr 20",
  },
  {
    id: 3,
    text: "New equipment training completed by entire field crew",
    date: "Apr 19",
  },
];

export const Accomplishments = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-truenorth-700 text-lg">
          <Trophy className="h-4 w-4" />
          Recent Accomplishments
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="space-y-2">
          {accomplishments.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-start p-2 bg-blue-50 dark:bg-truenorth-900/50 rounded-lg"
            >
              <p className="text-truenorth-700 flex-1 text-sm">{item.text}</p>
              <span className="text-xs text-truenorth-500 ml-4">{item.date}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
