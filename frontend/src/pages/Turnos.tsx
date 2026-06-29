import React, { useEffect, useState } from 'react';
import api from '../services/api';
import type { Turno, Doctor, Animal } from '../types';

const Turnos: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Nvegacion de semana
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Reservas modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Turno>>({
    fechaHora: '',
    motivo: '',
    animalId: undefined,
    doctorId: undefined,
    estado: 'RESERVADO'
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [turnosRes, doctoresRes, animalesRes] = await Promise.all([
        api.get<Turno[]>('/turnos'),
        api.get<Doctor[]>('/doctores'),
        api.get<Animal[]>('/animales')
      ]);
      setTurnos(turnosRes.data);
      setDoctores(doctoresRes.data);
      setAnimales(animalesRes.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos de turnos y agenda');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // lunes
    startOfWeek.setDate(diff);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(startOfWeek);
      nextDate.setDate(startOfWeek.getDate() + i);
      dates.push(nextDate);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentDate);

  const formatDayName = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
  };

  const getTurnosByDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return turnos.filter((t) => t.fechaHora.split('T')[0] === dateString);
  };

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.put(`/turnos/${id}/estado?estado=${newStatus}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el estado del turno');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este turno?')) return;
    try {
      await api.delete(`/turnos/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el turno');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fechaHora || !form.motivo || !form.animalId || !form.doctorId) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    setSaving(true);
    try {
      await api.post('/turnos', form);
      alert('Turno reservado correctamente');
      setShowModal(false);
      setForm({ fechaHora: '', motivo: '', animalId: undefined, doctorId: undefined, estado: 'RESERVADO' });
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error al reservar el turno');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agenda & Turnos</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de citas médicas y organización diaria.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
        >
          Reservar Cita
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Navegacion de Agenda */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevWeek}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
            title="Semana Anterior"
          >
            ⬅️
          </button>
          <button
            onClick={handleToday}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
          >
            Hoy
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
            title="Semana Siguiente"
          >
            ➡️
          </button>
        </div>
        <h2 className="text-lg font-bold text-gray-800">
          Semana del {weekDates[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} al{' '}
          {weekDates[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando agenda...</div>
      ) : (
        /* Cuadrícula de la semana */
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDates.map((date, idx) => {
            const dayTurnos = getTurnosByDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={idx}
                className={`bg-white rounded-xl border flex flex-col min-h-[300px] shadow-sm ${
                  isToday ? 'border-teal-500 ring-2 ring-teal-100' : 'border-gray-100'
                }`}
              >
                {/* Cabecera del Dia */}
                <div
                  className={`px-3 py-3 border-b text-center rounded-t-xl ${
                    isToday ? 'bg-teal-50 text-teal-800' : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="block text-xs font-bold uppercase tracking-wider">
                    {formatDayName(date)}
                  </span>
                  <span className="block text-xl font-black mt-0.5">{date.getDate()}</span>
                </div>

                {/* Lista de citas */}
                <div className="p-3 flex-1 space-y-3 overflow-y-auto max-h-[400px]">
                  {dayTurnos.length === 0 ? (
                    <div className="text-center py-8 text-gray-300 text-xs italic">Sin turnos</div>
                  ) : (
                    dayTurnos.map((t) => {
                      const timeStr = t.fechaHora.split('T')[1].substring(0, 5);
                      
                      const badges: Record<string, string> = {
                        RESERVADO: 'bg-blue-50 text-blue-700 border-blue-200',
                        COMPLETADO: 'bg-green-50 text-green-700 border-green-200',
                        CANCELADO: 'bg-red-50 text-red-700 border-red-200'
                      };
                      const badgeClass = badges[t.estado] || 'bg-gray-50 text-gray-700';

                      return (
                        <div
                          key={t.id}
                          className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 hover:shadow transition-shadow flex flex-col justify-between text-xs gap-1.5"
                        >
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-teal-700">{timeStr} hs</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${badgeClass}`}>
                                {t.estado}
                              </span>
                            </div>
                            <span className="block font-semibold text-gray-800 truncate" title={`Paciente: ${t.animalNombre}`}>
                              🐾 {t.animalNombre}
                            </span>
                            <span className="block text-gray-500 font-medium truncate" title={`Dr. ${t.doctorNombre}`}>
                              🩺 Dr. {t.doctorNombre?.split(' ')[1]}
                            </span>
                            <p className="text-[10px] text-gray-400 mt-1 italic line-clamp-2" title={t.motivo}>
                              {t.motivo}
                            </p>
                          </div>

                          <div className="border-t border-gray-200/50 pt-1.5 mt-1 flex justify-between gap-1">
                            {t.estado === 'RESERVADO' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(t.id!, 'COMPLETADO')}
                                  className="text-green-600 hover:text-green-800 font-bold"
                                  title="Marcar como Completado"
                                >
                                  ✔️
                                </button>
                                <button
                                  onClick={() => handleStatusChange(t.id!, 'CANCELADO')}
                                  className="text-red-600 hover:text-red-800 font-bold"
                                  title="Marcar como Cancelado"
                                >
                                  ❌
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(t.id!)}
                              className="text-gray-400 hover:text-red-600 ml-auto font-bold"
                              title="Eliminar cita"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Reservas */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Reservar Turno</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Paciente (Animal)</label>
                <select
                  value={form.animalId || ''}
                  onChange={(e) => setForm({ ...form, animalId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                  required
                >
                  <option value="">Seleccionar Paciente...</option>
                  {animales.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre} ({a.duenio ? `${a.duenio.apellido}, ${a.duenio.nombre}` : 'Sin dueño'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Médico Veterinario</label>
                <select
                  value={form.doctorId || ''}
                  onChange={(e) => setForm({ ...form, doctorId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                  required
                >
                  <option value="">Seleccionar Médico...</option>
                  {doctores.map((d) => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.apellido}, {d.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Fecha y Hora</label>
                <input
                  type="datetime-local"
                  value={form.fechaHora}
                  onChange={(e) => setForm({ ...form, fechaHora: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Motivo de la Cita</label>
                <textarea
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  placeholder="Ej: Vacunación, cojera posterior, control digestivo, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Confirmar Reserva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Turnos;
