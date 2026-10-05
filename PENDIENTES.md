# Pendientes y plan de trabajo

Documento vivo. Marca lo que falta implementar, las decisiones ya tomadas y lo que
quedó a medias. Se actualiza a medida que se avanza; lo terminado se tacha con `[x]`.

Última actualización: sitio público, panel admin **y chat público de preventas** completos,
compilando y con lint limpio.

---

## 0. Progreso de esta tanda

### Hecho — sitio público completo y compilando
- [x] Sistema de diseño SCSS: `_tokens.scss`, `_themes.scss` (claro/oscuro), `_mixins.scss`,
      `_reset.scss`, `_base.scss`, `_utilities.scss`, `global.scss`.
- [x] Tema con `ThemeProvider` (light/dark/system + `localStorage`) y anti-FOUC inline en
      `index.html`.
- [x] Fuentes locales (`@fontsource-variable` Sora / Inter / JetBrains Mono).
- [x] Layout: `Header`, `MobileNav` (drawer accesible), `Footer`, `Logo` (CSS), `ThemeToggle`,
      `Section`, `Container`, `AppShell` (skip link).
- [x] UI: `Button`, `Badge`, `Field` (Input/Textarea/Select), `PageHeader`, `StateBlock`,
      `Spinner`.
- [x] Datos: `lib/http.ts` (axios + `ApiError` RFC 7807), `lib/format.ts`,
      `features/content/{types,api,queries}.ts` (React Query).
- [x] Contenido: `ServiceCard`, `ProjectCard`, `BlogCard`, `Prose`, `CtaBand`, `SEO`.
- [x] Páginas: Home, Services, ServiceDetail (`/services/:slug`), Portfolio, ProjectDetail
      (`/portfolio/:slug`), About, Blog (tags + paginación), BlogPost (`/blog/:slug`),
      Contact (react-hook-form + zod → `POST /api/public/leads`), TrackLead
      (`/consulta/:token`), NotFound.
- [x] Router con code-splitting por ruta (`React.lazy` + `Suspense`). Chunk principal ~289 kB.
- [x] `.env` (dev → `https://localhost:7129/api`) y `.env.production`.
- [x] Eliminado todo el código muerto: `App.css`, `index.css`, `data/*`, `types/types.ts`,
      `hooks/useCotizacion.ts`, `services/{cotizacionService,quotationAnalyzer,quotationGenerator}.ts`,
      `components/{BlogCard,ProjectCard,ServiceCard}.tsx`, assets sin uso y `BACKEND_IMPLEMENTATION_EXAMPLE.js`,
      `QUOTATION_SYSTEM_*`.
- [x] `npm run build` verde y `npm run lint` con 0 errores (2 warnings menores).

### Hecho — panel de administración completo

**Sesión y seguridad**
- [x] `lib/session.ts`: access token **solo en memoria** (nunca en `localStorage`) y refresh
      token en `sessionStorage` (por pestaña). Decisión tomada para exponer lo mínimo.
- [x] `lib/http.ts` reescrito: `ApiError` (RFC 7807), `toApiError`, `errorMessage`,
      refresh automático ante 401 con **un solo refresh compartido** entre peticiones en
      vuelo, y `setUnauthorizedHandler` para expulsar la sesión.
- [x] `features/auth/`: `types`, `api`, `AuthContext`, `AuthProvider` (restaura sesión al
      recargar vía refresh token), `useAuth`, `RequireAuth`.

**Datos del panel**
- [x] `features/admin/enums.ts`: uniones de string espejo de `JsonStringEnumConverter(CamelCase)`,
      labels en español, tonos de `Badge`, `withAll` para filtros, `severityFromRank`.
- [x] `features/admin/types.ts`: todos los DTOs de `/api/admin/*` (leads, propuestas,
      conversaciones, escalamientos, usuarios, roles, contenido, settings).
- [x] `features/admin/api.ts` + `queries.ts`: cliente y ~55 hooks de React Query.

