import api from "./api";

export const getMessagesByPatientId = async (patientId) => {
  const response = await api.get(`/chat/${patientId}/getmessages`);
  return response.data;
};

export const sendMessageToPatient = async ({ receiverId, body }) => {
  const response = await api.post("/chat/sendmessages", {
    receiverId,
    body,
  });

  return response.data;
};
