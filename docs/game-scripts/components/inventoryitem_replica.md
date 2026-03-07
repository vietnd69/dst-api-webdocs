---
id: inventoryitem_replica
title: Inventoryitem Replica
description: Manages network-replicated properties and synchronization of inventory items between server and client, including pickup restrictions, deploy modes, weapon stats, and usage state serialization.
tags: [inventory, network, client, server]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ac239c51
system_scope: network
---

# Inventoryitem Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Inventoryitem_replica` is a network-aware component that mirrors and exposes certain runtime properties of `inventoryitem` to the client. It does not manage game logic directly, but instead synchronizes state (e.g., "is wet", "deploy mode", "attack range") from the server to the client via the `classified` child entity and net_bool/net_hash properties. It is primarily used on the client to query server-held item state when the server-side component (e.g., `deployable`, `weapon`, `equippable`) is not locally attached.

## Usage example
```lua
-- On the server, attach and configure the component for an item prefab
inst:AddComponent("inventoryitem_replica")
if inst.components.weapon then
    inst.components.inventoryitem_replica:SetAttackRange(inst.components.weapon.attackrange)
end

-- On the client, query deployability or weapon stats
if item.replica.inventoryitem:IsDeployable(player) then
    -- ...
end
local range = item.replica.inventoryitem:AttackRange()
```

## Dependencies & tags
**Components used:** `inventoryitem`, `deployable`, `weapon`, `equippable`, `saddler`, `armor`, `finiteuses`, `fueled`, `perishable`, `rechargeable`, `inventoryitemmoisture`, `container`  
**Tags:** Checks `spider`, `spiderwhisperer`; uses `complexprojectile`, `boatbuilder`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `._cannotbepickedup` | `net_bool` | `false` | Controls whether the item can be picked up by players. |
| `._iswet` | `net_bool` | `false` | Networked wetness state of the item. |
| `._isacidsizzling` | `net_bool` | `false` | Networked acid-sizzle state. |
| `._grabbableoverridetag` | `net_hash` | `0` | Custom tag override allowing specific players to pick up the item. |
| `classified` | `Prefab` or `nil` | `SpawnPrefab("inventoryitem_classified")` | Client-side serialized state container (server only); holds replicated values like image, attack range, deploy mode. |

## Main functions
### `SetCanBePickedUp(canbepickedup)`
*   **Description:** Sets whether the item can be picked up by players. Internally inverts the value and sets the `_cannotbepickedup` net_bool.
*   **Parameters:** `canbepickedup` (boolean) — `true` if the item should be pick-uppable.
*   **Returns:** Nothing.

### `CanBePickedUp(doer)`
*   **Description:** Checks whether the item can be picked up by the specified entity, honoring grabbable override tags and spider-spiderwhisperer restrictions.
*   **Parameters:** `doer` (entity or `nil`) — The entity attempting to pick up the item.
*   **Returns:** `true` if the item is pick-uppable; otherwise `false`.
*   **Error states:** Returns `false` if `doer` is a spider and does not have the `spiderwhisperer` tag.

### `SetDeployMode(deploymode)`
*   **Description:** Sets the deploy mode (e.g., `DEPLOYMODE.DEFAULT`, `DEPLOYMODE.WATER`) for networked display and remote checks.
*   **Parameters:** `deploymode` (number, from `DEPLOYMODE` enum) — The deployment mode to serialize.
*   **Returns:** Nothing.

### `GetDeployMode()`
*   **Description:** Returns the effective deploy mode. Prioritizes the local `deployable` component; falls back to the networked value.
*   **Parameters:** None.
*   **Returns:** `number` — One of the `DEPLOYMODE` constants, or `DEPLOYMODE.NONE` if neither is available.

### `IsDeployable(deployer)`
*   **Description:** Determines if the item can be deployed by the given entity, respecting tag restrictions and mount/floating state.
*   **Parameters:** `deployer` (entity or `nil`) — The entity attempting deployment.
*   **Returns:** `true` if deployable; `false` otherwise.

