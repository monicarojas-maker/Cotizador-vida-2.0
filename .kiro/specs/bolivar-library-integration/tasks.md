# Plan de Implementación: Integración Librería de Diseño Bolívar

## Resumen

Migración incremental en 5 fases del Cotizador de Vida Grupo desde shadcn/ui hacia la librería de componentes oficial de Seguros Bolívar, usando una capa adaptadora en `src/components/bolivar/` que preserva las interfaces actuales. El motor de pricing y la integración con Supabase no se modifican.

## Tareas

- [x] 1. Fase 1 — Configurar tokens de diseño y tema Bolívar
  - [x] 1.1 Instalar la librería `@seguros-bolivar/ui` y `fast-check` como dependencias del proyecto
    - Ejecutar `npm install @seguros-bolivar/ui` (o el paquete correspondiente del registro privado)
    - Ejecutar `npm install --save-dev fast-check`
    - Verificar que ambas dependencias aparecen en `package.json`
    - _Requerimientos: 1.1, 1.2_

  - [x] 1.2 Reemplazar variables CSS de colores en `src/index.css` con tokens corporativos Bolívar
    - Sustituir los valores de `--primary`, `--secondary`, `--accent`, `--background`, `--foreground`, `--muted`, `--destructive`, `--border`, `--input`, `--ring`, `--radius` con los colores corporativos de Seguros Bolívar
    - Agregar tokens adicionales: `--success`, `--step-active`, `--step-completed`, `--step-pending`
    - Mantener la estructura de variables CSS `:root` y `.dark` existente
    - _Requerimientos: 2.1, 2.3_

  - [x] 1.3 Configurar tipografías oficiales Bolívar en `tailwind.config.ts`
    - Reemplazar la fuente `Inter` por la fuente principal de Bolívar en `fontFamily.sans`
    - Reemplazar la fuente `Oswald` por la fuente de títulos de Bolívar en `fontFamily.display`
    - Definir fuentes de fallback del sistema (`sans-serif`)
    - _Requerimientos: 2.2_

  - [ ]* 1.4 Escribir tests unitarios para verificar configuración de tema
    - Crear `src/test/theme-tokens.test.ts`
    - Verificar que las variables CSS corporativas están definidas con valores Bolívar
    - Verificar que `tailwind.config.ts` referencia las tipografías correctas
    - _Requerimientos: 2.1, 2.2, 2.3_

