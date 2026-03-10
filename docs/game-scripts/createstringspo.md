---
id: createstringspo
title: Createstringspo
description: A standalone utility script for generating localization template files (.pot) from game string tables, supporting both legacy msgid-based (v1) and modern msgctxt-based (v2) formats.
tags: [localization, tooling, strings]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 03c05610
system_scope: ui
---

# Createstringspo

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`createstringspo.lua` is a standalone Lua script used to extract localized strings from the game’s `STRINGS` table and generate GNU gettext-compatible template files (`.pot`). It supports two output formats:  
- **v1**: Uses `msgid` directly from string values (older format).  
- **v2**: Uses `msgctxt` to disambiguate strings with identical `msgid` by including their full table path (e.g., `STRINGS.NAMES.BEE`), ensuring uniqueness.  

The script also supports providing a separate lookup table (`tbl_lkp`) to align translated strings with original keys during version migrations (e.g., from a legacy `strings.lua` translation to the new v2 format). It is not an ECS component—instead, it runs as a CLI tool for mod and game string extraction.

## Usage example
```lua
-- Generate a v2-format .pot file from the built-in STRINGS table
CreateStringsPOTv2("languages/strings.pot", "STRINGS", STRINGS)

-- Generate a v2-format .pot file using a custom lookup table for translation alignment
CreateStringsPOTv2("languages/custom.pot", "STRINGS", MY_TRANSLATED_STRINGS, STRINGS)
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  
**External dependencies:** Requires `strings.lua` and standard Lua modules (`io`, `string`). Uses platform detection via command-line arguments (`arg[1]`).

## Properties
No public properties.

## Main functions
### `CreateStringsPOTv1(filename, root, tbl_dta, tbl_lkp)`
* **Description:** Generates a `.pot` file in v1 format using `msgid`-only entries. If a lookup table (`tbl_lkp`) is provided, it tries to find corresponding original `msgid` values for translated strings.
* **Parameters:**  
  - `filename` (string, optional): Output file path. Defaults to `"data\\scripts\\languages\\temp_v1.pot"`.  
  - `root` (string, optional): Starting path in the string table. Defaults to `"STRINGS"`.  
  - `tbl_dta` (table, required): The translation source table (e.g., `STRINGS`).  
  - `tbl_lkp` (table, optional): Lookup table of original strings for translating existing translations.  
* **Returns:** Nothing.
* **Error states:** Silently skips duplicate `msgid` strings with a console warning.

### `CreateStringsPOTv2(filename, root, tbl_dta, tbl_lkp)`
* **Description:** Generates a `.pot` file in v2 format, where `msgctxt` contains the full table path (e.g., `msgctxt "STRINGS.NAMES.BEE"`), disambiguating strings with identical values.
* **Parameters:** Same as `CreateStringsPOTv1`.
* **Returns:** Nothing.
* **Error states:** Skips strings that begin with reserved UTF-8 bytes (`238`, `239`). Logs potential omissions for strings longer than 4 characters with unexpected reserved bytes.

## Events & listeners
None. This script is not event-driven.