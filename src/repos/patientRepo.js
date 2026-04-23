import { useQuery } from "@tanstack/react-query";
import { getPatientById, getPatients } from "../services/patientService";
import { normalizePatientPayload, normalizePatientsPayload } from "../utils/patientUtils";

export const usePatientsQuery = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await getPatients();
      return normalizePatientsPayload(response);
    },
  });
};

export const usePatientByIdQuery = (patientId) => {
  return useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      const response = await getPatientById(patientId);
      return normalizePatientPayload(response);
    },
    enabled: Boolean(patientId),
  });
};
