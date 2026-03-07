---
id: tackler
title: Tackler
description: Handles collision detection and interaction logic for entities that can tackle or trample other entities and work on workable targets.
tags: [combat, collision, interaction, workable]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8d34726b
system_scope: entity
---

# Tackler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Tackler` manages interaction logic for entities that perform directional attacks (tackles) against nearby targets and work on workable objects (e.g., mining, chopping). It performs raycast-like detection in front of the entity, identifies valid targets (workables or combat-capable entities), and executes the appropriate action (working or attacking), while supporting custom callbacks for collision/trample events and edge detection.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("tackler")
inst.components.tackler:SetRadius(1.0)
inst.components.tackler:AddWorkAction("chop", 2)
inst.components.tackler:SetOnCollideFn(function(talker, target)
    -- custom logic when colliding with a target
end)
local hit = inst.components.tackler:CheckCollision()
```

## Dependencies & tags
**Components used:** `combat`, `health`, `workable`
**Tags:** Checks against `no_collide_tags` (`"NPC_workable"`, `"DIG_workable"`, `"FX"`, `"NOCLICK"`, `"DECOR"`, `"INLIMBO"`, and `"player"` when PVP is disabled), and dynamically adds `_workable` tags from `work_actions` to `collide_tags`. Also uses `"_combat"` as a default collide tag.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `distance` | number | `0.5` | Forward distance to check for collision targets. |
| `radius` | number | `0.75` | Radius around the forward direction used for entity detection. |
| `structure_damage_mult` | number | `2` | Damage multiplier applied when attacking structures during a tackle. |
| `work_actions` | table | `{}` | Maps `WorkAction` objects to work amounts for workable targets. |
| `collide_tags` | table | `{ "_combat" }` | Tags that entities must have to be considered as potential collision targets. |
| `no_collide_tags` | table | `{ "NPC_workable", "DIG_workable", "FX", "NOCLICK", "DECOR", "INLIMBO", "player" (if PVP disabled) }` | Tags that cause entities to be ignored in collision checks. |
| `edgedistance` | number | `5` | Distance used by `CheckEdge` to determine if the entity is near a map edge or hole. |
| `onstarttacklefn` | function | `nil` | Optional callback invoked when `StartTackle` is called. |
| `oncollidefn` | function | `nil` | Optional callback invoked on direct collision with a workable or structure. |
| `ontramplefn` | function | `nil` | Optional callback invoked when trampling small creatures. |

## Main functions
### `SetOnStartTackleFn(fn)`
* **Description:** Sets the callback function to be invoked when `StartTackle` is called. Typically used to trigger visual/audio effects or state changes before tackling.
* **Parameters:** `fn` (function) — the callback function accepting one argument: the owning instance (`self.inst`).
* **Returns:** Nothing.

### `StartTackle()`
* **Description:** Invokes the `onstarttacklefn` callback if one is set.
* **Parameters:** None.
* **Returns:** The return value of the `onstarttacklefn` callback (e.g., `true`/`false`), or `nil` if no callback is set.

### `SetDistance(distance)`
* **Description:** Configures the forward offset distance where collision checks begin.
* **Parameters:** `distance` (number) — new offset distance.
* **Returns:** Nothing.

### `SetRadius(radius)`
* **Description:** Configures the radius around the forward direction used to search for entities.
* **Parameters:** `radius` (number) — new search radius.
* **Returns:** Nothing.

### `SetStructureDamageMultiplier(mult)`
* **Description:** Sets the damage multiplier used when the tackler attacks structures during a collision.
* **Parameters:** `mult` (number) — new damage multiplier (applied via `externaldamagemultipliers`).
* **Returns:** Nothing.

### `AddWorkAction(action, amount)`
* **Description:** Registers a `WorkAction` that this entity can perform during a tackle. Automatically adds the action’s `id.."_workable"` tag to `collide_tags` for the first time the action is added.
* **Parameters:**  
  `action` (`WorkAction`) — the action to register (e.g., `"chop"`, `"mine"`).  
  `amount` (number, optional) — number of work units to apply; defaults to `1`.
* **Returns:** Nothing.

### `SetOnCollideFn(fn)`
* **Description:** Sets a custom callback invoked when the entity collides with a target during `CheckCollision`.
* **Parameters:** `fn` (function) — callback accepting two arguments: `tackler_inst`, `target_inst`.
* **Returns:** Nothing.

### `SetOnTrampleFn(fn)`
* **Description:** Sets a custom callback invoked when the entity tramples a small creature during `CheckCollision`.
* **Parameters:** `fn` (function) — callback accepting two arguments: `tackler_inst`, `target_inst`.
* **Returns:** Nothing.

### `CheckCollision(ignores)`
* **Description:** Performs directional collision detection in front of the entity. Checks for workables first (prioritizing them), then structures, then small creatures (trample). Executes appropriate action(s) and triggers callbacks.
* **Parameters:** `ignores` (table or `nil`) — optional table mapping `inst` → `true` to skip specific entities (e.g., for loop-avoidance).
* **Returns:** `true` if any valid target (workable, structure, or trample target) was hit; `false` otherwise.
* **Error states:**  
  - Workable targets must satisfy `workable:CanBeWorked()` and match a registered `work_actions` key.  
  - Combat targets must satisfy `combat:CanTarget()`, `health:IsDead() == false`, and not be force-attack-exclusive (if `TargetForceAttackOnly` exists).  
  - Trample targets must have `smallcreature` tag (implied by exclusion in workable check) and be valid, alive, and targetable.

### `SetEdgeDistance(distance)`
* **Description:** Sets the distance used to check for map edges or holes around the entity.
* **Parameters:** `distance` (number) — new edge-check distance.
* **Returns:** Nothing.

### `CheckEdge()`
* **Description:** Checks whether the entity is adjacent to a map edge or hole in three directions (forward, ±30°) using `TheWorld.Map` APIs.
* **Parameters:** None.
* **Returns:** `true` if *all three* directions indicate blocked terrain (hole or below ground); `false` otherwise.

## Events & listeners
None identified.
