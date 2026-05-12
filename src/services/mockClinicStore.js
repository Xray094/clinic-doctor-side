const STORAGE_KEY = "medics-mock-clinic-store-v1";

const createSeedState = () => ({
  nextId: 100,
  users: [
    {
      id: "1",
      first_name: "Rana",
      last_name: "Haddad",
      email: "admin@medics.local",
      phone: "+962 79 000 0000",
      password: "Admin123!",
      user_status: "active",
      wallet_balance: "0.00",
      role: "admin",
      created_at: "2026-05-01T08:00:00.000Z",
    },
    {
      id: "2",
      first_name: "Lina",
      last_name: "Nasser",
      email: "doctor.lina@medics.local",
      phone: "+962 79 100 0001",
      password: "Doctor123!",
      user_status: "active",
      wallet_balance: "180.00",
      role: "doctor",
      created_at: "2026-05-02T08:00:00.000Z",
    },
    {
      id: "3",
      first_name: "Yazan",
      last_name: "Saleh",
      email: "doctor.yazan@medics.local",
      phone: "+962 79 100 0002",
      password: "Doctor123!",
      user_status: "active",
      wallet_balance: "220.00",
      role: "doctor",
      created_at: "2026-05-03T08:00:00.000Z",
    },
    {
      id: "4",
      first_name: "Mira",
      last_name: "Sabbagh",
      email: "doctor.mira@medics.local",
      phone: "+962 79 100 0003",
      password: "Doctor123!",
      user_status: "active",
      wallet_balance: "210.00",
      role: "doctor",
      created_at: "2026-05-04T08:00:00.000Z",
    },
    {
      id: "8",
      first_name: "Omar",
      last_name: "Khalil",
      email: "patient.omar@medics.local",
      phone: "+962 79 200 0001",
      password: "Patient123!",
      user_status: "active",
      wallet_balance: "45.00",
      role: "patient",
      created_at: "2026-05-08T08:00:00.000Z",
    },
    {
      id: "9",
      first_name: "Sara",
      last_name: "Ibrahim",
      email: "patient.sara@medics.local",
      phone: "+962 79 200 0002",
      password: "Patient123!",
      user_status: "active",
      wallet_balance: "58.00",
      role: "patient",
      created_at: "2026-05-09T08:00:00.000Z",
    },
    {
      id: "10",
      first_name: "Alaa",
      last_name: "Hamdan",
      email: "patient.alaa@medics.local",
      phone: "+962 79 200 0003",
      password: "Patient123!",
      user_status: "pending",
      wallet_balance: "12.00",
      role: "patient",
      created_at: "2026-05-10T08:00:00.000Z",
    },
    {
      id: "11",
      first_name: "Noor",
      last_name: "Mansour",
      email: "patient.noor@medics.local",
      phone: "+962 79 200 0004",
      password: "Patient123!",
      user_status: "active",
      wallet_balance: "27.50",
      role: "patient",
      created_at: "2026-05-11T08:00:00.000Z",
    },
  ],
  doctors: [
    {
      id: "21",
      user_id: "2",
      specialization: "Cardiologist",
      bio: "Focuses on preventive heart care and follow-up plans.",
      education: "University of Jordan - MD",
      certification: "Board Certified Cardiologist",
      years_of_experience: 11,
      session_price: "35.00",
      license_number: "DOC-2201",
      gender: "female",
      created_at: "2026-05-02T10:00:00.000Z",
      updated_at: "2026-05-10T09:00:00.000Z",
    },
    {
      id: "22",
      user_id: "3",
      specialization: "General Practitioner",
      bio: "Primary care, follow-up, and general clinic consultations.",
      education: "Jordan University of Science and Technology - MBBS",
      certification: "Family Medicine Diploma",
      years_of_experience: 8,
      session_price: "25.00",
      license_number: "DOC-2202",
      gender: "male",
      created_at: "2026-05-03T10:00:00.000Z",
      updated_at: "2026-05-10T09:00:00.000Z",
    },
    {
      id: "23",
      user_id: "4",
      specialization: "Gynecologist",
      bio: "Women’s health, preventive screenings, and consultations.",
      education: "Damascus University - MD",
      certification: "Board Certified OB/GYN",
      years_of_experience: 13,
      session_price: "40.00",
      license_number: "DOC-2203",
      gender: "female",
      created_at: "2026-05-04T10:00:00.000Z",
      updated_at: "2026-05-10T09:00:00.000Z",
    },
  ],
  patients: [
    { id: "41", user_id: "8", emergency_contact_name: "Khaled Khalil", emergency_contact_phone: "+962 79 300 0001", allergies: "Penicillin", chronic_diseases: "Hypertension", weight: 82.4, height: 176, gender: "male", blood_type: "A+", date_of_birth: "1992-04-12", created_at: "2026-05-08T09:00:00.000Z" },
    { id: "42", user_id: "9", emergency_contact_name: "Abeer Ibrahim", emergency_contact_phone: "+962 79 300 0002", allergies: "None", chronic_diseases: "Asthma", weight: 63.1, height: 168, gender: "female", blood_type: "O+", date_of_birth: "1995-09-18", created_at: "2026-05-09T09:00:00.000Z" },
    { id: "43", user_id: "10", emergency_contact_name: "Mazen Hamdan", emergency_contact_phone: "+962 79 300 0003", allergies: "Dust", chronic_diseases: "Diabetes", weight: 74.2, height: 171, gender: "male", blood_type: "B+", date_of_birth: "1989-02-06", created_at: "2026-05-10T09:00:00.000Z" },
    { id: "44", user_id: "11", emergency_contact_name: "Rula Mansour", emergency_contact_phone: "+962 79 300 0004", allergies: "Seafood", chronic_diseases: "Migraine", weight: 59.9, height: 164, gender: "female", blood_type: "AB+", date_of_birth: "2000-11-22", created_at: "2026-05-11T09:00:00.000Z" },
  ],
  appointments: [
    { id: "51", patient_id: "41", doctor_id: "21", appointment_date: "2026-05-12", start_time: "09:00", end_time: "09:30", status: "confirmed", reason: "Blood pressure follow-up", notes: "Bring recent lab results.", reminder_sent: true, created_at: "2026-05-10T10:00:00.000Z" },
    { id: "52", patient_id: "42", doctor_id: "22", appointment_date: "2026-05-12", start_time: "10:00", end_time: "10:20", status: "pending", reason: "Annual checkup", notes: "First visit at clinic.", reminder_sent: false, created_at: "2026-05-10T10:10:00.000Z" },
    { id: "53", patient_id: "43", doctor_id: "23", appointment_date: "2026-05-13", start_time: "11:00", end_time: "11:30", status: "completed", reason: "Prenatal review", notes: "All good, schedule next trimester visit.", reminder_sent: true, created_at: "2026-05-10T10:20:00.000Z" },
    { id: "54", patient_id: "44", doctor_id: "21", appointment_date: "2026-05-14", start_time: "12:00", end_time: "12:30", status: "cancelled", reason: "Chest discomfort consultation", notes: "Patient rebooked after travel.", reminder_sent: false, created_at: "2026-05-10T10:30:00.000Z" },
    { id: "55", patient_id: "41", doctor_id: "22", appointment_date: "2026-05-15", start_time: "13:00", end_time: "13:20", status: "no_show", reason: "General follow-up", notes: "Marked after no attendance.", reminder_sent: true, created_at: "2026-05-10T10:40:00.000Z" },
  ],
  schedules: [
    { id: "61", doctor_id: "21", day_of_week: "sunday", start_time: "08:00", end_time: "14:00", slot_duration: 30, status: "active", created_at: "2026-05-02T11:00:00.000Z" },
    { id: "62", doctor_id: "21", day_of_week: "tuesday", start_time: "08:00", end_time: "14:00", slot_duration: 30, status: "active", created_at: "2026-05-02T11:10:00.000Z" },
    { id: "63", doctor_id: "22", day_of_week: "monday", start_time: "09:00", end_time: "15:00", slot_duration: 20, status: "active", created_at: "2026-05-03T11:00:00.000Z" },
    { id: "64", doctor_id: "22", day_of_week: "wednesday", start_time: "09:00", end_time: "15:00", slot_duration: 20, status: "active", created_at: "2026-05-03T11:10:00.000Z" },
    { id: "65", doctor_id: "23", day_of_week: "thursday", start_time: "10:00", end_time: "16:00", slot_duration: 30, status: "active", created_at: "2026-05-04T11:00:00.000Z" },
    { id: "66", doctor_id: "23", day_of_week: "friday", start_time: "10:00", end_time: "14:00", slot_duration: 30, status: "on_leave", created_at: "2026-05-04T11:10:00.000Z" },
  ],
  vacations: [
    { id: "71", doctor_id: "21", start_date: "2026-06-01", end_date: "2026-06-05", reason: "Conference attendance", status: "approved", created_at: "2026-05-08T12:00:00.000Z" },
    { id: "72", doctor_id: "22", start_date: "2026-06-10", end_date: "2026-06-12", reason: "Family leave", status: "pending", created_at: "2026-05-09T12:00:00.000Z" },
    { id: "73", doctor_id: "23", start_date: "2026-06-18", end_date: "2026-06-22", reason: "Medical leave", status: "approved", created_at: "2026-05-10T12:00:00.000Z" },
  ],
});

