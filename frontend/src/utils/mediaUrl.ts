const DEV_BACKEND_PORT = '8080';

function getBackendOrigin(): string {
  if (window.location.port === '5173') {
    return `${window.location.protocol}//${window.location.hostname}:${DEV_BACKEND_PORT}`;
  }

  return window.location.origin;
}

export function resolveMediaUrl(value?: string | null): string | undefined {
  if (!value) return undefined;

  const url = value.trim();
  if (!url) return undefined;

  if (/^(https?:|data:|blob:)/i.test(url)) {
    return url;
  }

  if (url.startsWith('/media/') || url.startsWith('/static/')) {
    return `${getBackendOrigin()}${url}`;
  }

  if (url.startsWith('avatars/') || url.startsWith('banners/')) {
    return `${getBackendOrigin()}/media/${url}`;
  }

  return url;
}
