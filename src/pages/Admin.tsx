
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrueNorthLogo } from '@/components/TrueNorthLogo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, X, Plus, Save, Edit2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";

const Admin = () => {
  const navigate = useNavigate();
  
  // State for birthdays
  const [birthdays, setBirthdays] = useState([
    { name: 'Alex Johnson', date: new Date('2023-04-15') },
    { name: 'Maria Garcia', date: new Date('2023-04-22') },
    { name: 'James Wilson', date: new Date('2023-04-30') },
    { name: 'Beth Chen', date: new Date('2023-05-05') },
    { name: 'Omar Patel', date: new Date('2023-05-17') },
  ]);
  
  const [newBirthday, setNewBirthday] = useState({ name: '', date: new Date() });
  
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
  
  const [newShoutout, setNewShoutout] = useState({ text: '', from: '' });
  
  // State for crew schedule
  const [scheduleData, setScheduleData] = useState([
    {
      weekOf: "May 12 - May 16, 2025",
      days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      dates: ["5/12/2025", "5/13/2025", "5/14/2025", "5/15/2025", "5/16/2025"],
      crews: [
        {
          position: "TIM",
          name: "SHAUN",
          schedule: [
            { jobCode: "j18-18", description: "test" },
            { jobCode: "j18-18", description: "test" },
            { jobCode: "j18-183", description: "test" },
            { jobCode: "j18-184", description: "test" },
            { jobCode: "j18-185", description: "test" },
          ]
        },
        {
          position: "TAYLOR",
          name: "GERRY",
          schedule: [
            { jobCode: "j19-18", description: "test" },
            { jobCode: "j19-18", description: "test" },
            { jobCode: "j19-183", description: "test" },
            { jobCode: "j19-184", description: "test" },
            { jobCode: "j19-185", description: "test" },
          ]
        },
        {
          position: "DOMINIC",
          name: "SERGIO",
          schedule: [
            { jobCode: "j20-11", description: "test" },
            { jobCode: "j20-11", description: "test" },
            { jobCode: "j20-113", description: "test" },
            { jobCode: "j20-114", description: "test" },
            { jobCode: "j20-115", description: "test" },
          ]
        },
        {
          position: "OFF",
          name: "",
          schedule: [
            { jobCode: "", description: "" },
            { jobCode: "", description: "" },
            { jobCode: "", description: "" },
            { jobCode: "", description: "" },
            { jobCode: "", description: "" },
          ]
        },
      ]
    },
    {
      weekOf: "May 19 - May 23, 2025",
      days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      dates: ["5/19/2025", "5/20/2025", "5/21/2025", "5/22/2025", "5/23/2025"],
      crews: [
        {
          position: "TIM",
          name: "SHAUN",
          schedule: [
            { jobCode: "j18-22", description: "test" },
            { jobCode: "j18-23", description: "test" },
            { jobCode: "j18-24", description: "test" },
            { jobCode: "j18-25", description: "test" },
            { jobCode: "j18-26", description: "test" },
          ]
        },
        {
          position: "TAYLOR",
          name: "GERRY",
          schedule: [
            { jobCode: "j19-22", description: "test" },
            { jobCode: "j19-23", description: "test" },
            { jobCode: "j19-24", description: "test" },
            { jobCode: "j19-25", description: "test" },
            { jobCode: "j19-26", description: "test" },
          ]
        },
        {
          position: "DOMINIC",
          name: "SERGIO",
          schedule: [
            { jobCode: "j20-22", description: "test" },
            { jobCode: "j20-23", description: "test" },
            { jobCode: "j20-24", description: "test" },
            { jobCode: "j20-25", description: "test" },
            { jobCode: "j20-26", description: "test" },
          ]
        },
        {
          position: "OFF",
          name: "",
          schedule: [
            { jobCode: "", description: "" },
            { jobCode: "", description: "" },
            { jobCode: "", description: "" },
            { jobCode: "", description: "" },
            { jobCode: "", description: "" },
          ]
        },
      ]
    }
  ]);
  
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  
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
  
  // Handle crew schedule editing
  const handleCellEdit = (weekIndex: number, crewIndex: number, dayIndex: number | null, field: 'jobCode' | 'description' | 'position' | 'name') => {
    const cellId = dayIndex !== null 
      ? `${weekIndex}-${crewIndex}-${dayIndex}-${field}`
      : `${weekIndex}-${crewIndex}-crew-${field}`;
    
    let currentValue = '';
    if (field === 'position' || field === 'name') {
      currentValue = scheduleData[weekIndex].crews[crewIndex][field];
    } else if (dayIndex !== null) {
      currentValue = scheduleData[weekIndex].crews[crewIndex].schedule[dayIndex][field];
    }
    
    setEditingCell(cellId);
    setEditValue(currentValue);
  };
  
  const handleSaveEdit = (weekIndex: number, crewIndex: number, dayIndex: number | null, field: 'jobCode' | 'description' | 'position' | 'name') => {
    const newScheduleData = [...scheduleData];
    
    if (field === 'position' || field === 'name') {
      newScheduleData[weekIndex].crews[crewIndex][field] = editValue;
    } else if (dayIndex !== null) {
      newScheduleData[weekIndex].crews[crewIndex].schedule[dayIndex][field] = editValue;
    }
    
    setScheduleData(newScheduleData);
    setEditingCell(null);
    setEditValue('');
  };
  
  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };
  
  // Save all changes
  const handleSaveChanges = () => {
    // Here you would save all the data to your backend
    alert('Changes saved!');
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
        
        <Tabs defaultValue="schedule">
          <TabsList className="mb-6">
            <TabsTrigger value="schedule">Crew Schedule</TabsTrigger>
            <TabsTrigger value="birthdays">Birthdays</TabsTrigger>
            <TabsTrigger value="shoutouts">Shoutouts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Manage Crew Schedule</CardTitle>
                <CardDescription>
                  Edit the crew schedule that appears on the main dashboard. Click on any cell to edit it, including crew names and positions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {scheduleData.map((weekData, weekIndex) => (
                    <div key={weekIndex}>
                      <h3 className="text-lg font-semibold mb-3">{weekData.weekOf}</h3>
                      <Table className="border-collapse border border-gray-300">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="border border-gray-300 bg-gray-100">Crew</TableHead>
                            {weekData.days.map((day, index) => (
                              <TableHead key={day + index} className="border border-gray-300 bg-gray-100 text-center">
                                {day}
                                <div className="text-xs text-gray-500">{weekData.dates[index]}</div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {weekData.crews.map((crew, crewIndex) => (
                            <TableRow key={`${weekIndex}-${crew.position}-${crewIndex}`}>
                              <TableCell className="border border-gray-300 font-medium">
                                {/* Position */}
                                {editingCell === `${weekIndex}-${crewIndex}-crew-position` ? (
                                  <div className="flex items-center gap-2 mb-2">
                                    <Input
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="text-sm font-bold"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleSaveEdit(weekIndex, crewIndex, null, 'position');
                                        } else if (e.key === 'Escape') {
                                          handleCancelEdit();
                                        }
                                      }}
                                      autoFocus
                                    />
                                    <Button size="sm" onClick={() => handleSaveEdit(weekIndex, crewIndex, null, 'position')}>
                                      <Save className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div 
                                    className="cursor-pointer hover:bg-gray-100 p-1 rounded flex items-center gap-1 font-bold mb-2"
                                    onClick={() => handleCellEdit(weekIndex, crewIndex, null, 'position')}
                                  >
                                    <span>{crew.position}</span>
                                    <Edit2 className="h-3 w-3 text-gray-400" />
                                  </div>
                                )}
                                
                                {/* Name */}
                                {editingCell === `${weekIndex}-${crewIndex}-crew-name` ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="text-sm"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleSaveEdit(weekIndex, crewIndex, null, 'name');
                                        } else if (e.key === 'Escape') {
                                          handleCancelEdit();
                                        }
                                      }}
                                      autoFocus
                                    />
                                    <Button size="sm" onClick={() => handleSaveEdit(weekIndex, crewIndex, null, 'name')}>
                                      <Save className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div 
                                    className="cursor-pointer hover:bg-gray-100 p-1 rounded flex items-center gap-1 text-sm text-gray-600"
                                    onClick={() => handleCellEdit(weekIndex, crewIndex, null, 'name')}
                                  >
                                    <span>{crew.name || 'Click to add name'}</span>
                                    <Edit2 className="h-3 w-3 text-gray-400" />
                                  </div>
                                )}
                              </TableCell>
                              {crew.schedule.map((day, dayIndex) => (
                                <TableCell key={`${crewIndex}-${dayIndex}`} className="border border-gray-300">
                                  <div className="space-y-2">
                                    {/* Job Code */}
                                    {editingCell === `${weekIndex}-${crewIndex}-${dayIndex}-jobCode` ? (
                                      <div className="flex items-center gap-2">
                                        <Input
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          className="text-sm"
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              handleSaveEdit(weekIndex, crewIndex, dayIndex, 'jobCode');
                                            } else if (e.key === 'Escape') {
                                              handleCancelEdit();
                                            }
                                          }}
                                          autoFocus
                                        />
                                        <Button size="sm" onClick={() => handleSaveEdit(weekIndex, crewIndex, dayIndex, 'jobCode')}>
                                          <Save className="h-3 w-3" />
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <div 
                                        className="cursor-pointer hover:bg-gray-100 p-1 rounded flex items-center gap-1"
                                        onClick={() => handleCellEdit(weekIndex, crewIndex, dayIndex, 'jobCode')}
                                      >
                                        <span className="font-medium">{day.jobCode}</span>
                                        <Edit2 className="h-3 w-3 text-gray-400" />
                                      </div>
                                    )}
                                    
                                    {/* Description */}
                                    {editingCell === `${weekIndex}-${crewIndex}-${dayIndex}-description` ? (
                                      <div className="flex items-center gap-2">
                                        <Input
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          className="text-sm"
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              handleSaveEdit(weekIndex, crewIndex, dayIndex, 'description');
                                            } else if (e.key === 'Escape') {
                                              handleCancelEdit();
                                            }
                                          }}
                                          autoFocus
                                        />
                                        <Button size="sm" onClick={() => handleSaveEdit(weekIndex, crewIndex, dayIndex, 'description')}>
                                          <Save className="h-3 w-3" />
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <div 
                                        className="cursor-pointer hover:bg-gray-100 p-1 rounded flex items-center gap-1"
                                        onClick={() => handleCellEdit(weekIndex, crewIndex, dayIndex, 'description')}
                                      >
                                        <span className="text-gray-600 text-sm">{day.description || 'Click to add description'}</span>
                                        <Edit2 className="h-3 w-3 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
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
