---
id: archive_pillar
title: Archive Pillar
description: Represents a decorative, non-interactive archive pillar prop that can exist in intact or broken states, with state persistence across saves and network synchronization.
tags: [prop, environment, persistence]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 103a4769
system_scope: environment
---

# Archive Pillar

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`archive_pillar` is a static prop prefab used in world environments—specifically for aesthetic decoration in zones such as the Ruins. It supports two visual states: intact (`full`) and broken. The broken state is determined randomly upon creation or explicitly via the `choosebroken` function, and the state is persisted through save/load cycles via `OnSave` and `OnLoad` handlers. Network synchronization is handled automatically via the `entity:AddNetwork()` call, with `Pristine` state ensuring server authority.

## Usage example
```lua
local inst = SpawnPrefab("archive_pillar")
inst.Transform:SetPos(x, y, z)
inst.broken = true  -- optionally override the random broken state
inst:PushEvent("atriumpowered", true)  -- triggers animation state (commented out in current code)
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `minimapentity`, `physics`  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `broken` | boolean | `false` | Indicates whether the pillar is in a visually broken state. Set by `choosebroken` or loaded from save data. |

## Main functions
### `choosebroken(inst, broken)`
*   **Description:** Sets the visual state of the pillar to either "full" or "broken", updating the animation bank and build accordingly. If `broken` is `nil`, a random 20% chance to break is applied.
*   **Parameters:** `inst` (entity instance), `broken` (boolean or `nil`) — `true` forces broken state, `false` forces full state, `nil` triggers probabilistic choice.
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `OnPoweredFn(inst, ispowered)`
*   **Description:** Plays either the "idle_active" or "idle" animation based on `ispowered`. Currently unused—event listener is commented out.
*   **Parameters:** `inst` (entity instance), `ispowered` (boolean).
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes the `broken` state for world save persistence.
*   **Parameters:** `inst` (entity instance), `data` (table) — save data table to modify in-place.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores the `broken` state from save data and updates the visual representation.
*   **Parameters:** `inst` (entity instance), `data` (table) — loaded save data.
*   **Returns:** Nothing.
*   **Error states:** No-op if `data` or `data.broken` is `nil`.

## Events & listeners
- **Listens to:** None (the `"atriumpowered"` listener is commented out and inactive).
- **Pushes:** None identified.