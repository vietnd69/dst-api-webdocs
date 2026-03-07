---
id: atrium_light
title: Atrium Light
description: Manages the visual and lighting behavior of the Atrium Light prefab, which activates when powered and toggles between ON and OFF states.
tags: [environment, fx, lighting]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d24311d5
system_scope: environment
---

# Atrium Light

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `atrium_light` prefab is a decorative, powered lighting object used in the Atrium environment. It consists of three sub-prefabs (`atrium_light`, `atrium_light_back`, and `atrium_light_light`) that combine visually to form a complete light fixture. The component manages light activation via the `atriumpowered` event, controlling animation states and the `Light` component. It also integrates with the `inspectable` component to report status (`ON`/`OFF`). This prefab does not persist across sessions and is marked non-clickable.

## Usage example
```lua
local inst = SpawnPrefab("atrium_light")
inst.Transform:SetPos(x, y, z)
inst:PushEvent("atriumpowered", { ispowered = true })
```

## Dependencies & tags
**Components used:** `inspectable`  
**Tags added by sub-prefabs:** `FX` (on `atrium_light_back`), `DECOR` and `NOCLICK` (on `atrium_light_light`); parent has no tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `highlightchildren` | table | `{}` (server) / `{}` (client) | List of child prefabs (`atrium_light_back`, `atrium_light_light`) used for highlighting effects. Server-side only. |
| `scrapbook_speechstatus` | string | `"OFF"` | Status indicator used by `inspectable`; updated via `getstatus`. Server-side only. |

## Main functions
### `getstatus(inst)`
*   **Description:** Helper function assigned to `inspectable.getstatus`; returns `"ON"` if the light is enabled, otherwise `"OFF"`.
*   **Parameters:** `inst` (entity) — the `atrium_light` instance.
*   **Returns:** `"ON"` or `"OFF"` (string).
*   **Error states:** None. Assumes `inst.Light` exists.

## Events & listeners
- **Listens to:**  
  `atriumpowered` (on `TheWorld`) — triggered when power state changes for the Atrium. Applies logic to turn light ON/OFF and update animations accordingly.  
  `animover` (on `inst._light`) — registered temporarily when turning OFF to reset idle animations once the turn-off animation completes.  
- **Pushes:** None (does not fire custom events).