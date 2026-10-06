import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import {
  Activity, ArrowRight, Bell, Check, ChevronDown, CircleHelp, ClipboardCheck, ClipboardList,
  Clock3, Eye, History, ImagePlus, Laptop, LogOut, Plus, Search, Settings2, ShieldCheck, X,
} from 'lucide-react'
import { api, ApiError } from './api'
import type { AdminActivity, AdminEquipment, Equipment, Task, TaskEvidence, TaskStatus, User } from './types'
import { AuthScreen } from './components/AuthScreen'
import './TechTrackApp.css'

const statusLabels: Record<TaskStatus, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
}
const statusOrder: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED']

/** Presenta la consola de tareas y equipos para el técnico autenticado. */
export default function TechTrackApp() {
  const [token, setToken] = useState(() => localStorage.getItem('techtrack-token'))
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [activeView, setActiveView] = useState<'tasks' | 'equipment' | 'history' | 'supervision'>('tasks')
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [modal, setModal] = useState<'task' | 'equipment' | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [historyEquipment, setHistoryEquipment] = useState<Equipment | null>(null)
  const [historyTasks, setHistoryTasks] = useState<Task[]>([])
  const [adminActivities, setAdminActivities] = useState<AdminActivity[]>([])
  const [adminTechnicians, setAdminTechnicians] = useState<User[]>([])
  const [adminEquipment, setAdminEquipment] = useState<AdminEquipment[]>([])
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('')
  const [adminReviewedTask, setAdminReviewedTask] = useState<AdminActivity | null>(null)
  const [uploadingEvidence, setUploadingEvidence] = useState(false)
  const [loading, setLoading] = useState(() => Boolean(token))
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    let cancelled = false
    Promise.all([api.me(token), api.listTasks(token), api.listEquipment(token)])
      .then(([profile, taskList, equipmentList]) => {
        if (cancelled) return
        setUser(profile)
        setTasks(taskList)
        setEquipment(equipmentList)
        setError('')
      })
      .catch((reason: unknown) => {
        if (cancelled) return
        if (reason instanceof ApiError && reason.status === 401) {
          localStorage.removeItem('techtrack-token')
          setToken(null)
          setUser(null)
        } else {
          setError(reason instanceof Error ? reason.message : 'No se pudo conectar con el servidor.')
        }
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
    const linkedEquipment = getEquipment(task)
    const matchesSearch = `${task.title} ${linkedEquipment?.name ?? ''} ${task.description}`.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  }), [tasks, statusFilter, searchTerm])

  const counts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === 'PENDING').length,
    progress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
    completed: tasks.filter((task) => task.status === 'COMPLETED').length,
  }), [tasks])

  function handleAuthenticated(nextToken: string, profile: User) {
    localStorage.setItem('techtrack-token', nextToken)
    setLoading(true)
    setToken(nextToken)
    setUser(profile)
  }

  async function handleLogout() {
    if (token) await api.logout(token).catch(() => undefined)
    localStorage.removeItem('techtrack-token')
    setToken(null)
    setUser(null)
    setTasks([])
    setEquipment([])
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    try {
      const updated = await api.updateTaskStatus(token!, task._id, status)
      setTasks((current) => current.map((item) => item._id === updated._id ? updated : item))
      setSelectedTask(updated)
      setToast(`Tarea actualizada a ${statusLabels[status].toLowerCase()}`)
    } catch (reason) {
      setToast(reason instanceof Error ? reason.message : 'No se pudo actualizar el estado.')
    }
  }

  async function handleSelectTask(task: Task) {
    try {
      if (user?.role === 'ADMIN') {
        const detailedTask = await api.getAdminTask(token!, task._id)
        setAdminReviewedTask(detailedTask)
        return
      }
      setSelectedTask(task)
      const detailedTask = await api.getTask(token!, task._id)
      setSelectedTask(detailedTask)
    } catch (reason) {
      setToast(reason instanceof Error ? reason.message : 'No se pudo cargar el detalle de la tarea.')
    }
  }

  async function handleOpenHistory(item: Equipment) {
    try {
      const history = await api.getEquipmentHistory(token!, item._id)
      setHistoryEquipment(history.equipment)
      setHistoryTasks(history.tasks)
      setActiveView('history')
    } catch (reason) {
      setToast(reason instanceof Error ? reason.message : 'No se pudo cargar el historial del equipo.')
    }
  }

  async function handleOpenSupervision() {
    setActiveView('supervision')
    try {
      const [activities, options] = await Promise.all([api.listAdminActivities(token!), api.getAdminTechnicians(token!)])
      setAdminActivities(activities)
      setAdminTechnicians(options.technicians)
      setAdminEquipment(options.equipment)
      if (!options.technicians.some((technician) => technician._id === selectedTechnicianId)) {
        setSelectedTechnicianId(options.technicians[0]?._id ?? '')
      }
    } catch (reason) {
      setToast(reason instanceof Error ? reason.message : 'No se pudieron cargar las actividades.')
    }
  }

  async function handleCreateAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    try {
      const result = await api.createAssignedTask(token!, {
        title: String(data.get('title')).trim(),
        description: String(data.get('description')).trim(),
        technicianId: String(data.get('technicianId')),
        equipmentId: String(data.get('equipmentId')),
      })
      setAdminActivities((current) => [result.task, ...current])
      form.reset()
      setToast(result.message)
    } catch (reason) {
      setToast(reason instanceof Error ? reason.message : 'No se pudo asignar la tarea.')
    }
  }

  async function handleSaveDocumentation(event: FormEvent<HTMLFormElement>, task: Task) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    try {
      const updated = await api.updateTaskDocumentation(token!, task._id, {
        problemReported: String(data.get('problemReported')).trim(),
        diagnosis: String(data.get('diagnosis')).trim(),
        activities: String(data.get('activities')).trim(),
        result: String(data.get('result')).trim(),
        recommendations: String(data.get('recommendations')).trim(),
      })
      setSelectedTask(updated.task)
      setTasks((current) => current.map((item) => item._id === updated.task._id ? updated.task : item))
      setToast(updated.message)
    } catch (reason) {
      setToast(reason instanceof Error ? reason.message : 'No se pudo guardar la documentación.')
    }
  }

  async function handleUploadEvidence(event: ChangeEvent<HTMLInputElement>, task: Task) {
    const input = event.currentTarget
    const image = input.files?.[0]
    if (!image) return
    setUploadingEvidence(true)
    try {
      const result = await api.uploadEvidence(token!, task._id, image)
      setSelectedTask(result.task)
      setTasks((current) => current.map((item) => item._id === result.task._id ? result.task : item))
      setToast(result.message)
    } catch (reason) {
      setToast(reason instanceof Error ? reason.message : 'No se pudo adjuntar la imagen.')
    } finally {
      setUploadingEvidence(false)
      input.value = ''
    }
  }

  async function handleCreateEquipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    try {
      const created = await api.createEquipment(token!, {
        assetTag: String(data.get('assetTag')).trim(),
        name: String(data.get('name')).trim(),
        type: String(data.get('type')).trim(),
        brand: String(data.get('brand')).trim(),
        model: String(data.get('model')).trim(),
        serialNumber: String(data.get('serialNumber')).trim(),
      })
      setEquipment((current) => [created, ...current])
      setModal(null)
      setToast('Equipo registrado correctamente')
    } catch (reason) {
      setToast(reason instanceof Error ? reason.message : 'No se pudo registrar el equipo.')
    }
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    try {
      const created = await api.createTask(token!, {
        title: String(data.get('title')).trim(),
        description: String(data.get('description')).trim(),
        equipmentId: String(data.get('equipmentId')),
      })
      setTasks((current) => [created, ...current])
      setModal(null)
      setActiveView('tasks')
      setToast('Tarea creada y asignada como pendiente')
    } catch (reason) {
      setToast(reason instanceof Error ? reason.message : 'No se pudo crear la tarea.')
    }
  }

  if (!user) return <AuthScreen onAuthenticated={handleAuthenticated} />

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#inicio" aria-label="TechTrack inicio"><span className="brand-mark"><Activity size={19} strokeWidth={2.4} /></span><span>techtrack<span className="brand-period">.</span></span></a>
      <div className="workspace-label">ESPACIO DE TRABAJO</div>
      <nav className="main-nav" aria-label="Navegación principal">
        <button className={activeView === 'tasks' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView('tasks')} title="Tareas"><ClipboardList size={18} /><span>Tareas</span><span className="nav-count">{counts.total}</span></button>
        <button className={activeView === 'equipment' || activeView === 'history' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView('equipment')} title="Equipos"><Laptop size={18} /><span>Equipos</span><span className="nav-count">{equipment.length}</span></button>
        {user.role === 'ADMIN' && <button className={activeView === 'supervision' ? 'nav-item active' : 'nav-item'} onClick={() => void handleOpenSupervision()} title="Supervisión"><ClipboardCheck size={18} /><span>Supervisión</span></button>}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-note"><div className="note-icon"><ShieldCheck size={17} /></div><strong>Todo bajo control</strong><span>El historial de cada intervención se conserva con su equipo.</span></div>
      <div className="sidebar-footer"><button className="user-menu" onClick={() => void handleLogout()} title="Cerrar sesión"><span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span><span className="user-copy"><strong>{user.name}</strong><small>{user.role === 'ADMIN' ? 'Administrador' : 'Técnico'}</small></span><LogOut size={16} /></button></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumbs"><span>TechTrack</span><span className="crumb-divider">/</span><strong>{activeView === 'tasks' ? 'Tareas' : activeView === 'equipment' ? 'Equipos' : activeView === 'history' ? 'Historial del equipo' : 'Supervisión'}</strong></div><div className="topbar-actions"><div className="connection-pill"><span className="connection-dot" /> Sistema operativo</div><button className="icon-button" aria-label="Ayuda" title="Ayuda"><CircleHelp size={18} /></button><button className="icon-button notification-button" aria-label="Notificaciones" title="Notificaciones"><Bell size={18} /><i /></button></div></header>
      <div className="page-content">
        {error && <div className="inline-alert"><span>{error}</span><button onClick={() => window.location.reload()} aria-label="Reintentar">Reintentar</button></div>}
        {activeView === 'tasks' ? <>
          <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> CONTROL DE SERVICIO</div><h1>Panel de tareas</h1><p className="page-description">Una vista clara de lo que requiere atención y del trabajo realizado.</p></div><button className="primary-button" onClick={() => setModal('task')}><Plus size={17} /> Nueva tarea</button></div>
          <section className="metric-grid" aria-label="Resumen de tareas"><MetricCard label="Tareas registradas" value={counts.total} detail="En tu espacio de trabajo" icon={<ClipboardList size={18} />} tone="mint" /><MetricCard label="Pendientes" value={counts.pending} detail="Por atender" icon={<Clock3 size={18} />} tone="amber" /><MetricCard label="En progreso" value={counts.progress} detail="Intervenciones activas" icon={<Activity size={18} />} tone="blue" /><MetricCard label="Completadas" value={counts.completed} detail="Trabajo documentado" icon={<Check size={18} />} tone="green" /></section>
          <section className="task-panel"><div className="panel-heading"><div><h2>Actividad técnica</h2><p>Seguimiento de las intervenciones asignadas</p></div><button className="text-button" onClick={() => setActiveView('equipment')}>Ver equipos <ArrowRight size={15} /></button></div>
            <div className="table-toolbar"><div className="filter-tabs" role="group" aria-label="Filtrar por estado"><button className={statusFilter === 'ALL' ? 'filter-tab selected' : 'filter-tab'} onClick={() => setStatusFilter('ALL')}>Todas <span>{counts.total}</span></button>{statusOrder.map((status) => <button key={status} className={statusFilter === status ? 'filter-tab selected' : 'filter-tab'} onClick={() => setStatusFilter(status)}>{statusLabels[status]}</button>)}</div><label className="search-field"><Search size={16} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar tarea o equipo" aria-label="Buscar tarea o equipo" /></label></div>
            <div className="task-table-wrap"><table className="task-table"><thead><tr><th>Intervención</th><th>Equipo</th><th>Estado</th><th>Creada</th><th aria-label="Acciones" /></tr></thead><tbody>{filteredTasks.map((task) => { const linkedEquipment = getEquipment(task); return <tr key={task._id} onClick={() => void handleSelectTask(task)} className="task-row"><td><div className="task-title-cell"><span className="task-type-icon"><Settings2 size={16} /></span><span><strong>{task.title}</strong><small>{task.description || 'Sin descripción adicional'}</small></span></div></td><td><div className="equipment-cell"><Laptop size={15} /><span>{linkedEquipment?.name ?? 'Equipo'}</span><small>{linkedEquipment?.assetTag ?? ''}</small></div></td><td onClick={(event) => event.stopPropagation()}><StatusSelect value={task.status} onChange={(status) => void handleStatusChange(task, status)} /></td><td className="date-cell">{formatDate(task.createdAt)}</td><td><button className="row-arrow" aria-label={`Ver ${task.title}`} onClick={(event) => { event.stopPropagation(); void handleSelectTask(task) }}><ArrowRight size={16} /></button></td></tr> })}</tbody></table>
              {loading && <div className="empty-state"><span className="loader" /> Cargando tareas...</div>}
              {!loading && filteredTasks.length === 0 && <div className="empty-state"><span className="empty-icon"><ClipboardList size={21} /></span><strong>{tasks.length === 0 ? 'Tu lista está lista para empezar' : 'No encontramos resultados'}</strong><span>{tasks.length === 0 ? 'Registra un equipo y crea tu primera tarea técnica.' : 'Prueba otra búsqueda o cambia el filtro.'}</span>{tasks.length === 0 && <button className="text-button" onClick={() => setModal('task')}>Crear primera tarea <ArrowRight size={15} /></button>}</div>}
            </div><div className="panel-footnote"><span><ShieldCheck size={14} /> Tus tareas solo son visibles para tu cuenta</span><span>{filteredTasks.length} {filteredTasks.length === 1 ? 'registro' : 'registros'}</span></div>
          </section>
        </> : activeView === 'equipment' ? <>
          <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> INVENTARIO TÉCNICO</div><h1>Equipos</h1><p className="page-description">Activos bajo seguimiento y su información de identificación.</p></div><button className="primary-button" onClick={() => setModal('equipment')}><Plus size={17} /> Registrar equipo</button></div>
          <section className="equipment-section"><div className="equipment-toolbar"><div><strong>{equipment.length} equipos</strong><span> registrados en tu espacio</span></div><label className="search-field"><Search size={16} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar equipo" aria-label="Buscar equipo" /></label></div>
            {visibleEquipment(equipment, searchTerm).length > 0 ? <div className="equipment-grid">{visibleEquipment(equipment, searchTerm).map((item) => <article className="equipment-card" key={item._id}><div className="equipment-card-top"><span className="equipment-icon"><Laptop size={20} /></span><span className="asset-tag">{item.assetTag}</span></div><h3>{item.name}</h3><p>{item.brand} {item.model}</p><div className="equipment-meta"><span>{item.type}</span><span>Serie {item.serialNumber || 'Sin registrar'}</span></div><button className="equipment-history" onClick={() => void handleOpenHistory(item)}>Ver historial técnico <ArrowRight size={15} /></button></article>)}</div> : <div className="empty-state equipment-empty"><span className="empty-icon"><Laptop size={21} /></span><strong>{equipment.length ? 'No encontramos ese equipo' : 'Aún no hay equipos registrados'}</strong><span>Registra los activos para vincularlos con las intervenciones técnicas.</span>{!equipment.length && <button className="primary-button" onClick={() => setModal('equipment')}><Plus size={16} /> Registrar primer equipo</button>}</div>}
          </section>
        </> : activeView === 'history' ? <>
          <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> TRAZABILIDAD DEL ACTIVO</div><h1>{historyEquipment?.name ?? 'Historial técnico'}</h1><p className="page-description">{historyEquipment ? `${historyEquipment.assetTag} · ${historyEquipment.brand} ${historyEquipment.model}` : 'Intervenciones registradas para este equipo.'}</p></div><button className="secondary-button" onClick={() => setActiveView('equipment')}><Laptop size={15} /> Volver a equipos</button></div>
          {historyTasks.length ? <section className="history-list" aria-label="Intervenciones del equipo">{historyTasks.map((task) => <button className="history-entry" key={task._id} onClick={() => void handleSelectTask(task)}><span className="history-marker"><History size={16} /></span><span className="history-entry-copy"><strong>{task.title}</strong><small>{task.activities || task.problemReported || task.description || 'Sin resumen de actividades.'}</small></span><span className="history-entry-meta"><span className={`history-status status-${task.status.toLowerCase()}`}>{statusLabels[task.status]}</span><time>{formatDate(task.updatedAt)}</time><ArrowRight size={15} /></span></button>)}</section> : <div className="empty-state history-empty"><span className="empty-icon"><History size={21} /></span><strong>Este equipo aún no tiene historial</strong><span>Las intervenciones asociadas aparecerán aquí con su fecha y detalle.</span></div>}
        </> : <>
          <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> CONTROL DE CALIDAD</div><h1>Supervisión de actividades</h1><p className="page-description">Intervenciones registradas por los técnicos.</p></div><span className="activity-count">{adminActivities.length} registros</span></div>
          <section className="admin-assignment"><div className="panel-heading"><div><h2>Asignar nueva tarea</h2><p>La tarea aparecerá en el espacio de trabajo del técnico seleccionado.</p></div></div><form className="admin-assignment-form" onSubmit={(event) => void handleCreateAssignment(event)}><div className="form-grid"><label>Técnico<select name="technicianId" value={selectedTechnicianId} required onChange={(event) => setSelectedTechnicianId(event.target.value)}><option value="" disabled>Selecciona un técnico</option>{adminTechnicians.map((technician) => <option key={technician._id} value={technician._id}>{technician.name} · {technician.email}</option>)}</select></label><label>Equipo asignado<select key={selectedTechnicianId} name="equipmentId" required defaultValue=""><option value="" disabled>Selecciona un equipo</option>{adminEquipment.filter((item) => item.owner === selectedTechnicianId).map((item) => <option key={item._id} value={item._id}>{item.assetTag} · {item.name}</option>)}</select></label></div><label>Título de la tarea<input name="title" required maxLength={120} placeholder="Ej. Mantenimiento preventivo" /></label><label>Descripción inicial<textarea name="description" rows={2} maxLength={2000} placeholder="Describe el trabajo solicitado" /></label><div className="dialog-actions"><span className="assignment-hint">{adminTechnicians.length === 0 ? 'No hay técnicos registrados.' : adminEquipment.every((item) => item.owner !== selectedTechnicianId) ? 'El técnico seleccionado aún no tiene equipos.' : 'El técnico podrá documentar y actualizar su tarea.'}</span><button type="submit" className="primary-button" disabled={!selectedTechnicianId || !adminEquipment.some((item) => item.owner === selectedTechnicianId)}><Plus size={15} /> Asignar tarea</button></div></form></section>
          <section className="task-panel"><div className="admin-activity-list">{adminActivities.length ? adminActivities.map((item) => { const linkedEquipment = getEquipment(item); return <article className="admin-activity-row" key={item._id}><span className="task-type-icon"><ClipboardCheck size={16} /></span><div className="admin-activity-main"><strong>{item.activities || item.title}</strong><small>{item.owner?.name ?? 'Técnico'} · {linkedEquipment?.assetTag ?? 'Equipo'} {linkedEquipment?.name ? `· ${linkedEquipment.name}` : ''}</small></div><span className={`history-status status-${item.status.toLowerCase()}`}>{statusLabels[item.status]}</span><time>{formatDate(item.updatedAt)}</time><button className="admin-review-button" onClick={() => void handleSelectTask(item)} aria-label={`Revisar tarea: ${item.title}`}><Eye size={14} /> Revisar</button></article> }) : <div className="empty-state"><span className="empty-icon"><ClipboardCheck size={21} /></span><strong>No hay actividades registradas</strong><span>Los registros técnicos aparecerán aquí para su revisión.</span></div>}</div></section>
        </>}
        <footer className="page-footer"><span>TECHTRACK <span className="brand-period">/</span> TRAZABILIDAD TÉCNICA</span><span>Una intervención a la vez, con todo su contexto.</span></footer>
      </div>
    </main>

    {modal && <Modal title={modal === 'task' ? 'Nueva tarea técnica' : 'Registrar equipo'} onClose={() => setModal(null)}>
      {modal === 'task' ? <form className="dialog-form" onSubmit={(event) => void handleCreateTask(event)}><div className="form-intro"><span className="dialog-icon"><ClipboardList size={18} /></span><div><strong>Define la intervención</strong><span>La tarea se creará con estado pendiente.</span></div></div><label>Título de la tarea<input name="title" required maxLength={120} placeholder="Ej. Diagnóstico de equipo" /></label><label>Equipo asociado<select name="equipmentId" required defaultValue=""><option value="" disabled>Selecciona un equipo</option>{equipment.map((item) => <option key={item._id} value={item._id}>{item.assetTag} · {item.name}</option>)}</select></label><label>Descripción del problema<textarea name="description" rows={3} placeholder="Describe brevemente el trabajo solicitado" /></label>{equipment.length === 0 && <div className="form-warning"><Laptop size={16} /> Primero registra un equipo para poder asociarlo a una tarea.</div>}<div className="dialog-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>Cancelar</button><button type="submit" className="primary-button" disabled={equipment.length === 0}><Plus size={16} /> Crear tarea</button></div></form> : <form className="dialog-form" onSubmit={(event) => void handleCreateEquipment(event)}><div className="form-intro"><span className="dialog-icon"><Laptop size={18} /></span><div><strong>Identifica el activo</strong><span>Completa los datos para facilitar su seguimiento.</span></div></div><div className="form-grid"><label>Identificador<input name="assetTag" required maxLength={40} placeholder="Ej. PC-001" /></label><label>Tipo<input name="type" required maxLength={60} placeholder="Laptop, servidor..." /></label></div><label>Nombre o descripción<input name="name" required maxLength={120} placeholder="Ej. Laptop de recepción" /></label><div className="form-grid"><label>Marca<input name="brand" required maxLength={60} placeholder="Ej. Lenovo" /></label><label>Modelo<input name="model" required maxLength={80} placeholder="Ej. ThinkPad E14" /></label></div><label>Número de serie<input name="serialNumber" required maxLength={100} placeholder="Número de serie del fabricante" /></label><div className="dialog-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>Cancelar</button><button type="submit" className="primary-button"><Plus size={16} /> Guardar equipo</button></div></form>}
    </Modal>}

    {selectedTask && <Modal title="Detalle de intervención" onClose={() => setSelectedTask(null)} wide><div className="detail-content"><div className="detail-title"><span className="task-type-icon large"><Settings2 size={19} /></span><div><div className="eyebrow">{getEquipment(selectedTask)?.assetTag ?? 'TAREA TÉCNICA'}</div><h3>{selectedTask.title}</h3></div></div><div className="detail-meta"><span><Laptop size={15} /> {getEquipment(selectedTask)?.name ?? 'Equipo asociado'}</span><span><Clock3 size={15} /> Creada el {formatDate(selectedTask.createdAt)}</span><span>Actualizada el {formatDate(selectedTask.updatedAt)}</span></div><div className="detail-status"><span>Estado actual</span><StatusSelect value={selectedTask.status} onChange={(status) => void handleStatusChange(selectedTask, status)} /></div><form className="documentation-form" onSubmit={(event) => void handleSaveDocumentation(event, selectedTask)}><label>Problema reportado<textarea name="problemReported" rows={2} maxLength={3000} defaultValue={selectedTask.problemReported || selectedTask.description} disabled={selectedTask.status === 'COMPLETED'} /></label><label>Diagnóstico<textarea name="diagnosis" rows={3} maxLength={5000} defaultValue={selectedTask.diagnosis} placeholder="Describe la causa identificada" disabled={selectedTask.status === 'COMPLETED'} /></label><label>Actividades realizadas<textarea name="activities" rows={3} maxLength={5000} defaultValue={selectedTask.activities} placeholder="Detalla las acciones ejecutadas" disabled={selectedTask.status === 'COMPLETED'} /></label><label>Resultado<textarea name="result" rows={2} maxLength={3000} defaultValue={selectedTask.result} placeholder="¿Cuál fue el resultado de la intervención?" disabled={selectedTask.status === 'COMPLETED'} /></label><label>Recomendaciones<textarea name="recommendations" rows={2} maxLength={3000} defaultValue={selectedTask.recommendations} placeholder="Observaciones para el seguimiento" disabled={selectedTask.status === 'COMPLETED'} /></label>{selectedTask.status !== 'COMPLETED' ? <div className="dialog-actions"><button className="primary-button" type="submit"><Check size={15} /> Guardar documentación</button></div> : <p className="documentation-locked">La tarea está completada y su documentación ya no se puede editar.</p>}</form><section className="evidence-section"><div className="evidence-heading"><div><strong>Evidencias</strong><span>{selectedTask.evidence?.length ?? 0} imágenes adjuntas</span></div>{selectedTask.status !== 'COMPLETED' && <label className="evidence-upload"><ImagePlus size={15} />{uploadingEvidence ? 'Subiendo...' : 'Adjuntar imagen'}<input type="file" name="image" accept="image/jpeg,image/png,image/webp" disabled={uploadingEvidence} onChange={(event) => void handleUploadEvidence(event, selectedTask)} /></label>}</div>{selectedTask.evidence?.length ? <div className="evidence-grid">{selectedTask.evidence.map((item) => <EvidencePreview key={item._id} evidence={item} token={token!} />)}</div> : <p className="evidence-empty">Aún no hay evidencias adjuntas.</p>}</section></div></Modal>}
    {adminReviewedTask && <Modal title="Revisión de tarea" onClose={() => setAdminReviewedTask(null)} wide><div className="detail-content"><div className="detail-title"><span className="task-type-icon large"><ClipboardCheck size={19} /></span><div><div className="eyebrow">{getEquipment(adminReviewedTask)?.assetTag ?? 'TAREA ASIGNADA'}</div><h3>{adminReviewedTask.title}</h3></div></div><div className="detail-meta"><span><strong>Técnico:</strong> {adminReviewedTask.owner.name} · {adminReviewedTask.owner.email}</span><span><Laptop size={15} /> {getEquipment(adminReviewedTask)?.name ?? 'Equipo asociado'}</span><span><Clock3 size={15} /> Creada el {formatDate(adminReviewedTask.createdAt)}</span><span>Actualizada el {formatDate(adminReviewedTask.updatedAt)}</span></div><div className="admin-review-status"><span>Estado actual</span><span className={`history-status status-${adminReviewedTask.status.toLowerCase()}`}>{statusLabels[adminReviewedTask.status]}</span></div><div className="admin-review-fields"><ReadOnlyField label="Problema reportado" value={adminReviewedTask.problemReported || adminReviewedTask.description} /><ReadOnlyField label="Diagnóstico" value={adminReviewedTask.diagnosis} /><ReadOnlyField label="Actividades realizadas" value={adminReviewedTask.activities} /><ReadOnlyField label="Resultado" value={adminReviewedTask.result} /><ReadOnlyField label="Recomendaciones" value={adminReviewedTask.recommendations} /></div><section className="admin-review-timeline"><strong>Historial de estado</strong>{adminReviewedTask.statusHistory?.length ? <ol>{adminReviewedTask.statusHistory.map((entry, index) => <li key={`${entry.status}-${entry.changedAt}-${index}`}><span className={`history-status status-${entry.status.toLowerCase()}`}>{statusLabels[entry.status]}</span><time>{formatDate(entry.changedAt)}</time></li>)}</ol> : <p>Sin cambios de estado registrados.</p>}</section><section className="evidence-section"><div className="evidence-heading"><div><strong>Evidencias</strong><span>{adminReviewedTask.evidence?.length ?? 0} imágenes adjuntas</span></div></div>{adminReviewedTask.evidence?.length ? <div className="evidence-grid">{adminReviewedTask.evidence.map((item) => <EvidencePreview key={item._id} evidence={item} token={token!} />)}</div> : <p className="evidence-empty">Esta tarea aún no tiene evidencias adjuntas.</p>}</section></div></Modal>}
    {toast && <div className="toast" role="status"><span className="toast-check"><Check size={14} /></span>{toast}<button onClick={() => setToast('')} aria-label="Cerrar mensaje"><X size={15} /></button></div>}
  </div>
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

