---
id: charlieresidue
title: Charlieresidue
description: A classified client-side visual effect entity that tracks a target and renders Charlie's residue, decaying when activated or vision conditions change.
tags: [fx, classified, client, vision, decay]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 02ee8293
system_scope: fx
---

# Charlieresidue

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`charlieresidue` is a classified client-side prefab that creates a persistent visual effect (residue) attached to a target entity. It is typically instantiated by Charlie-related abilities (e.g., Winona's Charlie技能) to visually indicate an active effect on a target. The component manages a nested FX entity (`charlieresidue` animstate build) and synchronizes its lifecycle with the target. It decays (transitions to post-animation and removes itself) when activated by an inspectable user or when the viewer lacks Rose glasses vision.

Key behaviors:
- Attaches a client-only FX entity to the target for visual rendering.
- Uses `CLASSIFIED` tag and `net_entity` synchronization for secure target assignment.
- Supports Rose glasses vision detection via `playervision:HasRoseGlassesVision()`.
- Responds to activatable interactions via `activatable.OnActivate`, triggering immediate decay.
- Provides map action context support for UI interaction (e.g., pulling up map on interaction).

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("CLASSIFIED")
-- ... configure transform and network ...
inst:SetFXOwner(player)
inst:SetTarget(target_entity)
inst:SetMapActionContext(CHARLIERESIDUE_MAP_ACTIONS.INSPECT)
```

## Dependencies & tags
**Components used:**  
- `activatable` (added; used for `OnActivate` callback)  
- `inspectable` (added on master)  
- `playervision` (accessed via `owner.components.playervision`)  
- `roseinspectableuser` (accessed via `doer.components.roseinspectableuser`)  

**Tags:**  
- `CLASSIFIED` (added unconditionally)  
- `NOBLOCK` (added to FX entity)  
- `FX` (added to FX entity during `pst` animation)  
- `NOCLICK` (added during `pst` animation and after `Decay`)  
- `action_pulls_up_map` (added conditionally when `mapactioncontext > NONE`)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_animstate` | net_tinybyte | `0` | Networked animstate (pre=0, idle=1, pst=2). |
| `_mapactioncontext` | net_tinybyte | `0` | Networked map action context (see `CHARLIERESIDUE_MAP_ACTIONS`). |
| `_target` | net_entity | `nil` | Networked target entity reference. |
| `_fx` | entity | `nil` | Local FX entity (client only; `nil` after `pst`). |
| `killed` | boolean | `false` | Internal flag marking if decay has started. |
| `valid_map_actions` | table | `{[ACTIONS.ACTIVATE] = true}` | Map of actions that trigger map UI on interaction. |

## Main functions
### `SetFXOwner(owner)`
* **Description:** Assigns the owner entity and initializes client-side FX if owner has HUD. Begins listening for deactivation or Rose glasses vision changes to trigger decay.
* **Parameters:** `owner` (entity or `nil`) — The player/entity responsible for this residue.
* **Returns:** Nothing.
* **Error states:** No-op if `_inittask` has already been canceled (i.e., init already completed).

### `SetTarget(target)`
* **Description:** Sets and synchronizes the target entity via `net_entity`. Adjusts physics radius override to match target.
* **Parameters:** `target` (entity or `nil`) — Entity to attach the residue to.
* **Returns:** Nothing.

### `SetMapActionContext(context)`
* **Description:** Sets the map action context and toggles the `action_pulls_up_map` tag accordingly.
* **Parameters:** `context` (number) — One of `CHARLIERESIDUE_MAP_ACTIONS` constants.
* **Returns:** Nothing.

### `Decay()`
* **Description:** Initiates decay: transitions animstate to `pst`, clears FX target, detaches and removes FX entity, adds `NOCLICK`, and schedules removal after `0.5` seconds.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnActivate(inst, doer)`
* **Description:** Handler for `activatable.OnActivate`. Immediately triggers `Decay()` and notifies `roseinspectableuser` if present.
* **Parameters:**  
  - `inst` (entity) — This residue instance.  
  - `doer` (entity or `nil`) — The entity activating the residue.
* **Returns:** Nothing.

### `GetTarget()`
* **Description:** Returns the current target entity.
* **Parameters:** None.
* **Returns:** `entity or nil`

### `GetMapActionContext()`
* **Description:** Returns the current map action context value.
* **Parameters:** None.
* **Returns:** `number` — Current `CHARLIERESIDUE_MAP_ACTIONS` constant.

## Events & listeners
- **Listens to:**  
  - `onremove` — Removes this instance when target is removed (on master).  
  - `ondeactivateskill_server` — Triggers `Decay()` if skill `"winona_charlie_1"` is deactivated (only under Rose glasses vision).  
  - `roseglassesvision` — Triggers `Decay()` if vision is disabled (only under Rose glasses vision).  
  - `animstatedirty` — Synchronizes FX animstate on client.  
  - `targetdirty` — Updates FX target on client.  

- **Pushes:** None (does not push custom events).