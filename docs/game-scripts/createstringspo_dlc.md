---
id: createstringspo_dlc
title: Createstringspo Dlc
description: Utility script for generating PO/T translation files from the game's STRINGS table using v1 (msgid-based) or v2 (msgctxt-based) formats.
tags: [translation, localization, tools]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 7b5a2e16
system_scope: 
---

# Createstringspo Dlc

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`createstringspo_dlc.lua` is a standalone utility script used to export localization strings from the in-game `STRINGS` table into GNU gettext-compatible `.pot` or `.po` files for translation workflows. It supports two formats: v1 (legacy, using `msgid` alone) and v2 (enhanced, using `msgctxt` to disambiguate identical strings via their fully qualified path). The script is intended for developer use during mod or DLC localization setup, not for runtime component logic.

## Usage example
```lua
-- Generate v2 POT file from STRINGS table (default behavior when run directly)
CreateStringsPOTv2("..\\DLC0001\\scripts\\languages\\strings.pot", "STRINGS", STRINGS)

-- Generate v2 POT file with custom lookup table for translated strings (e.g., for bilingual diff)
CreateStringsPOTv2("output.pot", "STRINGS", MY_TRANSLATIONS, STRINGS)
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
No public properties.

## Main functions
### `CreateStringsPOTv1(filename, root, tbl_dta, tbl_lkp)`
* **Description:** Generates a `.pot` file using v1 format, where strings are uniquely identified only by their `msgid`. Duplicate strings share the same entry unless resolved by context in `msgstr`.
* **Parameters:**
  * `filename` (string, optional) — Output file path. Defaults to `"data\\scripts\\languages\\temp_v1.pot"`.
  * `root` (string, optional) — Root table path prefix (typically `"STRINGS"`).
  * `tbl_dta` (table) — The source table of strings (usually the global `STRINGS` table).
  * `tbl_lkp` (table, optional) — Optional lookup table for translated versions of strings. If provided, generated entries include `msgstr` values sourced from `tbl_lkp`.
* **Returns:** Nothing.

### `CreateStringsPOTv2(filename, root, tbl_dta, tbl_lkp)`
* **Description:** Generates a `.pot` file using v2 format, where each string is disambiguated with a `msgctxt` field containing its fully qualified table path (e.g., `"STRINGS.CHARACTERS.WATHGRITHR.TITLE"`), ensuring uniqueness even for identical `msgid` values.
* **Parameters:**
  * `filename` (string, optional) — Output file path. Defaults to `"data\\DLC0001\\scripts\\languages\\temp_v2.pot"`.
  * `root` (string, optional) — Root table path prefix (typically `"STRINGS"`).
  * `tbl_dta` (table) — The source table of strings.
  * `tbl_lkp` (table, optional) — Optional lookup table for translated versions. When present, `msgstr` values are populated from this table.
* **Returns:** Nothing.
* **Error states:** Writes invalid non-printable characters (outside ASCII 32–127) to `.pot` only for v1 format; v2 skips them entirely.

### `LookupIdValue(lkp_var, path)`
* **Description:** Constructs and evaluates a dynamic table lookup expression (e.g., `STRINGS_LOOKUP["CHARACTERS"]["WATHGRITHR"]["TITLE"]`) to retrieve a translated string value from a given lookup table, using dot-separated path indices.
* **Parameters:**
  * `lkp_var` (string) — Name of the variable holding the lookup table (as a string literal, e.g., `"STRINGS_LOOKUP"`).
  * `path` (string) — Dot-separated path into the table (e.g., `"STRINGS.CHARACTERS.WATHGRITHR.TITLE"`).
* **Returns:** (string or nil) — The resolved string value if found and valid; otherwise `nil`.
* **Error states:** Returns `nil` on `pcall` failure (e.g., non-string value, invalid table path, syntax error in generated Lua chunk).

## Events & listeners
Not applicable.