const clone = (value) => JSON.parse(JSON.stringify(value));

const loadState = () => {
  if (typeof window === "undefined") {
    return createSeedState();
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...createSeedState(), ...JSON.parse(saved) };
    }
  } catch {
    return createSeedState();
  }

  return createSeedState();
};

let state = loadState();

const persist = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const nextId = () => String(state.nextId++);

const userSummary = (user) => ({
  id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  phone: user.phone,
  wallet_balance: user.wallet_balance,
  user_status: user.user_status,
  role: user.role,
  created_at: user.created_at,
});

const getUserById = (id) => state.users.find((user) => user.id === String(id));

const getDoctorById = (id) => state.doctors.find((doctor) => doctor.id === String(id));
const getPatientById = (id) => state.patients.find((patient) => patient.id === String(id));

const enrichDoctor = (doctor) => {
  const user = getUserById(doctor.user_id);

  return {
    ...clone(doctor),
    user: user ? userSummary(user) : null,
    appointments_count: state.appointments.filter((appointment) => appointment.doctor_id === doctor.id).length,
    schedules_count: state.schedules.filter((schedule) => schedule.doctor_id === doctor.id).length,
    vacations_count: state.vacations.filter((vacation) => vacation.doctor_id === doctor.id).length,
  };
};

const enrichPatient = (patient) => {
  const user = getUserById(patient.user_id);

  return {
    ...clone(patient),
    user: user ? userSummary(user) : null,
    appointments_count: state.appointments.filter((appointment) => appointment.patient_id === patient.id).length,
  };
};

