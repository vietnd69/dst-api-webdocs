---
id: anchor
title: Anchor
description: Manages the raising and lowering state of an anchor attached to a boat, handling drag physics, animation timing, and multiplayer coordination via sailor tasks.
tags: [physics, locomotion, multiplayer, boat, animation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7bb501ef
system_scope: physics
---

# Anchor

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Anchor` governs the operational state of an anchor entity — specifically whether it is raised, lowered, or transitioning — and interacts with boat physics to apply drag when lowered. It tracks how many sailors are raising the anchor, computes raise/lower speeds using `ExpertSailor` modifiers, and coordinates state transitions via `StateGraph` events. The component also synchronizes state during saves/load and updates entity animation speed dynamically during transitions.

It is typically added to anchor prefabs (e.g., `anchor`) and depends on the anchor being attached to a boat entity via `GetCurrentPlatform()`. It listens to boat movement events and updates the anchor state accordingly.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("anchor")

-- Optionally set velocity modifier (used internally, not commonly called externally)
inst.components.anchor:SetVelocityMod(0.5)

-- Trigger raising or lowering logic (usually invoked viaStateGraph or actions)
inst.components.anchor:StartRaisingAnchor()
inst.components.anchor:StartLoweringAnchor()

-- Add/remove sailor参与raising (often triggered by player action)
inst.components.anchor:AddAnchorRaiser(player)
inst.components.anchor:RemoveAnchorRaiser(player)
```

## Dependencies & tags
**Components used:** `boatphysics`, `expertsailor`
**Tags:** Adds/Removes `anchor_raised`, `anchor_lowered`, `anchor_transitioning`, `burnt`; checks `burnt`, `master_crewman`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `is_anchor_lowered` | boolean | `false` | Whether the anchor is fully lowered. |
| `raisers` | table | `{}` | Map of raiser (e.g., player) → raise speed (units/sec). |
| `numberofraisers` | number | `0` | Count of active raisers. |
| `raiseunits` | number | `0` | Current progress (in units) of raising; `0` = fully lowered, `>= depth` = fully raised. |
| `currentraiseunits` | number | `0` | Sum of active raiser speeds (units/sec). |
| `autolowerunits` | number | `3` | Speed at which the anchor auto-lowers when no raisers are present (units/sec). |
| `is_boat_moving` | boolean | `false` | Cached value of `boat.components.boatphysics.was_moving`. |
| `boat` | entity or `nil` | `nil` | Reference to the boat the anchor is attached to. |
| `max_velocity_mod` | number | `nil` | Velocity modifier applied during transitions (rarely used externally). |

## Main functions
### `SetBoat(boat)`
* **Description:** Assigns or replaces the boat this anchor is attached to. Registers or removes event callbacks on the boat for movement and removal.
* **Parameters:** `boat` (entity or `nil`) — the boat entity or `nil` to detach.
* **Returns:** Nothing.
* **Error states:** Safe to call multiple times; previous boat references are properly cleaned up.

### `SetVelocityMod(set)`
* **Description:** Sets an optional velocity modifier (not used in core logic).
* **Parameters:** `set` (number) — multiplier for velocity.
* **Returns:** Nothing.

### `GetCurrentDepth()`
* **Description:** Returns the anchor depth threshold (in units) required to transition from lowered to raised state, based on tile ocean depth.
* **Parameters:** None.
* **Returns:** number — depth threshold (e.g., `0.1`, `0.5`, `1.0`) from `TUNING.ANCHOR_DEPTH_TIMES`.
* **Error states:** Returns `0.1` if no boat is attached, or if tile data is unavailable.

### `SetIsAnchorLowered(is_lowered)`
* **Description:** Directly sets the anchor's lowered state and updates `boatphysics` drag attachments accordingly.
* **Parameters:** `is_lowered` (boolean) — whether to mark the anchor as lowered.
* **Returns:** Nothing.

### `StartRaisingAnchor()`
* **Description:** Begins raising the anchor if not burnt or already raised. Pushes `"raising_anchor"` event.
* **Parameters:** None.
* **Returns:** `true` if starting the raise succeeded, `false` if anchor was burnt or raised.
* **Error states:** Returns `false` if `inst:HasTag("burnt")` or `inst:HasTag("anchor_raised")`.

### `StartLoweringAnchor()`
* **Description:** Begins lowering the anchor if not burnt or already lowered; starts transition if not already in transition.
* **Parameters:** None.
* **Returns:** `true` if starting the lower succeeded, `false` if already lowering or burnt/lowered.
* **Error states:** Returns `false` if anchor is burnt or already fully lowered/transitioning.

### `AddAnchorRaiser(doer)`
* **Description:** Registers a raiser (e.g., player) and updates raise speed. Starts transition if needed. Uses `ExpertSailor.GetAnchorRaisingSpeed()` and `MASTER_CREWMAN_MULT` bonus.
* **Parameters:** `doer` (entity) — the entity raising the anchor (e.g., a player).
* **Returns:** `true` if raiser was added (even if already registered), `false` if burnt.
* **Error states:** Ignored if `inst:HasTag("burnt")`.

### `RemoveAnchorRaiser(doer)`
* **Description:** Removes a raiser and updates the cumulative raise speed. If no raisers remain and a lowering transition was active, pushes `"lowering_anchor"`.
* **Parameters:** `doer` (entity) — the raiser to remove.
* **Returns:** Nothing.

### `AnchorRaised()`
* **Description:** Finalizes a successful raise: clears transition tag, resets animation speed multiplier, cancels all raisers, and pushes `"anchor_raised"`.
* **Parameters:** None.
* **Returns:** Nothing.

### `AnchorLowered()`
* **Description:** Finalizes a successful lower: clears transition tag and resets animation speed; pushes `"anchor_lowered"`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called each frame during transition (`is_anchor_transitioning == true`) to advance raise/lower progress. Updates animation speed multiplier based on `numberofraisers`.
* **Parameters:** `dt` (number) — elapsed time in seconds since last frame.
* **Returns:** Nothing.
* **Behavior:**
  - While raising: decreases `raiseunits` by `dt * currentraiseunits`.
  - While lowering with no raisers: increases `raiseunits` by `dt * autolowerunits`.
  - Anim multiplier = `0.2 + (numberofraisers * 0.3)` when raisers present, else `1.0`.
  - Triggers `AnchorRaised()` or `AnchorLowered()` when thresholds crossed.

### `GetDebugString()`
* **Description:** Returns a multi-line debug string with current boat, raiser count, raise progress, and depth.
* **Parameters:** None.
* **Returns:** string — formatted debug info (e.g., `"Boat: EntityID numberofraisers: 2 raiseunits: 0.2 currentraiseunits: 3.5 depth: 1.0"`).
* **Error states:** Returns `"Boat: nil"` if no boat attached.

### `OnSave()`
* **Description:** serializes the `raiseunits` property for save data.
* **Parameters:** None.
* **Returns:** table — `{ raiseunits = self.raiseunits }`.

### `OnLoad(data)`
* **Description:** Restores `raiseunits` from save data.
* **Parameters:** `data` (table or `nil`) — saved data from `OnSave()`.
* **Returns:** Nothing.

### `LoadPostPass()`
* **Description:** Called after loading to finalize state and transition based on `raiseunits` and current platform.
* **Parameters:** None.
* **Returns:** Nothing.
* **Behavior:** Sets anchor state (`raised`, `lowered`, `lowered_land`, `lowering`) in the StateGraph based on depth and raiser state.

## Events & listeners
- **Listens to:**  
  `onremove` — on the anchor and boat to detach references (`OnBoatRemoved`),  
  `boat_stop_moving`, `boat_start_moving` — on the boat to track movement (`OnBoatStopMoving`, `OnBoatStartMoving`),  
  `death`, `onburnt` — indirectly via `boatphysics`’s drag listeners (handled via `AddBoatDrag`).  
- **Pushes:**  
  `raising_anchor`, `lowering_anchor`, `anchor_raised`, `anchor_lowered`, `stopraisinganchor`,  
  `boat_stop_moving`, `boat_start_moving` — on the boat when movement state changes (handled by boat, not anchor).
