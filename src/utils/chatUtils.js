import { getPatientIdentity } from "./patientUtils";

export function normalizeMessagesPayload(payload) {
  const list = payload?.data?.data || payload?.data || payload;
  const items = Array.isArray(list) ? list : [];

  return items
    .map((item) => ({
      id: item?.id,
      body: item?.attributes?.body || "",
      isMine: Boolean(item?.attributes?.is_mine),
      time: item?.attributes?.created_at || "",
    }))
    .filter((entry) => entry.id && entry.body)
    .sort((a, b) => {
      const aTime = new Date(a.time).getTime();
      const bTime = new Date(b.time).getTime();

      if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
        return Number(a.id) - Number(b.id);
      }

      return aTime - bTime;
    });
}

export function buildNotification(patient, text) {
  return {
    id: `${Date.now()}-${Math.random()}`,
    patientId: patient.id,
    title: `New message from ${getPatientIdentity(patient).name}`,
    body: text,
    at: new Date().toLocaleTimeString(),
  };
}
