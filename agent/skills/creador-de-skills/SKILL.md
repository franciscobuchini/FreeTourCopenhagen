---
name: creador-de-skills
description: Asistente experto para diseñar y crear nuevos Skills de Antigravity siguiendo estandares de calidad y estructura.
---

# Skill: Creador de Skills para Antigravity

## Cuándo usar este skill
- Cuando el usuario pida crear un nuevo Skill (ej: "Crea un skill para gestionar bases de datos").
- Cuando necesites generar la estructura de carpetas y archivos para un Skill.
- Cuando quieras asegurar que un nuevo skill sea predecible, reutilizable y fácil de mantener.

## Instrucciones Principales
1. **Lee siempre** la guía maestra ubicada en: `recursos/creador-de-skills-antigravity.md`. Esta guía contiene todas las reglas de estructura, nombrado y contenido.
2. Sigue los pasos de la guía para definir el `name`, `description`, estructura de carpetas y contenido del `SKILL.md`.
3. Genera la estructura de carpetas `agent/skills/<nombre>/` y los archivos necesarios.

## Workflow
1. **Entender el objetivo**: ¿Qué debe hacer el skill? ¿Cuál es su input y output?
2. **Definir nombre y alcance**: Elige un nombre corto (kebab-case) y redacta una descripción breve.
3. **Determinar recursos**: ¿Necesita plantillas, guías o scripts adicionales?
4. **Generar archivos**:
   - `SKILL.md` con frontmatter y secciones estándar (Cuándo usar, Inputs, Workflow, Instrucciones).
   - Recursos en la carpeta `recursos/`.
5. **Validar**: Verifica que cumple con la "Estructura mínima obligatoria" y "Reglas de nombre" definidas en la guía.

## Recuerda
- Mantén la estructura simple.
- Usa el formato de salida especificado en la guía (Sección 8).
- Si faltan datos, pregunta al usuario antes de inventar.