**Layout y permisos**
- [x] `components/admin/AdminLayout`: sidebar por grupos, topbar con tema y usuario, logout.
- [x] `features/admin/navigation.ts`: navegación filtrada por rol. `OwnerOrAdmin` = Owner +
      Admin (no incluye Provider); el borrado de contenido y la baja de usuarios quedan
      para Owner en la UI, como baja el backend.
- [x] `AdminPage`, `DataTable`, `Pagination`, `ConfirmButton` y las primitivas de layout en
      `styles/_admin.scss` (`.panel`, `.form-grid`, `.filters`, `.check`, `.stack`,
      `.row-actions`, `.role-list`).

**Pantallas**
- [x] `LoginPage` (`/admin/login`, fuera del chrome público).
- [x] `DashboardPage`: métricas, volumen 30 días y top de servicios.
- [x] `LeadsPage` + `LeadDetailPage`: filtros, estado, responsable, notas internas, borrado.
- [x] `ProposalsPage` + `ProposalEditPage`: editor de líneas con subtotal/descuento/impuestos
      calculados en pantalla (el servidor recalcula), cambio de estado con motivo, descarga
      del PDF. Filtra por `?leadId=` cuando se llega desde la ficha del lead.
- [x] `ConversationsPage` + `ConversationDetailPage`: hilo con notas internas, respuesta,
      asignación, cierre con motivo, escalamientos (crear/cambiar estado/nota de resolución).
      **SignalR** a `/hubs/chat/team` con `accessTokenFactory` + polling cada 10 s como
      respaldo si la conexión cae.
- [x] `ServicesPage` + `ServiceEditPage`, `PortfolioPage` + `PortfolioEditPage` (incluye
      galería de imágenes), `BlogPage` + `BlogEditPage` (SEO, portada, tags) y
      `BlogTagsPage` (alta/edición/baja de tags).
- [x] `PagesPage` + `PageEditPage`: editor de secciones con tipo, contenido en JSON,
      visibilidad y orden; valida el JSON antes de guardar.
- [x] `UsersPage` + `UserEditPage`: alta, edición, roles, desbloqueo, reset de contraseña y
      baja.
- [x] `SettingsPage`: empresa, footer, redes, hero y SEO por defecto.
- [x] Rutas de todo lo anterior en `App.tsx` bajo `RequireAuth` + `AdminLayout`.
- [x] `npm run build` verde y `npm run lint` con 0 errores (mismos 2 warnings de siempre).

### Hecho — chat público de preventas
- [x] `features/chat/{types,api,queries,store}.ts`: espejo de `ChatDtos.cs`, cliente de los
      cuatro endpoints públicos y hooks de React Query.
- [x] `ChatWidget` (`components/chat/ChatWidget.scss`): lanzador flotante fijo abajo a la
      derecha, presente en **todo el sitio público** vía `AppShell`, mobile first.
- [x] Alta del hilo: nombre, email, teléfono, asunto, mensaje, servicio opcional y adjunto
      opcional (5 MB, base64), con los límites del backend respetados en el cliente.
- [x] Hilo: burbujas, hora, descarga del adjunto, estado de la conversación y
      conversación cerrada con su motivo.
- [x] **SignalR** a `/hubs/chat/conversation?publicToken=…` (el Hub público es anónimo y se
      autentica con el token del hilo, no con el de sesión) + polling cada 10 s como
      respaldo si la conexión se cae.
- [x] Reanudar la conversación guardando `{ publicToken, name, email, lastReadAtUtc }` en
      `localStorage` bajo `backsolutions:chat`. Es la decisión que permite seguir el hilo al
      día siguiente; ver la deuda de seguridad anotada abajo.
- [x] Punto de "respuesta nueva" en el lanzador cuando el equipo contestó y el panel está
      cerrado; `Escape` cierra y el foco vuelve al lanzador; `openChatWidget()` /
      evento `backsolutions:open-chat` para abrirlo desde otra pantalla.
