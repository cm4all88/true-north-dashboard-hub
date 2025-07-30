
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type CrewSchedule = Database['public']['Tables']['crew_schedules']['Row'];
type CrewMember = Database['public']['Tables']['crew_members']['Row'];
type ScheduleItem = Database['public']['Tables']['schedule_items']['Row'];
type Birthday = Database['public']['Tables']['birthdays']['Row'];
type Shoutout = Database['public']['Tables']['shoutouts']['Row'];

// Transform database data to match our existing interface
export interface WeekData {
  weekOf: string;
  days: string[];
  dates: string[];
  crews: CrewMemberData[];
  callouts?: {
    vacation: string[];
    sick: string[];
  };
}

export interface CrewMemberData {
  position: string;
  name: string;
  schedule: ScheduleItemData[];
}

export interface ScheduleItemData {
  row1: {
    color: 'orange' | 'blue' | 'green' | 'purple' | 'none';
    jobNumber: string;
    jobName: string;
  };
  row2: {
    color: 'orange' | 'blue' | 'green' | 'purple' | 'none';
    jobNumber: string;
    jobName: string;
  };
}

export interface BirthdayData {
  name: string;
  date: Date;
}

export interface ShoutoutData {
  id: number;
  text: string;
  from: string;
  date: Date;
}

