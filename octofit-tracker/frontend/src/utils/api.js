export function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

  if (typeof codespaceName === 'string' && codespaceName.trim()) {
    return `https://${codespaceName.trim()}-8000.app.github.dev`;
  }

  return 'http://localhost:8000';
}

export function getApiUrl(resource) {
  const cleanedResource = String(resource ?? '').replace(/^\/+|\/+$/g, '');
  return `${getApiBaseUrl()}/api/${cleanedResource}/`;
}

export function normalizeCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (payload && typeof payload === 'object') {
    const firstArrayValue = Object.values(payload).find(Array.isArray);
    if (firstArrayValue) {
      return firstArrayValue;
    }
  }

  return [];
}

export async function fetchCollection(resource) {
  const response = await fetch(getApiUrl(resource));

  if (!response.ok) {
    throw new Error(`Request failed for ${resource}: ${response.status}`);
  }

  const payload = await response.json();
  return normalizeCollection(payload);
}
