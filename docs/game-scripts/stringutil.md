---
id: stringutil
title: Stringutil
description: Provides utilities for retrieving, formatting, and processing localized string content, including character-specific speech generation and string helpers.
tags: [string, localization, speech, utility]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 8dafad94
system_scope: entity
---

# Stringutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`stringutil` is a shared utility module (not an Entity Component System component) that centralizes string-related operations for the game. It handles dynamic string lookup using character and item context, generates procedurally constructed speech (e.g., "Oooh" speech for ghosts, monkey/giberish speech), and provides formatting functions for time, dates, and localization placeholders. The module integrates with the `talker`, `inspectable`, `repairable`, and `foodmemory` components to enrich descriptions and speech output with contextual data.

## Usage example
```lua
-- Retrieve a descriptive string for an item from the current character's locale
local desc = GetString(ThePlayer, "DESCRIBE", nil, true)

-- Generate ghost-like speech (e.g., "Oohhh?!")
local ghost_speech = GetSpecialCharacterString("ghost")

-- Format seconds into HH:MM:SS or MM:SS
local time_str = str_seconds(3725) -- "1:02:05"

-- Display the mortality string for a mob
local mortality_str = GetMortalityStringFor(target_entity)
```

## Dependencies & tags
**Components used:** `talker` (via `inst.components.talker.speechproxy`), `inspectable` (via `nameoverride`), `repairable` (via `NeedsRepairs()` and `noannounce`), `foodmemory` (via `GetMemoryCount()`), `shadowlevel` (via presence check on `inst.components.shadowlevel`).  
**Tags:** Checks `mime`, `playerghost` for special character speech handling.

## Properties
No public properties.

## Main functions
### `GetString(inst, stringtype, modifier, nil_missing)`
*   **Description:** Retrieves a localized string using the character name (or `speechproxy`), item context, and optional modifiers. Falls back to `GENERIC` strings and optionally returns an error placeholder if missing.
*   **Parameters:**  
    - `inst` (string or entity): Entity instance or prefab name string. If an entity, used to determine character and apply talker overrides.  
    - `stringtype` (string): Key in the character's string table (e.g., `"DESCRIBE"`, `"ACTIONFAIL"`).  
    - `modifier` (string or table): Optional modifier key(s); tables are used for nested lookups or random selection.  
    - `nil_missing` (boolean): If `true`, return `nil` on missing strings instead of a placeholder.  
*   **Returns:** A localized string, or an `"UNKNOWN STRING: ..."` placeholder if `nil_missing` is `false` and no match is found.  
*   **Error states:** May return `nil` only if `nil_missing` is `true` and no fallback succeeds.

### `GetDescription(inst, item, modifier)`
*   **Description:** Constructs a full description string for an item, incorporating character-specific and generic descriptions, plus special contextual notes (e.g., shadow level, food memory, repair status).
*   **Parameters:**  
    - `inst` (string or entity): Character entity or name (for context).  
    - `item` (entity or prefab): The item being described.  
    - `modifier` (string or table): Optional modifier to parameterize the description.  
*   **Returns:** A final description string (may be `nil` if truly absent and no fallbacks apply).  
*   **Error states:** Returns the fallback `DESCRIBE_GENERIC` only if all other paths fail.

### `GetSpecialCharacterString(character)`
*   **Description:** Returns special procedural or static strings for named characters (e.g., `ghost`, `wonkey`, `wilton`), or `nil` for standard characters.
*   **Parameters:**  
    - `character` (string): Lowercase character prefab name.  
*   **Returns:** A generated string (e.g., `"Oohh!."`, `"Ehhhh."`), or `nil` if no special handling exists.

### `CraftOooh()`
*   **Description:** Generates randomized ghost-like vocalizations (e.g., `"ooh? oohh! oohh."`) using configurable endings, punctuation, and spacing rules.
*   **Parameters:** None.  
*   **Returns:** A randomly constructed string matching ghost speech patterns.

### `GetLine(inst, line, modifier, nil_missing)`
*   **Description:** Returns the raw `line` string unchanged, but first attempts to apply character-specific overrides (e.g., `mime`, `ghost`) via `GetSpecialCharacterString()`.
*   **Parameters:**  
    - `inst`: As in `GetString`.  
    - `line` (string): The literal string to return if no override applies.  
    - `modifier`: Optional modifier.  
    - `nil_missing`: Unused in this function; preserved for API consistency.  
*   **Returns:** The special character string if applicable, otherwise `line`.

### `FirstToUpper(str)`
*   **Description:** Capitalizes the first letter of a string.
*   **Parameters:**  
    - `str` (string): Input string.  
*   **Returns:** String with first character uppercased.

### `subfmt(s, tab)`
*   **Description:** Performs simple placeholder substitution in a format string (e.g., `"Hello {name}!"`).
*   **Parameters:**  
    - `s` (string): Format string with `{placeholder}` tokens.  
    - `tab` (table): Map of placeholder names to replacement values.  
*   **Returns:** Substituted string, with unmatched placeholders left unchanged.

### `str_seconds(time)`
*   **Description:** Converts seconds (integer) into formatted time strings (e.g., `"01:02:05"` or `"02:05"`).
*   **Parameters:**  
    - `time` (number): Total seconds.  
*   **Returns:** A formatted time string using localized format definitions (`STRINGS.UI.TIME_FORMAT`).

### `str_date(os_time)`
*   **Description:** Formats an OS timestamp into a locale-aware date string (e.g., `"Mar 10, 2026"`).
*   **Parameters:**  
    - `os_time` (number): Timestamp from `os.time()`.  
*   **Returns:** Formatted date string using `STRINGS.UI.DATE_FORMAT`.

### `str_play_time(time)`
*   **Description:** Formats game time (in minutes) into day/hour/minute strings (e.g., `"1d 2h 3m"`).
*   **Parameters:**  
    - `time` (number): Play time in minutes.  
*   **Returns:** Human-readable duration string.

### `DamLevDist(a, b, limit)`
*   **Description:** Computes the Damerau–Levenshtein edit distance between two strings, with early termination if `limit` is exceeded.
*   **Parameters:**  
    - `a`, `b` (string): Input strings.  
    - `limit` (number): Maximum distance to compute; function returns early if exceeded.  
*   **Returns:** Distance (integer), or the lower bound exceeding `limit` if early terminated.

## Events & listeners
None.