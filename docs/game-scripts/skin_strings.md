---
id: skin_strings
title: Skin Strings
description: A static data file containing localized string mappings for character clothing, accessories, and book skin identifiers in Don't Starve Together.
tags: [localization, assets, ui, skin, strings]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: data_patched
category_type: root
source_hash: 1bffff2b
system_scope: ui
---

# Skin Strings

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
Skin Strings is a static Lua data file (`skin_strings.lua`) that defines key–value mappings for localized human-readable names of character apparel, accessories, and other cosmetic items. It is not an executable code module with functions, constructors, or event logic; instead, it serves as a centralized dictionary for string localization, where keys are item/skin identifiers (e.g., `body_wilson_formal`, `hat_tophat`, `book_ancient_tome`) and values are display strings in the local language. The file follows character-specific naming conventions (`body_*`, `feet_*`, `hat_*`, etc.) to align with DST’s asset and skin management system, and is consumed externally by UI andPrefab systems at runtime to render localized names in the Character Loadout UI and other interfaces.

## Usage example
Skin Strings is not invoked directly in code, but its data is referenced indirectly through the game’s localization framework. For example, a prefab or UI widget may retrieve the localized name for `"body_wilson_formal"` via:
```lua
STRINGS.NAMES["body_wilson_formal"]  -- Returns "Tuxedo"
```
This key-value pair is defined in `skin_strings.lua` and merged into the global `STRINGS.NAMES` table during initialization.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None in this chunk

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `STRINGS.NAMES` (indirectly populated) | Table | `{}` | A global localization table populated at startup with key-value pairs from `skin_strings.lua`. Keys are skin/item identifiers; values are localized display names. |

## Main functions
None found — this file contains only static data assignments.

## Events & listeners
None found — this file contains no runtime logic, event listeners, or event emitters.