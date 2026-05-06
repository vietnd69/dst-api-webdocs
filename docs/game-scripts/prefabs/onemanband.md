---
id: onemanband
title: Onemanband
description: Wearable musical armor prefab that provides dapperness bonuses, summons follower minions, consumes fuel over time, and can be haunted to activate follower effects.
tags: [prefab, armor, wearable, musical]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 3e626b95
system_scope: entity
---

# Onemanband

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`onemanband.lua` registers a wearable armor prefab that combines equipment, fuel consumption, and follower management mechanics. The prefab attaches multiple components to enable equipping to the body slot, gradual fuel depletion, sanity aura calculation based on followers, and ghost haunting interactions. The `fn()` constructor builds the entity on both client and master, with gameplay components attached only on the master simulation.

## Usage example
```lua
-- Spawn at world origin:
local inst = SpawnPrefab("onemanband")
inst.Transform:SetPosition(0, 0, 0)

-- Equip to a player:
player.components.inventory:GiveItem(inst)
-- Item will auto-equip to BODY slot if slot is available
```

## Dependencies & tags
**External dependencies:**
- `MakeInventoryPhysics` -- applies physics and floatable behavior for inventory items

**Components used:**
- `inspectable` -- enables player inspection text
- `inventoryitem` -- enables carrying in inventory; configured to sink in water
- `fueled` -- manages fuel consumption over time; uses ONEMANBAND fuel type
- `equippable` -- enables equipping to BODY slot; calculates dapperness based on followers
- `shadowlevel` -- sets shadow creature aggression level
- `leader` -- enables follower tracking; CalcDapperness uses owner's leader component (not inst's), inst's leader component integrates with leaderrollcall
- `leaderrollcall` -- manages summoned minion followers; enables/disables on equip and haunt
- `hauntable` -- enables ghost haunting; activates followers when haunted

**Tags:**
- `band` -- added in fn() for entity identification
- `shadowlevel` -- added in fn() for shadow creature optimization

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | `{Asset("ANIM", "anim/armor_onemanband.zip")}` | Array of asset entries loaded with this prefab. |
| `inst.foleysound` | string | `"dontstarve/wilson/onemanband"` | Sound path played periodically while haunted. |
| `TUNING.ONEMANBAND_PERISHTIME` | constant | --- | Fuel duration in seconds before the item is depleted and removed. |
| `TUNING.ONEMANBAND_SHADOW_LEVEL` | constant | --- | Default shadow creature aggression level applied to shadowlevel component. |
| `TUNING.ONEMANBAND_RANGE` | constant | --- | Radius in units for leaderrollcall follower management. |
| `TUNING.ONEMANBAND_MAXFOLLOWERS` | constant | --- | Maximum number of minions the leaderrollcall can maintain. |
| `TUNING.HAUNT_SMALL` | constant | --- | Haunt value for hauntable component success rate. |
| `TUNING.DAPPERNESS_SMALL` | constant | --- | Base dapperness penalty applied when equipped. |
| `TUNING.SANITYAURA_SMALL` | constant | --- | Sanity aura multiplier per follower exceeding pet count. |

## Main functions
### `fn()`
* **Description:** Prefab constructor that builds the onemanband entity. Creates base entity components (Transform, AnimState, SoundEmitter, Network), applies inventory physics, sets animation bank/build, and attaches gameplay components on master only. Returns `inst` for framework processing.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host; master-only components guarded by `TheWorld.ismastersim` check.

### `CalcDapperness(inst, owner)` (local)
* **Description:** Calculates the dapperness (sanity aura) value when equipped. Returns negative sanity aura based on the difference between follower count and pet count. More followers than pets results in greater sanity drain.
* **Parameters:**
  - `inst` -- unused (equippable component passes only owner to dapperfn callback)
  - `owner` -- player entity wearing the item
* **Returns:** number -- negative sanity aura value (e.g., `-25` base minus follower penalty)
* **Error states:** Errors if `owner` is nil (no guard before `owner.components` access). Component accesses for `leader` and `petleash` are nil-guarded.

### `onequip(inst, owner)` (local)
* **Description:** Callback fired when a player equips the onemanband. Overrides the player's body animation symbol to display the armor, starts fuel consumption, and enables the leaderrollcall to begin managing followers.
* **Parameters:**
  - `inst` -- onemanband entity instance
  - `owner` -- player entity equipping the item
* **Returns:** None
* **Error states:** Errors if `owner` has no `AnimState` (nil dereference on `owner.AnimState` — no guard present). Errors if `inst` lacks `fueled` or `leaderrollcall` components.

### `onunequip(inst, owner)` (local)
* **Description:** Callback fired when a player unequips the onemanband. Clears the body animation symbol override, stops fuel consumption, and disables the leaderrollcall to stop managing followers.
* **Parameters:**
  - `inst` -- onemanband entity instance
  - `owner` -- player entity unequipping the item
* **Returns:** None
* **Error states:** Errors if `owner` has no `AnimState` (nil dereference on `owner.AnimState` — no guard present). Errors if `inst` lacks `fueled` or `leaderrollcall` components.

### `onequiptomodel(inst, owner)` (local)
* **Description:** Callback fired when the onemanband is equipped to a player model (e.g., in loadout screens). Stops fuel consumption and disables leaderrollcall since the item is not actively equipped in-game.
* **Parameters:**
  - `inst` -- onemanband entity instance
  - `owner` -- player entity
* **Returns:** None
* **Error states:** Errors if `inst` lacks `fueled` or `leaderrollcall` components.

### `OnHaunt(inst)` (local)
* **Description:** Callback fired when a ghost successfully haunts the onemanband. Enables the leaderrollcall to activate followers and starts a periodic task that plays foley sounds every 0.3 seconds. Returns `true` to indicate successful haunt.
* **Parameters:** `inst` -- onemanband entity instance
* **Returns:** `true` -- indicates successful haunt to hauntable component
* **Error states:** Errors if `inst` lacks `leaderrollcall` component.

### `OnUnHaunt(inst)` (local)
* **Description:** Callback fired when the haunt effect ends. Disables the leaderrollcall and cancels the periodic foley sound task.
* **Parameters:** `inst` -- onemanband entity instance
* **Returns:** None
* **Error states:** Errors if `inst` lacks `leaderrollcall` component or if `inst.hauntsfxtask` is nil when attempting to cancel.

### `OnPutInInventoryFn(inst)` (local)
* **Description:** Callback fired when the onemanband is placed into a player's inventory. Checks if the item is currently haunted and stops the haunt effect if so, ensuring haunt state does not persist while stored.
* **Parameters:** `inst` -- onemanband entity instance
* **Returns:** None
* **Error states:** Errors if `inst` lacks `hauntable` component.

### `haunt_foley_delayed(inst)` (local)
* **Description:** Periodic callback that plays the foley sound effect while the onemanband is haunted. Called every 0.3 seconds by the hauntsfxtask periodic task.
* **Parameters:** `inst` -- onemanband entity instance
* **Returns:** None
* **Error states:** Errors if `inst` lacks `SoundEmitter` component or if `inst.foleysound` is nil.

## Events & listeners
- **Listens to:** None identified — callbacks are registered via component setter methods, not `ListenForEvent`.
- **Pushes:** None identified — no `PushEvent` calls in source.