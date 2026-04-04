---
id: createstringspo
title: Createstringspo
description: Generates localization .pot files from the game STRINGS table for translation workflows.
tags: [localization, tools, strings]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 03c05610
system_scope: ui
---

# Createstringspo

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`Createstringspo` is a standalone utility script used during the build process to generate Portable Object Template (`.pot`) files from the game's `STRINGS` table. It is not a runtime component attached to entities; instead, it is executed via the command line to assist localization teams. The script supports two formats: Version 1 (msgid based) and Version 2 (msgctxt based), allowing developers to export string tables for translation into `.po` files.

## Usage example
This script is typically executed from the command line within the `data/scripts` directory. It can also be required as a module to invoke generation functions directly.

```lua
-- Execute via command line (Windows example)
-- cd data/scripts
-- ..\..\tools\LUA\lua.exe createstringspo.lua

-- Or require within a custom build script
require "createstringspo"
CreateStringsPOTv2("languages/strings.pot", "STRINGS", STRINGS)
```

## Dependencies & tags
**Components used:** None (standalone script).
**Modules:** `strings`, `io`.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `STRING_RESERVED_LEAD_BYTES` | table | `{238, 239}` | Byte values indicating invalid UTF-8 strings to ignore during generation. |
| `POT_GENERATION` | boolean | `true` | Flag indicating that the script is running in generation mode. |
| `PLATFORM` | string | `WIN32_STEAM` | Detected platform based on command line arguments (e.g., `PS4`, `XBL`). |

## Main functions
### `CreateStringsPOTv1(filename, root, tbl_dta, tbl_lkp)`
*   **Description:** Generates a Version 1 `.pot` file using msgid-based localization. Iterates through the provided table and writes formatted strings to the specified file.
*   **Parameters:**
    *   `filename` (string) - Path for the output `.pot` file. Defaults to `data\scripts\languages\temp_v1.pot`.
    *   `root` (string) - Root key name for the string table. Defaults to `STRINGS`.
    *   `tbl_dta` (table) - The string table data to process.
    *   `tbl_lkp` (table, optional) - Lookup table for translated strings. If nil, generates template only.
*   **Returns:** Nothing.
*   **Error states:** May skip strings containing reserved lead bytes or duplicate msgids.

### `CreateStringsPOTv2(filename, root, tbl_dta, tbl_lkp)`
*   **Description:** Generates a Version 2 `.pot` file using msgctxt-based localization. Includes file format headers and sorts output strings by path.
*   **Parameters:**
    *   `filename` (string) - Path for the output `.pot` file. Defaults to `data\scripts\languages\temp_v2.pot`.
    *   `root` (string) - Root key name for the string table. Defaults to `STRINGS`.
    *   `tbl_dta` (table) - The string table data to process.
    *   `tbl_lkp` (table, optional) - Lookup table for translated strings. If nil, generates template only.
*   **Returns:** Nothing.
*   **Error states:** May skip strings containing reserved lead bytes. Logs warnings for valid strings dropped due to encoding issues.

### `LookupIdValue(lkp_var, path)`
*   **Description:** Helper function to lookup values in a table using a dot-delimited path string. Converts path syntax to bracket syntax for evaluation.
*   **Parameters:**
    *   `lkp_var` (string) - Name of the variable holding the lookup table.
    *   `path` (string) - Dot-delimited indexes (e.g., `STRINGS.LEVEL1.LEVEL2`).
*   **Returns:** string value if found, otherwise `nil`.
*   **Error states:** Returns `nil` if the path is invalid or evaluation fails.

## Events & listeners
None identified. This script does not interact with the game event system.