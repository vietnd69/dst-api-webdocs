---
id: pumpkincarvable
title: Pumpkincarvable
description: Manages carving, visual rendering, and state persistence of pumpkins in the game, including cut shapes, lighting effects, and synchronization between client and server.
tags: [crafting, fx, lighting, persistence, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e70060f5
system_scope: entity
---

# Pumpkincarvable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Pumpkincarvable` component enables a pumpkin entity to be carved, displayed with animated cut shapes, and persisted across sessions. It handles both server-side logic (validating cut data, tracking the current carver, syncing state) and client-side rendering (managing cut FX entities, animated fill glow, day/night lighting overrides). The component integrates with `inventory` (to check for valid carving tools), `burnable` (to prevent carving while burning), and `updatelooper` (to drive animation updates).

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("pumpkin")
inst:AddComponent("pumpkincarvable")

-- Begin carving
local carver = TheWorld:GetPlayerEntity()
if inst.components.pumpkincarvable:CanBeginCarving(carver) then
    inst.components.pumpkincarvable:BeginCarving(carver)
end

-- After carving, load cut data (e.g., from a menu)
inst.components.pumpkincarvable:LoadCutData("encoded_cut_data_string")

-- Check current carved state
local currentCutData = inst.components.pumpkincarvable:GetCutData()
```

## Dependencies & tags
**Components used:** `burnable`, `inventory`, `updatelooper`  
**Tags:** Adds `FX` to cut FX entities (not the pumpkin itself); does not modify tags on the owning entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `cuts` | table | `{}` | Array of cut FX entity instances currently attached to the pumpkin. |
| `cutdata` | net_string | `""` | Replicated string of encoded cut data (see `SHAPE_NAMES`, `TOOL_SHAPES`). |
| `carver` | Entity | `nil` | Entity currently performing the carving (server-only). |
| `range` | number | `3` | Carver’s max distance to continue carving. |
| `swapinst` | Entity | `nil` | Server-side preview FX entity shown when pumpkin is equipped. |
| `ismastersim` | boolean | `TheWorld.ismastersim` | `true` on the master server, `false` on clients. |

## Main functions
### `GetCutData()`
* **Description:** Returns the current carved pattern data as a string.
* **Parameters:** None.
* **Returns:** `string` — Encoded cut data (empty string if uncarved).

### `CanBeginCarving(doer)`
* **Description:** Checks if the specified entity (`doer`) is allowed to start carving the pumpkin.
* **Parameters:** `doer` (Entity) — The player attempting to carve.
* **Returns:** `boolean, string?` — `true, nil` if allowed; otherwise `false` and a reason: `"BURNING"` (if burning), `"INUSE"` (if another carver is active), or `false` (if same carver or busy state).

### `BeginCarving(doer)`
* **Description:** Starts the carving interaction for `doer`, transitions the carver to `"pumpkincarving"` state, and begins monitoring updates and events.
* **Parameters:** `doer` (Entity) — The player starting to carve.
* **Returns:** `boolean` — `true` if carving started, `false` if already in progress.

### `EndCarving(doer)`
* **Description:** Ends the carving session for `doer`, cleans up events and FX, and emits `"ms_endpumpkincarving"` on the carver.
* **Parameters:** `doer` (Entity) — The player ending the carve session.
* **Returns:** Nothing.

### `DoRefreshCutData()`
* **Description:** Rebuilds all cut FX entities (`self.cuts`) based on the current `cutdata`. Invoked on client when `cutdata` updates.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if cut data was successfully decoded and applied.

### `LoadCutData(cutdata)`
* **Description:** Validates, sets, and applies new cut data (`cutdata`). On clients, triggers `DoRefreshCutData`; on server, updates lighting.
* **Parameters:** `cutdata` (string) — Encoded carving pattern.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns saved state for persistence (contains `cuts` field with `cutdata`).
* **Parameters:** None.
* **Returns:** `{ cuts = string }` or `nil` if uncarved.

### `OnLoad(data, newents)`
* **Description:** Loads cut data from saved state and applies it.
* **Parameters:** `data` (table) — Saved component data; `newents` (unused).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `equipped` (server) — Spawns preview FX (`pumpkincarving_swap_fx`) when pumpkin is held.  
  - `unequipped` (server) — Removes preview FX.  
  - `onremove` (server) — Closes carving session and validates/saves cut data.  
  - `ms_closepopup` (server) — Handles closing of pumpkin carving UI popup.  
  - `cutdatadirty` (client) — Triggers client-side `DoRefreshCutData`.
- **Pushes:** None directly (uses networked `cutdatadirty` event internally via `net_string`).
