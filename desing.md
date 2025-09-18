## 💻 Frontend (fleet-monitor-frontend)

### 🔹 Tecnologías
- **React 18 + Vite**
- **React Router DOM** (navegación SPA)
- **TailwindCSS** (estilos)
- **Axios** (llamadas API)
- **SignalR client** (tiempo real)
- **Context API** (gestión de auth)

### 🔹 Organización del código
```
src/
 ├── components/        # Reutilizables (NavBar, etc.)
 ├── contexts/          # AuthContext
 ├── layouts/           # AuthLayout, AppLayout
 ├── pages/             # Login, Register, Devices, Telemetry, Alerts
 ├── services/          # api.js, auth.js, signalr.js
 ├── App.jsx            # Rutas principales
 └── main.jsx           # Punto de entrada
```

### 🔹 Flujos principales (UI)
1. **Login/Register**
   - Usuarios se autentican → JWT almacenado en `localStorage`.
   - AuthContext gestiona `user` y `token`.

2. **Devices**
   - Lista de dispositivos.
   - Admin puede crear nuevos dispositivos.

3. **Telemetry**
   - Formulario para enviar telemetría manual.
   - Stream en tiempo real por SignalR.

4. **Alerts**
   - Vista de alertas históricas.
   - Nuevas alertas aparecen automáticamente con SignalR.