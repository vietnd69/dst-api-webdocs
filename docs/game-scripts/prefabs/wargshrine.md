---
id: wargshrine
title: Wargshrine
description: A structure that accepts torches to become active, enabling a prototyper and emitting flame; deactivates when extinguished or deconstructed.
tags: [structure, crafting, fire, trader]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c4f11625
system_scope: crafting
---

# Wargshrine

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wargshrine` prefab is a craftable structure that functions as a trader and temporary prototyper. It starts in an *empty* state where it accepts torches. When a torch is inserted, it becomes *active*, lighting a flame and enabling crafting blueprints via the `prototyper` component. It interacts with multiple core systems: burning (via `burnable` and `propagator`), trading (via `trader`), crafting (via `prototyper`), and loot generation (via `lootdropper`). Its state transitions—*empty* ↔ *active* ↔ *burnt*—are managed by custom callbacks for ignition, extinguishing, burning, hammering, and deconstruction.

## Usage example
```lua
-- The prefab is built via the game's UI and world placement.
-- Modders may spawn it and interact programmatically:
local shrine = SpawnPrefab("wargshrine")
shrine.Transform:SetPosition(x, y, z)

-- Insert a torch to activate it:
local torch = SpawnPrefab("torch")
TheWorld:PushEvent("onthereis", { inst = shrine, giver = player, item = torch })

-- Deactivate by extinguishing:
if shrine.components.burnable then
    shrine.components.burnable:Extinguish()
end
```

## Dependencies & tags
**Components used:** `burnable`, `hauntable`, `inspectable`, `lootdropper`, `prototyper`, `trader`, `workable`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`, `fueled`, `health`, `propagator`.  
**Tags added:** `structure`, `wargshrine`, `prototyper` (pristine only).  
**Tags checked:** `burnt`, `fireimmune`, `controlled_burner`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `torch` | entity or nil | `nil` | The torch currently inserted; `nil` when empty or burnt. |
| `_erodetorch` | net_event | `net_event(...)` | Network event to simulate torch erosion visually on clients. |
| `_ontorchremoved` | function | `function() MakeEmpty(inst) end` | Callback fired when the torch entity is removed. |
| `fires` | table of entities | `nil` | Active flame FX entities (only when active). |

## Main functions
### `SetTorch(inst, torch, loading)`
*   **Description:** Inserts a torch into the shrine, activating it: lights the flame, hides the torch sprite from world, adds it as a child, enables `prototyper`, and disables the `trader`.  
*   **Parameters:**  
    * `inst` (entity) — the wargshrine instance.  
    * `torch` (entity) — the torch to insert.  
    * `loading` (boolean) — if `true`, skips sound and some visual overrides (used during save/load).  
*   **Returns:** Nothing.  
*   **Error states:** No-op if `torch == inst.torch`. Automatically calls `DropTorch` if a torch is already present.

### `DropTorch(inst, worker)`
*   **Description:** Removes and re-activates the current torch (if present), extinguishes it, returns it to the scene, and triggers deactivation.  
*   **Parameters:**  
    * `inst` (entity) — the wargshrine instance.  
    * `worker` (entity or nil) — if provided, the torch is thrown to them via `LaunchAt`; otherwise, it is flung via `lootdropper:FlingItem`.  
*   **Returns:** Nothing.

### `MakeEmpty(inst)`
*   **Description:** Returns the shrine to its *empty* state: extinguishes flame, hides torch, removes `prototyper`, adds `trader` with appropriate callbacks, and re-enables lighting.  
*   **Parameters:** `inst` (entity) — the wargshrine instance.  
*   **Returns:** Nothing.  
*   **Error states:** Safely handles missing components and nil `torch`.

### `OnBurnt(inst)`
*   **Description:** Handles full burnout of the shrine: applies default burnt structure state, removes the torch, erodes visual residue, disables `trader`, and pushes the `wargshrinedeactivated` event.  
*   **Parameters:** `inst` (entity) — the wargshrine instance.  
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns the shrine's status string for `inspectable` UI. Prioritizes `"BURNT"` over `"EMPTY"` if applicable.  
*   **Parameters:** `inst` (entity) — the wargshrine instance.  
*   **Returns:** `"BURNT"` if burnt, `"EMPTY"` if trader component exists and not burnt, otherwise `nil`.

## Events & listeners
- **Listens to:**  
    * `onremove` (on torch) — triggers `MakeEmpty` when the torch entity is removed.  
    * `ondeconstructstructure` — triggers `DropTorch`.  
    * `wargshrine._erodetorch` (client-only) — triggers `OnErodeTorch`.  
    * `onbuilt` — triggers `onbuilt`.  
    * `animover` (on erosion FX) — triggers `Remove` on the FX.  
- **Pushes:**  
    * `wargshrineactivated` — when a torch is inserted.  
    * `wargshrinedeactivated` — when the torch is removed (by deconstruct, hammer, or burnout).  
    * `entity_droploot` — when loot is dropped (via `lootdropper:DropLoot`).