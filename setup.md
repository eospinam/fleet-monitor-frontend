## 📂 Frontend (fleet-monitor-frontend)

### 1. Variables de entorno

Crea el archivo `.env` en la raíz del frontend:

```
VITE_API_URL=http://localhost:5110
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar el frontend

```bash
npm run dev
```

El frontend corre en:

```
http://localhost:5173
```

---

## 🧪 Testing con Postman

1. Importa la colección `FleetMonitor.postman_collection.json` incluida en el repo.  
2. Flujo básico:
   - Registrar usuario (`/api/auth/register`)
   - Login (`/api/auth/login`) → copiar JWT
   - Crear dispositivo (`/api/device`)
   - Enviar telemetría (`/api/telemetry`)
   - Recibir alertas (`/api/alerts` o vía SignalR`)