---
id: aoeweapon_base
title: Aoeweapon Base
description: Provides shared behavior for area-of-effect weapons that can destroy workables, pick pickables, or attack combat targets.
tags: [combat, workable, pickable, aoe]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: bd3f5de8
system_scope: combat
---

# Aoeweapon Base

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Aoeweapon_Base` is a helper component that encapsulates common logic for area-of-effect (AOE) weapons used by characters or projectiles. It determines how a thrown or launched object interacts with entities in its path: either destroys `workable` objects (like trees or walls), picks `pickable` objects (like saplings or bushes), or attacks valid `combat` targets. It supports custom hit/miss callbacks and filters targets by work actions, stimuli, and tags.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("aoeweapon_base")

inst.components.aoeweapon_base:SetDamage(25)
inst.components.aoeweapon_base:SetStimuli({ "fire", "hot" })
inst.components.aoeweapon_base:SetWorkActions(ACTIONS.CHOP, ACTIONS.MINE)
inst.components.aoeweapon_base:SetTags("_combat", "projectile")
inst.components.aoeweapon_base:SetOnHitFn(function(inst, doer, target)
    -- custom logic on successful hit
end)
```

## Dependencies & tags
**Components used:** `combat`, `workable`, `pickable`, `mine`, `inventoryitem`, `spawner`, `childspawner`

**Tags:** Adds `"_combat"`, `"pickable"`, `"NPC_workable"` by default; uses `workactions` to dynamically append `"<action_id>_workable"` tags. Supports `notags` filtering (e.g., `"FX"`, `"DECOR"`, `"INLIMBO"`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `damage` | number | `10` | Base damage applied when attacking combat targets. |
| `stimuli` | table or nil | `nil` | Optional stimuli array passed to combat attacks. |
| `tags` | table | `{ "_combat", "pickable", "NPC_workable" }` | Tags used to identify the weapon for filtering targets. |
| `notags` | table or nil | `nil` | Tags that disqualify a target from being affected. |
| `combinedtags` | table | populated at runtime | Combined list of custom tags and generated `workable` tags. |
| `workactions` | table (keyed by `ACTIONS.X`) | empty | Set of action types this weapon can use on workables. |
| `onprehitfn` | function or nil | `nil` | Callback fired before hit logic evaluates. |
| `onhitfn` | function or nil | `nil` | Callback fired on successful hit or work/pick. |
| `onmissfn` | function or nil | `nil` | Callback fired when no valid target interaction occurs. |
| `canpick` | boolean or nil | `nil` | If set, determines whether pickables are considered; unset means pickables are ignored. |

## Main functions
### `SetDamage(dmg)`
*   **Description:** Sets the damage value used when attacking combat targets.
*   **Parameters:** `dmg` (number) - damage amount.
*   **Returns:** Nothing.

### `SetStimuli(stimuli)`
*   **Description:** Sets the stimuli table passed to `Combat:DoAttack`, affecting how the target perceives the damage source.
*   **Parameters:** `stimuli` (table) - array-like list of stimuli strings (e.g., `{ "fire", "hot" }`).
*   **Returns:** Nothing.

### `SetWorkActions(...)`
*   **Description:** Specifies the set of work actions this weapon can perform (e.g., `ACTIONS.CHOP`, `ACTIONS.MINE`). Generates `workable` tags internally.
*   **Parameters:** Variadic list of action constants (e.g., `ACTIONS.CHOP, ACTIONS.DIG`).
*   **Returns:** Nothing.

### `SetTags(...)`
*   **Description:** Replaces the default `tags` list with a new set of custom tags.
*   **Parameters:** Variadic list of tag strings.
*   **Returns:** Nothing.

### `SetNoTags(...)`
*   **Description:** Specifies tags that exclude a target from interaction (e.g., `FX`, `INLIMBO`).
*   **Parameters:** Variadic list of tag strings.
*   **Returns:** Nothing.

### `SetOnPreHitFn(fn)`
*   **Description:** Registers a callback invoked just before target interaction logic runs.
*   **Parameters:** `fn` (function) - function signature: `fn(inst, doer, target)`.
*   **Returns:** Nothing.

### `SetOnHitFn(fn)`
*   **Description:** Registers a callback invoked after a successful interaction (work, pick, or combat hit).
*   **Parameters:** `fn` (function) - function signature: `fn(inst, doer, target)`.
*   **Returns:** Nothing.

### `SetOnMissFn(fn)`
*   **Description:** Registers a callback invoked when no target interaction occurs.
*   **Parameters:** `fn` (function) - function signature: `fn(inst, doer, target)`.
*   **Returns:** Nothing.

### `OnHit(doer, target)`
*   **Description:** Executes the core hit logic: tries to destroy a workable, pick a pickable, or attack a combat target. Calls the appropriate `onhitfn` or `onmissfn` based on outcome.
*   **Parameters:**
    * `doer` (entity) - the entity performing the action.
    * `target` (entity) - the entity being hit.
*   **Returns:** Nothing.
*   **Error states:** Will skip interaction if the target has any tag in `notags`, if `canpick` is `nil` and the target is pickable, or if combat targeting rules fail.

### `OnToss(doer, target, sourceposition, basespeed, startradius)`
*   **Description:** Applies physical tossing physics to the target upon impact, used for thrown objects (e.g., rocks). Deactivates mines, skips bouncing if `nobounce`, and attempts to find a valid landing position.
*   **Parameters:**
    * `doer` (entity) - entity that threw the object.
    * `target` (entity) - the thrown object entity.
    * `sourceposition` (Vector3 or nil) - starting position; uses `doer`'s position if `nil`.
    * `basespeed` (number or nil) - base forward speed; actual speed varies randomly.
    * `startradius` (number or nil) - minimum distance offset; computed from physics radii if `nil`.
*   **Returns:** Nothing.

## Events & listeners
None identified.

