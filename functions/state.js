export async function onRequestGet(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };

  const token = context.request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

  const res = await fetch(
    `${context.env.SUPABASE_URL}/rest/v1/devices?token=eq.${token}&select=led_state,ota_trigger,ota_version,mode,valve,schedule,moisture,temperature`,
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
    led: data[0].led_state,
    ota: data[0].ota_trigger,
    version: data[0].ota_version,
    mode: data[0].mode || "AUTO",
    valve: data[0].valve || false,
    schedule: data[0].schedule || [],
    moisture: data[0].moisture || 0,
    temperature: data[0].temperature || 0
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
}