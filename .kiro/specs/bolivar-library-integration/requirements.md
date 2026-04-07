# Documento de Requerimientos — Integración Librería de Diseño Bolívar

## Introducción

El Cotizador de Vida Grupo Colectivo "726" es una aplicación React + TypeScript + Vite que actualmente utiliza componentes genéricos de shadcn/ui (basados en Radix UI) con estilos Tailwind personalizados. El objetivo de esta integración es reemplazar los componentes genéricos por la librería/sistema de diseño oficial de Seguros Bolívar, alineando la interfaz con la identidad visual corporativa y los estándares de UX de la compañía.

La aplicación tiene dos vistas principales:
- **Cotizador** (Index): Formulario multi-step para captura de solicitudes (Generales, Tomador, Coberturas, Cláusulas, Envío)
- **Analista**: Motor de cotización con tabs (Parámetros, Coberturas, Cláusulas, Resultados, Propuesta)

## Glosario

- **Cotizador**: Página principal de la aplicación donde asesores comerciales capturan solicitudes de cotización de Vida Grupo
- **Analista**: Página donde analistas técnicos ejecutan el motor de pricing sobre solicitudes recibidas
- **Librería_Bolívar**: Sistema de diseño / librería de componentes UI oficial de Seguros Bolívar que reemplaza a shadcn/ui
- **Capa_Adaptadora**: Módulo intermedio que mapea las interfaces de los componentes actuales (shadcn/ui) a los componentes equivalentes de la Librería_Bolívar
- **Token_Diseño**: Variable de diseño (color, tipografía, espaciado, sombra) definida por el sistema de diseño de Bolívar
- **Componente_UI**: Elemento reutilizable de interfaz (Button, Input, Select, Switch, Tabs, Badge, Card, Table, Toast, Dialog)
- **Motor_Pricing**: Módulo en src/lib/pricing-engine.ts que calcula tasas comerciales, primas y desgloses técnicos
- **Step_Indicator**: Componente visual que muestra el progreso del formulario multi-step del Cotizador
- **Tema_Bolívar**: Configuración de tokens de diseño (colores corporativos, tipografías, radios, sombras) alineada con la identidad visual de Seguros Bolívar

## Requerimientos

### Requerimiento 1: Investigación y Documentación de la Librería Bolívar

**Historia de Usuario:** Como desarrollador, quiero identificar y documentar la librería de componentes oficial de Seguros Bolívar, para planificar la migración con información precisa sobre componentes disponibles y sus APIs.

#### Criterios de Aceptación

1. WHEN el equipo inicia la integración, THE Capa_Adaptadora SHALL documentar la fuente de la Librería_Bolívar (paquete npm, repositorio interno, CDN o Storybook)
2. WHEN la Librería_Bolívar es identificada, THE Capa_Adaptadora SHALL generar un mapeo explícito entre cada Componente_UI de shadcn/ui utilizado y su equivalente en la Librería_Bolívar
3. IF la Librería_Bolívar no provee un componente equivalente para algún Componente_UI actual, THEN THE Capa_Adaptadora SHALL documentar la estrategia de reemplazo (componente custom con tokens Bolívar, composición de primitivos, o mantener shadcn/ui con estilos Bolívar)

### Requerimiento 2: Configuración del Tema y Tokens de Diseño Bolívar

**Historia de Usuario:** Como desarrollador, quiero configurar los tokens de diseño corporativos de Bolívar en el proyecto, para que todos los componentes reflejen la identidad visual oficial.

#### Criterios de Aceptación

1. THE Tema_Bolívar SHALL definir las variables CSS de colores corporativos de Seguros Bolívar reemplazando las variables actuales en src/index.css
2. THE Tema_Bolívar SHALL configurar las tipografías oficiales de Bolívar en tailwind.config.ts reemplazando las fuentes actuales (Inter, Oswald)
3. THE Tema_Bolívar SHALL definir los radios de borde, sombras y espaciados según las especificaciones del sistema de diseño de Bolívar
4. WHEN el Tema_Bolívar es aplicado, THE Cotizador SHALL renderizar todos los elementos visuales con los colores, tipografías y espaciados corporativos de Bolívar
5. WHEN el Tema_Bolívar es aplicado, THE Analista SHALL renderizar todos los elementos visuales con los colores, tipografías y espaciados corporativos de Bolívar

### Requerimiento 3: Migración de Componentes de Formulario

