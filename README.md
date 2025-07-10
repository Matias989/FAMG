# Albion Group Manager

Una plataforma web moderna para gestionar grupos, eventos y calcular loot en Albion Online. Diseñada específicamente para organizar actividades de juego con plantillas predefinidas y roles específicos.

## 🎯 Características Principales

### 👥 **Gestión de Grupos**
- Crear y gestionar grupos de juego
- Plantillas predefinidas para diferentes actividades
- Roles específicos (Tanque, Sanador, DPS, etc.)
- Sistema de invitaciones y membresía

### 📅 **Gestión de Eventos**
- Programar eventos con fechas y horarios
- Aplicar a eventos con roles específicos
- Calendario de actividades
- Sistema de confirmaciones

### 💰 **Calculadora de Loot**
- Reparto equitativo de ganancias
- Consideración de gastos de reparación
- Distribución proporcional por participación
- Historial de cálculos

### 🎨 **Plantillas de Grupos**
- Plantillas predefinidas para PvE, PvP, HCE
- Roles específicos para cada actividad
- Personalización de plantillas
- Categorías organizadas

## 🚀 Tecnologías Utilizadas

### **Frontend**
- **React 18** con Vite
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Context API** para estado global

### **Optimizado para Hosting Gratuito**
- **Build estático** para Netlify/Vercel
- **LocalStorage** para sesiones
- **Sin backend** (puede agregarse Firebase/Supabase)

## 📱 Páginas Principales

### **🏠 Landing Page**
- Presentación del proyecto
- Características destacadas
- Call-to-action para registro

### **🔐 Autenticación**
- Login/Register con validación
- Credenciales de demo incluidas
- Gestión de sesiones

### **📊 Dashboard**
- Resumen de actividad
- Estadísticas personales
- Eventos próximos
- Acciones rápidas

### **👥 Grupos**
- Lista de grupos con filtros
- Crear nuevos grupos
- Gestión de miembros
- Categorías organizadas

### **📅 Eventos**
- Calendario de eventos
- Programar nuevas actividades
- Sistema de aplicaciones
- Estados de eventos

### **💰 Calculadora**
- Cálculo de loot integrado
- Distribución equitativa/proporcional
- Gastos de reparación
- Formateo de moneda

### **📋 Plantillas**
- Plantillas predefinidas
- Roles específicos por actividad
- Personalización
- Categorías: PvE, PvP, Gathering, Crafting

## 🎮 Plantillas de Grupos

### **PvE - Dungeons**
- **Dungeon 5 Jugadores**: Tanque, Sanador, DPS Melee, DPS Ranged
- **Dungeon 10 Jugadores**: Tanques principales/secundarios, Sanadores, DPS
- **HCE 5 Jugadores**: Especializado para Hardcore Expeditions

### **PvP - Guerras**
- **GvG 20 Jugadores**: Tanques, Sanadores, DPS, Soporte
- Roles específicos para batallas competitivas

### **Actividades Especializadas**
- **Gathering**: Recolectores y protectores
- **Crafting**: Crafteadores y recolectores

## 🛠️ Instalación y Desarrollo

### **Requisitos**
- Node.js 16+
- npm o yarn

### **Instalación**
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/albion-group-manager.git
cd albion-group-manager

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### **Scripts Disponibles**
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting del código
```

## 🌐 Despliegue

### **Hosting Gratuito Recomendado**

#### **Netlify**
1. Conectar repositorio GitHub
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Desplegar automáticamente

#### **Vercel**
1. Importar proyecto desde GitHub
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

#### **GitHub Pages**
1. Configurar GitHub Actions
2. Build y deploy automático
3. Configurar dominio personalizado

## 🎨 Diseño y UX

### **Tema Albion Online**
- Colores inspirados en el juego
- Gradientes y efectos visuales
- Iconografía temática
- Responsive design

### **Características UX**
- Navegación intuitiva
- Notificaciones en tiempo real
- Estados de carga
- Validaciones de formularios
- Animaciones suaves

## 🔧 Configuración

### **Variables de Entorno**
```env
# Para desarrollo local
VITE_APP_TITLE=Albion Group Manager
VITE_APP_VERSION=1.0.0
```

### **Personalización**
- Modificar colores en `tailwind.config.js`
- Ajustar plantillas en `group-templates.json`
- Personalizar componentes en `src/components/`

## 📈 Roadmap

### **Fase 1 - MVP** ✅
- [x] Estructura básica React
- [x] Sistema de autenticación
- [x] Calculadora de loot
- [x] Plantillas básicas

### **Fase 2 - Funcionalidades Avanzadas**
- [ ] Backend con Firebase/Supabase
- [ ] Chat en tiempo real
- [ ] Notificaciones push
- [ ] API de Albion Online

### **Fase 3 - Características Premium**
- [ ] Analytics avanzados
- [ ] Integración con Discord
- [ ] Sistema de logros
- [ ] Marketplace de plantillas

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Albion Online** por la inspiración
- **React** y **Vite** por el framework
- **Tailwind CSS** por los estilos
- **Lucide** por los iconos

---

**¡Disfruta organizando tus grupos y eventos en Albion Online!** ⚔️🗡️💰 