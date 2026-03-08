---
id: SGlunarthrall_plant_vine
title: Sglunarthrall Plant Vine
description: Manages the state machine and behavior of a vine segment belonging to a Lunarthrall plant structure, including movement, combat, freezing, and chain reactions with parent and child segments.
tags: [combat, ai, freezing, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 6904573a
system_scope: entity
---

# Sglunarthrall Plant Vine

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGlunarthrall_plant_vine` defines the state graph for vine segments of the Lunarthrall boss encounter. These segments act as independent entities that can spawn, move forward (extend), move backward (retract), attack, and be damaged. The vine chain maintains a parent–child relationship: each segment (`nub`) is attached to a parent (`headplant` or `parentplant`) and can spawn a new child vine. The state machine handles transitions between idle, emerging, attacking, retracting, and dying states, and supports freezing/thawing behavior across the vine chain via state tags and event propagation.

## Usage example
```lua
-- A vine segment is automatically created by the Lunarthrall boss logic.
-- To manually spawn and configure one (for testing or modding):
local vine = SpawnPrefab("lunarthrall_plant_vine")
vine.headplant = parent_vine_or_plant
vine.parentplant = parent_vine_or_plant
vine:AddTag("lunarthrall_plant_end")
vine:AddTag("weakvine")
vine:DoTaskInTime(0.5, function() vine.sg:GoToState("nub_spawn") end)
```

## Dependencies & tags
**Components used:** `burnable`, `colouradder`, `combat`, `freezable`, `health`, `inventoryitem`, `mine`, `timer`, `transform`, `soundemitter`, `animstate`, `fueled` (indirect), `propagator` (indirect via burnable)
**Tags added/removed/checked:**
- Common tags: `idle`, `busy`, `emerged`, `retracting`, `nub`, `dead`, `frozen`, `thawing`, `noattack`, `noelectrocute`, `caninterrupt`
- Custom tags: `weakvine`, `lunarthrall_plant_end`, `lunarthrall_plant_segment`, `INLIMBO`, `DECOR`, `invisible`, `notarget`, `noattack`, `wall`, `lunarthrall_plant`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `headplant` | `Entity?` | `nil` | Reference to the immediate parent vine or plant segment (typically the base). Used for coldness redirection. |
| `parentplant` | `Entity?` | `nil` | Logical parent vine (often the same as `headplant`), used for lifecycle management and chain propagation. |
| `tintcolor` | `{r,g,b}` | `nil` | Optional RGB color used to tint the vine's animation. |
| `indirectdamage` | `boolean` | `nil` | Flag affecting death animation; set externally during damage. |
| `tails` | `table` | `{}` | Array of child vine segments spawned ahead of this one. Controls extension length. |

## Main functions
*This stategraph does not define standalone components or function modules; it is a `StateGraph`. The following are internal helper functions and event handlers used within the state definitions.*

### `nub_addcoldness(nub, coldness, freezetime, nofreeze)`
* **Description:** Redirects coldness application from a child vine segment (`nub`) to its parent vine or plant (`headplant`). Enables freezing effects to propagate upward in the vine chain.
* **Parameters:** 
  - `nub` (Entity) — child vine segment being frozen.
  - `coldness`, `freezetime`, `nofreeze` — standard Freezable component arguments.
* **Returns:** `true` if redirection succeeded (parent found and valid), `false` otherwise.
* **Error states:** Returns `false` if `headplant` is `nil` or invalid.

### `movetail(inst, anim)`
* **Description:** Staggered animation trigger for tail segments in a vine chain. Causes each tail to transition to the given animation (`anim`) over increasing time delays (e.g., 0.1s per segment).
* **Parameters:** 
  - `inst` (Entity) — vine segment triggering the movement.
  - `anim` (string) — animation name to play in each tail (e.g., `"nub_forward"`, `"nub_reverse"`).
* **Returns:** Nothing.

### `teleportback(inst)`
* **Description:** Recedes the vine chain by one segment: removes the last tail, teleports the current vine to the tail's position and rotation, sets weak state, and transitions to `"nub_idle"`. If no tails remain, removes the vine entirely.
* **Parameters:** `inst` (Entity) — current vine segment.
* **Returns:** Nothing.

### `teleportahead(inst, pos)`
* **Description:** Extends the vine chain forward by spawning a new child vine at the current location, adjusting the parent's position and rotation based on `pos`, and linking them visually and functionally.
* **Parameters:** 
  - `inst` (Entity) — current vine segment.
  - `pos` (Vector3) — target position for the new vine head.
* **Returns:** Nothing.

### `DoToss(inst)`
* **Description:** Clears nearby interactable items (e.g., mines) and launches lightweight inventory items away from the vine upon emerging or spawning.
* **Parameters:** `inst` (Entity) — vine segment performing the toss.
* **Returns:** Nothing.

### `cancelmovetail(tail)`
* **Description:** Cancels any pending tail movement task previously scheduled for a tail segment.
* **Parameters:** `tail` (Entity) — tail segment whose task to cancel.
* **Returns:** Nothing.

### `onmovetailtask(inst, tail, anim)`
* **Description:** Callback used by `movetail` to transition a tail segment into the specified animation once its delay expires.
* **Parameters:** 
  - `inst` (Entity) — main vine (unused here).
  - `tail` (Entity) — tail segment to animate.
  - `anim` (string) — animation name to apply.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"animover"` — triggered when animations complete; drives transitions to next states (e.g., idle, spawn, attack).
  - `"attacked"` — initiates `"hit"` state if interruptible and not dead; also handles electrocution via `CommonHandlers.TryElectrocuteOnAttacked`.
  - `"doattack"` — triggers `"attack"` (if emerged), `"nub_retract"` (if nub), or `"emerge"` states depending on current state.
  - `"death"` — immediately transitions to `"death"` state.
  - `"moveback"` — retracts vine via `"retract"`, `"nub_retract"`, or `teleportback`.
  - `"moveforward"` — extends vine via `"retract"`, `teleportahead`, or `"nub_spawn"`.
  - `"emerge"` — forces `"emerge"` state if interruptible and not already emerged.
  - `"electrocute"` — handled via `CommonStates.AddElectrocuteStates`, which adds `"sync_frozen"` and `"sync_thaw"` states and propagates effects to vine children and parent.

- **Pushes:**
  - `"onextinguish"` — via burnable component during `"retract"` (via `Extinguish`).
  - `"death"` — via `health` component → `"death"` state transition.
  - `"animover"` — fired internally by animstate when animations finish.