- [x] Botón "Abrir el chat" en `Contact`, y contexto automático: en `/servicios/:slug`
      propone el asunto con el nombre del servicio; en `/consulta/:token` engancha la
      conversación al lead (`leadId`) para que el equipo la vea en su ficha.
- [x] Contrato verificado contra el backend local: los cuatro endpoints responden y el
      historial nunca trae notas internas.

### Pendiente inmediato
- [ ] **El backend desplegado está obsoleto**: `https://backsolutions.runasp.net/api` solo
      expone `/api/Cotizar` (Swagger: 1 path). Para ver el sitio con datos reales hay que
      correr el backend local (`dotnet run` → `https://localhost:7129`, que es lo que apunta
      `.env`; `http://localhost:5047` redirige con 307 a ese puerto) o desplegar la versión
      actual. El CORS local ya permite `http://localhost:5173`.
- [ ] Verificación visual en navegador (no se pudo hacer desde el entorno de desarrollo).
- [ ] Probar el camino de **WebSocket** del chat público en un navegador real: por HTTP ya
      se verificó el ciclo completo (alta, historial, mensaje, adjunto), pero el handshake
      del Hub y la reconexión automática no.
- [ ] Warning `react(only-export-components)`: mover `useTheme` a su propio archivo.

### Deuda técnica anotada
- [ ] **El `publicToken` del visitante viaja en `localStorage` y en la URL del adjunto.**
      Es lo que permite retomar el hilo, pero en un navegador compartido cualquiera con
      acceso al dispositivo puede leer y escribir esa conversación. Si eso molesta,
      `sessionStorage` lo cierra y a costa de perder el hilo al cerrar la pestaña. Los
      tokens de sesión del equipo ya están tratados aparte; estos dos no.
- [ ] La descarga del adjunto abre una pestaña con el token en la URL, así que queda en el
      historial del navegador y se puede filtrar por `Referer` a un tercero. Cuando el sitio
      tenga dominio propio conviene servir los adjuntos por un host aparte o por un token de
      un solo uso.
- [ ] **Refresh token en cookie httpOnly**: es la opción máxima de seguridad y requiere
      cambios en el backend (`Set-Cookie`/`Clear-Cookie`, CORS con credenciales). Hoy el
      refresh vive en `sessionStorage`: por pestaña y se borra al cerrarla.
- [ ] **El editor de contenido es HTML crudo** (textarea). Para producción hace falta un
      editor visual o, al menos, sanitizado del HTML en el backend antes de renderizarlo.
- [ ] **Desajuste de roles en `LeadsController`**: el comentario dice "Provider y Admin
      acceden" pero la política `OwnerOrAdmin` no incluye a Provider. El código manda; hay
      que corregir el comentario o la política, según cuál sea la intención.
- [ ] Los selectores de contenido mandan `content` como JSON en un textarea; si el backend
      valida forma distinta por tipo de sección, hay que agregar un editor por tipo.

---

## 1. Estado inicial (antes de esta tanda, queda como referencia)

### Frontend — `React/BackSolutionsFront`
- React 19 + Vite 8 + TypeScript 6 + React Router 7 + Axios. Sin gestor de estado ni
  capa de datos.
- Tema **solo oscuro**, con los tokens a mano en `src/index.css`.
- **Un solo `src/App.css` de 870 líneas** con los estilos de todas las vistas. No hay
  estilos por archivo, que es justo lo que se quiere cambiar.
- Páginas: `Home`, `Services`, `Portfolio`, `About`, `Blog`, `Contact`. Las de listado
  (Services, Portfolio, Blog) son finas: renderizan datos **mock** de `src/data/*.ts`.
- El formulario de contacto usa el hook `useCotizacion`, que hace `POST {VITE_API_URL}/Cotizar`.
  **Ese endpoint ya no existe** en el backend nuevo: el sistema de cotizaciones lo
  reemplazó el de propuestas. El sitio está desconectado de la API real.
