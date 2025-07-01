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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useDashboardData } from '@/contexts/DashboardDataContext';

// Available colors for dots
const availableColors = [
  { value: 'none', label: 'None', color: 'transparent' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'green', label: 'Green', color: '#22c55e' },
  { value: 'purple', label: 'Purple', color: '#a855f7' }
];

const Admin = () => {
  const navigate = useNavigate();
  const { data, updateScheduleData, updateBirthdays, updateShoutouts } = useDashboardData();
  
  // Local state for new items
  const [newBirthday, setNewBirthday] = useState({ name: '', date: new Date() });
  const [newShoutout, setNewShoutout] = useState({ text: '', from: '' });
  
  // Function to copy from previous day
  const copyFromPreviousDay = (weekIndex: number, crewIndex: number, dayIndex: number) => {
    if (dayIndex === 0) return; // Can't copy if it's the first day
    
    const newScheduleData = [...data.scheduleData];
    const previousDayData = newScheduleData[weekIndex].crews[crewIndex].schedule[dayIndex - 1];
    newScheduleData[weekIndex].crews[crewIndex].schedule[dayIndex] = {
      row1: { ...previousDayData.row1 },
      row2: { ...previousDayData.row2 }
    };
    
    updateScheduleData(newScheduleData);
  };
  
  // Function to update row data
  const updateRowData = (weekIndex: number, crewIndex: number, dayIndex: number, row: 'row1' | 'row2', field: 'color' | 'jobNumber' | 'jobName', value: string | 'orange' | 'blue' | 'green' | 'purple' | 'none') => {
    const newScheduleData = [...data.scheduleData];
    newScheduleData[weekIndex].crews[crewIndex].schedule[dayIndex][row][field] = value as any;
    updateScheduleData(newScheduleData);
  };

  // Function to export daily schedule as CSV
  const exportDayAsCSV = (weekData: any, dayIndex: number) => {
    const dayName = weekData.days[dayIndex];
    const date = weekData.dates[dayIndex];
    
    let csvContent = `Crew Schedule for ${dayName} ${date}\n`;
    csvContent += `Crew Member,Position,Row,Job Code,Description,Project Manager\n`;
    
    weekData.crews.forEach((crew: any) => {
      csvContent += `${crew.name},${crew.position},1,${crew.schedule[dayIndex].row1.jobNumber},${crew.schedule[dayIndex].row1.jobName},${crew.schedule[dayIndex].row1.color}\n`;
      csvContent += `${crew.name},${crew.position},2,${crew.schedule[dayIndex].row2.jobNumber},${crew.schedule[dayIndex].row2.jobName},${crew.schedule[dayIndex].row2.color}\n`;
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
            <Button onClick={() => alert('Changes saved!')}>
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
                  Edit the crew schedule with 2 rows per day. Each row can have a colored dot, job number, and job name.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {data.scheduleData.map((weekData, weekIndex) => (
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
                                <div className="font-bold">{crew.position}</div>
                                <div className="text-sm text-gray-600">{crew.name}</div>
                              </TableCell>
                              {crew.schedule.map((day, dayIndex) => (
                                <TableCell key={`${crewIndex}-${dayIndex}`} className="border border-gray-300">
                                  {crew.position === 'OFF' ? (
                                    <div className="text-gray-400 text-center">OFF</div>
                                  ) : (
                                    <div className="space-y-4">
                                      {/* Copy button */}
                                      {dayIndex > 0 && (
                                        <div className="flex justify-end">
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
                                      
                                      {/* Row 1 */}
                                      <div className="space-y-2 p-2 bg-gray-50 rounded">
                                        <div className="text-xs font-semibold text-gray-600">Row 1</div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <Select
                                            value={day.row1.color}
                                            onValueChange={(value: 'orange' | 'blue' | 'green' | 'purple' | 'none') => 
                                              updateRowData(weekIndex, crewIndex, dayIndex, 'row1', 'color', value)
                                            }
                                          >
                                            <SelectTrigger className="h-8">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {availableColors.map((color) => (
                                                <SelectItem key={color.value} value={color.value}>
                                                  <div className="flex items-center gap-2">
                                                    {color.value !== 'none' && (
                                                      <div 
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: color.color }}
                                                      ></div>
                                                    )}
                                                    <span>{color.label}</span>
                                                  </div>
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          <Input
                                            placeholder="Job #"
                                            value={day.row1.jobNumber}
                                            onChange={(e) => updateRowData(weekIndex, crewIndex, dayIndex, 'row1', 'jobNumber', e.target.value)}
                                            className="h-8 text-xs"
                                          />
                                          <Input
                                            placeholder="Job Name"
                                            value={day.row1.jobName}
                                            onChange={(e) => updateRowData(weekIndex, crewIndex, dayIndex, 'row1', 'jobName', e.target.value)}
                                            className="h-8 text-xs"
                                          />
                                        </div>
                                      </div>
                                      
                                      {/* Row 2 */}
                                      <div className="space-y-2 p-2 bg-gray-50 rounded">
                                        <div className="text-xs font-semibold text-gray-600">Row 2</div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <Select
                                            value={day.row2.color}
                                            onValueChange={(value: 'orange' | 'blue' | 'green' | 'purple' | 'none') => 
                                              updateRowData(weekIndex, crewIndex, dayIndex, 'row2', 'color', value)
                                            }
                                          >
                                            <SelectTrigger className="h-8">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {availableColors.map((color) => (
                                                <SelectItem key={color.value} value={color.value}>
                                                  <div className="flex items-center gap-2">
                                                    {color.value !== 'none' && (
                                                      <div 
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: color.color }}
                                                      ></div>
                                                    )}
                                                    <span>{color.label}</span>
                                                  </div>
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          <Input
                                            placeholder="Job #"
                                            value={day.row2.jobNumber}
                                            onChange={(e) => updateRowData(weekIndex, crewIndex, dayIndex, 'row2', 'jobNumber', e.target.value)}
                                            className="h-8 text-xs"
                                          />
                                          <Input
                                            placeholder="Job Name"
                                            value={day.row2.jobName}
                                            onChange={(e) => updateRowData(weekIndex, crewIndex, dayIndex, 'row2', 'jobName', e.target.value)}
                                            className="h-8 text-xs"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
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
