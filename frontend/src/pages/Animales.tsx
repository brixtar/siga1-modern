import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { animalService } from '../services/animalService';
import { duenioService } from '../services/duenioService';
import { especieService } from '../services/especieService';
import { razaService } from '../services/razaService';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Animal, Duenio, Especie, Raza } from '../types';

const Animales: React.FC = () => {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [duenios, setDuenios] = useState<Duenio[]>([]);
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [razas, setRazas] = useState<Raza[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Animal | null>(null);
  const [form, setForm] = useState<Partial<Animal>>({ sexo: 'DESCONOCIDO' });

  const { hasRole } = useAuth();
  const canModify = hasRole('ADMIN') || hasRole('DOCTOR');

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'historial' | 'peso' | 'vacunas'>('info');
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  const loadHistory = async (animalId: number) => {
    setLoadingTimeline(true);
    try {
      const [consultasRes, retornosRes, derivacionesRes, hemogramasRes, quimicasRes, urianalisisRes] = await Promise.all([
        api.get<any[]>(`/consultas/animal/${animalId}`),
        api.get<any[]>(`/retornos`),
        api.get<any[]>(`/derivaciones`),
        api.get<any[]>(`/hemogramas`),
        api.get<any[]>(`/quimica-clinica`),
        api.get<any[]>(`/urianalisis`),
      ]);

      const items: any[] = [];

      consultasRes.data.forEach(c => {
        items.push({
          id: c.id,
          fecha: c.fecha,
          tipo: 'consulta',
          titulo: `🩺 Consulta: ${c.motivo}`,
          descripcion: `Diagnóstico: ${c.diagnosticoPresuntivo || 'No especificado'}. Tratamiento: ${c.tratamiento || 'No especificado'}.`,
          objeto: c
        });
      });

      retornosRes.data.filter(r => r.animalId === animalId).forEach(r => {
        items.push({
          id: r.id,
          fecha: r.fecha,
          tipo: 'retorno',
          titulo: `↩️ Retorno de Control`,
          descripcion: `Indicaciones: ${r.indicaciones || 'Control general'}. Temp: ${r.temperatura || '-'}°C, FC: ${r.fc || '-'} lpm.`,
          objeto: r
        });
      });

      derivacionesRes.data.filter(d => d.animalId === animalId).forEach(d => {
        items.push({
          id: d.id,
          fecha: d.fecha,
          tipo: 'derivacion',
          titulo: `↗️ Derivación Médica`,
          descripcion: `Sistema derivado: ${d.sistema || 'Especialista'}. Anamnesis: ${d.anamnesis || ''}.`,
          objeto: d
        });
      });

      hemogramasRes.data.filter(h => h.animalId === animalId).forEach(h => {
        items.push({
          id: h.id,
          fecha: h.fecha,
          tipo: 'hemograma',
          titulo: `🧪 Análisis: Hemograma (Protocolo ${h.protocoloLab || 'S/N'})`,
          descripcion: `Leucocitos: ${h.leucocitos || '-'}, Eritrocitos: ${h.eritrocitos || '-'}, Hematocrito: ${h.hematocrito || '-'}.`,
          objeto: h
        });
      });

      quimicasRes.data.filter(q => q.animalId === animalId).forEach(q => {
        items.push({
          id: q.id,
          fecha: q.fecha,
          tipo: 'quimica',
          titulo: `🧪 Análisis: Química Clínica (Protocolo ${q.protocoloLab || 'S/N'})`,
          descripcion: `Glucemia: ${q.glucemia || '-'}, Uremia: ${q.uremia || '-'}, Creatininemia: ${q.creatininemia || '-'}.`,
          objeto: q
        });
      });

      urianalisisRes.data.filter(u => u.animalId === animalId).forEach(u => {
        items.push({
          id: u.id,
          fecha: u.fecha,
          tipo: 'urianalisis',
          titulo: `🧪 Análisis: Urianálisis (Protocolo ${u.protocoloLab || 'S/N'})`,
          descripcion: `Color: ${u.color || '-'}, Aspecto: ${u.aspecto || '-'}, pH: ${u.ph || '-'}.`,
          objeto: u
        });
      });

      items.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      setTimeline(items);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTimeline(false);
    }
  };

  // Nuevos estados para control de peso
  const [pesos, setPesos] = useState<any[]>([]);
  const [loadingPesos, setLoadingPesos] = useState(false);
  const [newPeso, setNewPeso] = useState('');
  const [newPesoFecha, setNewPesoFecha] = useState(new Date().toISOString().substring(0, 10));

  // Nuevos estados para vacunas
  const [vacunas, setVacunas] = useState<any[]>([]);
  const [loadingVacunas, setLoadingVacunas] = useState(false);
  const [newVacunaNombre, setNewVacunaNombre] = useState('');
  const [newVacunaFechaApp, setNewVacunaFechaApp] = useState(new Date().toISOString().substring(0, 10));
  const [newVacunaFechaProx, setNewVacunaFechaProx] = useState('');

  const loadPesos = async (animalId: number) => {
    setLoadingPesos(true);
    try {
      const res = await api.get<any[]>(`/animales/${animalId}/pesos`);
      setPesos(res.data);
    } catch (err) {
      console.error("Error al cargar pesos", err);
    } finally {
      setLoadingPesos(false);
    }
  };

  const loadVacunas = async (animalId: number) => {
    setLoadingVacunas(true);
    try {
      const res = await api.get<any[]>(`/animales/${animalId}/vacunas`);
      setVacunas(res.data);
    } catch (err) {
      console.error("Error al cargar vacunas", err);
    } finally {
      setLoadingVacunas(false);
    }
  };

  const handleAddPeso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimal?.id || !newPeso) return;
    try {
      await api.post(`/animales/${selectedAnimal.id}/pesos`, {
        peso: Number(newPeso),
        fecha: newPesoFecha
      });
      setNewPeso('');
      loadPesos(selectedAnimal.id);
      setSelectedAnimal({
        ...selectedAnimal,
        peso: String(newPeso)
      });
      setAnimales((prev: Animal[]) => prev.map((a: Animal) => a.id === selectedAnimal.id ? { ...a, peso: String(newPeso) } : a));
    } catch (err) {
      console.error(err);
      alert("Error al registrar peso");
    }
  };

  const handleDeletePeso = async (pesoId: number) => {
    if (!selectedAnimal?.id) return;
    try {
      await api.delete(`/pesos/${pesoId}`);
      loadPesos(selectedAnimal.id);
    } catch (err) {
      console.error(err);
      alert("Error al borrar peso");
    }
  };

  const handleAddVacuna = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimal?.id || !newVacunaNombre || !newVacunaFechaProx) return;
    try {
      await api.post(`/animales/${selectedAnimal.id}/vacunas`, {
        nombreVacuna: newVacunaNombre,
        fechaAplicacion: newVacunaFechaApp,
        fechaProxima: newVacunaFechaProx
      });
      setNewVacunaNombre('');
      setNewVacunaFechaProx('');
      loadVacunas(selectedAnimal.id);
    } catch (err) {
      console.error(err);
      alert("Error al registrar vacuna");
    }
  };

  const handleCompleteVacuna = async (vacunaId: number) => {
    if (!selectedAnimal?.id) return;
    try {
      await api.put(`/vacunas/${vacunaId}/completar`);
      loadVacunas(selectedAnimal.id);
    } catch (err) {
      console.error(err);
      alert("Error al completar vacuna");
    }
  };

  const handleDeleteVacuna = async (vacunaId: number) => {
    if (!selectedAnimal?.id) return;
    try {
      await api.delete(`/vacunas/${vacunaId}`);
      loadVacunas(selectedAnimal.id);
    } catch (err) {
      console.error(err);
      alert("Error al borrar vacuna");
    }
  };

  useEffect(() => {
    if (selectedAnimal?.id) {
      loadHistory(selectedAnimal.id);
      loadPesos(selectedAnimal.id);
      loadVacunas(selectedAnimal.id);
      setActiveTab('info');
    } else {
      setTimeline([]);
      setPesos([]);
      setVacunas([]);
    }
  }, [selectedAnimal]);

  const load = async () => {
    setLoading(true);
    try {
      const [a, d, e] = await Promise.all([
        animalService.getAll(),
        duenioService.getAll(),
        especieService.getAll(),
      ]);
      setAnimales(a);
      setDuenios(d);
      setEspecies(e);
    } catch {
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (form.especieId) {
      razaService.getByEspecieId(form.especieId).then(setRazas).catch(() => setRazas([]));
    } else {
      setRazas([]);
    }
  }, [form.especieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canModify) return;
    try {
      if (editing) {
        await animalService.update(editing.id, form);
      } else {
        await animalService.create(form as Omit<Animal, 'id'>);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ sexo: 'DESCONOCIDO' });
      load();
    } catch {
      alert('Error al guardar');
    }
  };

  const handleEdit = (animal: Animal) => {
    if (!canModify) return;
    setEditing(animal);
    setForm(animal);
    if (animal.especieId) {
      razaService.getByEspecieId(animal.especieId).then(setRazas).catch(() => setRazas([]));
    }
    setShowForm(true);
  };

  const handleDelete = async (animal: Animal) => {
    if (!canModify) return;
    if (!confirm('¿Eliminar animal?')) return;
    try {
      await animalService.delete(animal.id);
      load();
    } catch {
      alert('Error al eliminar');
    }
  };

  const columns = [
    { key: 'nombre' as keyof Animal, header: 'Nombre' },
    { key: 'especie' as any, header: 'Especie', render: (row: Animal) => row.especie?.especie || '-' },
    { key: 'raza' as any, header: 'Raza', render: (row: Animal) => row.raza?.raza || '-' },
    { key: 'sexo' as keyof Animal, header: 'Sexo' },
    { key: 'duenio' as any, header: 'Dueño', render: (row: Animal) => row.duenio ? `${row.duenio.apellido}, ${row.duenio.nombre}` : '-' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Animales</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de pacientes y expedientes clínicos.</p>
        </div>
        {canModify && (
          <button
            onClick={() => { setShowForm(true); setEditing(null); setForm({ sexo: 'DESCONOCIDO' }); }}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
          >
            Nuevo Animal
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Editar Animal' : 'Nuevo Animal'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={form.nombre || ''}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dueño</label>
              <select
                value={form.duenioId || ''}
                onChange={(e) => setForm({ ...form, duenioId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar...</option>
                {duenios.map((d) => (
                  <option key={d.id} value={d.id}>{d.apellido}, {d.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especie</label>
              <select
                value={form.especieId || ''}
                onChange={(e) => setForm({ ...form, especieId: Number(e.target.value), razaId: undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar...</option>
                {especies.map((e) => (
                  <option key={e.id} value={e.id}>{e.especie}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
              <select
                value={form.razaId || ''}
                onChange={(e) => setForm({ ...form, razaId: Number(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!form.especieId}
              >
                <option value="">Seleccionar...</option>
                {razas.map((r) => (
                  <option key={r.id} value={r.id}>{r.raza}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
              <select
                value={form.sexo || 'DESCONOCIDO'}
                onChange={(e) => setForm({ ...form, sexo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MACHO">Macho</option>
                <option value="HEMBRA">Hembra</option>
                <option value="DESCONOCIDO">Desconocido</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
              <input
                type="text"
                value={form.peso || ''}
                onChange={(e) => setForm({ ...form, peso: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Nacimiento</label>
              <input
                type="date"
                value={form.nacimiento || ''}
                onChange={(e) => setForm({ ...form, nacimiento: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                value={form.color || ''}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Cargando...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={animales} 
          onEdit={canModify ? handleEdit : undefined} 
          onDelete={canModify ? handleDelete : undefined} 
          onView={(row) => setSelectedAnimal(row)}
        />
      )}

      {selectedAnimal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Ficha del Animal: {selectedAnimal.nombre}</h3>
                <span className="text-xs text-gray-500 font-medium capitalize">
                  {selectedAnimal.especie?.especie || 'Sin especie'} — {selectedAnimal.raza?.raza || 'Sin raza'}
                </span>
              </div>
              <button 
                onClick={() => setSelectedAnimal(null)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>
            
            <div className="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'info' ? 'border-teal-500 text-teal-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Información General
              </button>
              <button
                onClick={() => setActiveTab('historial')}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'historial' ? 'border-teal-500 text-teal-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Línea de Tiempo Clínica
              </button>
              <button
                onClick={() => setActiveTab('peso')}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'peso' ? 'border-teal-500 text-teal-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                ⚖️ Control de Peso
              </button>
              <button
                onClick={() => setActiveTab('vacunas')}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'vacunas' ? 'border-teal-500 text-teal-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🛡️ Vacunas
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-semibold text-gray-400 uppercase">Nombre</span>
                      <span className="text-sm font-medium text-gray-800">{selectedAnimal.nombre}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-400 uppercase">Sexo</span>
                      <span className="text-sm font-medium text-gray-800 capitalize">{selectedAnimal.sexo || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-400 uppercase">Peso</span>
                      <span className="text-sm font-medium text-gray-800">{selectedAnimal.peso ? `${selectedAnimal.peso} kg` : '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-400 uppercase">Color</span>
                      <span className="text-sm font-medium text-gray-800">{selectedAnimal.color || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-400 uppercase">Nacimiento</span>
                      <span className="text-sm font-medium text-gray-800">
                        {selectedAnimal.nacimiento ? new Date(selectedAnimal.nacimiento).toLocaleDateString('es-ES') : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-400 uppercase">Estado Vital</span>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border mt-1 ${
                        selectedAnimal.vivo ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                      }`}>
                        {selectedAnimal.vivo ? 'Vivo' : 'Fallecido'}
                      </span>
                    </div>
                  </div>

                  <hr className="border-gray-100" />
                  
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3">Información del Dueño</h4>
                    {selectedAnimal.duenio ? (
                      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                          <span className="block text-xs font-semibold text-gray-400 uppercase">Dueño</span>
                          <span className="text-sm font-medium text-gray-800">
                            {selectedAnimal.duenio.apellido}, {selectedAnimal.duenio.nombre}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-gray-400 uppercase">DNI</span>
                          <span className="text-sm font-medium text-gray-800">{selectedAnimal.duenio.dni}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-gray-400 uppercase">Celular</span>
                          <span className="text-sm font-medium text-gray-800">{selectedAnimal.duenio.telefonoCelular || '-'}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-gray-400 uppercase">Email</span>
                          <span className="text-sm font-medium text-gray-800">{selectedAnimal.duenio.email || '-'}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No hay dueño asignado.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'historial' && (
                <div className="space-y-6">
                  {loadingTimeline ? (
                    <div className="text-center py-12 text-gray-500">Cargando historial clínico...</div>
                  ) : timeline.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 italic">No hay registros clínicos en el historial de este animal.</div>
                  ) : (
                    <div className="relative border-l-2 border-teal-200 ml-4 space-y-8 py-2">
                      {timeline.map((item, idx) => (
                        <div key={idx} className="relative pl-6">
                          <div className="absolute -left-[11px] top-1 bg-white border-2 border-teal-500 rounded-full w-5 h-5 flex items-center justify-center z-10 shadow-sm" />
                          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                            <span className="text-xs text-gray-400 font-semibold block mb-1">
                              {new Date(item.fecha).toLocaleString('es-ES')}
                            </span>
                            <h4 className="text-sm font-bold text-slate-800 mb-2">{item.titulo}</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">{item.descripcion}</p>
                            {item.tipo === 'consulta' && (
                              <div className="mt-3 flex justify-end">
                                <a
                                  href={`/consultas/${item.id}`}
                                  className="text-teal-600 hover:text-teal-800 text-xs font-semibold"
                                >
                                  Detalles Consulta ➡️
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'peso' && (
                <div className="space-y-6">
                  {(() => {
                    if (pesos.length < 2) {
                      return (
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center text-xs text-slate-400 italic">
                          Registre al menos 2 mediciones de peso para trazar la curva de crecimiento.
                        </div>
                      );
                    }

                    const width = 500;
                    const height = 200;
                    const padding = 30;

                    const minP = Math.min(...pesos.map(p => p.peso));
                    const maxP = Math.max(...pesos.map(p => p.peso));
                    const pesoDiff = maxP - minP === 0 ? 1 : maxP - minP;

                    const getX = (index: number) => {
                      return padding + (index * (width - padding * 2)) / (pesos.length - 1);
                    };

                    const getY = (value: number) => {
                      return height - padding - ((value - minP) * (height - padding * 2)) / pesoDiff;
                    };

                    let pathD = `M ${getX(0)} ${getY(pesos[0].peso)}`;
                    for (let i = 1; i < pesos.length; i++) {
                      pathD += ` L ${getX(i)} ${getY(pesos[i].peso)}`;
                    }

                    return (
                      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-2">
                        <h4 className="text-xs font-bold text-slate-700 tracking-tight">Curva de Evolución de Peso</h4>
                        <div className="relative w-full overflow-x-auto">
                          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[400px] h-[200px]">
                            <line x1={padding} y1={getY(minP)} x2={width - padding} y2={getY(minP)} stroke="#e2e8f0" strokeDasharray="3" />
                            <line x1={padding} y1={getY(maxP)} x2={width - padding} y2={getY(maxP)} stroke="#e2e8f0" strokeDasharray="3" />
                            <text x={padding - 5} y={getY(minP) + 4} className="text-[9px] fill-slate-400 font-semibold" textAnchor="end">{minP.toFixed(1)} kg</text>
                            <text x={padding - 5} y={getY(maxP) + 4} className="text-[9px] fill-slate-400 font-semibold" textAnchor="end">{maxP.toFixed(1)} kg</text>
                            <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            {pesos.map((p, idx) => {
                              const x = getX(idx);
                              const y = getY(p.peso);
                              return (
                                <g key={p.id}>
                                  <circle cx={x} cy={y} r="4" className="fill-teal-600 stroke-white stroke-2" />
                                  <text x={x} y={y - 8} className="text-[8px] font-bold fill-slate-700" textAnchor="middle">{p.peso} kg</text>
                                  <text x={x} y={height - 10} className="text-[7px] font-medium fill-slate-400" textAnchor="middle">
                                    {new Date(p.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                      </div>
                    );
                  })()}

                  {canModify && (
                    <form onSubmit={handleAddPeso} className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Peso (kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newPeso}
                          onChange={(e) => setNewPeso(e.target.value)}
                          placeholder="Ej: 8.5"
                          className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha</label>
                        <input
                          type="date"
                          required
                          value={newPesoFecha}
                          onChange={(e) => setNewPesoFecha(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                        />
                      </div>
                      <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded text-sm transition">
                        Registrar Peso
                      </button>
                    </form>
                  )}

                  <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-slate-100 text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="px-4 py-3">Fecha</th>
                          <th className="px-4 py-3">Peso</th>
                          {canModify && <th className="px-4 py-3 text-right">Acciones</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {loadingPesos ? (
                          <tr><td colSpan={3} className="px-4 py-4 text-center text-slate-400">Cargando...</td></tr>
                        ) : pesos.length === 0 ? (
                          <tr><td colSpan={3} className="px-4 py-4 text-center text-slate-400 italic">No hay registros de peso.</td></tr>
                        ) : (
                          [...pesos].reverse().map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50">
                              <td className="px-4 py-3">{new Date(p.fecha).toLocaleDateString('es-ES')}</td>
                              <td className="px-4 py-3 font-semibold text-slate-800">{p.peso} kg</td>
                              {canModify && (
                                <td className="px-4 py-3 text-right">
                                  <button onClick={() => handleDeletePeso(p.id)} className="text-red-600 hover:text-red-800 font-semibold text-xs">
                                    Borrar
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'vacunas' && (
                <div className="space-y-6">
                  {canModify && (
                    <form onSubmit={handleAddVacuna} className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre Vacuna</label>
                        <input
                          type="text"
                          required
                          value={newVacunaNombre}
                          onChange={(e) => setNewVacunaNombre(e.target.value)}
                          placeholder="Ej: Antirrábica, Quíntuple"
                          className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha Aplicación</label>
                        <input
                          type="date"
                          required
                          value={newVacunaFechaApp}
                          onChange={(e) => setNewVacunaFechaApp(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Próximo Refuerzo</label>
                        <input
                          type="date"
                          required
                          value={newVacunaFechaProx}
                          onChange={(e) => setNewVacunaFechaProx(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                        />
                      </div>
                      <div className="sm:col-span-4 flex justify-end">
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded text-sm transition">
                          Programar Alerta Vacuna
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-slate-100 text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="px-4 py-3">Vacuna</th>
                          <th className="px-4 py-3">Aplicación</th>
                          <th className="px-4 py-3">Refuerzo</th>
                          <th className="px-4 py-3">Estado</th>
                          {canModify && <th className="px-4 py-3 text-right">Acciones</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {loadingVacunas ? (
                          <tr><td colSpan={5} className="px-4 py-4 text-center text-slate-400">Cargando...</td></tr>
                        ) : vacunas.length === 0 ? (
                          <tr><td colSpan={5} className="px-4 py-4 text-center text-slate-400 italic">No hay vacunas registradas.</td></tr>
                        ) : (
                          vacunas.map((v) => {
                            const isExpired = new Date(v.fechaProxima).getTime() < new Date().getTime() && v.estado === 'PENDIENTE';
                            return (
                              <tr key={v.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-semibold text-slate-800">{v.nombreVacuna}</td>
                                <td className="px-4 py-3">{new Date(v.fechaAplicacion).toLocaleDateString('es-ES')}</td>
                                <td className={`px-4 py-3 font-medium ${isExpired ? 'text-red-600 font-bold animate-pulse' : 'text-slate-600'}`}>
                                  {new Date(v.fechaProxima).toLocaleDateString('es-ES')} {isExpired && '⚠️ (Vencida)'}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                                    v.estado === 'COMPLETADA' 
                                      ? 'bg-green-50 border-green-200 text-green-700' 
                                      : v.estado === 'ENVIADO'
                                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                                      : 'bg-blue-50 border-blue-200 text-blue-700'
                                  }`}>
                                    {v.estado}
                                  </span>
                                </td>
                                {canModify && (
                                  <td className="px-4 py-3 text-right space-x-2">
                                    {v.estado !== 'COMPLETADA' && (
                                      <button onClick={() => handleCompleteVacuna(v.id)} className="text-green-600 hover:text-green-800 font-semibold text-xs border border-green-200 px-2 py-0.5 rounded hover:bg-green-50">
                                        Completar
                                      </button>
                                    )}
                                    <button onClick={() => handleDeleteVacuna(v.id)} className="text-red-600 hover:text-red-800 font-semibold text-xs">
                                      Borrar
                                    </button>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50">
              <button
                onClick={() => setSelectedAnimal(null)}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Animales;
