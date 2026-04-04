---
id: aoeweapon_base
title: Aoeweapon Base
description: Provides area-of-effect weapon functionality with configurable targeting, damage, and interaction callbacks.
tags: [combat, weapon, targeting, workable]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: bd3f5de8
system_scope: combat
---

# Aoeweapon Base

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`Aoeweapon_Base` is a component that provides area-of-effect weapon functionality for entities. It handles targeting logic for three interaction types: workable objects (chopping, mining, digging), pickable items (harvesting), and combat targets (attacking enemies). The component supports configurable damage values, tag-based filtering for valid targets, and callback functions for hit/miss events. It is commonly used as a base for throwable weapons, traps, or AOE attack abilities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("aoeweapon_base")
inst.components.aoeweapon_base:SetDamage(25)
inst.components.aoeweapon_base:SetWorkActions(ACTIONS.CHOP, ACTIONS.MINE)
inst.components.aoeweapon_base:SetOnHitFn(function(inst, doer, target)
    print("Hit target: "..tostring(target))
end)
```

## Dependencies & tags
**Components used:** `combat`, `workable`, `pickable`, `mine`, `spawner`, `childspawner`, `inventoryitem`, `physics`
**Tags:** Default tags include `_combat`, `pickable`, `NPC_workable`. Excludes `FX`, `DECOR`, `INLIMBO`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `damage` | number | `10` | Base damage value dealt to combat targets. |
| `tags` | table | `{"_combat", "pickable", "NPC_workable"}` | Entity tags to include in targeting. |
| `notags` | table | `{"FX", "DECOR", "INLIMBO"}` | Entity tags to exclude from targeting. |
| `workactions` | table | `nil` | Map of work action types this weapon can perform. |
| `combinedtags` | table | `nil` | Internally computed union of tags and work action tags. |
| `stimuli` | any | `nil` | Combat stimuli data passed during attacks. |
| `onprehitfn` | function | `nil` | Callback fired before hit resolution. |
| `onhitfn` | function | `nil` | Callback fired on successful hit. |
| `onmissfn` | function | `nil` | Callback fired when hit fails. |
| `canpick` | boolean | `nil` | Whether this weapon can pick pickable entities. |

## Main functions
### `SetDamage(dmg)`
*   **Description:** Sets the base damage value for combat attacks.
*   **Parameters:** `dmg` (number) - damage value to apply.
*   **Returns:** Nothing.

### `SetStimuli(stimuli)`
*   **Description:** Sets the stimuli data passed to combat attacks.
*   **Parameters:** `stimuli` (any) - stimuli table or value for combat system.
*   **Returns:** Nothing.

### `SetWorkActions(...)`
*   **Description:** Configures which work actions this weapon can perform on workable entities.
*   **Parameters:** Variable arguments of action types (e.g., `ACTIONS.CHOP`, `ACTIONS.MINE`).
*   **Returns:** Nothing.
*   **Error states:** Rebuilds `combinedtags` internally after setting work actions.

### `SetTags(...)`
*   **Description:** Sets entity tags to include in targeting filter.
*   **Parameters:** Variable arguments of tag strings.
*   **Returns:** Nothing.
*   **Error states:** Rebuilds `combinedtags` internally after setting tags.

### `SetNoTags(...)`
*   **Description:** Sets entity tags to exclude from targeting filter.
*   **Parameters:** Variable arguments of tag strings to exclude.
*   **Returns:** Nothing.

### `SetOnPreHitFn(fn)`
*   **Description:** Registers callback function to execute before hit resolution.
*   **Parameters:** `fn` (function) - callback with signature `(inst, doer, target)`.
*   **Returns:** Nothing.

### `SetOnHitFn(fn)`
*   **Description:** Registers callback function to execute on successful hit.
*   **Parameters:** `fn` (function) - callback with signature `(inst, doer, target)`.
*   **Returns:** Nothing.

### `SetOnMissFn(fn)`
*   **Description:** Registers callback function to execute when hit fails.
*   **Parameters:** `fn` (function) - callback with signature `(inst, doer, target)`.
*   **Returns:** Nothing.

### `OnHit(doer, target)`
*   **Description:** Main hit resolution logic. Determines if target is workable, pickable, or combat-valid, then performs appropriate action.
*   **Parameters:** `doer` (entity) - the entity performing the hit. `target` (entity) - the entity being hit.
*   **Returns:** Nothing.
*   **Error states:** Workable destruction skips spawner/childspawner entities for DIG action. Pickable items do not pass doer to avoid loot pocketing. Combat requires `CanTarget` and non-ally status.

### `OnToss(doer, target, sourceposition, basespeed, startradius)`
*   **Description:** Handles physics-based tossing/throwing of a target entity. Deactivates mines, calculates trajectory, and applies velocity.
*   **Parameters:** `doer` (entity) - throwing entity. `target` (entity) - entity to toss. `sourceposition` (Vector3 or nil) - starting position. `basespeed` (number or nil) - base velocity magnitude. `startradius` (number or nil) - starting radius offset.
*   **Returns:** Nothing.
*   **Error states:** Skips toss if target lacks physics or has `nobounce` inventory flag. Adjusts angle if initial trajectory hits blocked ground.

## Events & listeners
None identified. This component does not register event listeners or push events directly. Callbacks are invoked via function references set through `SetOnPreHitFn`, `SetOnHitFn`, and `SetOnMissFn`.