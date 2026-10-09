export async function purgeCloudflareCache(urls?: string[]): Promise<boolean> {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!zoneId || !apiToken) {
    return false;
  }

  try {
    const endpoint = `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`;
    const body = urls && urls.length > 0 ? { files: urls } : { purge_everything: true };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return data.success === true;
  } catch (error) {
    console.error("Gagal melakukan purge cache Cloudflare:", error);
    return false;
  }
}
