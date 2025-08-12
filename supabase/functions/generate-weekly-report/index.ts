import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as XLSX from "https://esm.sh/xlsx@0.18.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function toISODateUTC(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getLastWeekRangeUTC() {
  const now = new Date();
  // Get this week's Monday (UTC)
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dow = todayUTC.getUTCDay() || 7; // 1..7 (Mon..Sun)
  const thisMonday = new Date(todayUTC);
  thisMonday.setUTCDate(thisMonday.getUTCDate() - (dow - 1));
  // Last week's Monday and Friday
  const lastMonday = new Date(thisMonday);
  lastMonday.setUTCDate(lastMonday.getUTCDate() - 7);
  const lastFriday = new Date(lastMonday);
  lastFriday.setUTCDate(lastFriday.getUTCDate() + 4);
  return { start: lastMonday, end: lastFriday };
}

function getDayNameUTC(d: Date) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      throw new Error("Missing Supabase env vars");
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Compute last week's date range (Mon..Fri) in UTC
    const { start, end } = getLastWeekRangeUTC();
    const startISO = toISODateUTC(start);
    const endISO = toISODateUTC(end);

    console.log(`Generating weekly report for ${startISO} to ${endISO}`);

    // Fetch schedule items that have row1 or row2 field dates in range
    const { data: items, error: itemsError } = await supabase
      .from("schedule_items")
      .select("*")
      .or(
        `and(row1_field_date.gte.${startISO},row1_field_date.lte.${endISO}),and(row2_field_date.gte.${startISO},row2_field_date.lte.${endISO})`
      );

    if (itemsError) throw itemsError;

    const crewIds = Array.from(
      new Set((items || []).map((i: any) => i.crew_member_id).filter((v: string | null) => !!v))
    );

    const crewMap = new Map<string, { name: string; position: string }>();
    if (crewIds.length > 0) {
      const { data: crews, error: crewsError } = await supabase
        .from("crew_members")
        .select("id,name,position")
        .in("id", crewIds);
      if (crewsError) throw crewsError;
      (crews || []).forEach((c: any) => crewMap.set(c.id, { name: c.name, position: c.position }));
    }

    // Build rows for XLSX
    const header = [
      "Date",
      "Day",
      "Crew Position",
      "Crew Name",
      "Row",
      "Job Number",
      "Job Name",
      "Color",
    ];

    const rows: any[][] = [header];

    function pushRow(dateStr: string, rowLabel: string, item: any, which: "row1" | "row2") {
      const d = new Date(dateStr + "T00:00:00Z");
      const crew = item.crew_member_id ? crewMap.get(item.crew_member_id) : undefined;
      rows.push([
        dateStr,
        getDayNameUTC(d),
        crew?.position || "",
        crew?.name || "",
        rowLabel,
        item[`${which}_job_number`] || "",
        item[`${which}_job_name`] || "",
        item[`${which}_color`] || "",
      ]);
    }

    for (const item of items || []) {
      if (item.row1_field_date && item.row1_job_number) {
        if (item.row1_field_date >= startISO && item.row1_field_date <= endISO) {
          pushRow(item.row1_field_date, "1", item, "row1");
        }
      }
      if (item.row2_field_date && item.row2_job_number) {
        if (item.row2_field_date >= startISO && item.row2_field_date <= endISO) {
          pushRow(item.row2_field_date, "2", item, "row2");
        }
      }
    }

    if (rows.length === 1) {
      rows.push(["No items for this period", "", "", "", "", "", "", ""]);
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Last Week");

    const filename = `weekly-report-${startISO}_to_${endISO}.xlsx`;
    const arrayBuffer: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const bytes = new Uint8Array(arrayBuffer);

    const upload = await supabase.storage
      .from("reports")
      .upload(filename, bytes, {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        upsert: true,
      });

    if (upload.error) throw upload.error;

    console.log(`Report uploaded to reports/${filename}`);

    return new Response(
      JSON.stringify({ success: true, filename }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("generate-weekly-report error:", err?.message || err);
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});