const enrichSchedule = (schedule) => {
  const doctor = getDoctorById(schedule.doctor_id);

  return {
    ...clone(schedule),
    doctor: doctor ? enrichDoctor(doctor) : null,
  };
};

const enrichVacation = (vacation) => {
  const doctor = getDoctorById(vacation.doctor_id);

  return {
    ...clone(vacation),
    doctor: doctor ? enrichDoctor(doctor) : null,
  };
};

const enrichAppointment = (appointment) => {
  const doctor = getDoctorById(appointment.doctor_id);
  const patient = getPatientById(appointment.patient_id);

  return {
    ...clone(appointment),
    doctor: doctor ? enrichDoctor(doctor) : null,
    patient: patient ? enrichPatient(patient) : null,
  };
};

const matchesQuery = (record, query, fields) => {
  if (!query) {
    return true;
  }

  const needle = query.trim().toLowerCase();

  return fields.some((field) => String(field ?? "").toLowerCase().includes(needle));
};

const paginate = (items, page = 1, perPage = 5) => {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const start = (safePage - 1) * perPage;

  return {
    data: items.slice(start, start + perPage),
    meta: {
      page: safePage,
      perPage,
      total,
      totalPages,
    },
  };
};

export const mockAdminCredentials = {
  email: "admin@medics.local",
  password: "Admin123!",
};

