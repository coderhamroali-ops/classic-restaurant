// Адрес API: в браузере — NEXT_PUBLIC_API_URL, на сервере Next можно задать отдельный API_URL (например, внутри Docker).
export const API_URL =
  (typeof window === "undefined" ? process.env.API_URL : undefined) ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000/api";

export type Role = "admin" | "manager";
export type BookingStatus = "new" | "confirmed" | "cancelled";

export interface MenuDish {
  id: number;
  name: string;
  price: number;
  description: string;
  photoUrl: string | null;
}
export interface MenuCategory {
  id: number;
  name: string;
  dishes: MenuDish[];
}
export interface Dish extends MenuDish {
  categoryId: number;
  isAvailable: boolean;
  sortOrder: number;
}
export interface Category {
  id: number;
  name: string;
  sortOrder: number;
}
export interface Booking {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  occasion: string;
  comment: string;
  status: BookingStatus;
  createdAt: string;
}
export interface Staff {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Запрос к API. Ошибки валидации Nest приходят массивом — склеиваем в одну строку. */
export async function api<T>(path: string, init: RequestInit & { token?: string | null } = {}): Promise<T> {
  const { token, headers, ...rest } = init;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const msg = Array.isArray(body?.message) ? body.message.join(", ") : body?.message;
    throw new ApiError(res.status, msg || `Ошибка ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

/** 1450 → «1 450 с» */
export const formatPrice = (n: number) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} с`;
