export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };

  const body = await context.request.json();
  const { token, led, ota, mode, valve } = body;

  if (!token) return new Response("Bad request: no token", { status: 400, headers: corsHeaders });

  const update = { updated_at: new Date().toISOString() };

  if (typeof led === "boolean") update.led_state = led;
  if (typeof ota === "boolean") update.ota_trigger = ota;
  if (typeof mode === "string") update.mode = mode;
  if (typeof valve === "boolean") update.valve = valve;

  await fetch(`${context.env.SUPABASE_URL}/rest/v1/devices?token=eq.${token}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: context.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${context.env.SUPABASE_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify(update)
  });

  return new Response("OK", { headers: corsHeaders });
}