export const loginMockAccount = ({ email, password, role }) => {
  const user = state.users.find((entry) => entry.email === email && entry.password === password && (!role || entry.role === role));

  if (!user) {
    return null;
  }

  const token = `mock-${user.role}-${user.id}-${Date.now()}`;
  const responseUser = {
    id: user.id,
    role: user.role,
    roles: [user.role],
    attributes: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      wallet_balance: user.wallet_balance,
      user_status: user.user_status,
      role: user.role,
      created_at: user.created_at,
    },
  };

  if (user.role === "doctor") {
    const doctor = state.doctors.find((entry) => entry.user_id === user.id);

    responseUser.doctor_id = doctor?.id ?? null;
    responseUser.relationships = { doctor: doctor ? enrichDoctor(doctor) : null };
  }

  if (user.role === "patient") {
    const patient = state.patients.find((entry) => entry.user_id === user.id);

    responseUser.patient_id = patient?.id ?? null;
    responseUser.relationships = { patient: patient ? enrichPatient(patient) : null };
  }

  return {
    data: {
      user: responseUser,
      token,
    },
  };
};

export const getAdminOverview = () => {
  const today = new Date().toISOString().slice(0, 10);

  return {
    totals: {
      doctors: state.doctors.length,
      patients: state.patients.length,
      appointments: state.appointments.length,
      schedules: state.schedules.length,
      vacations: state.vacations.length,
      active_accounts: state.users.filter((user) => user.user_status === "active").length,
    },
    focus: {
      today_appointments: state.appointments.filter((appointment) => appointment.appointment_date === today).length,
      pending_appointments: state.appointments.filter((appointment) => appointment.status === "pending").length,
      completed_appointments: state.appointments.filter((appointment) => appointment.status === "completed").length,
      active_schedules: state.schedules.filter((schedule) => schedule.status === "active").length,
      vacation_days: state.vacations.reduce((sum, vacation) => {
        const start = new Date(vacation.start_date);
        const end = new Date(vacation.end_date);
        const days = Math.max(1, Math.round((end - start) / 86400000) + 1);

        return sum + days;
      }, 0),
    },
    recent_doctors: state.doctors.slice(-3).reverse().map(enrichDoctor),
    recent_appointments: state.appointments.slice(-4).reverse().map(enrichAppointment),
    recent_vacations: state.vacations.slice(-3).reverse().map(enrichVacation),
  };
};

export const listDoctors = ({ page = 1, perPage = 5, search = "" } = {}) => {
  const doctors = state.doctors
    .map(enrichDoctor)
    .filter((doctor) => matchesQuery(doctor, search, [
      doctor.user?.first_name,
      doctor.user?.last_name,
      doctor.user?.email,
      doctor.specialization,
      doctor.license_number,
      doctor.gender,
    ]));

  return paginate(doctors, page, perPage);
};

export const listPatients = ({ page = 1, perPage = 5, search = "" } = {}) => {
  const patients = state.patients
    .map(enrichPatient)
    .filter((patient) => matchesQuery(patient, search, [
      patient.user?.first_name,
      patient.user?.last_name,
      patient.user?.email,
      patient.emergency_contact_name,
      patient.blood_type,
      patient.gender,
    ]));

  return paginate(patients, page, perPage);
};

