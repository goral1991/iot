export async function onRequestGet(context) {

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET,OPTIONS"
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const token = context.request.headers
    .get("authorization")
    ?.replace("Bearer ", "");

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url =
    `${context.env.SUPABASE_URL}/rest/v1/devices` +
    `?token=eq.${token}&select=led_state,ota_trigger,ota_version`;

  const res = await fetch(url, {
    headers: {
      apikey: context.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${context.env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  });

  const data = await res.json();

  if (!data.length) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(
    JSON.stringify({
      led: data[0].led_state,
      ota: data[0].ota_trigger,
      version: data[0].ota_version
    }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );
}