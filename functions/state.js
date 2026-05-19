export async function onRequestGet(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };

  const token = context.request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

  // Pobranie stanu urządzenia
  const res = await fetch(
    `${context.env.SUPABASE_URL}/rest/v1/devices?token=eq.${token}&select=fw_version,mode,valve_state,ota_trigger`,
    {
      headers: {
        apikey: context.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${context.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    }
  );

  const data = await res.json();
  if (!data.length) return new Response("Not found", { status: 404, headers: corsHeaders });

  return new Response(JSON.stringify({
    version: data[0].fw_version || "unknown",
    mode: data[0].mode || "AUTO",
    valve: data[0].valve_state ?? false,
    ota: data[0].ota_trigger ?? false
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
}