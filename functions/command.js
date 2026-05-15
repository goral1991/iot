export async function onRequestPost(context) {

  const body = await context.request.json();

  const { token, led } = body;

  if (!token || typeof led !== "boolean") {
    return new Response("Bad request", { status: 400 });
  }

  const url =
    `${context.env.SUPABASE_URL}/rest/v1/devices?token=eq.${token}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: context.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${context.env.SUPABASE_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({
      led_state: led,
      updated_at: new Date().toISOString()
    })
  });

  return new Response("OK");
}