- [x] 2. Checkpoint — Verificar que el tema Bolívar se aplica correctamente
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Fase 2 — Crear capa adaptadora de componentes de formulario
  - [x] 3.1 Crear el archivo índice `src/components/bolivar/index.ts` y el adaptador `BolivarButton`
    - Crear `src/components/bolivar/BolivarButton.tsx` con el mapeo de variantes (default→primary, destructive→danger, outline→outlined, secondary→secondary, ghost→text, link→link) y tamaños (default→medium, sm→small, lg→large, icon→icon)
    - Exportar `Button` desde `src/components/bolivar/index.ts`
    - El adaptador debe exponer la misma interfaz `ButtonProps` de shadcn/ui
    - _Requerimientos: 3.6_

  - [x] 3.2 Crear adaptador `BolivarInput`
    - Crear `src/components/bolivar/BolivarInput.tsx` que delegue al componente Input de la Librería Bolívar
    - Mantener la interfaz `React.ComponentProps<"input">` idéntica a shadcn/ui
    - Exportar desde `index.ts`
    - _Requerimientos: 3.1_

  - [x] 3.3 Crear adaptador `BolivarSelect` con API compuesta
    - Crear `src/components/bolivar/BolivarSelect.tsx` que mapee la API compuesta de Radix Select (Select, SelectTrigger, SelectContent, SelectItem, SelectValue) al componente Select de la Librería Bolívar
    - Preservar `value`, `onValueChange` y la composición de children
    - Exportar todos los sub-componentes desde `index.ts`
    - _Requerimientos: 3.2_

  - [x] 3.4 Crear adaptadores `BolivarSwitch`, `BolivarLabel` y `BolivarTextarea`
    - Crear `src/components/bolivar/BolivarSwitch.tsx` mapeando `checked`/`onCheckedChange`
    - Crear `src/components/bolivar/BolivarLabel.tsx` como adaptador directo
    - Crear `src/components/bolivar/BolivarTextarea.tsx` como adaptador directo
    - Exportar los tres desde `index.ts`
    - _Requerimientos: 3.3, 3.4, 3.5_

  - [x] 3.5 Crear helper de fallback `withBolivarTokens` para componentes sin equivalente
    - Crear `src/components/bolivar/BolivarFallback.tsx` con la función `withBolivarTokens<P>()` que aplica clases CSS de tokens Bolívar sin sobreescribir las clases originales
    - _Requerimientos: 3.7_

  - [x] 3.6 Actualizar imports en componentes del Cotizador para usar capa adaptadora
    - En `src/components/cotizador/StepGenerales.tsx`: cambiar imports de `@/components/ui/*` a `@/components/bolivar`
    - En `src/components/cotizador/StepTomador.tsx`: cambiar imports
    - En `src/components/cotizador/StepCoberturas.tsx`: cambiar imports
    - En `src/components/cotizador/StepClausulas.tsx`: cambiar imports
    - En `src/components/cotizador/StepEnvio.tsx`: cambiar imports
    - En `src/pages/Index.tsx`: cambiar import de Button
    - _Requerimientos: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 3.7 Actualizar imports en componentes del Analista para usar capa adaptadora
    - En `src/components/analista/AnalystParams.tsx`: cambiar imports
    - En `src/components/analista/AnalystCoverages.tsx`: cambiar imports
    - En `src/components/analista/AnalystResults.tsx`: cambiar imports
    - En `src/pages/Analista.tsx`: cambiar import de Button
    - _Requerimientos: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 3.8 Escribir test de propiedad para delegación de adaptadores de formulario
    - Crear `src/test/bolivar-adapters.test.tsx`
    - **Propiedad 1: Delegación de componentes adaptadores** — Para cualquier conjunto de props válidas, el adaptador renderiza el componente Bolívar y no el componente shadcn/ui original
    - **Valida: Requerimientos 3.1, 3.2, 3.3, 3.4, 3.5**

  - [ ]* 3.9 Escribir test de propiedad para mapeo de variantes del Button
    - En `src/test/bolivar-adapters.test.tsx`
    - **Propiedad 2: Preservación del mapeo de variantes del Button** — Para cualquier combinación de variante y tamaño de shadcn/ui, el adaptador mapea a un equivalente válido en Bolívar y el onClick se invoca
    - Usar `fc.constantFrom('default','destructive','outline','secondary','ghost','link')` × `fc.constantFrom('default','sm','lg','icon')`
    - **Valida: Requerimiento 3.6**

  - [ ]* 3.10 Escribir test de propiedad para fallback con tokens Bolívar
    - En `src/test/bolivar-adapters.test.tsx`
    - **Propiedad 3: Wrapper de fallback aplica tokens Bolívar** — Para cualquier componente sin equivalente, `withBolivarTokens` aplica clases Bolívar sin sobreescribir las originales
    - **Valida: Requerimiento 3.7**

- [x] 4. Checkpoint — Verificar que formularios del Cotizador y Analista funcionan con adaptadores
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Fase 3 — Migrar componentes de navegación y layout
  - [x] 5.1 Crear adaptador `BolivarTabs` con API compuesta
    - Crear `src/components/bolivar/BolivarTabs.tsx` mapeando Tabs, TabsList, TabsTrigger, TabsContent de Radix al componente Tabs de la Librería Bolívar
    - Preservar `defaultValue`, `value`, `onValueChange`
    - Exportar desde `index.ts`
    - _Requerimientos: 4.1_

  - [x] 5.2 Crear componente `BolivarAppBar` para header de la aplicación
    - Crear `src/components/bolivar/BolivarAppBar.tsx` con interfaz `AppBarProps` (title, subtitle, icon, actions)
    - Delegar al componente de navegación/AppBar de la Librería Bolívar
    - Exportar desde `index.ts`
    - _Requerimientos: 4.3, 4.4_

  - [x] 5.3 Actualizar `StepIndicator` para usar componentes Bolívar
    - Modificar `src/components/cotizador/StepIndicator.tsx` para usar el componente Stepper/Progress de la Librería Bolívar
    - Si la Librería Bolívar no provee Stepper, mantener implementación custom aplicando tokens Bolívar (variables `--step-active`, `--step-completed`, `--step-pending`)
    - Preservar animaciones de transición (Framer Motion como fallback si Bolívar no provee equivalente)
    - _Requerimientos: 4.2, 4.5, 9.1, 9.2, 9.3, 9.4_

  - [x] 5.4 Reemplazar headers custom en `Index.tsx` y `Analista.tsx` con `BolivarAppBar`
    - En `src/pages/Index.tsx`: reemplazar el bloque `<header>` por `<BolivarAppBar>` con title="Cotizador", subtitle="Vida Grupo Colectivo 726"
    - En `src/pages/Analista.tsx`: reemplazar el bloque `<header>` por `<BolivarAppBar>` con title="Analista", subtitle="Motor de Cotización — Vida Grupo"
    - Mantener los botones de navegación (Link a Analista / Cotizador) como `actions`
    - _Requerimientos: 4.3, 4.4_

  - [x] 5.5 Actualizar imports de Tabs en `Analista.tsx` para usar capa adaptadora
    - Cambiar import de `@/components/ui/tabs` a `@/components/bolivar`
    - _Requerimientos: 4.1_

