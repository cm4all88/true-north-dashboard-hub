import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrueNorthLogo } from '@/components/TrueNorthLogo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, X, Plus, Save, Edit2, Download, Copy, FileSpreadsheet } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useDashboardData } from '@/contexts/DashboardDataContext';
import * as XLSX from 'xlsx';

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
  
  // State for vacation/sick callouts
  const [callouts, setCallouts] = useState<{[key: string]: string}>({});
  
  // Local state for inputs to prevent lag
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({});
  const timeoutRefs = useRef<{[key: string]: NodeJS.Timeout}>({});
  
  // Local state for new items
  const [newBirthday, setNewBirthday] = useState({ name: '', date: new Date() });
  const [newShoutout, setNewShoutout] = useState({ text: '', from: '' });
  
  // Debounced update function
  const debouncedUpdate = useCallback((key: string, value: string, updateFn: () => void) => {
    // Clear existing timeout
    if (timeoutRefs.current[key]) {
      clearTimeout(timeoutRefs.current[key]);
    }
    
    // Set new timeout
    timeoutRefs.current[key] = setTimeout(() => {
      updateFn();
      delete timeoutRefs.current[key];
    }, 300);
  }, []);
  
  // Get input value (from local state or data)
  const getInputValue = useCallback((key: string, fallback: string) => {
    return inputValues[key] !== undefined ? inputValues[key] : fallback;
  }, [inputValues]);
  
  // Handle input change with debouncing
  const handleInputChange = useCallback((key: string, value: string, updateFn: () => void) => {
    setInputValues(prev => ({ ...prev, [key]: value }));
    debouncedUpdate(key, value, updateFn);
  }, [debouncedUpdate]);
  
  const updateCrewName = useCallback((weekIndex: number, crewIndex: number, newName: string) => {
    const key = `crew-name-${weekIndex}-${crewIndex}`;
    const updateFn = () => {
      const newScheduleData = [...data.scheduleData];
      const allCrews = newScheduleData[weekIndex].crews;
      const visibleCrews = allCrews.filter(crew => crew.position !== 'OFF');
      
      if (visibleCrews[crewIndex]) {
        const actualIndex = allCrews.findIndex(crew => crew === visibleCrews[crewIndex]);
        if (actualIndex !== -1) {
          newScheduleData[weekIndex].crews[actualIndex].name = newName;
          updateScheduleData(newScheduleData);
          // Clear from local state after update
          setInputValues(prev => {
            const newState = { ...prev };
            delete newState[key];
            return newState;
          });
        }
      }
    };
    
    handleInputChange(key, newName, updateFn);
  }, [data.scheduleData, updateScheduleData, handleInputChange]);
  
  const updateCrewPosition = useCallback((weekIndex: number, crewIndex: number, newPosition: string) => {
    const key = `crew-position-${weekIndex}-${crewIndex}`;
    const updateFn = () => {
      const newScheduleData = [...data.scheduleData];
      const allCrews = newScheduleData[weekIndex].crews;
      const visibleCrews = allCrews.filter(crew => crew.position !== 'OFF');
      
      if (visibleCrews[crewIndex]) {
        const actualIndex = allCrews.findIndex(crew => crew === visibleCrews[crewIndex]);
        if (actualIndex !== -1) {
          newScheduleData[weekIndex].crews[actualIndex].position = newPosition;
          updateScheduleData(newScheduleData);
          // Clear from local state after update
          setInputValues(prev => {
            const newState = { ...prev };
            delete newState[key];
            return newState;
          });
        }
      }
    };
    
    handleInputChange(key, newPosition, updateFn);
  }, [data.scheduleData, updateScheduleData, handleInputChange]);
  
  const copyFromPreviousDay = useCallback((weekIndex: number, crewIndex: number, dayIndex: number) => {
    if (dayIndex === 0) return;
    
    const newScheduleData = [...data.scheduleData];
    const allCrews = newScheduleData[weekIndex].crews;
    const visibleCrews = allCrews.filter(crew => crew.position !== 'OFF');
    
    if (visibleCrews[crewIndex]) {
      const actualIndex = allCrews.findIndex(crew => crew === visibleCrews[crewIndex]);
      if (actualIndex !== -1) {
        const previousDayData = newScheduleData[weekIndex].crews[actualIndex].schedule[dayIndex - 1];
        newScheduleData[weekIndex].crews[actualIndex].schedule[dayIndex] = {
          row1: { ...previousDayData.row1 },
          row2: { ...previousDayData.row2 }
        };
        updateScheduleData(newScheduleData);
      }
    }
  }, [data.scheduleData, updateScheduleData]);
  
  const updateRowData = useCallback((weekIndex: number, crewIndex: number, dayIndex: number, row: 'row1' | 'row2', field: 'color' | 'jobNumber' | 'jobName', value: string) => {
    const key = `row-${weekIndex}-${crewIndex}-${dayIndex}-${row}-${field}`;
    const updateFn = () => {
      const newScheduleData = [...data.scheduleData];
      const allCrews = newScheduleData[weekIndex].crews;
      const visibleCrews = allCrews.filter(crew => crew.position !== 'OFF');
      
      if (!visibleCrews[crewIndex]) return;
      
      const actualIndex = allCrews.findIndex(crew => crew === visibleCrews[crewIndex]);
      if (actualIndex === -1) return;
      
      if (!newScheduleData[weekIndex]?.crews[actualIndex]?.schedule[dayIndex]) return;
      
      if (!newScheduleData[weekIndex].crews[actualIndex].schedule[dayIndex][row]) {
        newScheduleData[weekIndex].crews[actualIndex].schedule[dayIndex][row] = {
          color: 'none',
          jobNumber: '',
          jobName: ''
        };
      }
      
      newScheduleData[weekIndex].crews[actualIndex].schedule[dayIndex][row][field] = value as any;
      updateScheduleData(newScheduleData);
      // Clear from local state after update
      setInputValues(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    };

    if (field === 'color') {
      // Color changes don't need debouncing
      updateFn();
    } else {
      handleInputChange(key, value, updateFn);
    }
  }, [data.scheduleData, updateScheduleData, handleInputChange]);

  // Function to export all schedule data to Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Create a worksheet for each week
    data.scheduleData.forEach((weekData, weekIndex) => {
      const worksheetData: any[][] = [];
      
      // Add header row with week information
      worksheetData.push([`Week ${weekIndex + 1}: ${weekData.weekOf}`]);
      worksheetData.push([]); // Empty row
      
      // Add column headers
      const headers = ['Crew Member', 'Position'];
      weekData.days.forEach((day, dayIndex) => {
        headers.push(`${day} ${weekData.dates[dayIndex]} - Job 1 Color`);
        headers.push(`${day} ${weekData.dates[dayIndex]} - Job 1 Number`);
        headers.push(`${day} ${weekData.dates[dayIndex]} - Job 1 Name`);
        headers.push(`${day} ${weekData.dates[dayIndex]} - Job 2 Color`);
        headers.push(`${day} ${weekData.dates[dayIndex]} - Job 2 Number`);
        headers.push(`${day} ${weekData.dates[dayIndex]} - Job 2 Name`);
      });
      worksheetData.push(headers);
      
      // Add crew data
      weekData.crews.filter(crew => crew.position !== 'OFF').forEach(crew => {
        const row = [crew.name, crew.position];
        
        crew.schedule.forEach(daySchedule => {
          row.push(
            daySchedule.row1?.color || 'none',
            daySchedule.row1?.jobNumber || '',
            daySchedule.row1?.jobName || '',
            daySchedule.row2?.color || 'none',
            daySchedule.row2?.jobNumber || '',
            daySchedule.row2?.jobName || ''
          );
        });
        
        worksheetData.push(row);
      });
      
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Auto-size columns
      const columnWidths = headers.map((header, index) => {
        const maxLength = Math.max(
          header.length,
          ...worksheetData.slice(3).map(row => String(row[index] || '').length)
        );
        return { wch: Math.min(maxLength + 2, 30) };
      });
      worksheet['!cols'] = columnWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, `Week ${weekIndex + 1}`);
    });
    
    // Create summary sheet with birthdays and shoutouts
    const summaryData: any[][] = [];
    summaryData.push(['BIRTHDAYS']);
    summaryData.push(['Name', 'Date']);
    data.birthdays.forEach(birthday => {
      summaryData.push([birthday.name, format(birthday.date, "MMMM d, yyyy")]);
    });
    
    summaryData.push([]); // Empty row
    summaryData.push(['SHOUTOUTS']);
    summaryData.push(['Message', 'From', 'Date']);
    data.shoutouts.forEach(shoutout => {
      summaryData.push([shoutout.text, shoutout.from, format(shoutout.date, "MMMM d, yyyy")]);
    });
    
    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWorksheet['!cols'] = [
      { wch: 50 }, // Message/Name column
      { wch: 20 }, // From/Date column
      { wch: 15 }  // Date column
    ];
    
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
    
    // Generate filename with current date
    const today = new Date();
    const filename = `crew-schedule-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}.xlsx`;
    
    // Save the file
    XLSX.writeFile(workbook, filename);
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
            <Button variant="outline" onClick={exportToExcel}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
            <Button onClick={() => alert('Changes saved automatically!')}>
              <Save className="mr-2 h-4 w-4" />
              Auto-Save Active
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-truenorth-700 mb-6">Dashboard Administration</h1>
        
        <Tabs defaultValue="schedule">
          <TabsList className="mb-6">
            <TabsTrigger value="schedule">Crew Schedule</TabsTrigger>
            <TabsTrigger value="callouts">Vacation/Sick</TabsTrigger>
            <TabsTrigger value="birthdays">Birthdays</TabsTrigger>
            <TabsTrigger value="shoutouts">Shoutouts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Manage Crew Schedule</CardTitle>
                <CardDescription>
                  Edit the crew schedule - Type directly in the fields. Changes save automatically after you stop typing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {data.scheduleData.map((weekData, weekIndex) => (
                    <div key={weekIndex} className="border rounded-lg p-6 bg-white">
                      <h3 className="text-xl font-bold mb-6 text-center bg-gray-100 p-3 rounded">{weekData.weekOf}</h3>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border-2 border-gray-300">
                          <thead>
                            <tr className="bg-blue-100">
                              <th className="border-2 border-gray-300 p-4 text-left font-bold text-lg min-w-[200px]">
                                Crew Member
                              </th>
                              {weekData.days.map((day, index) => (
                                <th key={`${day}-${index}`} className="border-2 border-gray-300 p-4 text-center font-bold text-lg min-w-[300px]">
                                  <div className="text-lg font-bold">{day}</div>
                                  <div className="text-sm text-gray-600 font-normal">{weekData.dates[index]}</div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {weekData.crews.filter(crew => crew.position !== 'OFF').map((crew, crewIndex) => (
                              <tr key={`${weekIndex}-${crew.position}-${crewIndex}`} className="border-b-2 border-gray-200">
                                <td className="border-2 border-gray-300 p-4 bg-gray-50">
                                  <div className="space-y-3">
                                    <Input
                                      placeholder="Position"
                                      value={getInputValue(`crew-position-${weekIndex}-${crewIndex}`, crew.position)}
                                      onChange={(e) => updateCrewPosition(weekIndex, crewIndex, e.target.value)}
                                      className="font-bold text-base h-12 text-lg"
                                    />
                                    <Input
                                      placeholder="Name"
                                      value={getInputValue(`crew-name-${weekIndex}-${crewIndex}`, crew.name)}
                                      onChange={(e) => updateCrewName(weekIndex, crewIndex, e.target.value)}
                                      className="text-base h-12 text-lg"
                                    />
                                  </div>
                                </td>
                                {crew.schedule.map((daySchedule, dayIndex) => (
                                  <td key={`${crewIndex}-${dayIndex}`} className="border-2 border-gray-300 p-3 align-top">
                                    <div className="space-y-4">
                                      {dayIndex > 0 && (
                                        <div className="flex justify-end mb-3">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => copyFromPreviousDay(weekIndex, crewIndex, dayIndex)}
                                            className="h-8 px-3 text-xs"
                                            title="Copy from previous day"
                                          >
                                            <Copy className="h-3 w-3 mr-1" />
                                            Copy
                                          </Button>
                                        </div>
                                      )}
                                      
                                      {/* JOB 1 */}
                                      <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                                        <div className="text-sm font-bold text-blue-800 mb-3">JOB 1</div>
                                        <div className="space-y-3">
                                          <Select
                                            value={daySchedule.row1?.color || 'none'}
                                            onValueChange={(value) => 
                                              updateRowData(weekIndex, crewIndex, dayIndex, 'row1', 'color', value)
                                            }
                                          >
                                            <SelectTrigger className="h-10 text-base">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white z-50">
                                              {availableColors.map((color) => (
                                                <SelectItem key={color.value} value={color.value}>
                                                  <div className="flex items-center gap-2">
                                                    {color.value !== 'none' && (
                                                      <div 
                                                        className="w-4 h-4 rounded-full border"
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
                                            placeholder="Job Number"
                                            value={getInputValue(`row-${weekIndex}-${crewIndex}-${dayIndex}-row1-jobNumber`, daySchedule.row1?.jobNumber || '')}
                                            onChange={(e) => updateRowData(weekIndex, crewIndex, dayIndex, 'row1', 'jobNumber', e.target.value)}
                                            className="h-10 text-base"
                                          />
                                          <Input
                                            placeholder="Job Description"
                                            value={getInputValue(`row-${weekIndex}-${crewIndex}-${dayIndex}-row1-jobName`, daySchedule.row1?.jobName || '')}
                                            onChange={(e) => updateRowData(weekIndex, crewIndex, dayIndex, 'row1', 'jobName', e.target.value)}
                                            className="h-10 text-base"
                                          />
                                        </div>
                                      </div>
                                      
                                      {/* JOB 2 */}
                                      <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                                        <div className="text-sm font-bold text-green-800 mb-3">JOB 2</div>
                                        <div className="space-y-3">
                                          <Select
                                            value={daySchedule.row2?.color || 'none'}
                                            onValueChange={(value) => 
                                              updateRowData(weekIndex, crewIndex, dayIndex, 'row2', 'color', value)
                                            }
                                          >
                                            <SelectTrigger className="h-10 text-base">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white z-50">
                                              {availableColors.map((color) => (
                                                <SelectItem key={color.value} value={color.value}>
                                                  <div className="flex items-center gap-2">
                                                    {color.value !== 'none' && (
                                                      <div 
                                                        className="w-4 h-4 rounded-full border"
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
                                            placeholder="Job Number"
                                            value={getInputValue(`row-${weekIndex}-${crewIndex}-${dayIndex}-row2-jobNumber`, daySchedule.row2?.jobNumber || '')}
                                            onChange={(e) => updateRowData(weekIndex, crewIndex, dayIndex, 'row2', 'jobNumber', e.target.value)}
                                            className="h-10 text-base"
                                          />
                                          <Input
                                            placeholder="Job Description"
                                            value={getInputValue(`row-${weekIndex}-${crewIndex}-${dayIndex}-row2-jobName`, daySchedule.row2?.jobName || '')}
                                            onChange={(e) => updateRowData(weekIndex, crewIndex, dayIndex, 'row2', 'jobName', e.target.value)}
                                            className="h-10 text-base"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="callouts">
            <Card>
              <CardHeader>
                <CardTitle>Manage Vacation & Sick Callouts</CardTitle>
                <CardDescription>
                  Manage vacation and sick day callouts for each week and day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {data.scheduleData.map((weekData, weekIndex) => (
                    <div key={weekIndex} className="border rounded-lg p-6 bg-white">
                      <h3 className="text-xl font-bold mb-6 text-center bg-gray-100 p-3 rounded">{weekData.weekOf}</h3>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border-2 border-gray-300">
                          <thead>
                            <tr className="bg-blue-100">
                              <th className="border-2 border-gray-300 p-4 text-left font-bold text-lg min-w-[150px]">
                                Type
                              </th>
                              {weekData.days.map((day, index) => (
                                <th key={`${day}-${index}`} className="border-2 border-gray-300 p-4 text-center font-bold text-lg min-w-[200px]">
                                  <div className="text-lg font-bold">{day}</div>
                                  <div className="text-sm text-gray-600 font-normal">{weekData.dates[index]}</div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b-2 border-gray-200">
                              <td className="border-2 border-gray-300 p-4 bg-green-50 font-bold text-green-800">
                                VACATION
                              </td>
                              {weekData.days.map((_, dayIndex) => (
                                <td key={`vacation-${dayIndex}`} className="border-2 border-gray-300 p-3">
                                  <Textarea
                                    placeholder="Enter vacation callouts..."
                                    value={callouts[`${weekIndex}-${dayIndex}-vacation`] || ''}
                                    onChange={(e) => setCallouts(prev => ({
                                      ...prev,
                                      [`${weekIndex}-${dayIndex}-vacation`]: e.target.value
                                    }))}
                                    className="min-h-[80px] resize-none"
                                  />
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b-2 border-gray-200">
                              <td className="border-2 border-gray-300 p-4 bg-red-50 font-bold text-red-800">
                                SICK
                              </td>
                              {weekData.days.map((_, dayIndex) => (
                                <td key={`sick-${dayIndex}`} className="border-2 border-gray-300 p-3">
                                  <Textarea
                                    placeholder="Enter sick callouts..."
                                    value={callouts[`${weekIndex}-${dayIndex}-sick`] || ''}
                                    onChange={(e) => setCallouts(prev => ({
                                      ...prev,
                                      [`${weekIndex}-${dayIndex}-sick`]: e.target.value
                                    }))}
                                    className="min-h-[80px] resize-none"
                                  />
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
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
