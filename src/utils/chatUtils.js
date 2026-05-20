import { getPatientIdentity } from "./patientUtils";

export function normalizeMessagesPayload(payload) {
  const list = payload?.data?.data || payload?.data || payload;
  const items = Array.isArray(list) ? list : [];

  return items
    .map((item) => ({
      id: item?.id,
      body: item?.attributes?.body || "",
      sender_user_id: item?.attributes?.sender_user_id ?? null,
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

export function normalizeConversationPayload(payload) {
  const data = payload?.data?.data || payload?.data || payload;
  const conversationId = data?.conversation_id ?? null;
  const messageList = data?.messages ?? data;

  return {
    conversationId: conversationId ? String(conversationId) : null,
    messages: normalizeMessagesPayload(messageList),
  };
}

function extractMessageRecord(payload) {
  const nestedData = payload?.data?.data;
  if (nestedData && typeof nestedData === "object" && !Array.isArray(nestedData)) {
    return nestedData;
  }

  const directData = payload?.data;
  if (directData && typeof directData === "object" && !Array.isArray(directData)) {
    return directData;
  }

  if (payload?.message && typeof payload.message === "object" && !Array.isArray(payload.message)) {
    return payload.message;
  }

  if (payload?.data?.message && typeof payload.data.message === "object" && !Array.isArray(payload.data.message)) {
    return payload.data.message;
  }

  return payload;
}

export function normalizeBroadcastMessage(payload) {
  const message = extractMessageRecord(payload);

  return {
    id: message?.id ? String(message.id) : null,
    body: message?.attributes?.body || message?.body || "",
    sender_user_id: message?.attributes?.sender_user_id ?? message?.sender_user_id ?? null,
    time: message?.attributes?.created_at || message?.time || "",
  };
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