// Schedule operations
export async function getScheduleData(): Promise<WeekData[]> {
  try {
    const { data: schedules, error: scheduleError } = await supabase
      .from('crew_schedules')
      .select('*')
      .order('week_index');

    if (scheduleError) throw scheduleError;

    const weekDataPromises = schedules.map(async (schedule) => {
      const { data: members, error: membersError } = await supabase
        .from('crew_members')
        .select('*')
        .eq('schedule_id', schedule.id)
        .order('order_index');

      if (membersError) throw membersError;

      const crewsPromises = members.map(async (member) => {
        const { data: items, error: itemsError } = await supabase
          .from('schedule_items')
          .select('*')
          .eq('crew_member_id', member.id)
          .order('day_index');

        if (itemsError) throw itemsError;

        // Create schedule array for 5 days
        const schedule: ScheduleItemData[] = [];
        for (let i = 0; i < 5; i++) {
          const item = items.find(item => item.day_index === i);
          schedule.push({
            row1: {
              color: (item?.row1_color as any) || 'none',
              jobNumber: item?.row1_job_number || '',
              jobName: item?.row1_job_name || ''
            },
            row2: {
              color: (item?.row2_color as any) || 'none',
              jobNumber: item?.row2_job_number || '',
              jobName: item?.row2_job_name || ''
            }
          });
        }

        return {
          position: member.position,
          name: member.name,
          schedule
        };
      });

      const crews = await Promise.all(crewsPromises);

      // Generate dates for the week
      const dates: string[] = [];
      const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
      
      // Simple date generation - you can enhance this based on your needs
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1 + (schedule.week_index * 7));
      
      for (let i = 0; i < 5; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        dates.push(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`);
      }

      return {
        weekOf: schedule.week_of,
        days,
        dates,
        crews,
        callouts: {
          vacation: schedule.vacation_callouts || ['', '', '', '', ''],
          sick: schedule.sick_callouts || ['', '', '', '', '']
        }
      };
    });

    return await Promise.all(weekDataPromises);
  } catch (error) {
    console.error('Error fetching schedule data:', error);
    return [];
  }
}

export async function saveScheduleData(scheduleData: WeekData[]): Promise<void> {
  try {
    console.log('Starting to save schedule data:', scheduleData);

    // Get existing schedules to check what needs to be updated vs inserted
    const { data: existingSchedules, error: fetchError } = await supabase
      .from('crew_schedules')
      .select('*')
      .order('week_index');

    if (fetchError) throw fetchError;

    // Process each week
    for (let weekIndex = 0; weekIndex < scheduleData.length; weekIndex++) {
      const weekData = scheduleData[weekIndex];
      let scheduleId: string;

      // Check if this week already exists
      const existingSchedule = existingSchedules.find(s => s.week_index === weekIndex);
      
      if (existingSchedule) {
        // Update existing schedule
        const { error: updateError } = await supabase
          .from('crew_schedules')
          .update({ 
            week_of: weekData.weekOf,
            vacation_callouts: weekData.callouts?.vacation || ['', '', '', '', ''],
            sick_callouts: weekData.callouts?.sick || ['', '', '', '', '']
          })
          .eq('id', existingSchedule.id);

        if (updateError) throw updateError;
        scheduleId = existingSchedule.id;
      } else {
        // Insert new schedule
        const { data: newSchedule, error: insertError } = await supabase
          .from('crew_schedules')
          .insert({
            week_of: weekData.weekOf,
            week_index: weekIndex,
            vacation_callouts: weekData.callouts?.vacation || ['', '', '', '', ''],
            sick_callouts: weekData.callouts?.sick || ['', '', '', '', '']
          })
          .select()
          .single();

        if (insertError) throw insertError;
        scheduleId = newSchedule.id;
      }

      // Get existing crew members for this schedule
      const { data: existingMembers, error: membersError } = await supabase
        .from('crew_members')
        .select('*')
        .eq('schedule_id', scheduleId)
        .order('order_index');

      if (membersError) throw membersError;

      // Process each crew member
      for (let crewIndex = 0; crewIndex < weekData.crews.length; crewIndex++) {
        const crew = weekData.crews[crewIndex];
        let memberId: string;

        // Check if this crew member already exists
        const existingMember = existingMembers.find(m => m.order_index === crewIndex);

        if (existingMember) {
          // Update existing member
          const { error: updateMemberError } = await supabase
            .from('crew_members')
            .update({
              position: crew.position,
              name: crew.name
            })
            .eq('id', existingMember.id);

          if (updateMemberError) throw updateMemberError;
          memberId = existingMember.id;
        } else {
          // Insert new member
          const { data: newMember, error: insertMemberError } = await supabase
            .from('crew_members')
            .insert({
              schedule_id: scheduleId,
              position: crew.position,
              name: crew.name,
              order_index: crewIndex
            })
            .select()
            .single();

          if (insertMemberError) throw insertMemberError;
          memberId = newMember.id;
        }

        // Get existing schedule items for this member
        const { data: existingItems, error: itemsError } = await supabase
          .from('schedule_items')
          .select('*')
          .eq('crew_member_id', memberId)
          .order('day_index');

        if (itemsError) throw itemsError;

        // Process each day's schedule
        for (let dayIndex = 0; dayIndex < crew.schedule.length; dayIndex++) {
          const daySchedule = crew.schedule[dayIndex];
          
          // Check if this day's schedule already exists
          const existingItem = existingItems.find(i => i.day_index === dayIndex);

          const itemData = {
            row1_color: daySchedule.row1.color,
            row1_job_number: daySchedule.row1.jobNumber,
            row1_job_name: daySchedule.row1.jobName,
            row2_color: daySchedule.row2.color,
            row2_job_number: daySchedule.row2.jobNumber,
            row2_job_name: daySchedule.row2.jobName
          };

          if (existingItem) {
            // Update existing item
            const { error: updateItemError } = await supabase
              .from('schedule_items')
              .update(itemData)
              .eq('id', existingItem.id);

            if (updateItemError) throw updateItemError;
          } else {
            // Insert new item
            const { error: insertItemError } = await supabase
              .from('schedule_items')
              .insert({
                crew_member_id: memberId,
                day_index: dayIndex,
                ...itemData
              });

            if (insertItemError) throw insertItemError;
          }
        }
      }

      // Clean up any extra crew members that shouldn't exist
      if (existingMembers.length > weekData.crews.length) {
        const membersToDelete = existingMembers.slice(weekData.crews.length);
        for (const member of membersToDelete) {
          const { error: deleteError } = await supabase
            .from('crew_members')
            .delete()
            .eq('id', member.id);
          
          if (deleteError) throw deleteError;
        }
      }
    }

    console.log('Successfully saved schedule data');
  } catch (error) {
    console.error('Error saving schedule data:', error);
    throw error;
  }
}

// Birthday operations
export async function getBirthdays(): Promise<BirthdayData[]> {
  try {
    const { data, error } = await supabase
      .from('birthdays')
      .select('*')
      .order('birth_date');

    if (error) throw error;

    return data.map((birthday: Birthday) => ({
      name: birthday.name,
      date: new Date(birthday.birth_date)
    }));
  } catch (error) {
    console.error('Error fetching birthdays:', error);
    return [];
  }
}

export async function saveBirthdays(birthdays: BirthdayData[]): Promise<void> {
  try {
    await supabase.from('birthdays').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    const birthdayInserts = birthdays.map(birthday => ({
      name: birthday.name,
      birth_date: birthday.date.toISOString().split('T')[0]
    }));

    const { error } = await supabase.from('birthdays').insert(birthdayInserts);
    if (error) throw error;
  } catch (error) {
    console.error('Error saving birthdays:', error);
    throw error;
  }
}

// Shoutout operations
export async function getShoutouts(): Promise<ShoutoutData[]> {
  try {
    const { data, error } = await supabase
      .from('shoutouts')
      .select('*')
      .order('date_posted', { ascending: false });

    if (error) throw error;

    return data.map((shoutout: Shoutout, index: number) => ({
      id: index + 1,
      text: shoutout.text,
      from: shoutout.from_person,
      date: new Date(shoutout.date_posted)
    }));
  } catch (error) {
    console.error('Error fetching shoutouts:', error);
    return [];
  }
}

export async function saveShoutouts(shoutouts: ShoutoutData[]): Promise<void> {
  try {
    await supabase.from('shoutouts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    const shoutoutInserts = shoutouts.map(shoutout => ({
      text: shoutout.text,
      from_person: shoutout.from,
      date_posted: shoutout.date.toISOString().split('T')[0]
    }));

    const { error } = await supabase.from('shoutouts').insert(shoutoutInserts);
    if (error) throw error;
  } catch (error) {
    console.error('Error saving shoutouts:', error);
    throw error;
  }
}
