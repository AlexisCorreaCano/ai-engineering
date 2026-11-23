#!/usr/bin/env python3
"""Genera el checklist de estudio a partir de las lecciones locales.

El estado se conserva por una clave estable: ruta de la lección + número de
ocurrencia del encabezado. Así se puede regenerar el archivo si el currículo
cambia sin perder checks ya realizados.
"""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CURRICULUM = ROOT / "ai-engineering-from-scratch" / "phases"
OUTPUT = ROOT / "CHECKLIST-ESTUDIO.md"


def read_previous_state() -> dict[str, bool]:
    if not OUTPUT.exists():
        return {}
    state: dict[str, bool] = {}
    key = None
    for line in OUTPUT.read_text(encoding="utf-8").splitlines():
        marker = re.match(r"<!-- item: (.+) -->", line)
        if marker:
            key = marker.group(1)
            continue
        item = re.match(r"- \[([ xX])\]", line)
        if item and key is not None:
            state[key] = item.group(1).lower() == "x"
            key = None
    return state


def lesson_title(doc: Path, fallback: str) -> str:
    for line in doc.read_text(encoding="utf-8", errors="replace").splitlines():
        match = re.match(r"^# (.+?)\s*$", line)
        if match:
            return match.group(1).strip()
    return fallback.replace("-", " ").title()


def headings(doc: Path) -> list[tuple[int, str, int]]:
    result = []
    occurrences: dict[str, int] = {}
    for line_number, line in enumerate(
        doc.read_text(encoding="utf-8", errors="replace").splitlines(), start=1
    ):
        match = re.match(r"^(#{2,6})\s+(.+?)\s*$", line)
        if not match:
            continue
        text = re.sub(r"\s+#*$", "", match.group(2)).strip()
        occurrence = occurrences.get(text, 0) + 1
        occurrences[text] = occurrence
        result.append((len(match.group(1)), text, occurrence))
    return result


def checked(state: dict[str, bool], key: str) -> str:
    return "x" if state.get(key, False) else " "


def main() -> None:
    previous = read_previous_state()
    lines = [
        "# Checklist de estudio — AI Engineering from Scratch",
        "",
        "> Seguimiento personal del currículo `ai-engineering-from-scratch/`.",
        "> Todas las casillas empiezan sin marcar: el estado `✅` del roadmap original **no** se copia.",
        "",
        "## Regla de marcado",
        "",
        "Marca una lección o subtema únicamente cuando ya lo hayas estudiado dentro de una sesión del método del tutor: recuperación/diagnóstico, explicación con ejemplo, reto o práctica, y cierre con una explicación propia. El check indica **estudiado**, no necesariamente dominio; el dominio se valida con el reto, el blog y la revisión definidos en `TUTOR-METODO.md`.",
        "",
        "## Cómo usarlo",
        "",
        "- Marca primero los subtemas que realmente cubriste y después la lección cuando el tema completo esté estudiado.",
        "- No marques por haber leído el archivo, visto el título o ejecutado el código sin analizarlo.",
        "- Si el currículo cambia, ejecuta `python3 scripts/generar_checklist_estudio.py`; los checks existentes se conservan.",
        "- El archivo se genera desde los títulos de `docs/en.md`, por lo que cada fase, lección y encabezado interno queda trazable al material original.",
        "",
        "## Resumen",
        "",
        "- Fases: 20",
        "- Lecciones: 523",
        "- Subtemas internos: 8.785 encabezados documentados",
        "- Estado inicial de este checklist: 0 elementos marcados",
        "",
    ]

    phases = sorted(p for p in CURRICULUM.iterdir() if p.is_dir())
    for phase in phases:
        phase_number, _, phase_name = phase.name.partition("-")
        lines += [f"## Fase {phase_number}: {phase_name.replace('-', ' ').title()}", ""]
        for lesson in sorted(p for p in phase.iterdir() if p.is_dir()):
            doc = lesson / "docs" / "en.md"
            if not doc.exists():
                continue
            title = lesson_title(doc, lesson.name)
            rel_doc = doc.relative_to(ROOT).as_posix()
            lesson_key = f"{rel_doc}::lesson"
            lines.append(f"<!-- item: {lesson_key} -->")
            lines.append(f"- [{checked(previous, lesson_key)}] **{lesson.name.split('-', 1)[0]} · {title}** ([material]({rel_doc}))")
            stack: list[int] = []
            for level, text, occurrence in headings(doc):
                while stack and stack[-1] >= level:
                    stack.pop()
                indent = "  " * (len(stack) + 1)
                key = f"{rel_doc}::h{level}::{occurrence}::{text}"
                lines.append(f"{indent}<!-- item: {key} -->")
                lines.append(f"{indent}- [{checked(previous, key)}] {text}")
                stack.append(level)
            lines.append("")

    OUTPUT.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    print(f"Escrito {OUTPUT} ({len(lines):,} líneas)")


if __name__ == "__main__":
    main()