### `CanDeploy(pt, mouseover, deployer, rot)`
*   **Description:** Checks placement validity at a given world point for deployment, forwarding to `deployable` if present or replicating its logic client-side.
*   **Parameters:**  
  - `pt` (`Vector3`) — Position to check.  
  - `mouseover` (entity or `nil`) — Optional interacted entity.  
  - `deployer` (entity or `nil`) — Deploying entity.  
  - `rot` (number or `nil`) — Rotation of placement.
*   **Returns:** `true` if placement is valid at `pt`; `false` otherwise.

### `SetAttackRange(attackrange)`
*   **Description:** Sets the weapon’s attack range for networked clients.
*   **Parameters:** `attackrange` (number or `nil`) — The range in world units.
*   **Returns:** Nothing.

### `AttackRange()`
*   **Description:** Returns the effective attack range of the item. Prioritizes `weapon` component; falls back to networked value.
*   **Parameters:** None.
*   **Returns:** `number` — Attack range (≥ 0), or `0` if not a weapon.

### `IsWeapon()`
*   **Description:** Determines if the item behaves as a weapon (i.e., has a `weapon` component or valid attack range).
*   **Parameters:** None.
*   **Returns:** `true` if weapon-like; `false` otherwise.

### `SetWalkSpeedMult(walkspeedmult)`
*   **Description:** Sets the walk speed multiplier (as a scaled integer, range 0–255, max 2 decimal precision). Used by equippable/saddler items to affect movement.
*   **Parameters:** `walkspeedmult` (number or `nil`) — Speed multiplier (e.g., `0.75`). Must be within `0 ≤ value ≤ 2.55` and precise to ≤ `0.01`.
*   **Returns:** Nothing.
*   **Error states:** Asserts if out of range or excessive precision.

### `GetWalkSpeedMult()`
*   **Description:** Returns the effective walk speed multiplier. Prioritizes `equippable` component; falls back to networked value.
*   **Parameters:** None.
*   **Returns:** `number` — Speed multiplier (e.g., `1.0` for normal speed).

### `SetIsWet(iswet)`
*   **Description:** Sets the item’s wet state and broadcasts `"wetnesschange"` event.
*   **Parameters:** `iswet` (boolean).
*   **Returns:** Nothing.

### `IsWet()`
*   **Description:** Returns the current wetness state.
*   **Parameters:** None.
*   **Returns:** `true` if wet; `false` otherwise.

### `SetMoistureLevel(moisture)`
*   **Description:** Sets the raw moisture value (client-side only; server uses `inventoryitemmoisture`).
*   **Parameters:** `moisture` (number).
*   **Returns:** Nothing.

### `GetMoisture()`
*   **Description:** Returns the current moisture level from `inventoryitemmoisture` or networked value.
*   **Parameters:** None.
*   **Returns:** `number` — Absolute moisture value.

### `GetMoisturePercent()`
*   **Description:** Returns moisture as a fraction of `TUNING.MAX_WETNESS`.
*   **Parameters:** None.
*   **Returns:** `number` — Moisture percentage (`0.0` to `1.0`).

### `SerializeUsage()`
*   **Description:** Serializes usage state (percent used, perish, recharge) from local components into the `classified` entity.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Skips components not attached to the item.

## Events & listeners
- **Listens to:**  
  - `"percentusedchange"` — Updates `classified`’s percent used.  
  - `"perishchange"` — Updates `classified`’s perish state.  
  - `"forceperishchange"` — Forces perish state update.  
  - `"rechargechange"` — Updates recharge percent and overtime.  
  - `"onremove"` — Triggers `ondetachclassified` to clean up `classified` entity.  
- **Pushes:**  
  - `"wetnesschange"` — Fired when wetness changes.  
  - `"acidsizzlingchange"` — Fired when acid sizzle state changes.  
  - `"rechargetimechange"` — Fired when charge time is updated.  
  - `"imagechange"` — Fired when `OverrideImage` is called.
