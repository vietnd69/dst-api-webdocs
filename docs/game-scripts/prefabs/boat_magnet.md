---
id: boat_magnet
title: Boat Magnet
description: A deployable structure component that enables boat magnet functionality by pairing with a beacon and responding to beacon state changes via the state graph.
tags: [boat, structure, environment, physics]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 96c3c831
system_scope: environment
---

# Boat Magnet

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`boat_magnet` is a deployable structure prefab that serves as the physical manifestation of a boat magnet in DST. It integrates with the `boatmagnet` and `boatmagnetbeacon` components to enable paired operation between magnets and beacons on the same boat. The prefab manages its own visual state, destruction behavior (including loot drops), burning state, and hampering interactions. It does not contain executable logic itself but defines callbacks and event handlers that respond to component state changes and delegate behavior to attached components.

## Usage example
This prefab is typically instantiated by the game via `SpawnPrefab("boat_magnet")` when placed from the `boat_magnet_kit`. Manual placement for testing may be done as follows:

```lua
local inst = SpawnPrefab("boat_magnet")
if inst and TheWorld.ismastersim then
    inst.Transform:SetPosition(x, y, z)
    inst:PushEvent("onbuilt")
end
```

## Dependencies & tags
**Components used:** `boatmagnet`, `lootdropper`, `workable`, `burnable`, `Inspectable`
**Tags added:** `boatmagnet`, `structure`

## Properties
No public properties are defined directly in the `boat_magnet` prefab. All properties are managed by attached components (`boatmagnet`, `burnable`, etc.) and accessed via `inst.components.X`.

## Main functions
This prefab itself does not define any standalone functions beyond the prefab constructor `fn()`. Its logic is expressed via callbacks assigned to component fields:

### Callbacks assigned to `boatmagnet` component
*   **`onpairedwithbeacon(inst, beacon)`** — State transition triggered when a beacon pairs with this magnet. Chooses `"idle"` if beacon is off *or* on same boat; otherwise `"pull_pre"`.
*   **`onunpairedwithbeacon(inst)`** — Transition to `"pull_pst"` state upon beacon unpairing, unless already burnt.
*   **`beaconturnedon(inst, beacon)`** — Transition to `"idle"` if beacon is on same boat; otherwise `"pull"` when turned on.
*   **`beaconturnedoff(inst)`** — Transition to `"pull_pst"` when beacon is turned off.

### Callbacks assigned to other components
*   **`on_hammered(inst, hammerer)`** — Handles hammering damage. Drops loot using `lootdropper`, spawns `collapse_small` effect, and removes the instance.
*   **`onburnt(inst)`** — Handles burning completion: calls `DefaultBurntStructureFn`, unsets boat association in `boatmagnet`, removes `boatmagnet` component, and transitions to `"burnt"` state.
*   **`onbuilt(inst)`** — Plays placement sound and transitions to `"place"` state.

### Utility functions
*   **`getstatus(inst, viewer)`** — Returns `"ACTIVATED"` if the `boatmagnet` component is activated; otherwise `"GENERIC"`. Used by the `inspectable` component.

## Events & listeners
- **Listens to:**
  - `onbuilt` — Triggers `onbuilt()` callback to play sound and advance state.
- **Pushes:** None directly — events are handled by attached components or state graph transitions.
- **Saves/Loads:**
  - `onsave(inst, data)` — Records `data.burnt = true` if currently burning or burnt.
  - `onload(inst, data)` — Restores burnt state by invoking `onburnt()` if flagged.