---
id: fix_character_strings
title: Fix Character Strings
description: Sorts and reformats character localization string tables into a consistent, alphabetically ordered Lua structure.
tags: [localization, tool, ui]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 6ab6a8ab
system_scope: ui
---

# Fix Character Strings

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`fix_character_strings` is a standalone Lua utility script used outside of the game engine to normalize and reorder character localization data. It reads a Lua file containing a nested table of string keys and values, recursively sorts all entries alphabetically (by key), and writes the reformatted output to a new file. This ensures consistent ordering across localization files, which improves maintainability and version control diffs.

## Usage example
```lua
-- Run from command line with input and optional output paths:
-- lua fix_character_strings.lua prefabs/characters.lua prefabs/characters_sorted.lua

-- Internally, the script:
-- 1. Reads the input file via `require(file_in)`
-- 2. Recursively sorts all string tables using `alphatable()`
-- 3. Writes the result as a `return`-statement-compatible Lua file
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `alphatable(in_table, indent)`
*   **Description:** Recursively processes a Lua table, formats its contents as sorted, indented Lua syntax, and returns the result as a string. Handles string, number, and nested table values. Strings are quoted (`%q`), and numeric keys are prefixed with `[key]`.
*   **Parameters:**  
  - `in_table` (table) — The table to format and sort.  
  - `indent` (number, optional, default `0`) — Current indentation level for nested tables.  
*   **Returns:** A string representation of the sorted table in valid Lua syntax.

## Events & listeners
Not applicable