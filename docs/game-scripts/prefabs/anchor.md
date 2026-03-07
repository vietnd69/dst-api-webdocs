---
id: anchor
title: Anchor
description: A deployable boat accessory that prevents vessel movement and interacts with water physics and environmental systems.
tags: [boat, physics, structure]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dbe62e52
system_scope: physics
---

# Anchor

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `anchor` is a deployable structure used to immobilize boats on water. It attaches to boats via the `boatdrag` component to apply drag forces and prevent forward motion. It integrates with multiple systems: it burns like other wood-based structures (`burnable`, `propagator`), drops loot when hammered (`lootdropper`, `workable`), emits sound effects during placement and interaction, and supports save/load persistence. The anchor also triggers camera shake and water leak events upon destruction.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("anchor")
inst.components.anchor:SetIsAnchorLowered(true)
-- The anchor automatically connects to the current platform (boat)
-- and applies drag forces defined in TUNING.BOAT.ANCHOR.BASIC
```

## Dependencies & tags
**Components used:** `burnable`, `lootdropper`, `workable`, `inspectable`, `hauntable`, `boatdrag`
**Tags:** Adds `structure`; checks `burnt`, `burning` (via `burnable`), `anchor_lowered` (event tag implied by usage).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `boat` | entity or `nil` | `nil` | Reference to the boat entity the anchor is attached to. Set automatically by `boatdrag`. |
| `drag` | number | `TUNING.BOAT.ANCHOR.BASIC.ANCHOR_DRAG` | Drag coefficient applied to the boat. Configured via `boatdrag` component. |
| `max_velocity_mod` | number | `TUNING.BOAT.ANCHOR.BASIC.MAX_VELOCITY_MOD` | Maximum velocity modifier for the boat. Configured via `boatdrag`. |
| `sailforcemodifier` | number | `TUNING.BOAT.ANCHOR.BASIC.SAILFORCEDRAG` | Modifier applied to sail force. Configured via `boatdrag`. |

## Main functions
### `SetIsAnchorLowered(lowered)`
*   **Description:** Sets the anchor's deployment state (visual and functional). Called when the anchor is lowered or raised on the boat.
*   **Parameters:** `lowered` (boolean) — `true` to lower the anchor (engaging drag), `false` to raise it (disengaging drag).
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `self.boat` is `nil`.

### `on_hammered(inst, hammerer)` (private)
*   **Description:** Handler executed when the anchor is fully hammered. Drops loot, spawns collapse FX, creates a medium-sized boat leak, lowers the anchor state, and removes the anchor entity.
*   **Parameters:** 
    *   `inst` (entity) — The anchor entity.
    *   `hammerer` (entity) — The player/entity performing the hammer action.
*   **Returns:** Nothing.
*   **Error states:** Non-fatal — silently skips actions if `inst.components.anchor` or `GetCurrentPlatform()` returns `nil`.

### `onburnt(inst)` (private)
*   **Description:** Cleanup handler when the anchor is fully burnt. Stops the mooring sound and clears the state graph.
*   **Parameters:** `inst` (entity) — The anchor entity.
*   **Returns:** Nothing.

### `onanchorlowered(inst)` (private)
*   **Description:** Triggered when the anchor hits water. Plays impact sound and triggers vertical camera shake on the associated boat.
*   **Parameters:** `inst` (entity) — The anchor entity.
*   **Returns:** Nothing.
*   **Error states:** Non-fatal — camera shake applies only if boat is valid.

### `initialize(inst)` (private)
*   **Description:** Initial setup callback to hide visual FX if the anchor is placed on a solid ground point (avoiding underwater FX showing above ground).
*   **Parameters:** `inst` (entity) — The anchor entity.
*   **Returns:** Nothing.

### `onsave(inst, data)` (private)
*   **Description:** Saves burn state (burning or burnt) to persistent data.
*   **Parameters:** 
    *   `inst` (entity) — The anchor entity.
    *   `data` (table) — Serialization table to populate.
*   **Returns:** Nothing.

### `onload(inst, data)` (private)
*   **Description:** Restores burn state from saved data. Triggers `onburnt` logic if the anchor was burnt at time of save.
*   **Parameters:** 
    *   `inst` (entity) — The anchor entity.
    *   `data` (table or `nil`) — Loaded save data.
*   **Returns:** Nothing.
*   **Error states:** Non-fatal — skips logic if `data` is `nil` or `data.burnt` is absent.

## Events & listeners
- **Listens to:** 
  *   `onburnt` — handled by `onburnt`.
  *   `onbuilt` — handled by `onbuilt` to play placement animation and sound.
  *   `anchor_lowered` — handled by `onanchorlowered` (triggered when anchor hits water).
- **Pushes:** 
  *   `workinghit` — fired on each work hit (via `onhit`).
  *   `spawnnewboatleak` — pushed to the attached boat when destroyed.
  *   `onburnt` — re-pushed during load if burnt state is restored.