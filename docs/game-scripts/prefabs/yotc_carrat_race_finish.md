---
id: yotc_carrat_race_finish
title: Yotc Carrat Race Finish
description: Manages the behavior and visual feedback of the carrat race finish line checkpoint in DST's Carrat Championship event, handling activation on race completion, lighting effects, loot, and burnt state persistence.
tags: [event, checkpoint, lighting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d0a9f8b7
system_scope: world
---

# Yotc Carrat Race Finish

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yotc_carrat_race_finish` prefab represents the finish line checkpoint for the Carrat Championship event. It is a non-combat structure that activates visually and audibly when a racer crosses it, displaying the winner's name and emitting colored light effects. It integrates with the `workable`, `burnable`, and `lootdropper` components to support hammering and burning interactions, and persists state across saves via custom `OnSave`/`OnLoad` handlers.

## Usage example
This prefab is typically spawned automatically as part of the Carrat Championship world generation or via deployable kit. Manual instantiation in a mod would look like:
```lua
local finish = SpawnPrefab("yotc_carrat_race_finish")
finish.Transform:SetPosition(x, y, z)
finish:PushEvent("yotc_racer_at_checkpoint", { racer = my_racer })
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `burnable`, `inspectable`
**Tags:** Adds `structure`, `yotc_racecheckpoint`, `yotc_racefinishline`, `FX` (for child light). Listens to events `onbuilt`, `yotc_racer_at_checkpoint`, `yotc_race_over`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_active` | boolean | `false` | Whether the finish line is currently in active (race-finished) state. |
| `_winner` | table or `nil` | `nil` | Stores `{ name = string, userid = string? }` when a racer finishes; used for custom description. |
| `_rug` | entity or `nil` | `nil` | Reference to the spawned `yotc_carrat_rug` child entity. |
| `_light` | entity or `nil` | `nil` | Reference to the colored light effect spawned on activation. |
| `prize` | any | `nil` | Custom prize data persisted across saves (if assigned externally). |

## Main functions
### `OnFinishRace(inst, data)`
* **Description:** Activates the finish line when a racer reaches it. Applies color override to glow effects, spawns a colored light, plays active animation, and records winner info for description. Only triggers once per instance unless reset by `OnRaceOver`.
* **Parameters:**
  * `inst` (entity) — The finish line instance.
  * `data` (table) — Event data; expected to contain `data.racer` (racer entity) to extract color and trainer info.
* **Returns:** Nothing.
* **Error states:** Returns early if `_active` is already `true`.

### `OnInactive(inst)`
* **Description:** Deactivates the finish line, removing the colored light, stopping sounds, and resetting internal state (`_active`, `_winner`).
* **Parameters:** `inst` (entity) — The finish line instance.
* **Returns:** Nothing.

### `OnRaceOver(inst)`
* **Description:** Schedules deactivation via `OnInactive` after `WIN_ANIM_MIN_TIME` (3.5 seconds), allowing the active animation to complete.
* **Parameters:** `inst` (entity) — The finish line instance.
* **Returns:** Nothing.

### `onhammered(inst, worker)`
* **Description:** Handles hammering interaction: drops loot, spawns a particle FX, and destroys the finish line.
* **Parameters:**
  * `inst` (entity) — The finish line instance.
  * `worker` (entity) — The entity performing the hammer action.
* **Returns:** Nothing.

### `onburnt(inst)`
* **Description:** Handles post-burnt state: applies burnt animation, removes light, kills active sound, and notifies the rug sub-entity via `onburntup` event. Uses `DefaultBurntStructureFn`.
* **Parameters:** `inst` (entity) — The finish line instance.
* **Returns:** Nothing.

### `getdesc(inst, viewer)`
* **Description:** Provides dynamic inspection description based on state: shows `"BURNT"` if burnt, `"I_WON"` if the viewer's trainer won, or `"SOMEONE_ELSE_WON"` with the winner's name.
* **Parameters:**
  * `inst` (entity) — The finish line instance.
  * `viewer` (entity) — The inspecting player entity.
* **Returns:** Localized string or `nil`.

## Events & listeners
- **Listens to:**
  * `onbuilt` — Triggers `onbuilt` handler to play build animation and sound, and notify rug.
  * `yotc_racer_at_checkpoint` — Triggers `OnFinishRace`.
  * `yotc_race_over` — Triggers `OnRaceOver`.
- **Pushes:** None directly; child rug and light entities may fire their own events.
- **Persistent save/load events:**
  * `inst.OnSave` — Saves `burnt` status and `prize` field.
  * `inst.OnLoad` — Restores `burnt` state via `burnable.onburnt` and `prize` value.
