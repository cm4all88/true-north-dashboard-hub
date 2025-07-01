import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrueNorthLogo } from '@/components/TrueNorthLogo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, X, Plus, Save, Edit2, Download, Copy } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useDashboardData } from '@/contexts/DashboardDataContext';

// Function to get color based on project manager
const getProjectManagerColor = (jobCode: string) => {
  if (!jobCode || jobCode.trim() === '') return '';
  
  const hash = jobCode.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const colors = [
    'bg-orange-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-purple-500'
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

const Admin = () => {
  const navigate = useNavigate();
  const { data, updateScheduleData, updateBirthdays, updateShoutouts } = useDashboardData();
  
  // Local state for new items
  const [newBirthday, setNewBirthday] = useState({ name: '', date: new Date() });
  const [newShoutout, setNewShoutout] = useState({ text: '', from: '' });
  
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  
  // Function to copy from previous day
  const copyFromPreviousDay = (weekIndex: number, crewIndex: number, dayIndex: number) => {
    if (dayIndex === 0) return; // Can't copy if it's the first day
    
    const newScheduleData = [...data.scheduleData];
    const previousDayData = newScheduleData[weekIndex].crews[crewIndex].schedule[dayIndex - 1];
    newScheduleData[weekIndex].crews[crewIndex].schedule[dayIndex] = {
      jobCode: previousDayData.jobCode,
      description: previousDayData.description
    };
    
    updateScheduleData(newScheduleData);
  };
  
  // Function to export daily schedule as CSV
  const exportDayAsCSV = (weekData: any, dayIndex: number) => {
    const dayName = weekData.days[dayIndex];
    const date = weekData.dates[dayIndex];
    
    let csvContent = `Crew Schedule for ${dayName} ${date}\n`;
    csvContent += `Crew Member,Position,Job Code,Description\n`;
    
    weekData.crews.forEach((crew: any) => {
      const daySchedule = crew.schedule[dayIndex];
      csvContent += `${crew.name},${crew.position},${daySchedule.jobCode},${daySchedule.description}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crew-schedule-${dayName.toLowerCase()}-${date.replace(/\//g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  
  // Handle birthday updates
  const handleAddBirthday = () => {
    if (newBirthday.name.trim() === '') return;
    
    const updatedBirthdays = [...data.birthdays, { ...newBirthday }];
    updateBirthdays(updatedBirthdays);
    setNewBirthday({ name: '', date: new Date() });
  };
  
  const handleRemoveBirthday = (index: number) => {
    const updatedBirthdays = data.birthdays.filter((_, i) => i !== index);
    updateBirthdays(updatedBirthdays);
  };
  
  // Handle shoutout updates
  const handleAddShoutout = () => {
    if (newShoutout.text.trim() === '' || newShoutout.from.trim() === '') return;
    
    const newId = data.shoutouts.length > 0 
      ? Math.max(...data.shoutouts.map(s => s.id)) + 1 
      : 1;
    
    const updatedShoutouts = [
      { 
        id: newId, 
        text: newShoutout.text, 
        from: newShoutout.from, 
        date: new Date() 
      },
      ...data.shoutouts
    ];
    
    updateShoutouts(updatedShoutouts);
    setNewShoutout({ text: '', from: '' });
  };
  
  const handleRemoveShoutout = (id: number) => {
    const updatedShoutouts = data.shoutouts.filter(shoutout => shoutout.id !== id);
    updateShoutouts(updatedShoutouts);
  };
  
  // Handle crew schedule editing
  const handleCellEdit = (weekIndex: number, crewIndex: number, dayIndex: number | null, field: 'jobCode' | 'description' | 'position' | 'name') => {
    const cellId = dayIndex !== null 
      ? `${weekIndex}-${crewIndex}-${dayIndex}-${field}`
      : `${weekIndex}-${crewIndex}-crew-${field}`;
    
    let currentValue = '';
    if (field === 'position' || field === 'name') {
      currentValue = data.scheduleData[weekIndex].crews[crewIndex][field];
    } else if (dayIndex !== null) {
      currentValue = data.scheduleData[weekIndex].crews[crewIndex].schedule[dayIndex][field];
    }
    
    setEditingCell(cellId);
    setEditValue(currentValue);
  };
  
  const handleSaveEdit = (weekIndex: number, crewIndex: number, dayIndex: number | null, field: 'jobCode' | 'description' | 'position' | 'name') => {
    const newScheduleData = [...data.scheduleData];
    
    if (field === 'position' || field === 'name') {
      newScheduleData[weekIndex].crews[crewIndex][field] = editValue;
    } else if (dayIndex !== null) {
      newScheduleData[weekIndex].crews[crewIndex].schedule[dayIndex][field] = editValue;
    }
    
    updateScheduleData(newScheduleData);
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
                  Edit the crew schedule that appears on the main dashboard. Click on any cell to edit it, including crew names and positions. Use the download buttons to export daily schedules as CSV files. Click the copy button to copy information from the previous day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {data.scheduleData.map((weekData, weekIndex) => (
                    <div key={weekIndex}>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">{weekData.weekOf}</h3>
                        <div className="flex gap-2">
                          {weekData.days.map((day, dayIndex) => (
                            <Button
                              key={`export-${weekIndex}-${dayIndex}`}
                              variant="outline"
                              size="sm"
                              onClick={() => exportDayAsCSV(weekData, dayIndex)}
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>
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
                                    {/* Copy button */}
                                    {dayIndex > 0 && (
                                      <div className="flex justify-end mb-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => copyFromPreviousDay(weekIndex, crewIndex, dayIndex)}
                                          className="h-6 w-6 p-0"
                                          title="Copy from previous day"
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}
                                    
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
                                        <div className="flex items-center gap-2">
                                          {day.jobCode && day.jobCode.trim() !== '' && (
                                            <div className={`w-3 h-3 rounded-full ${getProjectManagerColor(day.jobCode)}`}></div>
                                          )}
                                          <span className="font-medium">{day.jobCode}</span>
                                        </div>
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
                  {data.birthdays.map((birthday, index) => (
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
                  {data.shoutouts.map((shoutout) => (
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