**Historia de Usuario:** Como asesor comercial, quiero que los formularios del Cotizador usen los componentes oficiales de Bolívar, para tener una experiencia consistente con las demás aplicaciones de la compañía.

#### Criterios de Aceptación

1. WHEN un campo de texto es renderizado, THE Cotizador SHALL utilizar el componente Input de la Librería_Bolívar en lugar del Input de shadcn/ui
2. WHEN un campo de selección es renderizado, THE Cotizador SHALL utilizar el componente Select de la Librería_Bolívar en lugar del Select de shadcn/ui
3. WHEN un interruptor de activación es renderizado, THE Cotizador SHALL utilizar el componente Switch o Toggle de la Librería_Bolívar en lugar del Switch de shadcn/ui
4. WHEN una etiqueta de campo es renderizada, THE Cotizador SHALL utilizar el componente Label de la Librería_Bolívar en lugar del Label de shadcn/ui
5. WHEN un área de texto es renderizada, THE Cotizador SHALL utilizar el componente Textarea de la Librería_Bolívar en lugar del Textarea de shadcn/ui
6. WHEN un botón es renderizado, THE Cotizador SHALL utilizar el componente Button de la Librería_Bolívar en lugar del Button de shadcn/ui preservando las variantes (primary, outline, destructive)
7. IF la Librería_Bolívar no provee un componente de formulario equivalente, THEN THE Capa_Adaptadora SHALL crear un wrapper que aplique los Token_Diseño de Bolívar al componente existente

### Requerimiento 4: Migración de Componentes de Navegación y Layout

**Historia de Usuario:** Como usuario de la aplicación, quiero que la navegación y estructura visual sigan el sistema de diseño de Bolívar, para una experiencia coherente con el ecosistema digital de la compañía.

#### Criterios de Aceptación

1. WHEN la página Analista muestra las secciones de trabajo, THE Analista SHALL utilizar el componente Tabs de la Librería_Bolívar en lugar del Tabs de shadcn/ui
2. WHEN el Cotizador muestra el progreso del formulario, THE Step_Indicator SHALL utilizar componentes de la Librería_Bolívar (Stepper, Progress o equivalente) en lugar de la implementación custom actual con Framer Motion
3. WHEN el header de la aplicación es renderizado, THE Cotizador SHALL utilizar el componente de navegación o AppBar de la Librería_Bolívar en lugar del header custom actual
4. WHEN el header de la aplicación es renderizado, THE Analista SHALL utilizar el componente de navegación o AppBar de la Librería_Bolívar en lugar del header custom actual
5. IF la Librería_Bolívar no provee un componente Stepper, THEN THE Step_Indicator SHALL mantener la implementación custom aplicando los Token_Diseño de Bolívar

### Requerimiento 5: Migración de Componentes de Datos y Feedback

**Historia de Usuario:** Como analista técnico, quiero que las tablas de resultados, badges y notificaciones usen los componentes de Bolívar, para mantener consistencia visual en la vista de análisis.

#### Criterios de Aceptación

1. WHEN una tabla de datos es renderizada, THE Analista SHALL utilizar el componente Table de la Librería_Bolívar en lugar de las tablas HTML con clases Tailwind actuales
2. WHEN una etiqueta de estado es renderizada, THE Analista SHALL utilizar el componente Badge o Tag de la Librería_Bolívar en lugar del Badge de shadcn/ui
3. WHEN una notificación es mostrada al usuario, THE Cotizador SHALL utilizar el componente Toast o Notification de la Librería_Bolívar en lugar del Toast de shadcn/ui y Sonner
4. WHEN una notificación es mostrada al usuario, THE Analista SHALL utilizar el componente Toast o Notification de la Librería_Bolívar en lugar del Toast de shadcn/ui y Sonner
5. WHEN un contenedor de sección es renderizado, THE Cotizador SHALL utilizar el componente Card o Panel de la Librería_Bolívar en lugar de los divs con clases de card actuales
6. WHEN un contenedor de sección es renderizado, THE Analista SHALL utilizar el componente Card o Panel de la Librería_Bolívar en lugar de los divs con clases de card actuales

### Requerimiento 6: Preservación de Funcionalidad del Motor de Pricing

**Historia de Usuario:** Como analista técnico, quiero que la migración visual no altere los cálculos del motor de pricing, para mantener la precisión de las cotizaciones.

#### Criterios de Aceptación

