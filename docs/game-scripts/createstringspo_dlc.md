---
id: createstringspo_dlc
title: Createstringspo Dlc
description: Utility script for generating gettext POT files from the global STRINGS table.
tags: [localization, build, strings]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 7b5a2e16
system_scope: utility
---

# Createstringspo Dlc

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`createstringspo_dlc` is a development utility script used to export the game's `STRINGS` table into gettext-compatible `.pot` (Portable Object Template) files. It supports two formats (v1 and v2) and is typically executed via command line during the localization pipeline. The script modifies the `package.path` to prioritize DLC directories and checks the `BRANCH` global variable to skip execution on release builds.

## Usage example
```lua
require "createstringspo_dlc"

-- Generate v2 POT file for DLC0001
CreateStringsPOTv2("..\\DLC0001\\scripts\\languages\\strings.pot", "STRINGS", STRINGS)

-- Generate v1 POT file with custom lookup table
CreateStringsPOTv1("data\\scripts\\languages\\strings_v1.pot", "STRINGS", STRINGS, lookup_table)
```

## Dependencies & tags
**Components used:** None identified.
**Modules required:** `strings`, `io`.
**Tags:** None identified.

## Properties
No public properties

## Main functions
### `CreateStringsPOTv1(filename, root, tbl_dta, tbl_lkp)`
*   **Description:** Generates a version 1 format POT file from the provided string table. Uses `msgid` based identification without context paths.
*   **Parameters:**
    *   `filename` (string, optional) - Output file path. Defaults to `data\\scripts\\languages\\temp_v1.pot`.
    *   `root` (string, optional) - Root table key. Defaults to `STRINGS`.
    *   `tbl_dta` (table) - The string table data to process (e.g., `STRINGS`).
    *   `tbl_lkp` (table, optional) - Lookup table for translated strings. If nil, generates template only.
*   **Returns:** Nothing.
*   **Error states:** May fail if file permissions prevent writing to the target directory.

### `CreateStringsPOTv2(filename, root, tbl_dta, tbl_lkp)`
*   **Description:** Generates a version 2 format POT file. Uses `msgctxt` field set to the path in the table structure, guaranteeing unique identification versus string values. Writes header information including Application and POT Version.
*   **Parameters:**
    *   `filename` (string, optional) - Output file path. Defaults to `data\\DLC0001\\scripts\\languages\\temp_v2.pot`.
    *   `root` (string, optional) - Root table key. Defaults to `STRINGS`.
    *   `tbl_dta` (table) - The string table data to process (e.g., `STRINGS`).
    *   `tbl_lkp` (table, optional) - Lookup table for translated strings. If nil, generates template only.
*   **Returns:** Nothing.
*   **Error states:** May fail if file permissions prevent writing to the target directory.

## Events & listeners
None identified.