export type Role = 'ADMIN' | 'DOCTOR' | 'ALUMNO';

export interface AuthUser {
  id?: number;
  token: string;
  type: string;
  username: string;
  roles: Role[];
  puedeVerAuditoria?: boolean;
}

export interface Doctor {
  id: number;
  nombre: string;
  apellido: string;
  dni?: string;
  matricula?: string;
  telefonoCelular?: string;
  telefonoFijo?: string;
  email?: string;
  domicilio?: string;
  ciudad?: string;
}

export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  dni?: string;
  matricula?: string;
  telefonoCelular?: string;
  telefonoFijo?: string;
  email?: string;
  domicilio?: string;
  ciudad?: string;
}

export interface Duenio {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefonoCelular?: string;
  telefonoFijo?: string;
  email?: string;
  facebook?: string;
  domicilio?: string;
  ciudad?: string;
}

export interface Especie {
  id: number;
  especie: string;
}

export interface Raza {
  id: number;
  raza: string;
  especieId: number;
  especie?: Especie;
}

export interface Animal {
  id: number;
  nombre: string;
  nacimiento?: string;
  sexo?: string;
  peso?: string;
  color?: string;
  duenioId: number;
  duenio?: Duenio;
  especieId: number;
  especie?: Especie;
  razaId?: number;
  raza?: Raza;
  tipo: 'PEQUENIO' | 'GRANDE';
  vivo: boolean;
}

export interface Consulta {
  id: number;
  casoClinico?: string;
  fecha: string;
  motivo: string;
  anamnesis?: string;
  animalId: number;
  animal?: Animal;
  doctorId: number;
  doctor?: Doctor;
  alumnoId?: number;
  alumno?: Alumno;
  // Campos planos del backend (más de 100 campos posibles)
  temperatura?: string;
  fc?: string;
  fr?: string;
  cc?: string;
  llCap?: string;
  pulsoRitmo?: string;
  pulsoIntensidad?: string;
  hidratacion?: string;
  maOcular?: string;
  maBucal?: string;
  maNasal?: string;
  maGenital?: string;
  submandibular?: string;
  axilar?: string;
  inguinales?: string;
  popliteos?: string;
  lesionTipo?: string;
  lesionForma?: string;
  lesionUbicacion?: string;
  lesionSimetria?: string;
  olor?: string;
  prurito?: string;
  mantoPiloso?: string;
  ectoparasitos?: string;
  oido?: string;
  boca?: string;
  esofago?: string;
  estomago?: string;
  intestino?: string;
  higado?: string;
  regurgitacion?: string;
  vomito?: string;
  diarrea?: string;
  ruidos?: string;
  distension?: string;
  viasSuperiores?: string;
  viasInferiores?: string;
  ritmoRespiratorio?: string;
  tipo?: string;
  tosReflejo?: string;
  auscultacion?: string;
  corazonAuscultacion?: string;
  ritmoCorazon?: string;
  riñones?: string;
  ureteres?: string;
  vejiga?: string;
  uretra?: string;
  secreciones?: string;
  orina?: string;
  genitalesInterno?: string;
  genitalesExterno?: string;
  genitalesSecreciones?: string;
  tactoRectal?: string;
  locomotorLesion?: string;
  locomotorUbicacionL?: string;
  locomotorDeformacion?: string;
  locomotorUbicacionD?: string;
  claudicacionMiembro?: string;
  claudicacionTipo?: string;
  nerviosoUbicacion?: string;
  paralisis?: string;
  paresia?: string;
  convulsion?: string;
  ataxia?: string;
  reflejos?: string;
  sensibilidad?: string;
  conducta?: string;
  estadoSensorio?: string;
  snms?: string;
  snmi?: string;
  ojoDerecho?: string;
  ojoIzq?: string;
  diagnosticoPresuntivo?: string;
  diagnosticoDiferencial?: string;
  diagnosticoPronostico?: string;
  tratamiento?: string;
  indicaciones?: string;
  medicamentos?: ConsultaMedicamento[];
  [key: string]: any;
}

