---
id: toadstool_cap
title: Toadstool Cap
description: Manages the lifecycle and states of a toadstool patch, including tracking spawned toadstools, handling absorption of poison bursts, and controlling visual appearance via light-dark transitions.
tags: [event_trigger, environment, worldgen]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5d28a3a2
system_scope: world
---

# Toadstool Cap

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`toadstool_cap` is a prefabricated entity that acts as a persistent spawn point for toadstools (`toadstool` and `toadstool_dark`). It maintains three internal states: `EMPTY` (0), `INGROUND` (1), and `GROWING` (2), and two internal tracked properties: `_state` (public via `inst._state`) and `_dark` (indicates whether the toadstool variant is dark). It integrates with multiple components — `entitytracker` (to track spawned toadstool entities), `hauntable`, `timer` (for dark period duration and respawn timers), and `inspectable`. When harvested, it spawns a toadstool and transitions to `EMPTY`; if a poison burst occurs while `INGROUND` or `GROWING`, it absorbs it and transitions to `DARK` mode. It also participates in world state registration (`ms_registertoadstoolspawner`) and listens for world events (`ms_spawntoadstool`) to trigger growth.

## Usage example
```lua
-- Example: Spawn and inspect a toadstool cap instance
local inst = SpawnPrefab("toadstool_cap")
inst.Transform:SetPosition(x, y, z)
-- Initially in EMPTY state; to grow one:
inst:PushEvent("ms_spawntoadstool")  -- triggers growth
-- To simulate harvesting:
inst.components.workable:Work(ACTIONS.CHOP, player)
-- To simulate poison absorption:
inst:PushEvent("poisonburst")
```

## Dependencies & tags
**Components used:** `entitytracker`, `hauntable`, `inspectable`, `timer`, `workable` (added dynamically at runtime)  
**Tags:** `event_trigger`, `absorbpoison`, `blocker`, `FX`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_state` | `net_tinybyte` | `0` | Internal networked state: 0 = `EMPTY`, 1 = `INGROUND`, 2 = `GROWING` |
| `_dark` | `net_bool` | `false` | Internal networked flag: `true` if the cap is in dark mode |
| `displaynamefn` | function | see below | Returns localized name based on state/dark flag |
| `scrapbook_anim` | string | `"mushroom_toad_idle_loop"` | Animation used in scrapbook UI |
| `scrapbook_specialinfo` | string | `"TOADSTOOLCAP"` | Scrapbook info section identifier |
| `scrapbook_workable` | `ACTIONS` | `ACTIONS.CHOP` | Action icon shown in scrapbook |

## Main functions
### `setnormal(inst, instant)`
*   **Description:** Resets the toadstool cap to normal (non-dark) mode. Stops the `"darktimer"`, switches animation/build to `toadstool_build`, resets minimap icon and layer, and optionally spawns a release FX entity.
*   **Parameters:** `instant` (boolean) — if `false`, spawns `toadstool_cap_releasefx` and animates the transition.
*   **Returns:** Nothing.

### `setdark(inst, duration, instant)`
*   **Description:** Activates dark mode by switching to `toadstool_dark_build`, updating minimap icon, and starting/overwriting the `"darktimer"` with `duration` seconds. Optionally spawns `toadstool_cap_absorbfx`.
*   **Parameters:** `duration` (number) — timer duration in seconds (e.g., `TUNING.TOTAL_DAY_TIME`); `instant` (boolean) — skip FX if `true`.
*   **Returns:** Nothing.

### `setstate(inst, state)`
*   **Description:** Core state transition function. Handles transitions among states `0` (`EMPTY`), `1` (`INGROUND`), and `2` (`GROWING`). Registers/unregisters events (e.g., `"poisonburst"`), toggles `workable` component, manages animations, minimap icon, physics layer (`LAYER_BACKGROUND` vs `LAYER_WORLD`), and emits `toadstoolstatechanged` event.
*   **Parameters:** `state` (number) — desired state (0/1/2); invalid inputs default to `0`.
*   **Returns:** Nothing.

### `onabsorbpoison(inst)`
*   **Description:** Event callback for `"poisonburst"` events. Calls `setdark` with full-day duration unless cap is sleeping.
*   **Parameters:** `inst` (entity) — the toadstool cap instance.
*   **Returns:** Nothing.

### `onworked(inst, worker)`
*   **Description:** Called when the cap is chopped. Plays hit animation and sound, unless worker is a ghost.
*   **Parameters:** `worker` (entity or `nil`) — the entity performing the work.
*   **Returns:** Nothing.

### `onworkfinished(inst)`
*   **Description:** Triggered upon completion of a work action. Removes `workable` component, and if `"mushroom_toad_hit"` animation is still playing, listens for `"animover"` to spawn the toadstool, otherwise spawns it immediately.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `ongrowing(inst)`
*   **Description:** After `"animqueueover"` completes, plays `"spawn_appear_mushroom"` and listens for `"animover"` → `ongrown`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `ongrown(inst)`
*   **Description:** Final growth step. Updates minimap icon, switches to idle loop animation, and adds `workable` component with 3 work units.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `onspawntoad(inst)`
*   **Description:** Spawns the appropriate toadstool (`toadstool` or `toadstool_dark`) based on current `_dark` state, tracks it via `entitytracker`, transitions cap state to `0`, and positions the toadstool at cap's location.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `hastoadstool(inst)`
*   **Description:** Checks whether a toadstool is currently active (either spawned or `state > 0`).
*   **Parameters:** `inst` (entity).
*   **Returns:** `boolean` — `true` if a toadstool is present or state is not `EMPTY`.

### `ontimerdone(inst, data)`
*   **Description:** Handles `"timerdone"` events. Transitions cap back to `NORMAL` if `"darktimer"` expires, or initiates respawn (state `2`) if `"respawn"`/`"respawndark"` timers complete.
*   **Parameters:** `data.name` (string) — timer name; `data` also includes `timer` reference.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Saves current state (`inst._state`) if `> 0`.
*   **Parameters:** `data` (table) — output table for serialized data.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores state from saved data via `setstate`.
*   **Parameters:** `data` (table or `nil`) — saved data from `onsave`.
*   **Returns:** Nothing.

### `onloadpostpass(inst)`
*   **Description:** Recovers tracked toadstool (if any), restores dark timer, and corrects visual mode (`normal`/`dark`) on load.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `ontriggerspawn(inst)`
*   **Description:** Triggered via `"ms_spawntoadstool"` world event. Forces `state = 2` (`GROWING`) to initiate growth sequence.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"poisonburst"` — absorbs poison and enters dark mode (`onabsorbpoison`).  
  - `"timerdone"` — handles dark timer expiry and respawn timers (`ontimerdone`).  
  - `"animover"` — spawns toadstool after hit animation completes (`onspawntoad`).  
  - `"animqueueover"` — proceeds through growth animation phases (`ongrowing`).  
  - `"onremove"` — handles toadstool removal to trigger respawn (`tracktoad` callback).  
  - `"death"` — handles toadstool death by removing tracking and pushing `"toadstoolkilled"` (`tracktoad` callback).  
  - `"ms_spawntoadstool"` — external world event to force growth (`ontriggerspawn`).  
- **Pushes:**  
  - `"toadstoolstatechanged"` — fired whenever `state` transitions.  
  - `"toadstoolkilled"` — fired when tracked toadstool is destroyed.  
  - `"ms_registertoadstoolspawner"` — registers the instance via world event.