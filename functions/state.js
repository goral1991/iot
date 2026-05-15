export async function onRequestGet(context) {

  const token = context.request.headers
    .get("authorization")
    ?.replace("Bearer ", "");

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url =
    `${context.env.SUPABASE_URL}/rest/v1/devices` +
    `?token=eq.${token}&select=led_state`;

  const response = await fetch(url, {
    headers: {
      apikey: context.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${context.env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  });

  const data = await response.json();

  if (!data.length) {
    return new Response("Device not found", { status: 404 });
  }

  return Response.json({
    led: data[0].led_state
  });
}