- Código muerto heredado del cotizador viejo: `src/services/quotationGenerator.ts`
  (506 líneas), `src/services/quotationAnalyzer.ts`, `src/hooks/useCotizacion.ts`,
  `src/types/types.ts` (`CotizacionFormData`), `BACKEND_IMPLEMENTATION_EXAMPLE.js`,
  `QUOTATION_SYSTEM_DOCS.ts`, `QUOTATION_SYSTEM_README.md`.
- Hay clases estilo Tailwind en el JSX (p. ej. `Blog.tsx`: `text-4xl font-bold`) pero
  Tailwind **no está instalado**: no hacen nada. Confunde.
- Sin navegación móvil (el menú es una lista fija que se rompe en pantalla chica).
- Sin panel de administración.
- Sin toggle claro/oscuro.
- Sin tests (Jest configurado, cero tests).

### Backend — `C#/BackSolutions` (solo lo pendiente)
- API en .NET 8, Azure SQL, JWT + refresh, SignalR para el chat. Superficie completa
  en `/api/public`, `/api/admin` y `/api/auth`.
- Proyecto de tests `tests/BackSolutions.Tests` con el harness de integración ya
  funcionando: **5 tests de regresión en verde** y rollback verificado (la base queda
  limpia en las 16 tablas).
- Ver sección 6 para lo que falta del lado de tests.

### Puente entre ambos
- `VITE_API_URL=https://backsolutions.runasp.net/api` (producción).
- CORS del backend ya permite `http://localhost:5173` (Vite) y el dominio de Vercel.

---

## 2. Decisiones tomadas

- **CSS puro con SCSS**, sin Tailwind. Un archivo de estilos por componente/vista:
  `Home.tsx` ↔ `Home.scss`. Nada de CSS global monolítico.
- **Temas claro y oscuro** vía variables CSS, con conmutador y persistencia.
- **Mobile first**: se diseña para teléfono y se agranda.
- **Identidad visual definida por nosotros** (sección 4).
- Se construyen **sitio público y panel admin a la par**.
- El front consume la **API real**; se elimina el mock y el cotizador viejo.

---

## 3. Arquitectura objetivo del front

```
src/
  app/                 # composición: router, providers, layouts
    App.tsx / App.scss
    router.tsx
    providers.tsx      # QueryClient, Auth, Theme, Toaster
  styles/              # SOLO fundamentos, nada de componentes
    _tokens.scss       # variables CSS (colores, tipografía, espacio, sombras)
    _themes.scss       # :root[data-theme="light"|"dark"]
    _reset.scss
    _base.scss         # tipografía y elementos base
    _mixins.scss       # breakpoints, focus-ring, truncado, etc.
    global.scss        # importa lo anterior, único entry global
  components/          # UI reutilizable, cada uno con su .scss
    ui/                # Button, Input, Select, Textarea, Modal, Badge, Field...
    layout/            # Header, Footer, MobileNav, Container, ThemeToggle
  features/            # por dominio, con hooks + tipos + estilos
    auth/  leads/  proposals/  conversations/  content/  users/  dashboard/
  pages/
    public/            # Home, Services, Portfolio, Blog, About, Contact
    admin/             # Login, Dashboard, Leads, Proposals, Conversations, ...
  lib/                 # apiClient, tipos generados a mano, formatters, validaciones
```

Regla de estilos: cada `.tsx` que necesite estilos importa su `.scss` hermano y usa
clases con una raíz clara (`home__hero`). Los tokens son lo único global.

---

## 4. Identidad visual

**Posicionamiento:** estudio de software. Tono técnico, confiable, sobrio, moderno.
Nada de gradientes estridentes ni estética "crypto dashboard".

**Tipografía**
- Títulos: **Sora** (geométrica, moderna, con carácter).
- Texto: **Inter** (legibilidad en pantalla).
- Números/código: **JetBrains Mono** para métricas y datos tabulares.
- Empaquetadas localmente con `@fontsource` (sin depender de Google Fonts en runtime).

**Paleta (tokens, con versión clara y oscura)**

