import type { Ad, AdsResponse, NewAd } from './types';

export const API_URL =
  import.meta.env.VITE_API_URL ?? 'https://inai-col1.fishrungames.com';

async function readError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { detail?: unknown };
    return typeof data.detail === 'string' ? data.detail : 'Проверьте введённые данные.';
  } catch {
    return 'Сервер вернул ошибку.';
  }
}

export async function getAds(page: number, limit: number): Promise<AdsResponse> {
  const response = await fetch(`${API_URL}/ads?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as AdsResponse;
}

export async function createAd(newAd: NewAd): Promise<Ad> {
  const formData = new FormData();
  formData.append('title', newAd.title);
  formData.append('description', newAd.description);
  formData.append('price', String(newAd.price));
  formData.append('image', newAd.image);

  const response = await fetch(`${API_URL}/ads`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as Ad;
}

export function getImageUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
