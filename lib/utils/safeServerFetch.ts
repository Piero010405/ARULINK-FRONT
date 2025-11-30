// src/lib/utils/safeServerFetch.ts

function isHtml(text: string): boolean {
  return text.trim().startsWith("<") || text.includes("<html");
}

export async function safeServerFetch(
  url: string,
  options: RequestInit = {},
  retries: number = 1
): Promise<{ ok: boolean; status: number; data: any }> {
  let attempt = 0;

  while (attempt <= retries) {
    try {
      const res = await fetch(url, {
        ...options,
        cache: "no-store",
      });

      const status = res.status;
      const text = await res.text();

      // Cloudflare / nginx fallback
      if (isHtml(text)) {
        if (attempt === retries) {
          return { ok: false, status, data: null };
        }
        attempt++;
        continue;
      }

      let json = null;

      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        if (attempt === retries) {
          return { ok: false, status, data: null };
        }
        attempt++;
        continue;
      }

      return {
        ok: res.ok,
        status,
        data: json,
      };
    } catch (err) {
      if (attempt === retries) {
        return { ok: false, status: 0, data: null };
      }
    }

    attempt++;
    await new Promise((res) => setTimeout(res, 300 * attempt));
  }

  return { ok: false, status: 0, data: null };
}