| Token           | Claro       | Oscuro      | Uso                          |
|-----------------|-------------|-------------|------------------------------|
| `--bg`          | `#F6F8FB`   | `#070D16`   | Fondo de página              |
| `--surface`     | `#FFFFFF`   | `#0E1826`   | Tarjetas, paneles            |
| `--surface-2`   | `#EFF3F8`   | `#13202F`   | Superficie alterna           |
| `--text`        | `#0B1524`   | `#E7EEF8`   | Texto principal              |
| `--text-muted`  | `#5A6B84`   | `#93A4BC`   | Texto secundario             |
| `--border`      | `#E1E8F0`   | `#1E2C3E`   | Bordes                       |
| `--accent`      | `#0E9F86`   | `#34D3B4`   | Marca, acciones primarias    |
| `--accent-strong`| `#0B7F6B`  | `#22B99C`   | Hover/activo                 |
| `--accent-soft` | `rgba(14,159,134,.12)` | `rgba(52,211,180,.14)` | Fondos suaves |
| `--danger`      | `#D64550`   | `#F87171`   | Errores                      |
| `--warning`     | `#B7791F`   | `#FBBF24`   | Advertencias                 |
| `--success`     | `#18794E`   | `#4ADE80`   | Éxito                        |

- Radios: `--r-sm 8px`, `--r-md 12px`, `--r-lg 16px`, `--r-pill 999px`.
- Espaciado en base 4: `--s-1..--s-12`.
- Sombras suaves de dos capas, distintas por tema.
- Movimiento sutil (150–250 ms), respetando `prefers-reduced-motion`.
- Foco visible siempre (`:focus-visible`), contraste AA en ambos temas.

---

## 5. Plan por fases (frontend)

### Fase 0 — Fundamentos
- [x] Instalar `sass`, `@fontsource` (Sora, Inter, JetBrains Mono), `lucide-react`,
      `@tanstack/react-query`, `@microsoft/signalr`, `react-hook-form`, `zod`.
- [x] Estructura `styles/` con tokens, temas, reset, base y mixins.
- [x] `ThemeProvider` + `ThemeToggle` (claro/oscuro/sistema, persistido).
- [x] `lib/http.ts`: Axios con base URL, `Authorization`, y refresh automático ante 401
      con refresh único compartido entre peticiones en vuelo.
- [x] `QueryClient` + providers (`app/providers.tsx`: Query, Theme, Auth, Helmet).
- [ ] Toasts/notificaciones y `ErrorBoundary`.

### Fase 1 — Layout y navegación
- [x] `AppShell`, `Container`, `Header`, `Footer`.
- [x] Menú móvil (drawer) accesible con foco atrapado y cierre con Escape.
- [x] Skip link, landmarks, títulos de página por ruta.
- [x] Migrar todas las clases de `App.css` a SCSS por componente y **borrar `App.css`**.

### Fase 2 — Sitio público (API real)
- [x] Home: hero, servicios, portfolio destacado, últimos posts, CTA de contacto.
- [x] Servicios: listado y detalle (`/api/public/services`, `/services/{slug}`).
- [x] Portfolio: listado y detalle (`/api/public/portfolio`, `/portfolio/{slug}`).
- [x] Blog: listado con paginación y etiquetas, detalle (`/api/public/blog/posts`).
- [ ] Páginas estáticas por slug (`/api/public/pages/{slug}`): hoy las páginas del CMS no
      tienen ruta pública; solo existen como contenido del panel.
- [x] Contacto: formulario real contra `POST /api/public/leads`, con validación,
      estados de carga/éxito/error y seguimiento por `publicToken`.
- [x] Chat público (widget) contra `POST /api/public/conversations` y su WebSocket: lanzador
      flotante en todo el sitio, reanudación del hilo, SignalR a
      `/hubs/chat/conversation?publicToken=…` y polling de respaldo. El hub público ya
      aceptaba el token; la interfaz es nueva.
- [~] SEO: `SEO.tsx` por ruta está; faltan `sitemap.xml` y `robots.txt`.
- [~] 404 implementado; falta una pantalla de error de ruta (ErrorBoundary).

