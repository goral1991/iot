export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };

  const body = await context.request.json();
  const { token, valve, ota, mode } = body;

  if (!token) return new Response("Bad request: no token", { status: 400, headers: corsHeaders });

  const update = { updated_at: new Date().toISOString() };

  if (typeof valve === "boolean") update.valve_state = valve;
  if (typeof ota === "boolean") update.ota_trigger = ota;
  if (typeof mode === "string") update.mode = mode;

  const response = await fetch(`${context.env.SUPABASE_URL}/rest/v1/devices?token=eq.${token}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: context.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${context.env.SUPABASE_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify(update)
  });

  if(!response.ok){
    console.error("Błąd przy aktualizacji:", await response.text());
    return new Response("Failed", { status: response.status, headers: corsHeaders });
  }

  return new Response("OK", { headers: corsHeaders });
}