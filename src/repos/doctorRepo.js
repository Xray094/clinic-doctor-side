import { useQuery } from "@tanstack/react-query";
import { getDoctorDashboard, getDoctorProfile } from "../services/doctorService";

export const useDoctorDashboard = () => {
  return useQuery({
    queryKey: ["doctor-dashboard"],
    queryFn: getDoctorDashboard,
    refetchOnWindowFocus: false,
  });
};

export const useDoctorProfile = (doctorId) => {
  return useQuery({
    queryKey: ["doctor-profile", doctorId],
    queryFn: () => getDoctorProfile(doctorId),
    enabled: Boolean(doctorId),
    refetchOnWindowFocus: false,
  });
};
