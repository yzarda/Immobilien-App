import { PropertyDraft, PropertyInvestment } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unbekannter API-Fehler");
  }
  return response.json() as Promise<T>;
};

export const fetchProperties = async (): Promise<PropertyInvestment[]> => {
  const response = await fetch(`${API_BASE_URL}/properties`);
  return handleResponse<PropertyInvestment[]>(response);
};

export const createProperty = async (
  payload: PropertyDraft,
): Promise<PropertyInvestment> => {
  const response = await fetch(`${API_BASE_URL}/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<PropertyInvestment>(response);
};

export const updateProperty = async (
  id: string,
  payload: Partial<PropertyInvestment>,
): Promise<PropertyInvestment> => {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<PropertyInvestment>(response);
};

export const deleteProperty = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Fehler beim Löschen");
  }
};

export const apiConfig = {
  baseUrl: API_BASE_URL,
};

