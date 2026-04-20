# Brief de reunión — Prospecto automotriz peruano
**Fecha:** 2026-04-20 · Preparado por IJV Agency

---

## Los 3 puntos que pidió el cliente

| # | Pedido | ¿Cómo lo cubrimos? | Estado en demo |
|---|---|---|---|
| 1 | Responder +100 mensajes por día | Agente 24/7 con Gemini 2.5 Flash. Capacidad real: miles de mensajes/día concurrentes. | ✅ Funcionando |
| 2 | Dar seguimiento a clientes | Cron automático en n8n: recordatorios 24h / 72h / 7d vía WhatsApp + email. | ✅ Agente sabe explicarlo |
| 3 | Agendar clientes | Calendly embebido. Widget muestra el CTA tras capturar el lead. | ✅ Funcionando |

---

## Qué dice el agente (resumen)

**Personalidad:** Andrea, asesora virtual cálida, tono peruano natural. Conoce 18+ modelos con precios en soles, 5 bancos aliados, 3 sedes, promoción vigente.

**Flujo base (el que van a ver en el demo):**
1. Saludo cálido + pregunta abierta ("¿qué buscas hoy?").
2. Descubrimiento antes de ofrecer: uso, presupuesto, forma de pago.
3. Recomienda 2-3 modelos (no dump de catálogo).
4. Calcula cuota referencial si dan presupuesto e inicial.
5. Al detectar señal de compra → pide nombre + celular → muestra CTA Calendly para prueba de manejo.
6. Cierre siempre con pregunta o acción, nunca con "estoy aquí para ayudarte".

**Lo que NO hace (y por qué eso protege al negocio):**
- No inventa precios fuera del catálogo.
- No promete stock / color / año específico — eso lo confirma el asesor humano.
- No hace venta dura. Descubre, educa, deriva.

---

## Funcionalidades que podemos ofrecer (además del chat)

### 🔄 Seguimiento automático
- **Recordatorio 24h** si el lead no agendó prueba de manejo.
- **Recordatorio 72h** con la promo vigente si mostró interés en un modelo específico.
- **Re-enganche 7 días** con contenido relevante (comparativa de modelos, testimonios).
- Canal: WhatsApp Business + email. Se decide según dónde respondió el cliente.

### 📅 Agendamiento
- Integración con **Calendly** (o Google Calendar / Meet si prefieren).
- Slots de 45 min para prueba de manejo o visita a sede.
- Confirmación automática por WhatsApp + email.
- Recordatorio 2h antes de la cita.

### 📊 Reporte quincenal
- Cada 15 días le llega un email al dueño:
  - Cuántas horas de atención cubrió el agente.
  - Cuántos leads capturó.
  - Ejecutivo de recomendaciones generado por IA.

### 🌐 Multi-canal (upgrade)
- Mismo agente responde en web + WhatsApp + Instagram DM + Messenger.
- Una sola fuente de conocimiento, todos los canales consistentes.

---

## Preguntas clave para la reunión (descubrimiento)

**Volumen y canales actuales:**
1. ¿Por qué canal llegan hoy la mayoría de consultas? (Web, Facebook, Instagram, WhatsApp, presencial)
2. ¿Cuántas personas atienden los mensajes hoy? ¿Cuál es el costo mensual?
3. ¿Qué % de los mensajes son preguntas repetitivas (precios, horarios, disponibilidad)?
4. ¿Tienen tiempos de respuesta medidos? ¿Cuál es el tiempo promedio actual?

**Dolor real:**
5. ¿Cuántos leads se pierden por no responder a tiempo?
6. ¿Qué pasa los fines de semana o después de las 7pm?
7. ¿Qué preguntas repetidas les hace perder tiempo al equipo de ventas?

**Operación de ventas:**
8. ¿Cómo agendan hoy las pruebas de manejo? ¿WhatsApp manual? ¿Calendly? ¿Formulario?
9. ¿Tienen CRM (HubSpot, Salesforce, hoja de cálculo)? ¿Qué usan para dar seguimiento?
10. ¿Cuál es el ciclo promedio desde primer contacto hasta venta?

**Contenido / conocimiento:**
11. ¿Tienen catálogo digital actualizado? ¿Precios vigentes en documento?
12. ¿Quién maneja el stock por modelo / color? ¿Está en un sistema o es manual?
13. ¿Hay políticas de financiamiento / descuentos que el agente debe conocer?

**Decisión / presupuesto:**
14. ¿Quién toma la decisión de contratar un proveedor así? (dueño, gerencia, marketing)
15. ¿Tienen algún presupuesto mensual aproximado en mente para esta solución?
16. ¿Han probado chatbots antes? ¿Qué funcionó y qué no?

---

## Precio sugerido (rango de referencia IJV)

- **Setup inicial:** 1 pago — incluye ingesta de catálogo, branding, integración Calendly + WhatsApp, deploy.
- **Mensualidad:** incluye mantenimiento, mejoras continuas, reportes, hosting n8n + Gemini + Supabase.
- Ajustar por volumen de mensajes y número de canales.

*(Cerrar el número exacto en llamada una vez conozcas volumen real.)*

---

## Cierre esperado

Si muestran interés:
1. Compartir link del demo (Vercel) para que lo prueben en vivo.
2. Pedir que envíen catálogo actualizado + políticas de financiamiento.
3. Agendar kickoff de implementación en 3-5 días hábiles.
4. Implementación total: **5-7 días hábiles** para versión con RAG completo, leads automáticos, Calendly real y reporte quincenal.

---

## Diferenciadores de IJV a resaltar

- **No es un bot genérico tipo ManyChat.** Es un asistente con conocimiento real del negocio.
- **Descubrimiento antes de vender** — el agente pregunta antes de ofrecer (aumenta conversión vs. menu dumps).
- **Detecta señales de compra** y deriva al equipo humano en el momento justo.
- **Stack propio** (n8n + Supabase + Gemini) — no estás atado a una plataforma SaaS cara.
- **Reporte quincenal ejecutivo** — el cliente ve claramente el ROI.
- **Compliance listo** — política de privacidad Ley 29733 incluida.