function getEquipment(task: Task) {
  return typeof task.equipment === 'string' ? null : task.equipment
}

function visibleEquipment(items: Equipment[], query: string) {
  const normalizedQuery = query.toLowerCase()
  return items.filter((item) => `${item.name} ${item.assetTag} ${item.brand} ${item.model}`.toLowerCase().includes(normalizedQuery))
}

function MetricCard({ label, value, detail, icon, tone }: { label: string; value: number; detail: string; icon: ReactNode; tone: string }) {
  return <article className="metric-card"><span className={`metric-icon ${tone}`}>{icon}</span><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-detail">{detail}</div></article>
}

function StatusSelect({ value, onChange }: { value: TaskStatus; onChange: (status: TaskStatus) => void }) {
  const validOptions = value === 'PENDING' ? ['PENDING', 'IN_PROGRESS'] as TaskStatus[] : value === 'IN_PROGRESS' ? ['IN_PROGRESS', 'COMPLETED'] as TaskStatus[] : ['COMPLETED'] as TaskStatus[]
  return <span className={`status-wrap status-${value.toLowerCase()}`}><span className="status-dot" /><select aria-label="Cambiar estado de tarea" value={value} onChange={(event) => onChange(event.target.value as TaskStatus)}>{validOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select><ChevronDown size={13} /></span>
}

function Modal({ title, onClose, wide = false, children }: { title: string; onClose: () => void; wide?: boolean; children: ReactNode }) {
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [onClose])
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}><header className="modal-header"><strong>{title}</strong><button className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={18} /></button></header>{children}</section></div>
}

function EvidencePreview({ evidence, token }: { evidence: TaskEvidence; token: string }) {
  const [imageUrl, setImageUrl] = useState('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    let objectUrl = ''
    api.getEvidenceImage(token, evidence.url)
      .then((blob) => {
        if (!active) return
        objectUrl = URL.createObjectURL(blob)
        setImageUrl(objectUrl)
      })
      .catch(() => { if (active) setFailed(true) })
    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [evidence.url, token])

  return <article className="evidence-item">{imageUrl ? <a href={imageUrl} target="_blank" rel="noreferrer"><img src={imageUrl} alt={evidence.filename} /><span>{evidence.filename}</span></a> : <div className="evidence-image-placeholder">{failed ? 'No se pudo cargar' : 'Cargando imagen...'}</div>}<small>{formatFileSize(evidence.size)} · {formatDate(evidence.uploadedAt)}</small></article>
}

function formatFileSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

function ReadOnlyField({ label, value }: { label: string; value?: string }) {
  return <div className="admin-readonly-field"><strong>{label}</strong><p>{value || 'Sin información registrada.'}</p></div>
}