export interface Derivacion {
  id: number;
  fecha: string;
  anamnesis?: string;
  sistema?: string;
  indicaciones?: string;
  animalId: number;
  animal?: Animal;
  doctorId: number;
  doctor?: Doctor;
  alumnoId?: number;
  alumno?: Alumno;
}

export interface Retorno {
  id: number;
  consultaId?: number;
  consulta?: Consulta;
  fecha: string;
  anamnesis?: string;
  temperatura?: string;
  fc?: string;
  fr?: string;
  cc?: string;
  llCap?: string;
  pulsoRitmo?: string;
  pulsoIntensidad?: string;
  hidratacion?: string;
  maOcular?: string;
  maBucal?: string;
  maNasal?: string;
  maGenital?: string;
  submandibular?: string;
  axilar?: string;
  inguinales?: string;
  popliteos?: string;
  indicaciones?: string;
  animalId: number;
  animal?: Animal;
  doctorId: number;
  doctor?: Doctor;
  alumnoId?: number;
  alumno?: Alumno;
}

export interface Examen {
  id: number;
  protocoloLab?: string;
  fecha: string;
  consultaId?: number;
  consulta?: Consulta;
  animalId?: number;
  animal?: Animal;
  doctorId?: number;
  doctor?: Doctor;
  observaciones?: string;
}

export interface Urianalisis extends Examen {
  color?: string;
  aspecto?: string;
  densidad?: string;
  ph?: string;
  proteina?: string;
  urobilinogeno?: string;
  glucosa?: string;
  cCetonicos?: string;
  leucocitos?: string;
  nitritos?: string;
  sangreOculta?: string;
  pigBiliares?: string;
  celulasSanguineas?: string;
  celulasSanguineas2?: string;
  celulasEpiteliales?: string;
  celulasEpiteliales2?: string;
  cilindros?: string;
  cilindros2?: string;
  cristales?: string;
  cristales2?: string;
  otra?: string;
  otra2?: string;
  observaciones2?: string;
}

export interface QuimicaClinica extends Examen {
  glucemia?: string;
  uremia?: string;
  creatininemia?: string;
  fosfatemia?: string;
  albuminemia?: string;
  got?: string;
  gpt?: string;
  cpk?: string;
  ldh?: string;
}

export interface Hemograma extends Examen {
  eritrocitos?: string;
  hemoglobina?: string;
  hematocrito?: string;
  vcm?: string;
  hcm?: string;
  chcm?: string;
  reticulocitos?: string;
  ipr?: string;
  eritrNucleados?: string;
  pPlasmaticas?: string;
  fibrinogeno?: string;
  relPpFibr?: string;
  leucocitos?: string;
  mieloblastos?: string;
  promielocitos?: string;
  mielocitos?: string;
  metamielocitos?: string;
  neutrofCay?: string;
  neutrofSeg?: string;
  eosinofilos?: string;
  basofilos?: string;
  linfocitos?: string;
  monocitos?: string;
}

export interface ReporteEstadisticas {
  totalConsultas: number;
  totalDerivaciones: number;
  totalRetornos: number;
  totalExamenes: number;
  porDoctor?: Array<{ doctorId: number; nombre: string; cantidad: number }>;
  porAlumno?: Array<{ alumnoId: number; nombre: string; cantidad: number }>;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  role: Role;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface Medicamento {
  id: number;
  nombre: string;
  descripcion?: string;
  cantidadStock: number;
  stockMinimo: number;
  precioUnidad?: number;
  unidadMedida?: string;
}

export interface ConsultaMedicamento {
  id?: number;
  consultaId?: number;
  medicamentoId: number;
  medicamentoNombre?: string;
  cantidad: number;
  dosificacion?: string;
}

export interface Turno {
  id?: number;
  fechaHora: string;
  motivo: string;
  estado: string;
  animalId: number;
  animalNombre?: string;
  doctorId: number;
  doctorNombre?: string;
}

export interface EstudioMedico {
  id: number;
  nombreArchivo: string;
  tipoArchivo?: string;
  rutaArchivo: string;
  fechaSubida: string;
  consultaId: number;
}

export interface Auditoria {
  id: number;
  username: string;
  accion: string;
  tabla: string;
  registroId?: number;
  detalles?: string;
  fecha: string;
}
