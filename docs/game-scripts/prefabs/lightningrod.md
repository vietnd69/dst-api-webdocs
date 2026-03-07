---
id: lightningrod
title: Lightningrod
description: A structure component that accumulates charge during thunderstorms and discharges lightning upon impact, while also acting as a battery and breakable workable object.
tags: [structure, battery, weather, combat]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 88bd7532
system_scope: environment
---

# Lightningrod

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lightningrod` prefab implements a structure that charges during thunderstorms (via `lightningstrike` events) and stores charge over multiple game cycles. It functions as both a visual hazard (emitting light and sound when active) and a functional battery usable by other components. It also supports being hammered for loot and integrates with DST's save/load and world-state systems.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("structure")
inst:AddTag("lightningrod")
inst:AddComponent("inspectable")
inst:AddComponent("battery")
inst.components.battery.canbeused = function(...) return true end
inst.components.battery.onused = function(...) end
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`, `battery`
**Tags:** `structure`, `lightningrod`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `charged` | boolean | `false` | Indicates if the rod is currently storing charge. |
| `chargeleft` | number | `nil` | Number of charge cycles remaining before full discharge. |
| `zaptask` | timer | `nil` | Deferred task handle for recurring lightning events. |
| `scrapbook_specialinfo` | string | `"LIGHTNINGROD"` | Metadata used for scrapbook integration. |

## Main functions
### `setcharged(inst, charges)`
* **Description:** Activates the rod’s charged state (enabling light, bloom effect, and cycle listening) and updates the charge count. Triggers immediate lightning activity.
* **Parameters:** `charges` (number) – number of cycles to charge; must be `> 0`.
* **Returns:** Nothing.
* **Error states:** Does nothing if already charged beyond requested level; idempotent.

### `discharge(inst)`
* **Description:** Deactivates the charged state (disables light, cancels timers, removes cycle listener).
* **Parameters:** None.
* **Returns:** Nothing.

### `onlightning(inst)`
* **Description:** Handles `lightningstrike` events by triggering a hit animation and charging the rod by 3 cycles.
* **Parameters:** None.
* **Returns:** Nothing.

### `onhammered(inst, worker)`
* **Description:** Called when the rod is fully worked (e.g., hammered); drops loot, spawns collapse FX, and destroys the rod entity.
* **Parameters:** `worker` (Entity or `nil`) – the entity performing the work.
* **Returns:** Nothing.

### `onhit(inst, worker)`
* **Description:** Plays the `hit` animation upon partial work.
* **Parameters:** `worker` (Entity or `nil`) – the entity performing the work.
* **Returns:** Nothing.

### `getstatus(inst)`
* **Description:** Provides a status string for UI display when inspecting the rod.
* **Parameters:** None.
* **Returns:** `"CHARGED"` if `inst.charged` is `true`; otherwise `nil`.

## Events & listeners
- **Listens to:** `lightningstrike` – triggers `onlightning`.
- **Listens to:** `onbuilt` – triggers `onbuilt` animation/sound.
- **Pushes:** No events directly; relies on component-level events (`battery.onused`, `lootdropper:DropLoot`, etc.).
- **WorldState Watch:** `"cycles"` – triggers `ondaycomplete` once per in-game day while charged.

## Save & Load Integration
- **OnSave:** Records `charged` and `chargeleft` if the rod is charged.
- **OnLoad:** Restores charged state and schedule if saved data exists.