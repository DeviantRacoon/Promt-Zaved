declare const browser: any;

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPES = ["openid", "email", "profile"];

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

function buildAuthUrl(redirectUri: string) {
  const p = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    response_type: "id_token",
    redirect_uri: redirectUri,
    scope: SCOPES.join(" "),
    prompt: "consent",
    include_granted_scopes: "true",
    state: crypto.randomUUID(),
    nonce: crypto.randomUUID()
  });
  return `${GOOGLE_AUTH_URL}?${p.toString()}`;
}

export async function firefoxGoogleOIDC(): Promise<{ idToken: string }> {
  const redirectUri = browser.identity.getRedirectURL();
  const url = buildAuthUrl(redirectUri);

  const redirected = await browser.identity.launchWebAuthFlow({
    url,
    interactive: true
  });

  const frag = new URL(redirected).hash.replace(/^#/, "");
  const params = new URLSearchParams(frag);

  const idToken = params.get("id_token");
  if (!idToken) throw new Error("No id_token in redirect");

  return { idToken };
}
