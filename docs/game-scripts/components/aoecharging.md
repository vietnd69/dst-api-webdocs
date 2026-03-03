---
id: aoecharging
title: Aoecharging
description: Manages the state and visual feedback for a charging area-of-effect attack, synchronizing charge progress and owner tracking across networked clients.
tags: [combat, network, ui, player]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d6999c24
system_scope: combat
---

# Aoecharging

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AOECharging` manages the charging process and visual reticule for area-of-effect (AOE) attacks in Don't Starve Together. It tracks charge state via `ischarging`, `enabled`, and `chargeticks` networked properties, and coordinates the spawn/update of the `ChargingReticule` prefab when a player begins charging. The component operates differently on server (`ismastersim`) and client, handling synchronization, input polling, and event handling for the charging lifecycle.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("aoecharging")
inst.components.aoecharging.reticuleprefab = "my_reticule"
inst.components.aoecharging.pingprefab = "my_ping"
inst.components.aoecharging:SetAllowRiding(false)
inst.components.aoecharging:SetRefreshChargeTicksFn(function(self, reticule, ticks)
    reticule:SetChargeTicks(ticks)
end)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `equippable`, `playercontroller`, `chargingreticule`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component belongs to. |
| `ismastersim` | `boolean` | — | Whether this instance is running on the master simulation (server). |
| `reticuleprefab` | `string?` | `nil` | Prefab name for the reticule to spawn. |
| `pingprefab` | `string?` | `nil` | Prefab name for the charge-release ping effect. |
| `reticule` | `Entity?` | `nil` | Reference to the active `ChargingReticule` entity, if spawned. |
| `owner` | `Entity?` | `nil` | The player entity currently charging the attack. |
| `allowriding` | `boolean` | `true` | Whether charging is allowed while riding. |
| `enabled` | `net_bool` | `true` | Networked property controlling whether charging is enabled. |
| `ischarging` | `net_bool` | — | Networked property indicating if charging is active. |
| `chargeticks` | `net_byte` | — | Networked property tracking charge duration in ticks. |
| `syncdelay` | `number` | `0` (server), not used (client) | Delay counter before sending full sync on server. |
| `refreshchargeticksfn` | `function?` | `nil` | Callback when charge ticks are updated. |
| `onchargedattackfn` | `function?` | `nil` | Server-only callback when a charged attack is released. |

## Main functions
### `OnRemoveEntity()`
* **Description:** Cleans up when the owner entity is removed. Cancels any active charge and removes the reticule.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetAllowRiding(val)`
* **Description:** Sets whether charging is allowed while the owner is riding another entity.
* **Parameters:** `val` (boolean) — if `false`, riding while charging is disallowed; otherwise allowed.
* **Returns:** Nothing.

### `IsEnabled()`
* **Description:** Returns whether the charging system is currently enabled for this item.
* **Parameters:** None.
* **Returns:** `boolean` — current value of the `enabled` networked property.

### `GetChargeTicks()`
* **Description:** Returns the current number of charge ticks.
* **Parameters:** None.
* **Returns:** `number` — current `chargeticks` value.

### `SetRefreshChargeTicksFn(fn)`
* **Description:** Sets a callback function used to propagate charge tick updates to the reticule.
* **Parameters:** `fn` (function) — signature `fn(inst, reticule, chargeticks)`.
* **Returns:** Nothing.

### `OnRefreshChargeTicks(reticule)`
* **Description:** Invokes the `refreshchargeticksfn` callback (if set) to notify subscribers of a charge tick update.
* **Parameters:** `reticule` (Entity) — the reticule entity to update.
* **Returns:** Nothing.

### `SetChargingOwner(owner)`
* **Description:** Starts or stops the charging process for a given owner. Spawns or destroys the reticule and manages server/client state.
* **Parameters:** `owner` (`Entity?`) — player entity to begin charging as, or `nil` to cancel.
* **Returns:** Nothing.
* **Error states:** If the `owner` lacks `HUD` or `reticuleprefab` is `nil`, no reticule is spawned.

### `OnUpdate(dt)`
* **Description:** Called each frame while charging. Validates ownership, updates charge ticks, handles input, updates rotation, and triggers release on input release.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.
* **Error states:** Exits early if owner is no longer valid (not equipped, no longer owner, or SG tag lost).

### `UpdateRotation()`
* **Description:** Syncs the reticule's rotation to the owner's transform and, on clients, sends the rotation to the server.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetEnabled(enabled)`
* **Description:** (Server only) Sets the `enabled` state and triggers dirty event.
* **Parameters:** `enabled` (boolean).
* **Returns:** Nothing.

### `SetChargeTicks(ticks)`
* **Description:** (Server only, for debugging/overrides) Manually sets the charge tick count during an active charge.
* **Parameters:** `ticks` (number).
* **Returns:** Nothing.

### `SetOnChargedAttackFn(fn)`
* **Description:** (Server only) Sets the callback executed when a charged attack is released.
* **Parameters:** `fn` (function) — signature `fn(item, doer, chargeticks)`.
* **Returns:** Nothing.

### `ReleaseChargedAttack(doer, chargeticks)`
* **Description:** (Server only) Triggers the `onchargedattackfn` callback for the charged attack.
* **Parameters:**  
  - `doer` (Entity) — the entity performing the attack (typically the `owner`).  
  - `chargeticks` (number) — final tick count at release time.
* **Returns:** Nothing.

## Events & listeners
- **Listens to (client only):**  
  - `enableddirty` — handled by `OnEnabledDirty` to cancel charge if disabled.  
  - `ischargingdirty` — handled by `OnIsCharging` to link owner if local player charges.  
  - `chargeticksdirty` — handled by `OnChargeTicksDirty` to refresh reticule ticks.  
- **Pushes:** None (does not fire custom events internally; relies on owner’s stategraph to push `"chargingreticulereleased"` or `"chargingreticulecancelled"`).