export const listAppointments = ({ page = 1, perPage = 5, search = "" } = {}) => {
  const appointments = state.appointments
    .map(enrichAppointment)
    .filter((appointment) => matchesQuery(appointment, search, [
      appointment.patient?.user?.first_name,
      appointment.patient?.user?.last_name,
      appointment.doctor?.user?.first_name,
      appointment.doctor?.user?.last_name,
      appointment.status,
      appointment.reason,
      appointment.appointment_date,
    ]));

  return paginate(appointments, page, perPage);
};

export const listSchedules = ({ page = 1, perPage = 5, search = "", doctorId = "all" } = {}) => {
  const schedules = state.schedules
    .map(enrichSchedule)
    .filter((schedule) => doctorId === "all" || schedule.doctor_id === String(doctorId))
    .filter((schedule) => matchesQuery(schedule, search, [
      schedule.doctor?.user?.first_name,
      schedule.doctor?.user?.last_name,
      schedule.day_of_week,
      schedule.status,
    ]));

  return paginate(schedules, page, perPage);
};

export const listVacations = ({ page = 1, perPage = 5, search = "", doctorId = "all" } = {}) => {
  const vacations = state.vacations
    .map(enrichVacation)
    .filter((vacation) => doctorId === "all" || vacation.doctor_id === String(doctorId))
    .filter((vacation) => matchesQuery(vacation, search, [
      vacation.doctor?.user?.first_name,
      vacation.doctor?.user?.last_name,
      vacation.reason,
      vacation.status,
    ]));

  return paginate(vacations, page, perPage);
};

const upsertUser = ({ id, role, first_name, last_name, email, phone, password, user_status, wallet_balance }) => {
  if (id) {
    const existing = state.users.find((user) => user.id === String(id));
    if (!existing) {
      return null;
    }

    existing.first_name = first_name;
    existing.last_name = last_name;
    existing.email = email;
    existing.phone = phone;
    if (password) {
      existing.password = password;
    }
    existing.user_status = user_status;
    existing.wallet_balance = wallet_balance;
    existing.role = role;

    return existing;
  }

  const user = {
    id: nextId(),
    first_name,
    last_name,
    email,
    phone,
    password,
    user_status,
    wallet_balance,
    role,
    created_at: new Date().toISOString(),
  };

  state.users.unshift(user);
  return user;
};

export const saveDoctor = (payload) => {
  const user = upsertUser({
    id: payload.user?.id,
    role: "doctor",
    first_name: payload.user.first_name,
    last_name: payload.user.last_name,
    email: payload.user.email,
    phone: payload.user.phone,
    password: payload.user.password,
    user_status: payload.user.user_status,
    wallet_balance: payload.user.wallet_balance,
  });

  const existingDoctor = payload.id ? getDoctorById(payload.id) : null;

  const doctor = {
    id: payload.id ? String(payload.id) : nextId(),
    user_id: user.id,
    specialization: payload.specialization,
    bio: payload.bio,
    education: payload.education,
    certification: payload.certification,
    years_of_experience: Number(payload.years_of_experience),
    session_price: String(payload.session_price),
    license_number: payload.license_number,
    gender: payload.gender,
    created_at: existingDoctor?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existingDoctor) {
    state.doctors = state.doctors.map((entry) => (entry.id === doctor.id ? doctor : entry));
  } else {
    state.doctors.unshift(doctor);
  }

  persist();

  return enrichDoctor(doctor);
};

export const deleteDoctor = (doctorId) => {
  const doctor = getDoctorById(doctorId);
  if (!doctor) {
    return { ok: false };
  }

  state.doctors = state.doctors.filter((entry) => entry.id !== doctor.id);
  state.users = state.users.filter((user) => user.id !== doctor.user_id);
  state.schedules = state.schedules.filter((schedule) => schedule.doctor_id !== doctor.id);
  state.vacations = state.vacations.filter((vacation) => vacation.doctor_id !== doctor.id);
  state.appointments = state.appointments.filter((appointment) => appointment.doctor_id !== doctor.id);
  persist();

  return { ok: true };
};