1. THE Motor_Pricing SHALL mantener las mismas interfaces TypeScript (PricingParams, CoverageConfig, QuoteResult, CoverageResult) sin modificaciones durante la migración
2. WHEN una cotización es calculada después de la migración, THE Motor_Pricing SHALL producir resultados idénticos a los producidos antes de la migración para los mismos parámetros de entrada
3. THE Motor_Pricing SHALL mantener el catálogo de coberturas (COVERAGE_CATALOG) sin modificaciones durante la migración
4. WHEN los parámetros de cotización son editados en la vista Analista, THE Analista SHALL propagar los valores al Motor_Pricing de forma idéntica a la implementación actual

### Requerimiento 7: Preservación de Integración con Supabase

**Historia de Usuario:** Como asesor comercial, quiero que el envío y consulta de solicitudes siga funcionando correctamente después de la migración visual.

#### Criterios de Aceptación

1. WHEN una solicitud es enviada desde el Cotizador, THE Cotizador SHALL persistir los datos en la tabla solicitudes de Supabase con la misma estructura de datos actual
2. WHEN la página Analista carga solicitudes, THE Analista SHALL consultar y mostrar las solicitudes desde Supabase con el mismo comportamiento actual
3. WHEN una solicitud es seleccionada en la vista Analista, THE Analista SHALL mapear las coberturas y cláusulas de la solicitud a la configuración del motor de pricing de forma idéntica a la implementación actual
4. IF ocurre un error de conexión con Supabase, THEN THE Cotizador SHALL mostrar un mensaje de error utilizando el componente de notificación de la Librería_Bolívar
5. IF ocurre un error de conexión con Supabase, THEN THE Analista SHALL mostrar un mensaje de error utilizando el componente de notificación de la Librería_Bolívar

### Requerimiento 8: Limpieza de Dependencias Obsoletas

**Historia de Usuario:** Como desarrollador, quiero eliminar las dependencias de shadcn/ui que ya no se utilicen después de la migración, para mantener el proyecto limpio y reducir el tamaño del bundle.

#### Criterios de Aceptación

1. WHEN la migración de todos los componentes es completada, THE Capa_Adaptadora SHALL identificar los paquetes @radix-ui/* que ya no son utilizados por ningún componente
2. WHEN los paquetes obsoletos son identificados, THE Capa_Adaptadora SHALL remover las dependencias no utilizadas del package.json
3. WHEN las dependencias son removidas, THE Cotizador SHALL compilar sin errores con el comando `vite build`
4. WHEN las dependencias son removidas, THE Analista SHALL renderizar correctamente todas las vistas sin errores en consola
5. IF un componente de shadcn/ui no tiene equivalente en la Librería_Bolívar y se mantiene, THEN THE Capa_Adaptadora SHALL conservar únicamente las dependencias @radix-ui/* requeridas por ese componente

### Requerimiento 9: Compatibilidad con Animaciones Existentes

**Historia de Usuario:** Como usuario de la aplicación, quiero que las transiciones y animaciones del Cotizador se mantengan o mejoren con la migración, para una experiencia fluida.

#### Criterios de Aceptación

1. WHEN el usuario navega entre pasos del Cotizador, THE Cotizador SHALL mantener transiciones suaves entre los pasos del formulario
2. IF la Librería_Bolívar provee su propio sistema de animaciones, THEN THE Cotizador SHALL utilizar las animaciones de la Librería_Bolívar en lugar de Framer Motion
3. IF la Librería_Bolívar no provee animaciones equivalentes, THEN THE Cotizador SHALL mantener Framer Motion para las transiciones entre pasos
4. WHEN el Step_Indicator actualiza el paso activo, THE Step_Indicator SHALL animar la transición visual del indicador de progreso

### Requerimiento 10: Accesibilidad según Estándares de la Librería Bolívar

**Historia de Usuario:** Como usuario con necesidades de accesibilidad, quiero que la aplicación migrada mantenga o mejore los estándares de accesibilidad provistos por los componentes de Bolívar.

#### Criterios de Aceptación

1. THE Cotizador SHALL mantener navegación por teclado funcional en todos los campos de formulario después de la migración
2. THE Analista SHALL mantener navegación por teclado funcional en las tabs y tablas después de la migración
3. WHEN un componente de la Librería_Bolívar incluye atributos ARIA, THE Cotizador SHALL preservar esos atributos sin sobreescribirlos
4. WHEN un componente de la Librería_Bolívar incluye atributos ARIA, THE Analista SHALL preservar esos atributos sin sobreescribirlos
