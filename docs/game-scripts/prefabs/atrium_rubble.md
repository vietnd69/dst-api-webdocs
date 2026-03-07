---
id: atrium_rubble
title: Atrium Rubble
description: A decorative, non-interactive rubble prop used in the Atrium environment that supports animated variants and story-line based scrapbook status.
tags: [environment, decoration, world]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cca7e818
system_scope: environment
---

# Atrium Rubble

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`atrium_rubble` is a static environment prop prefab used to enhance visual detail in the Atrium area. It provides multiple animated variants (via `animid`) and integrates with the scrapbook system to display contextual story lines. The component does not perform gameplay logic directly but serves as a data host for visual state and narrative context.

## Usage example
```lua
local inst = SpawnPrefab("atrium_rubble")
inst.Transform:SetPosition(x, y, z)
inst.animid = 2
inst.storyprogress = 3
```

## Dependencies & tags
**Components used:** `inspectable`, `transform`, `animstate`, `minimapentity`, `network`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `storyprogress` | number | `nil` | Tracks which story line (1–5) is displayed for the scrapbook; defaults to `_storyprogress` if not set. |
| `animid` | number | `1` | Current animation variant index; determines the `idle{id}` animation played. |
| `scrapbook_specialinfo` | string | `"ATRIUMRUBBLE"` | Identifier used by the scrapbook system to recognize this entity. |
| `scrapbook_speechstatus` | string | `"LINE_1"` | On master simulation, stores the current scrapbook line key (e.g., `"LINE_3"`). |

## Main functions
### `SetAnimId(inst, id)`
*   **Description:** Updates the `animid` property and plays the corresponding animation (`idle{id}`).
*   **Parameters:** `id` (number) - the animation variant index to apply.
*   **Returns:** Nothing.
*   **Error states:** Only updates if `inst.animid` differs from `id`.

### `getstatus(inst)`
*   **Description:** Returns a string key for the current story line (e.g., `"LINE_3"`), used for scrapbook integration.
*   **Parameters:** `inst` (entity) - the instance whose `storyprogress` value is used.
*   **Returns:** string in the format `"LINE_" .. tostring(storyprogress)`.
*   **Error states:** If `inst.storyprogress` is `nil`, it assigns a new `storyprogress` value using a global counter (`_storyprogress`) modulo `NUM_STORY_LINES` (5), ensuring values cycle between `1` and `5`.

### `OnSave(inst, data)`
*   **Description:** Serializes persistent state (animid and storyprogress) for world save.
*   **Parameters:** `data` (table) - table to populate with `storyprogress` and `animid`.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores persistent state from saved data after world load.
*   **Parameters:** `data` (table) - table containing `storyprogress` and `animid`.
*   **Returns:** Nothing.
*   **Error states:** Safely skips restoration if `data` or specific keys (`animid`, `storyprogress`) are `nil`.

## Events & listeners
None identified.