### Fase 3 — Panel de administración
- [x] Login (`/api/auth/login`), refresh automático y logout. **Sin "recordarme"**: el
      refresh token vive en `sessionStorage` y se pierde al cerrar la pestaña.
- [x] Guardas de ruta: `RequireAuth` para autenticados y navegación filtrada por rol. El
      backend sigue siendo la frontera real (responde 403).
- [x] Layout admin: sidebar por grupos con drawer en móvil, topbar con tema y usuario.
- [x] Dashboard: métricas de `/api/admin/dashboard/stats`.
- [x] Leads: listado con filtros y cambio de estado/asignación/notas.
- [x] Propuestas: listado, editor de líneas, totales, cambio de estado, PDF.
- [x] Conversaciones: bandeja, chat en vivo con SignalR (y polling de respaldo), notas
      internas, escalaciones.
- [x] Contenido: portfolio, páginas, servicios, blog y etiquetas (CRUD con el mismo
      patrón de formularios).
- [x] Usuarios y roles, desbloqueo y reseteo de contraseña.
- [x] Configuración del sitio.

### Fase 4 — Calidad
- [ ] Tests de componentes/hooks (Vitest + Testing Library; hoy hay Jest sin usar).
- [ ] Manejo unificado de errores ProblemDetails del backend en formularios.
- [ ] Accesibilidad: navegación por teclado, contraste, `aria-live` en acciones.
- [ ] Optimización: code-splitting por ruta, imágenes responsivas, presupuesto de bundle.
- [ ] Revisión en pantallas reales (≤375 px, 768, 1024, 1440).

---

## 6. Deuda técnica del backend (tests)

Lo que quedó pendiente de la tanda de pruebas. El harness ya funciona; falta escribir
casos.

- [ ] Regresión de **filtros de estado** en los 7 servicios (el enum se resuelve fuera
      del árbol LINQ).
- [ ] Regresión del **dashboard** (proyección anónima + `Count()` correlacionado).
- [ ] Regresión del **subtotal de propuestas** (sin duplicar líneas).
- [ ] Tests **unitarios** de reglas de negocio puras (numeración, validez, totales).
- [ ] Portar el smoke HTTP de `/tmp/httptest.py` a tests de integración versionados.
- [ ] Documentar la deuda ya identificada: Provider sin acceso a leads/propuestas,
      `ForwardedHeaders`, invalidación de caché, SignalR WebSocket, adjuntos, SMTP,
      Docker/CI/deploy.
- [ ] Reescribir en un `TECHNICAL-DEBT.md` del repo backend la limitación del rollback
      por test y el porqué de `ITransactionRunner`.

---

## 7. Limpieza

- [ ] Borrar el cotizador viejo y sus docs (sección 1) una vez que Contact use la API real.
- [ ] Quitar del JSX las clases Tailwind muertas.
- [ ] Borrar `App.css` al terminar la migración a SCSS.
- [ ] Revisar `src/assets` (imágenes repetidas: `BSLogo.png`/`BSlogo2.png`,
      `favicon.ico`/`favicon2.png`, `hero.png` sin uso claro).
- [ ] Decidir el destino de `googleb315e8d1b6a0b63b.html` (verificación de Google).

---

## 8. Riesgos y notas

- **Espejo de tokens con el backend**: los roles y estados de leads/propuestas están
  duplicados en la API. Conviene un único lugar (documento o tipos compartidos) para
  que no se desincronicen.
- **CORS**: en producción hay que agregar el dominio real del front a
  `Cors:AllowedOrigins` del backend.
- **Zona horaria y fechas**: el backend guarda UTC. Formatear siempre con la zona del
  usuario en el front.
- **Chat**: el ciclo HTTP ya se verificó contra el backend local; falta el camino de
  WebSocket en un navegador real. Los proxies deben permitir `Upgrade`.
- **Propuestas**: tienen `publicToken`; el PDF se sirve por URL pública. Cuidar que no
  se filtren tokens en logs ni en el historial del navegador.
