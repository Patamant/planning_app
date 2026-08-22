/**
 * api.js
 * Wrapper único para hablar con el backend de Apps Script.
 * Usamos Content-Type text/plain para evitar el preflight OPTIONS
 * (Apps Script Web Apps no responden bien a preflight CORS).
 */

async function apiCall(action, payload) {
  const token = sessionStorage.getItem('token') || null;
  const body = JSON.stringify({ action, token, payload: payload || {} });

  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: body
  });

  if (!resp.ok) {
    throw new Error('Error de red al conectar con el servidor.');
  }
  return resp.json();
}

// ---------- Sesión ----------

function guardarSesion(data) {
  sessionStorage.setItem('token', data.token);
  sessionStorage.setItem('perfil', data.perfil);
  sessionStorage.setItem('nombre', data.nombre);
  sessionStorage.setItem('usuario', data.usuario);
}

function obtenerPerfilActual() {
  return sessionStorage.getItem('perfil');
}

function cerrarSesionLocal() {
  sessionStorage.clear();
}

function requireLogin(perfilesPermitidos) {
  const perfil = obtenerPerfilActual();
  if (!perfil) {
    window.location.href = 'index.html';
    return;
  }
  if (perfilesPermitidos && perfilesPermitidos.indexOf(perfil) === -1) {
    alert('No tienes permiso para ver esta página.');
    window.location.href = 'index.html';
  }
}

function redirigirSegunPerfil(perfil) {
  if (perfil === 'Administrador') window.location.href = 'admin.html';
  else if (perfil === 'Director de Planificación') window.location.href = 'director.html';
  else if (perfil === 'Gestor de Objetivos') window.location.href = 'gestor.html';
  else window.location.href = 'index.html';
}
