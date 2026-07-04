type AccessTokenPayload = {
  user_id?: string | number;
  id?: string | number;
  sub?: string | number;
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), '=');

  return atob(padded);
}

export function getLoggedInUserId() {
  const accessToken = localStorage.getItem('access');

  if (!accessToken || accessToken === 'undefined' || accessToken === 'null') {
    return null;
  }

  try {
    const payload = accessToken.split('.')[1];
    if (!payload) return null;

    const decodedPayload = JSON.parse(decodeBase64Url(payload)) as AccessTokenPayload;
    const userId = decodedPayload.user_id ?? decodedPayload.id ?? decodedPayload.sub;

    return userId === undefined || userId === null ? null : String(userId);
  } catch {
    return null;
  }
}
