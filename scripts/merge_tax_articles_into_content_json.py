#!/usr/bin/env python3
"""Merge data/_tax_article_markdown_generated.json into data/content.json."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__loader__.path).resolve().parent.parent  # type: ignore[name-defined]
