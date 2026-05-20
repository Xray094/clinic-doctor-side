import { useMutation, useQuery } from "@tanstack/react-query";
import { getMessagesByPatientId, sendMessageToPatient } from "../services/chatService";
import { normalizeConversationPayload } from "../utils/chatUtils";

export const usePatientMessagesQuery = (patientId, config = {}) => {
  return useQuery({
    queryKey: ["chat-messages", patientId],
    queryFn: async () => {
      const response = await getMessagesByPatientId(patientId);
      return normalizeConversationPayload(response);
    },
    enabled: Boolean(patientId),
    ...config,
  });
};

export const useSendPatientMessageMutation = () => {
  return useMutation({
    mutationFn: sendMessageToPatient,
  });
};
