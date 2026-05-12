import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAppointment,
  deleteDoctor,
  deletePatient,
  deleteSchedule,
  deleteVacation,
  getAdminOverview,
  listAppointments,
  listDoctors,
  listPatients,
  listSchedules,
  listVacations,
  saveDoctor,
  savePatient,
  saveSchedule,
  saveVacation,
} from "../services/mockClinicStore";

const invalidateAdminQueries = (queryClient, keys) => {
  keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
};

export const useAdminOverview = () =>
  useQuery({
    queryKey: ["admin", "overview"],
    queryFn: getAdminOverview,
  });

export const useDoctorsQuery = (params) =>
  useQuery({
    queryKey: ["admin", "doctors", params],
    queryFn: () => listDoctors(params),
  });

export const usePatientsQuery = (params) =>
  useQuery({
    queryKey: ["admin", "patients", params],
    queryFn: () => listPatients(params),
  });

export const useAppointmentsQuery = (params) =>
  useQuery({
    queryKey: ["admin", "appointments", params],
    queryFn: () => listAppointments(params),
  });

export const useSchedulesQuery = (params) =>
  useQuery({
    queryKey: ["admin", "schedules", params],
    queryFn: () => listSchedules(params),
  });

export const useVacationsQuery = (params) =>
  useQuery({
    queryKey: ["admin", "vacations", params],
    queryFn: () => listVacations(params),
  });

export const useSaveDoctorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDoctor,
    onSuccess: () => invalidateAdminQueries(queryClient, [["admin", "doctors"], ["admin", "overview"]]),
  });
};

export const useDeleteDoctorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => invalidateAdminQueries(queryClient, [["admin", "doctors"], ["admin", "overview"], ["admin", "appointments"], ["admin", "schedules"], ["admin", "vacations"]]),
  });
};

export const useSavePatientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePatient,
    onSuccess: () => invalidateAdminQueries(queryClient, [["admin", "patients"], ["admin", "overview"]]),
  });
};

export const useDeletePatientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePatient,
    onSuccess: () => invalidateAdminQueries(queryClient, [["admin", "patients"], ["admin", "overview"], ["admin", "appointments"]]),
  });
};

export const useSaveScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSchedule,
    onSuccess: () => invalidateAdminQueries(queryClient, [["admin", "schedules"], ["admin", "overview"]]),
  });
};

export const useDeleteScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => invalidateAdminQueries(queryClient, [["admin", "schedules"], ["admin", "overview"]]),
  });
};

export const useSaveVacationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveVacation,
    onSuccess: () => invalidateAdminQueries(queryClient, [["admin", "vacations"], ["admin", "overview"], ["admin", "schedules"]]),
  });
};

export const useDeleteVacationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVacation,
    onSuccess: () => invalidateAdminQueries(queryClient, [["admin", "vacations"], ["admin", "overview"], ["admin", "schedules"]]),
  });
};

export const useDeleteAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => invalidateAdminQueries(queryClient, [["admin", "appointments"], ["admin", "overview"]]),
  });
};