- [x] 6. Checkpoint — Verificar navegación, tabs y step indicator funcionan correctamente
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Fase 4 — Migrar componentes de datos y feedback
  - [x] 7.1 Crear adaptador `BolivarTable` con sub-componentes
    - Crear `src/components/bolivar/BolivarTable.tsx` con Table, TableHeader, TableBody, TableRow, TableHead, TableCell
    - Mapear la estructura HTML de tablas al componente Table de la Librería Bolívar
    - Exportar desde `index.ts`
    - _Requerimientos: 5.1_

  - [x] 7.2 Crear adaptador `BolivarBadge`
    - Crear `src/components/bolivar/BolivarBadge.tsx` con mapeo de variantes (default, secondary, destructive, outline) al componente Badge/Tag de la Librería Bolívar
    - Exportar desde `index.ts`
    - _Requerimientos: 5.2_

  - [x] 7.3 Crear adaptador `BolivarToast` y `BolivarToaster`
    - Crear `src/components/bolivar/BolivarToast.tsx` que delegue al componente Toast/Notification de la Librería Bolívar
    - Mapear variantes (default, destructive) a niveles de severidad Bolívar
    - Reemplazar tanto el Toast de Radix como Sonner con un único sistema de notificaciones Bolívar
    - Exportar `toast` (función imperativa) y `Toaster` (componente) desde `index.ts`
    - _Requerimientos: 5.3, 5.4_

  - [x] 7.4 Crear adaptador `BolivarCard`
    - Crear `src/components/bolivar/BolivarCard.tsx` con Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription
    - Exportar desde `index.ts`
    - _Requerimientos: 5.5, 5.6_

  - [x] 7.5 Actualizar `App.tsx` para usar Toaster de Bolívar
    - Reemplazar imports de `@/components/ui/sonner` y `@/components/ui/toaster` por `@/components/bolivar`
    - Reemplazar `<Toaster />` y `<Sonner />` por el `<Toaster />` de Bolívar
    - _Requerimientos: 5.3, 5.4_

  - [x] 7.6 Actualizar componentes del Analista para usar Table, Badge y Card de Bolívar
    - En `src/components/analista/AnalystCoverages.tsx`: usar BolivarTable
    - En `src/components/analista/AnalystResults.tsx`: usar BolivarTable y BolivarBadge
    - En `src/pages/Analista.tsx`: actualizar hook `useToast` para usar el de Bolívar
    - _Requerimientos: 5.1, 5.2, 5.4, 5.6_

  - [x] 7.7 Actualizar componentes del Cotizador para usar Card de Bolívar donde aplique
    - Reemplazar divs con clases de card por componentes `BolivarCard` en los steps del cotizador
    - _Requerimientos: 5.5_

  - [ ]* 7.8 Escribir test de propiedad para delegación del sistema de notificaciones
    - En `src/test/bolivar-adapters.test.tsx`
    - **Propiedad 4: Delegación del sistema de notificaciones** — Para cualquier invocación de toast con mensaje y variante, el adaptador delega al componente Notification de Bolívar con mensaje y severidad equivalente
    - Usar `fc.record({ message: fc.string(), variant: fc.constantFrom('default','destructive') })`
    - **Valida: Requerimientos 5.3, 5.4**

