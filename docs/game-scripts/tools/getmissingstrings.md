---
id: getmissingstrings
title: Getmissingstrings
description: Scans game prefabs and character speech files to identify missing localization strings and outputs a report file.
tags: [localization, tools, build]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: tools
source_hash: 755a011d
system_scope: world
---

# Getmissingstrings

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`getmissingstrings.lua` is a standalone utility script used during development and build preparation to detect missing localization strings across prefabs and character speech files. It scans all registered prefab files (`PREFABFILES`), compares them against character-specific `DESCRIBE` entries, and performs recursive comparisons across character speech structures to identify empty or missing entries. The results are written to `MISSINGSTRINGS.lua`, a Lua file containing a table of missing string keys and placeholders.

## Usage example
This script is intended to be run as a standalone tool, typically during build pipelines or pre-release verification:

```lua
-- Execute in the DST Lua environment after loading prefabs and character data:
dofile("tools/getmissingstrings.lua")
-- Result: MISSINGSTRINGS.lua will be generated in the working directory
```

## Dependencies & tags
**Components used:** None (standalone script)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `GetMissingPrefabStrings(prefabs, speechFile)`
*   **Description:** Scans a list of prefabs and checks whether each has a non-empty entry in `speechFile.DESCRIBE`. Returns a table of missing entries.
*   **Parameters:** 
    * `prefabs` (table) — list or set of prefab names (string keys).
    * `speechFile` (table) — speech table (e.g., `speech_wilson`) containing `DESCRIBE` key.
*   **Returns:** table — map of missing prefab names to empty strings (`{ [PREFAB_NAME] = "" }`).

### `GetMissingElementsFromTable(qTable, refTable)`
*   **Description:** Recursively compares `refTable` against `qTable`, identifying keys in `refTable` that are present but missing or empty in `qTable`. Used for comparing nested speech tables (e.g., `DIALOG`, `PREFAB`).
*   **Parameters:** 
    * `qTable` (table or `nil`) — candidate table to check against.
    * `refTable` (table) — reference table containing expected keys.
*   **Returns:** table or `nil` — nested table of missing/empty keys if any exist; otherwise `nil`.

### `GetMissingCharacterStrings(speechFile, refSpeechFile)`
*   **Description:** Wrapper for `GetMissingElementsFromTable` specialized for character speech comparison, used to detect missing speech entries for non-Wilson characters relative to a reference (typically Wilson).
*   **Parameters:** 
    * `speechFile` (table or `nil`) — character speech table for the target character.
    * `refSpeechFile` (table) — reference speech table (e.g., `speech_wilson`).
*   **Returns:** table or `nil` — nested table of missing keys.

### `MakePrefabsTable()`
*   **Description:** Loads all registered prefab files, extracts their returned tables, filters out skinned prefabs and those listed in `IGNORE_PREFABS` or containing keywords in `IGNORED_KEYWORDS`, and returns a deduplicated set of valid prefab names.
*   **Parameters:** None.
*   **Returns:** table — set of uppercase prefab names (`{ [PREFAB_NAME] = PREFAB_NAME, ... }`).

### `GetCharacterSpeech(character)`
*   **Description:** Attempts to load and return the speech file for a given character (e.g., `"wilson"` → `speech_wilson`).
*   **Parameters:** `character` (string) — character name.
*   **Returns:** table or `nil` — speech table or `nil` if load fails.

### `GetPrefabsFromFile(fileName)`
*   **Description:** Loads and executes a Lua file (e.g., a prefab definition file), asserting it returns one or more table values (prefabs).
*   **Parameters:** `fileName` (string) — path to the Lua file.
*   **Returns:** table — array of returned prefabs from `loadfile`.

### `TableToString(key, tbl, numIndent)`
*   **Description:** Converts a nested table of missing strings into a valid Lua syntax table string with proper indentation for inclusion in `MISSINGSTRINGS.lua`.
*   **Parameters:** 
    * `key` (string) — top-level key (e.g., `"Missing Strings"`).
    * `tbl` (table) — table to serialize.
    * `numIndent` (number) — current indentation level (number of tabs).
*   **Returns:** string — formatted Lua table string.

### `GenerateFile(missingStrings)`
*   **Description:** Writes the generated string content to `MISSINGSTRINGS.lua` in the working directory.
*   **Parameters:** `missingStrings` (string) — full content to write.
*   **Returns:** Nothing.

## Events & listeners
None identified.