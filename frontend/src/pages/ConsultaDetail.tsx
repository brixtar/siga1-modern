import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { consultaService } from '../services/consultaService';
import { medicamentoService } from '../services/medicamentoService';
import api from '../services/api';
import type { Consulta, Medicamento, EstudioMedico } from '../types';

type TabKey = 'general' | 'signos' | 'piel' | 'digestivo' | 'respiratorio' | 'cardiovascular' | 'urogenital' | 'locomotor' | 'nervioso' | 'diagnostico' | 'tratamiento' | 'estudios';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'signos', label: 'Signos Vitales' },
  { key: 'piel', label: 'Piel / Mucosas' },
  { key: 'digestivo', label: 'Digestivo' },
  { key: 'respiratorio', label: 'Respiratorio' },
  { key: 'cardiovascular', label: 'Cardiovascular' },
  { key: 'urogenital', label: 'Urogenital' },
  { key: 'locomotor', label: 'Locomotor' },
  { key: 'nervioso', label: 'Nervioso' },
  { key: 'diagnostico', label: 'Diagnóstico' },
  { key: 'tratamiento', label: 'Tratamiento' },
  { key: 'estudios', label: 'Estudios / Archivos' },
];

const ConsultaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [saving, setSaving] = useState(false);

  const [allMedicamentos, setAllMedicamentos] = useState<Medicamento[]>([]);
  const [selectedMedId, setSelectedMedId] = useState<string>('');
  const [medQuantity, setMedQuantity] = useState<number>(1);
  const [medDosage, setMedDosage] = useState<string>('');

  const [estudios, setEstudios] = useState<EstudioMedico[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const loadEstudios = async () => {
    if (!id) return;
    try {
      const res = await api.get<EstudioMedico[]>(`/estudios/consulta/${id}`);
      setEstudios(res.data);
    } catch (err) {
      console.error("Error al cargar estudios", err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload || !id) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('consultaId', id);
      await api.post('/estudios/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Estudio subido correctamente');
      setFileToUpload(null);
      loadEstudios();
    } catch (err) {
      console.error(err);
      alert('Error al subir el estudio médico');
    } finally {
      setUploading(false);
    }
  };

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await consultaService.getById(Number(id));
      setConsulta(data);
    } catch {
      alert('Error al cargar consulta');
    } finally {
      setLoading(false);
    }
  };

  const loadMeds = async () => {
    try {
      const data = await medicamentoService.getAll();
      setAllMedicamentos(data);
    } catch (err) {
      console.error("Error al cargar medicamentos", err);
    }
  };

  useEffect(() => {
    load();
    loadMeds();
    loadEstudios();
  }, [id]);

  const getMedName = (medId: number) => {
    const found = allMedicamentos.find(m => m.id === medId);
    return found ? found.nombre : `Medicamento #${medId}`;
  };

  const addMedicamento = () => {
    if (!selectedMedId || !consulta) return;
    const medId = Number(selectedMedId);
    const selectedMed = allMedicamentos.find(m => m.id === medId);
    if (!selectedMed) return;

    if (selectedMed.cantidadStock < medQuantity) {
      alert(`No hay stock suficiente de ${selectedMed.nombre}. Stock disponible: ${selectedMed.cantidadStock}`);
      return;
    }

    const currentMeds = consulta.medicamentos || [];
    if (currentMeds.some(m => m.medicamentoId === medId)) {
      alert("Este medicamento ya ha sido recetado en esta consulta.");
      return;
    }

    const newMed = {
      medicamentoId: medId,
      medicamentoNombre: selectedMed.nombre,
      cantidad: medQuantity,
      dosificacion: medDosage
    };

    setConsulta({
      ...consulta,
      medicamentos: [...currentMeds, newMed]
    });

    setSelectedMedId('');
    setMedQuantity(1);
    setMedDosage('');
  };

  const removeMedicamento = (index: number) => {
    if (!consulta || !consulta.medicamentos) return;
    const newMeds = [...consulta.medicamentos];
    newMeds.splice(index, 1);
    setConsulta({
      ...consulta,
      medicamentos: newMeds
    });
  };

  const updateField = (field: keyof Consulta, value: string) => {
    if (!consulta) return;
    setConsulta({ ...consulta, [field]: value });
  };

  const handleSave = async () => {
    if (!consulta || !id) return;
    setSaving(true);
    try {
      await consultaService.update(Number(id), consulta);
      alert('Consulta guardada correctamente');
    } catch {
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const input = (label: string, field: keyof Consulta, value?: string, multiline = false) => {
    const baseClass = "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500";
    return (
      <div className={multiline ? 'md:col-span-2' : ''}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {multiline ? (
          <textarea value={value || ''} onChange={(e) => updateField(field, e.target.value)} className={baseClass} rows={3} />
        ) : (
          <input type="text" value={value || ''} onChange={(e) => updateField(field, e.target.value)} className={baseClass} />
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    if (!consulta) return null;

    switch (activeTab) {
      case 'general':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label><input type="text" value={consulta.fecha} readOnly className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Caso Clínico</label><input type="text" value={consulta.casoClinico || ''} readOnly className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" /></div>
            {input('Motivo', 'motivo', consulta.motivo)}
            {input('Animal', 'animalId', consulta.animal?.nombre || String(consulta.animalId || ''))}
            {input('Doctor', 'doctorId', consulta.doctor?.apellido + ', ' + consulta.doctor?.nombre || String(consulta.doctorId || ''))}
            {input('Alumno', 'alumnoId', consulta.alumno?.apellido + ', ' + consulta.alumno?.nombre || String(consulta.alumnoId || ''))}
            {input('Anamnesis', 'anamnesis', consulta.anamnesis, true)}
          </div>
        );
      case 'signos':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {input('Temperatura', 'temperatura', consulta.temperatura)}
            {input('FC (lpm)', 'fc', consulta.fc)}
            {input('FR (rpm)', 'fr', consulta.fr)}
            {input('CC', 'cc', consulta.cc)}
            {input('LL Cap', 'llCap', consulta.llCap)}
            {input('Pulso Ritmo', 'pulsoRitmo', consulta.pulsoRitmo)}
            {input('Pulso Intensidad', 'pulsoIntensidad', consulta.pulsoIntensidad)}
            {input('Hidratación', 'hidratacion', consulta.hidratacion)}
          </div>
        );
      case 'piel':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {input('Mucosa Ocular', 'maOcular', consulta.maOcular)}
            {input('Mucosa Bucal', 'maBucal', consulta.maBucal)}
            {input('Mucosa Nasal', 'maNasal', consulta.maNasal)}
            {input('Mucosa Genital', 'maGenital', consulta.maGenital)}
            {input('Lesión Tipo', 'lesionTipo', consulta.lesionTipo)}
            {input('Lesión Forma', 'lesionForma', consulta.lesionForma)}
            {input('Lesión Ubicación', 'lesionUbicacion', consulta.lesionUbicacion)}
            {input('Lesión Simetría', 'lesionSimetria', consulta.lesionSimetria)}
            {input('Olor', 'olor', consulta.olor)}
            {input('Prurito', 'prurito', consulta.prurito)}
            {input('Manto Piloso', 'mantoPiloso', consulta.mantoPiloso)}
            {input('Ectoparásitos', 'ectoparasitos', consulta.ectoparasitos)}
            {input('Oído', 'oido', consulta.oido)}
          </div>
        );
      case 'digestivo':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {input('Boca', 'boca', consulta.boca)}
            {input('Esofago', 'esofago', consulta.esofago)}
            {input('Estómago', 'estomago', consulta.estomago)}
            {input('Intestino', 'intestino', consulta.intestino)}
            {input('Hígado', 'higado', consulta.higado)}
            {input('Regurgitación', 'regurgitacion', consulta.regurgitacion)}
            {input('Vómito', 'vomito', consulta.vomito)}
            {input('Diarrea', 'diarrea', consulta.diarrea)}
            {input('Ruidos', 'ruidos', consulta.ruidos)}
            {input('Distensión', 'distension', consulta.distension)}
          </div>
        );
      case 'respiratorio':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {input('Vías Superiores', 'viasSuperiores', consulta.viasSuperiores)}
            {input('Vías Inferiores', 'viasInferiores', consulta.viasInferiores)}
            {input('Ritmo Respiratorio', 'ritmoRespiratorio', consulta.ritmoRespiratorio)}
            {input('Tipo', 'tipo', consulta.tipo)}
            {input('Tos/Reflejo', 'tosReflejo', consulta.tosReflejo)}
            {input('Auscultación', 'auscultacion', consulta.auscultacion, true)}
          </div>
        );
      case 'cardiovascular':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {input('Corazón Auscultación', 'corazonAuscultacion', consulta.corazonAuscultacion)}
            {input('Ritmo Corazón', 'ritmoCorazon', consulta.ritmoCorazon)}
          </div>
        );
      case 'urogenital':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {input('Riñones', 'riñones', consulta.riñones)}
            {input('Uréteres', 'ureteres', consulta.ureteres)}
            {input('Vejiga', 'vejiga', consulta.vejiga)}
            {input('Uretra', 'uretra', consulta.uretra)}
            {input('Secreciones', 'secreciones', consulta.secreciones)}
            {input('Orina', 'orina', consulta.orina)}
            {input('Genitales Interno', 'genitalesInterno', consulta.genitalesInterno)}
            {input('Genitales Externo', 'genitalesExterno', consulta.genitalesExterno)}
            {input('Genitales Secreciones', 'genitalesSecreciones', consulta.genitalesSecreciones)}
            {input('Tacto Rectal', 'tactoRectal', consulta.tactoRectal)}
          </div>
        );
      case 'locomotor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {input('Lesión', 'locomotorLesion', consulta.locomotorLesion)}
            {input('Ubicación L', 'locomotorUbicacionL', consulta.locomotorUbicacionL)}
            {input('Deformación', 'locomotorDeformacion', consulta.locomotorDeformacion)}
            {input('Ubicación D', 'locomotorUbicacionD', consulta.locomotorUbicacionD)}
            {input('Claudicación Miembro', 'claudicacionMiembro', consulta.claudicacionMiembro)}
            {input('Claudicación Tipo', 'claudicacionTipo', consulta.claudicacionTipo)}
          </div>
        );
      case 'nervioso':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {input('Submandibular', 'submandibular', consulta.submandibular)}
            {input('Axilar', 'axilar', consulta.axilar)}
            {input('Inguinales', 'inguinales', consulta.inguinales)}
            {input('Poplíteos', 'popliteos', consulta.popliteos)}
            {input('Ubicación', 'nerviosoUbicacion', consulta.nerviosoUbicacion)}
            {input('Parálisis', 'paralisis', consulta.paralisis)}
            {input('Paresia', 'paresia', consulta.paresia)}
            {input('Convulsión', 'convulsion', consulta.convulsion)}
            {input('Ataxia', 'ataxia', consulta.ataxia)}
            {input('Reflejos', 'reflejos', consulta.reflejos)}
            {input('Sensibilidad', 'sensibilidad', consulta.sensibilidad)}
            {input('Conducta', 'conducta', consulta.conducta)}
            {input('Estado Sensorio', 'estadoSensorio', consulta.estadoSensorio)}
            {input('SNMS', 'snms', consulta.snms)}
            {input('SNMI', 'snmi', consulta.snmi)}
            {input('Ojo Derecho', 'ojoDerecho', consulta.ojoDerecho)}
            {input('Ojo Izquierdo', 'ojoIzq', consulta.ojoIzq)}
          </div>
        );
      case 'diagnostico':
        return (
          <div className="grid grid-cols-1 gap-4">
            {input('Diagnóstico Presuntivo', 'diagnosticoPresuntivo', consulta.diagnosticoPresuntivo, true)}
            {input('Diagnóstico Diferencial', 'diagnosticoDiferencial', consulta.diagnosticoDiferencial, true)}
            {input('Diagnóstico Pronóstico', 'diagnosticoPronostico', consulta.diagnosticoPronostico, true)}
          </div>
        );
      case 'tratamiento':
        return (
          <div className="grid grid-cols-1 gap-6">
            {input('Tratamiento', 'tratamiento', consulta.tratamiento, true)}
            {input('Indicaciones', 'indicaciones', consulta.indicaciones, true)}

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">💊</span> Medicamentos Prescritos
              </h3>

              {(!consulta.medicamentos || consulta.medicamentos.length === 0) ? (
                <p className="text-sm text-gray-500 italic mb-4">No se han recetado medicamentos en esta consulta.</p>
              ) : (
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 text-left uppercase tracking-wider">
                        <th className="px-4 py-3">Medicamento</th>
                        <th className="px-4 py-3">Cantidad</th>
                        <th className="px-4 py-3">Dosificación / Indicación</th>
                        <th className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                      {consulta.medicamentos.map((cm, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{cm.medicamentoNombre || getMedName(cm.medicamentoId)}</td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{cm.cantidad}</td>
                          <td className="px-4 py-3 text-gray-600">{cm.dosificacion || '-'}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => removeMedicamento(idx)}
                              className="text-red-600 hover:text-red-800 font-semibold"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Recetar Medicamento</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Medicamento</label>
                    <select
                      value={selectedMedId}
                      onChange={(e) => setSelectedMedId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option value="">-- Seleccionar --</option>
                      {allMedicamentos.map((m) => (
                        <option key={m.id} value={m.id!} disabled={m.cantidadStock <= 0}>
                          {m.nombre} ({m.cantidadStock} disponibles)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad a Prescribir</label>
                    <input
                      type="number"
                      min={1}
                      value={medQuantity}
                      onChange={(e) => setMedQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Instrucciones / Dosificación</label>
                    <input
                      type="text"
                      placeholder="Ej: 1 ml cada 12 horas por 5 días"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="button"
                      onClick={addMedicamento}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold text-sm transition"
                    >
                      Agregar Receta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'estudios':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Estudios y Archivos Adjuntos</h3>
              <p className="text-xs text-gray-500 mb-4">
                Sube imágenes de radiografías, ecografías, análisis clínicos o informes en PDF correspondientes a esta consulta.
              </p>
            </div>

            <form onSubmit={handleUpload} className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">📁</span>
                <span className="text-sm font-medium text-gray-700">
                  {fileToUpload ? fileToUpload.name : 'Ningún archivo seleccionado'}
                </span>
                <span className="text-xs text-gray-400 mt-1">Soporta imágenes, PDFs, documentos de texto, etc.</span>
              </div>
              <div className="flex gap-2">
                <label className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors shadow-sm">
                  Seleccionar Archivo
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFileToUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <button
                  type="submit"
                  disabled={!fileToUpload || uploading}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors shadow-sm"
                >
                  {uploading ? 'Subiendo...' : 'Subir Archivo'}
                </button>
              </div>
            </form>

            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Archivos en esta Consulta</h4>
              {estudios.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No hay archivos adjuntos en esta consulta.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {estudios.map((est) => (
                    <div key={est.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">
                            {est.tipoArchivo?.includes('pdf') ? '📄' : est.tipoArchivo?.includes('image') ? '🖼️' : '📎'}
                          </span>
                          <div className="overflow-hidden">
                            <span className="block text-sm font-medium text-gray-800 truncate" title={est.nombreArchivo}>
                              {est.nombreArchivo}
                            </span>
                            <span className="block text-[10px] text-gray-400">
                              {new Date(est.fechaSubida).toLocaleString('es-ES')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 border-t border-gray-50 pt-3 flex justify-between items-center">
                        <span className="text-xs text-gray-400 uppercase font-semibold">{est.tipoArchivo?.split('/')[1] || 'Archivo'}</span>
                        <a
                          href={`/api/v1/estudios/${est.id}/download`}
                          download={est.nombreArchivo}
                          className="text-teal-600 hover:text-teal-800 text-xs font-semibold flex items-center gap-1"
                        >
                          ⬇️ Descargar
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="text-gray-600 p-6">Cargando consulta...</div>;
  if (!consulta) return <div className="text-red-600 p-6">Consulta no encontrada</div>;

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Consulta #{consulta.id}</h1>
        <div className="flex space-x-2">
          <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          <button onClick={() => navigate('/consultas')} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
            Volver
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b overflow-x-auto">
          <div className="flex space-x-1 p-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ConsultaDetail;
