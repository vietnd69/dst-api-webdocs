---
id: yotd_dragonshrine
title: Yotd Dragonshrine
description: A ritual shrine that accepts charcoal offerings, activates a prototyper when offered, and resets to an empty trader state when used or extinguished.
tags: [structure, crafting, fire, event]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e6200ef3
system_scope: crafting
---

# Yotd Dragonshrine

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yotd_dragonshrine` prefab is a seasonal or event-specific structure that functions as a specialized crafting station. In its pristine state, it supports prototyping using materials defined in `TUNING.PROTOTYPER_TREES.DRAGONSHRINE`. When no offering is present, it acts as an empty trader that accepts charcoal. Placing a charcoal item ("charcoal") as an offering triggers animation and UI updates, disables trading, and activates the prototyper. The shrine can be burned or hammered to completion, which consumes the offering and drops loot. It integrates tightly with the `burnable`, `lootdropper`, `prototyper`, `trader`, and `yotd_raceprizemanager` systems.

## Usage example
```lua
-- Typical internal usage within the prefab definition (not modder-facing)
local shrine = SpawnPrefab("yotd_dragonshrine")
shrine.Transform:SetPosition(x, y, z)
TheWorld:PushEvent("yotd_ratraceprizechange") -- triggers idol visual update
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `workable`, `burnable`, `propagator`, `hauntable`, `prototyper`, `trader`, `yotd_raceprizemanager`
**Tags:** Adds `structure`, `catcoonshrine`, `prototyper`. Checks `burnt`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `offering` | Entity or `nil` | `nil` | Reference to the currently offered charcoal entity; set via `SetOffering`, cleared by `DropOffering` or burn/load logic. |
| `_onofferingremoved` | function | `function() MakeEmpty(inst) end` | Callback bound to the offering's `onremove` event to reset the shrine if the offering is removed externally. |

## Main functions
### `MakePrototyper(inst)`
*   **Description:** Removes the `trader` component (if present) and adds/activates `prototyper` with dragonshrine-specific recipe trees.
*   **Parameters:** `inst` (Entity) — the shrine instance.
*   **Returns:** Nothing.

### `SetOffering(inst, offering, loading)`
*   **Description:** Attaches a new charcoal offering to the shrine: plays sounds/animations, creates the child entity, updates visibility ("charcoal" layer), disables `trader`, and enables `prototyper`. Skips if the same offering is already present.
*   **Parameters:** `offering` (Entity) — the charcoal item to offer; `loading` (boolean) — suppresses sound/animation if `true`.
*   **Returns:** Nothing.

### `DropOffering(inst, worker)`
*   **Description:** Detaches and physically flings the current offering away (using `LootDropper:FlingItem`), removes listeners, hides the "offering" animation layer, and clears `inst.offering`.
*   **Parameters:** `inst` (Entity) — the shrine; `worker` (Entity or `nil`) — if provided, launches the item toward the worker.
*   **Returns:** Nothing.

### `MakeEmpty(inst)`
*   **Description:** Resets the shrine to its empty/trader state: removes the offering, hides the charcoal layer, removes the `prototyper`, and adds/reinitializes `trader` with a `able_to_accept_test` (only accepts "charcoal") and `onaccept` handler.
*   **Parameters:** `inst` (Entity) — the shrine instance.
*   **Returns:** Nothing.

### `on_work_finished(inst, worker)`
*   **Description:** Handles successful hammering completion: extinguishes fire if burning, drops loot, drops the offering, spawns a collapse FX, and removes the shrine entity.
*   **Parameters:** `inst` (Entity) — the shrine; `worker` (Entity) — the worker performing the action.
*   **Returns:** Nothing.

### `on_worked(inst, worker, workleft)`
*   **Description:** Handles intermediate hammer hits: drops the current offering (if any), resets the shrine to empty state, and plays a hit animation (unless burnt).
*   **Parameters:** `inst` (Entity) — the shrine; `worker` (Entity) — the worker; `workleft` (number) — remaining work units (unused).
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Callback invoked when the shrine burns completely: spawns default burnt structure loot, destroys the offering (if present), and removes the `trader` component.
*   **Parameters:** `inst` (Entity) — the shrine instance.
*   **Returns:** Nothing.

### `OnIgnite(inst)`
*   **Description:** Callback invoked when ignition starts: drops ash for any offering, resets to empty state via `MakeEmpty`, disables the trader, and proceeds with default burning.
*   **Parameters:** `inst` (Entity) — the shrine instance.
*   **Returns:** Nothing.

### `OnExtinguish(inst)`
*   **Description:** Callback invoked when fire is extinguished: re-enables the trader and proceeds with default extinguish logic.
*   **Parameters:** `inst` (Entity) — the shrine instance.
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns a string status for the inspector tooltip: `"BURNT"` or `"EMPTY"` depending on current state.
*   **Parameters:** `inst` (Entity) — the shrine instance.
*   **Returns:** `"BURNT"`, `"EMPTY"`, or `nil` (pristine/offering state is not surfaced).

### `OnSave(inst, data)`
*   **Description:** Serializes shrine state for saving: records `burnt` flag or the offering's save record.
*   **Parameters:** `inst` (Entity) — the shrine; `data` (table) — the save table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores shrine state on load: applies burnt state, reloads offering, or resets to empty state.
*   **Parameters:** `inst` (Entity) — the shrine; `data` (table or `nil`) — the saved data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — triggers `on_built` to set initial animation/sound.
- **Listens to:** `ondeconstructstructure` — calls `DropOffering`.
- **Listens to:** `onremove` (on `offering`) — triggers `_onofferingremoved`, which calls `MakeEmpty`.
- **Listens to:** `yotd_ratraceprizechange` — updates idol animation/visibility via `updateprize`.
- **Pushes:** None directly (relies on component events).