---
id: beef_bell
title: Beef Bell
description: Defines the Beef Bell prefab that bonds players to beefalo for riding and control, with a shadow variant that can revive dead beefalo.
tags: [inventory, mount, beefalo]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: 12e26e32
system_scope: entity
---

# Beef Bell

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`beef_bell` is a prefab definition that creates two variants of the Beef Bell item: a regular bell and a shadow bell. The bell establishes a bond between a player and a beefalo, enabling riding and control mechanics. It manages inventory restrictions (one bell per player), visual states (bonded vs unbonded), and cleanup when the beefalo dies or the bond is broken. The shadow variant adds rechargeable mechanics and can revive dead beefalo at the cost of a debuff.

## Usage example
```lua
-- Spawn a regular beef bell
local bell = SpawnPrefab("beef_bell")
bell.components.useabletargeteditem:StartUsingItem(beefalo, player)

-- Spawn a shadow beef bell
local shadow_bell = SpawnPrefab("shadow_beef_bell")
shadow_bell.components.rechargeable:SetCharge(1)
shadow_bell:ReviveTarget(dead_beefalo, player)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `useabletargeteditem`, `leader`, `migrationpetowner`, `rechargeable` (shadow variant), `tradable` (shadow variant), `inspectable`, `floater`

**Tags:** Adds `bell`, `donotautopick`, `nobundling` (when bonded), `shadowbell` (shadow variant), `rechargeable` (shadow variant), `oncooldown` (shadow variant when discharged)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isbonded` | net_bool | `false` | Network variable tracking whether the bell is bonded to a beefalo. |
| `_sound` | string | varies | Sound path for bell ring effects. |
| `AnimState` | AnimState | - | Animation state configured with cowbell or shadow build. |

## Main functions
### `OnUsedOnBeefalo(inst, target, user)`
*   **Description:** Called when the bell is used on a beefalo target. Establishes the bond and updates visual state.
*   **Parameters:** `inst` (entity) - the bell instance, `target` (entity) - the beefalo, `user` (entity) - the player using the bell.
*   **Returns:** `successful` (boolean), `failreason` (string or nil) - success status and optional failure code.
*   **Error states:** Returns `false` if target lacks `SetBeefBellOwner`, if beefalo is dead, or if user already has a linked bell.

### `OnStopUsing(inst, beefalo)`
*   **Description:** Called when the bell bond is broken. Removes followers, cleans up visual state, and handles shadow beefalo erosion on death.
*   **Parameters:** `inst` (entity) - the bell instance, `beefalo` (entity or nil) - the linked beefalo.
*   **Returns:** Nothing.
*   **Error states:** If beefalo is nil, attempts to retrieve via `GetBeefalo()`.

### `CleanUpBell(inst)`
*   **Description:** Resets the bell to unbonded state, restores default visuals, and clears network variables.
*   **Parameters:** `inst` (entity) - the bell instance.
*   **Returns:** Nothing.

### `GetBeefalo(inst)`
*   **Description:** Retrieves the linked beefalo from the leader component's followers table.
*   **Parameters:** `inst` (entity) - the bell instance.
*   **Returns:** `beefalo` (entity or nil) - the first linked beefalo follower.

### `GetAliveBeefalo(inst)`
*   **Description:** Returns the linked beefalo only if it is alive. Used by migration pet owner component.
*   **Parameters:** `inst` (entity) - the bell instance.
*   **Returns:** `beefalo` (entity or nil) - alive beefalo or nil if dead/unlinked.

### `OnPutInInventory(inst, owner)`
*   **Description:** Called when the bell is picked up. Drops any other linked bell in the owner's inventory to enforce one-bell limit.
*   **Parameters:** `inst` (entity) - the bell instance, `owner` (entity) - the picking up entity.
*   **Returns:** Nothing.
*   **Error states:** Returns early if owner is nil or bell has no beefalo linked.

### `ShadowBell_ReviveTarget(inst, target, doer)`
*   **Description:** Shadow bell variant function. Revives a dead beefalo and applies a curse debuff to the player.
*   **Parameters:** `inst` (entity) - the shadow bell, `target` (entity) - the dead beefalo, `doer` (entity) - the player.
*   **Returns:** Nothing.
*   **Error states:** Only available on shadow bell variant.

### `OnSave(inst, data)`
*   **Description:** Serializes beefalo clothing and save record for persistence across save/load cycles.
*   **Parameters:** `inst` (entity) - the bell instance, `data` (table) - save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores the beefalo from save record and re-establishes the bond on world load.
*   **Parameters:** `inst` (entity) - the bell instance, `data` (table) - loaded save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `player_despawn` - triggers beefalo despawn handling when bonded player leaves.
- **Listens to:** `isbondeddirty` (shadow variant, client) - updates floater scale when bond state changes.
- **Listens to:** `dismounted` (conditional) - tracks rider dismount during beefalo despawn.
- **Pushes:** `despawn` (on beefalo) - triggers beefalo removal when bond breaks.
- **Pushes:** Various events through component systems (`inventoryitem`, `useabletargeteditem`, `rechargeable`).