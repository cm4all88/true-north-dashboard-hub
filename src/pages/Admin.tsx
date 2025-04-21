
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrueNorthLogo } from '@/components/TrueNorthLogo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, X, Plus, Save } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Admin = () => {
  const navigate = useNavigate();
  // State for crew schedule
  const [crewSchedule, setCrewSchedule] = useState({
    Monday: ['Alex Johnson', 'Maria Garcia', 'Darnell Williams'],
    Tuesday: ['Beth Chen', 'Omar Patel', 'Sarah Kim'],
    Wednesday: ['James Wilson', 'Maria Garcia', 'Darnell Williams'],
    Thursday: ['Beth Chen', 'Omar Patel', 'Alex Johnson'],
    Friday: ['James Wilson', 'Sarah Kim', 'Omar Patel'],
  });
  
  // State for birthdays
  const [birthdays, setBirthdays] = useState([
    { name: 'Alex Johnson', date: new Date('2023-04-15') },
    { name: 'Maria Garcia', date: new Date('2023-04-22') },
    { name: 'James Wilson', date: new Date('2023-04-30') },
    { name: 'Beth Chen', date: new Date('2023-05-05') },
    { name: 'Omar Patel', date: new Date('2023-05-17') },
  ]);
  
  // State for the current birthday being edited
  const [newBirthday, setNewBirthday] = useState({ name: '', date: new Date() });
  
  // State for shoutouts
  const [shoutouts, setShoutouts] = useState([
    { 
      id: 1, 
      text: "Shoutout to Mike for helping on the Saturday rush job!", 
      from: "Sarah Kim",
      date: new Date('2023-04-18')
    },
    { 
      id: 2, 
      text: "Thanks to Beth for staying late to finish the downtown project documentation!",
      from: "James Wilson", 
      date: new Date('2023-04-17') 
    },
    { 
      id: 3, 
      text: "Kudos to the entire field team for completing the Westlake survey ahead of schedule.", 
      from: "Omar Patel",
      date: new Date('2023-04-15') 
    },
  ]);
  
  // State for the current shoutout being created
  const [newShoutout, setNewShoutout] = useState({ text: '', from: '' });
  
  // State for tracking crew edits
  const [editingDay, setEditingDay] = useState('');
  const [crewMember, setCrewMember] = useState('');
  
  // Handle crew schedule updates
  const handleAddCrewMember = (day) => {
    if (crewMember.trim() === '') return;
    
    setCrewSchedule(prevSchedule => ({
      ...prevSchedule,
      [day]: [...prevSchedule[day], crewMember]
    }));
    setCrewMember('');
  };
  
  const handleRemoveCrewMember = (day, index) => {
    setCrewSchedule(prevSchedule => ({
      ...prevSchedule,
      [day]: prevSchedule[day].filter((_, i) => i !== index)
    }));
  };
  
  // Handle birthday updates
  const handleAddBirthday = () => {
    if (newBirthday.name.trim() === '') return;
    
    setBirthdays(prev => [...prev, { ...newBirthday }]);
    setNewBirthday({ name: '', date: new Date() });
  };
  
  const handleRemoveBirthday = (index) => {
    setBirthdays(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle shoutout updates
  const handleAddShoutout = () => {
    if (newShoutout.text.trim() === '' || newShoutout.from.trim() === '') return;
    
    const newId = shoutouts.length > 0 
      ? Math.max(...shoutouts.map(s => s.id)) + 1 
      : 1;
    
    setShoutouts(prev => [
      { 
        id: newId, 
        text: newShoutout.text, 
        from: newShoutout.from, 
        date: new Date() 
      },
      ...prev
    ]);
    
    setNewShoutout({ text: '', from: '' });
  };
  
  const handleRemoveShoutout = (id) => {
    setShoutouts(prev => prev.filter(shoutout => shoutout.id !== id));
  };
  
  // Save all changes
  const handleSaveChanges = () => {
    // Here you would save all the data to your backend
    alert('Changes saved!');
    
    // In a real app, you would use an API call:
    // const saveData = async () => {
    //   try {
    //     await Promise.all([
    //       fetch('/api/crew-schedule', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(crewSchedule)
    //       }),
    //       fetch('/api/birthdays', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(birthdays)
    //       }),
    //       fetch('/api/shoutouts', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(shoutouts)
    //       })
    //     ]);
    //     alert('Changes saved successfully!');
    //   } catch (error) {
    //     console.error('Error saving data:', error);
    //     alert('Error saving changes');
    //   }
    // };
    // saveData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <TrueNorthLogo />
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              View Dashboard
            </Button>
            <Button onClick={handleSaveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save All Changes
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-truenorth-700 mb-6">Dashboard Administration</h1>
        
        <Tabs defaultValue="crew">
          <TabsList className="mb-6">
            <TabsTrigger value="crew">Crew Schedule</TabsTrigger>
            <TabsTrigger value="birthdays">Birthdays</TabsTrigger>
            <TabsTrigger value="shoutouts">Shoutouts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="crew">
            <Card>
              <CardHeader>
                <CardTitle>Manage Crew Schedule</CardTitle>
                <CardDescription>
                  Update the field crew assignments for each day of the work week.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {Object.entries(crewSchedule).map(([day, crew]) => (
                    <Card key={day} className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{day}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {crew.map((member, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <span>{member}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveCrewMember(day, index)}
                              >
                                <X className="h-4 w-4 text-gray-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        {editingDay === day ? (
                          <div className="flex gap-2">
                            <Input 
                              value={crewMember} 
                              onChange={(e) => setCrewMember(e.target.value)}
                              placeholder="Crew member name"
                              className="flex-1"
                            />
                            <Button 
                              onClick={() => {
                                handleAddCrewMember(day);
                                setEditingDay('');
                              }}
                              size="sm"
                            >
                              Add
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full" 
                            onClick={() => setEditingDay(day)}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Crew Member
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="birthdays">
            <Card>
              <CardHeader>
                <CardTitle>Manage Birthdays</CardTitle>
                <CardDescription>
                  Add, edit, or remove employee birthdays for the dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {birthdays.map((birthday, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white border rounded-md">
                      <div className="flex-1">{birthday.name}</div>
                      <div className="flex-1 text-gray-500">
                        {format(birthday.date, "MMMM d")}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveBirthday(index)}
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col space-y-4">
                  <h3 className="text-md font-medium">Add New Birthday</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Input
                        placeholder="Employee Name"
                        value={newBirthday.name}
                        onChange={(e) => setNewBirthday({...newBirthday, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newBirthday.date ? (
                              format(newBirthday.date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto">
                          <Calendar
                            mode="single"
                            selected={newBirthday.date}
                            onSelect={(date) => setNewBirthday({...newBirthday, date: date || new Date()})}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <Button onClick={handleAddBirthday} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add Birthday
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shoutouts">
            <Card>
              <CardHeader>
                <CardTitle>Manage Shoutouts</CardTitle>
                <CardDescription>
                  Add or remove employee recognition messages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {shoutouts.map((shoutout) => (
                    <div 
                      key={shoutout.id} 
                      className="flex justify-between items-start p-4 bg-white border rounded-md"
                    >
                      <div className="flex-1">
                        <p className="mb-1">{shoutout.text}</p>
                        <div className="text-sm text-gray-500">
                          From: {shoutout.from} | {format(shoutout.date, "MMMM d, yyyy")}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveShoutout(shoutout.id)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Add New Shoutout</h3>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Write a shoutout message..."
                      value={newShoutout.text}
                      onChange={(e) => setNewShoutout({...newShoutout, text: e.target.value})}
                      rows={3}
                    />
                    <Input
                      placeholder="From (Your Name)"
                      value={newShoutout.from}
                      onChange={(e) => setNewShoutout({...newShoutout, from: e.target.value})}
                    />
                    <Button onClick={handleAddShoutout} className="w-full md:w-auto">
                      <Plus className="mr-2 h-4 w-4" /> Add Shoutout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