export const savePatient = (payload) => {
  const user = upsertUser({
    id: payload.user?.id,
    role: "patient",
    first_name: payload.user.first_name,
    last_name: payload.user.last_name,
    email: payload.user.email,
    phone: payload.user.phone,
    password: payload.user.password,
    user_status: payload.user.user_status,
    wallet_balance: payload.user.wallet_balance,
  });

  const existingPatient = payload.id ? getPatientById(payload.id) : null;

  const patient = {
    id: payload.id ? String(payload.id) : nextId(),
    user_id: user.id,
    emergency_contact_name: payload.emergency_contact_name,
    emergency_contact_phone: payload.emergency_contact_phone,
    allergies: payload.allergies,
    chronic_diseases: payload.chronic_diseases,
    weight: Number(payload.weight),
    height: Number(payload.height),
    gender: payload.gender,
    blood_type: payload.blood_type,
    date_of_birth: payload.date_of_birth,
    created_at: existingPatient?.created_at ?? new Date().toISOString(),
  };

  if (existingPatient) {
    state.patients = state.patients.map((entry) => (entry.id === patient.id ? patient : entry));
  } else {
    state.patients.unshift(patient);
  }

  persist();

  return enrichPatient(patient);
};

export const deletePatient = (patientId) => {
  const patient = getPatientById(patientId);
  if (!patient) {
    return { ok: false };
  }

  state.patients = state.patients.filter((entry) => entry.id !== patient.id);
  state.users = state.users.filter((user) => user.id !== patient.user_id);
  state.appointments = state.appointments.filter((appointment) => appointment.patient_id !== patient.id);
  persist();

  return { ok: true };
};

export const saveSchedule = (payload) => {
  const existing = payload.id ? state.schedules.find((schedule) => schedule.id === String(payload.id)) : null;

  const schedule = {
    id: payload.id ? String(payload.id) : nextId(),
    doctor_id: String(payload.doctor_id),
    day_of_week: payload.day_of_week,
    start_time: payload.start_time,
    end_time: payload.end_time,
    slot_duration: Number(payload.slot_duration),
    status: payload.status,
    created_at: existing?.created_at ?? new Date().toISOString(),
  };

  if (existing) {
    state.schedules = state.schedules.map((entry) => (entry.id === schedule.id ? schedule : entry));
  } else {
    state.schedules.unshift(schedule);
  }

  persist();

  return enrichSchedule(schedule);
};

export const deleteSchedule = (scheduleId) => {
  state.schedules = state.schedules.filter((schedule) => schedule.id !== String(scheduleId));
  persist();
  return { ok: true };
};

export const saveVacation = (payload) => {
  const existing = payload.id ? state.vacations.find((vacation) => vacation.id === String(payload.id)) : null;

  const vacation = {
    id: payload.id ? String(payload.id) : nextId(),
    doctor_id: String(payload.doctor_id),
    start_date: payload.start_date,
    end_date: payload.end_date,
    reason: payload.reason,
    status: payload.status,
    created_at: existing?.created_at ?? new Date().toISOString(),
  };

  if (existing) {
    state.vacations = state.vacations.map((entry) => (entry.id === vacation.id ? vacation : entry));
  } else {
    state.vacations.unshift(vacation);
  }

  persist();

  return enrichVacation(vacation);
};

export const deleteVacation = (vacationId) => {
  state.vacations = state.vacations.filter((vacation) => vacation.id !== String(vacationId));
  persist();
  return { ok: true };
};

export const deleteAppointment = (appointmentId) => {
  state.appointments = state.appointments.filter((appointment) => appointment.id !== String(appointmentId));
  persist();
  return { ok: true };
};

export const getDoctorOptions = () => state.doctors.map(enrichDoctor);

export const listAppointmentsByDoctor = (doctorId) =>
  state.appointments.filter((appointment) => appointment.doctor_id === String(doctorId)).map(enrichAppointment);
