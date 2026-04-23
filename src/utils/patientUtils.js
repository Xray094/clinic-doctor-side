export function normalizePatientsPayload(payload) {
  const list = payload?.data?.data || payload?.data || payload;
  return Array.isArray(list) ? list : [];
}

export function normalizePatientPayload(payload) {
  const patient = payload?.data?.data || payload?.data || payload;
  return patient && typeof patient === "object" ? patient : null;
}

function getPatientPrimaryUser(patient) {
  const userRelation = patient?.relationships?.user;

  if (Array.isArray(userRelation)) {
    return userRelation[0] || null;
  }

  if (userRelation && typeof userRelation === "object") {
    return userRelation;
  }

  return null;
}

export function getPatientIdentity(patient) {
  const user = getPatientPrimaryUser(patient);
  const first = user?.first_name || patient?.attributes?.first_name || "Patient";
  const last = user?.last_name || patient?.attributes?.last_name || "";

  return {
    user,
    name: `${first} ${last}`.trim(),
  };
}

export function formatDateOnly(value) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
