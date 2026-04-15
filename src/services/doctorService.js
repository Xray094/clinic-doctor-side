import api from "./api";

export const getDoctorDashboard = async () => {
	const response = await api.get("/doctors/dashboard");
	return response.data;
};

export const getDoctorProfile = async (doctorId) => {
	const response = await api.get(`/doctors/${doctorId}`);
	return response.data;
};