- [x] 8. Checkpoint — Verificar tablas, badges, toasts y cards funcionan en ambas vistas
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Verificar preservación del motor de pricing y datos
  - [ ]* 9.1 Escribir test de propiedad para invariancia de resultados del motor de pricing
    - Crear `src/test/pricing-invariance.test.ts`
    - **Propiedad 5: Invariancia de resultados del motor de pricing** — Para cualquier combinación válida de PricingParams, CoverageConfig[], valorAseguradoBase (>0) y numeroAsegurados (>0), `calculateQuote` produce valores numéricos idénticos (tasaCotizadaRedondeada, prima, comisionIva, gastos, utilidad)
    - Usar generadores: `fc.record({ comision: fc.float({min:0,max:0.5}), utilidad: fc.float({min:0,max:0.5}), gastos: fc.float({min:0,max:0.3}), ivaComision: fc.float({min:0,max:0.3}), factorDescuento: fc.float({min:-1,max:0}) })`
    - **Valida: Requerimientos 6.1, 6.2, 6.3, 6.4**

  - [ ]* 9.2 Escribir test de propiedad para mapeo de coberturas de solicitud
    - Crear `src/test/coverage-mapping.test.ts`
    - **Propiedad 6: Mapeo de coberturas de solicitud a CoverageConfig** — Para cualquier solicitud con array de coberturas, `handleSelect` produce CoverageConfig[] donde cada cobertura mencionada tiene `active: true` y `manualValue` parseado correctamente, y "muerte" siempre es activa
    - **Valida: Requerimiento 7.3**

  - [ ]* 9.3 Escribir test de propiedad para estructura de datos de persistencia
    - Crear `src/test/data-persistence.test.ts`
    - **Propiedad 7: Estructura de datos de persistencia de solicitudes** — Para cualquier conjunto de datos de formulario válido, el payload serializado para Supabase contiene todos los campos requeridos con los mismos tipos de datos
    - **Valida: Requerimiento 7.1**

- [x] 10. Checkpoint — Verificar que pricing y persistencia no fueron afectados
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Verificar accesibilidad de los adaptadores
  - [ ]* 11.1 Escribir test de propiedad para navegación por teclado
    - Crear `src/test/accessibility.test.tsx`
    - **Propiedad 8: Preservación de navegación por teclado** — Para cualquier secuencia de campos de formulario renderizados a través de adaptadores Bolívar, Tab mueve el foco al siguiente campo interactivo en orden del DOM sin saltar ni atrapar el foco
    - **Valida: Requerimientos 10.1, 10.2**

  - [ ]* 11.2 Escribir test de propiedad para preservación de atributos ARIA
    - En `src/test/accessibility.test.tsx`
    - **Propiedad 9: Preservación de atributos ARIA en adaptadores** — Para cualquier componente adaptador que renderiza un componente Bolívar con atributos ARIA, el DOM resultante contiene esos atributos sin modificación ni omisión
    - **Valida: Requerimientos 10.3, 10.4**

- [x] 12. Fase 5 — Limpieza de dependencias obsoletas
  - [x] 12.1 Identificar y eliminar paquetes `@radix-ui/*` no utilizados de `package.json`
    - Revisar cada paquete `@radix-ui/*` en `package.json` y verificar si algún componente activo lo importa
    - Eliminar los paquetes que ya no son referenciados por ningún archivo fuente
    - Conservar únicamente los `@radix-ui/*` requeridos por componentes shadcn/ui que se mantuvieron (fallback)
    - _Requerimientos: 8.1, 8.2, 8.5_

  - [x] 12.2 Eliminar componentes shadcn/ui residuales no utilizados de `src/components/ui/`
    - Identificar archivos en `src/components/ui/` que ya no son importados por ningún componente
    - Eliminar los archivos no referenciados (button.tsx, input.tsx, select.tsx, switch.tsx, tabs.tsx, label.tsx, textarea.tsx, badge.tsx, table.tsx, card.tsx, toast.tsx, toaster.tsx, sonner.tsx, etc.)
    - Mantener solo los componentes de `src/components/ui/` que aún se usan directamente o como fallback
    - _Requerimientos: 8.1, 8.2_

  - [x] 12.3 Eliminar dependencia `sonner` de `package.json` si ya no se usa
    - Verificar que ningún archivo importa directamente de `sonner`
    - Remover del `package.json` si no hay referencias
    - _Requerimientos: 8.2_

  - [x] 12.4 Verificar compilación exitosa y ausencia de errores
    - Ejecutar `vite build` y confirmar que compila sin errores
    - Verificar que no hay errores en consola al renderizar ambas vistas (Cotizador y Analista)
    - _Requerimientos: 8.3, 8.4_

- [x] 13. Checkpoint final — Verificar que toda la aplicación funciona correctamente post-limpieza
  - Ensure all tests pass, ask the user if questions arise.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requerimientos específicos para trazabilidad
- Los checkpoints aseguran validación incremental entre fases
- Los tests de propiedades validan comportamientos universales de correctitud
- Los tests unitarios validan ejemplos específicos y casos borde
- El motor de pricing (`src/lib/pricing-engine.ts`) NO se modifica en ninguna tarea
- La integración con Supabase NO se modifica en ninguna tarea
