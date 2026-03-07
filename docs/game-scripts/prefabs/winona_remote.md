---
id: winona_remote
title: Winona Remote
description: Manages spell selection, deployment targeting, and battery-powered operations for Winona's engineer remote gadget, including circuit connections, charging logic, and elemental ability validation.
tags: [engineering, combat, inventory, network, equipment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8f879db8
system_scope: inventory
---

# Winona Remote

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`winona_remote` is a craftable item prefab that enables Winona to activate and control multiple engineering devices (catapults) from a distance. It implements a full spellbook UI with four distinct spells (Volley, Boost, Wakeup, Elemental Volley), integrates with the AOE targeting system for placement and ping feedback, and manages battery charging via circuit connections. The component orchestrates interdependent logic across `spellbook`, `aoetargeting`, `fueled`, `circuitnode`, `colouradder`, `powerload`, and `updatelooper` components to provide persistent, synchronized behavior across server and client.

## Usage example
```lua
local remote = SpawnPrefab("winona_remote")
remote:AddComponent("engineerremote") -- Hypothetical usage; in practice, the prefab is self-contained
remote.components.fueled:DoDelta(-TUNING.WINONA_REMOTE_COST)
remote.components.circuitnode:ConnectTo("engineeringbattery")
remote:AddBatteryPower(5.0)
```

## Dependencies & tags
**Components used:**  
- `aoespell` (via `inst.components.aoespell:SetSpellFn(...)`)  
- `aoetargeting` (via `SetAllowWater`, `SetDeployRadius`, `SetRange`, `SetShouldRepeatCastFn`, `SetTargetFX`, `reticule`)  
- `circuitnode` (via `ConnectTo`, `Disconnect`, `ForEachNode`, `IsConnected`, `IsEnabled`, `SetFootprint`, `SetOnConnectFn`, `SetOnDisconnectFn`, `SetRange`, `connectsacrossplatforms`, `rangeincludesfootprint`)  
- `colouradder` (via `PopColour`, `PushColour`)  
- `fueled` (via `DoDelta`, `InitializeFuelLevel`, `IsEmpty`, `IsFull`, `SetUpdateFn`, `StartConsuming`, `StopConsuming`, `fueltype`, `rate`)  
- `inventoryitem` (via `SetOnDroppedFn`, `SetOnPutInInventoryFn`, `is_landed`, `IsHeld`)  
- `inspectable` (via `getstatus`)  
- `powerload` (via `SetLoad`)  
- `spellbook` (via `SetBgData`, `SetFocusRadius`, `SetItems`, `SetRadius`, `SetRequiredTag`, `SetSpellFn`, `SetSpellName`, `closesound`, `executesound`, `focussound`, `opensound`)  
- `updatelooper` (via `AddOnUpdateFn`, `RemoveOnUpdateFn`)  

**Tags:** Adds `remotecontrol`, `engineering`, `engineeringbatterypowered`. Checks `engineeringbattery`, `portableengineer`, `burnt`, `catapult`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_powertask` | task reference or nil | `nil` | Tracks pending charging task; used to cancel/override ongoing charge. |
| `_quickcharge` | boolean | `false` | Indicates whether quick charging skill is active (affects recharge rate). |
| `_wired` | boolean or nil | `nil` | Internal state tracking whether the remote is currently connected to a circuit. |
| `_landed_owner` | entity reference or nil | `nil` | Stores the last owner when the item was dropped (used for indirect battery usage). |
| `_flash` | number or nil | `nil` | Temporary brightness accumulator used for spark FX animation. |
| `inst.AddBatteryPower` | function | defined in `fn` | Public helper to add battery power and toggle charging. |
| `inst.OnSave` | function | defined in `fn` | Serialization hook for power state and quickcharge flag. |
| `inst.OnLoad` | function | defined in `fn` | Deserialization hook; restores charging state and circuit nodes. |

## Main functions
### `AddBatteryPower(inst, power)`
*   **Description:** Initiates or resumes charging based on the current fuel level, using `SetCharging` to schedule a charging task for `power` seconds.
*   **Parameters:**  
    - `power` (number) - Duration (in seconds) of charging to apply.  
*   **Returns:** Nothing. If the battery is already full, charging is stopped instead.

### `ForEachCatapult(inst, doer, pos, fn)`
*   **Description:** Searches for all catapults within `TUNING.WINONA_CATAPULT_MAX_RANGE` that are not `burnt`, then invokes `fn` on each valid catapult. Returns `true` if at least one `fn` call returned `true`.
*   **Parameters:**  
    - `inst` (entity) - The remote instance.  
    - `doer` (entity) - The user entity, passed to `fn`.  
    - `pos` (Vector3) - Target position for range checks.  
    - `fn` (function) - Callback `(inst, doer, pos, catapult) => boolean`.  
*   **Returns:** `true` if any `fn` invocation succeeded (returned `true`), else `false`.

### `VolleySpellFn(inst, doer, pos)`
*   **Description:** Validates battery fuel and catapult availability, then triggers `activewakeup` and `dovolley` events on each valid catapult. Consumes battery power on success.
*   **Parameters:**  
    - `doer` (entity) - The entity using the remote.  
    - `pos` (Vector3) - Target position for spell deployment.  
*   **Returns:** `{ true }` on success; `{ false, "NO_BATTERY" }` if empty; `{ false, "NO_CATAPULTS" }` if no catapults matched range criteria.

### `ElementalVolleySpellFn(inst, doer, pos)`
*   **Description:** Similar to `VolleySpellFn`, but first verifies that at least one connected battery contains the correct elemental charge (shadow, lunar, or hybrid), based on the user’s skill tree.
*   **Parameters:** Same as `VolleySpellFn`.  
*   **Returns:** `{ true }` on success; `{ false, "NO_BATTERY" }` or `{ false, "NO_CATAPULTS" }`.

### `WakeUpSpellFn(inst, doer, pos)`
*   **Description:** Triggers `activewakeup` on all nearby catapults to wake them without firing. Consumes fuel on success.
*   **Returns:** Same as `VolleySpellFn`.

### `BoostSpellFn(inst, doer, pos)`
*   **Description:** Triggers `activewakeup` followed by `catapultspeedboost` on all nearby catapults. Consumes fuel on success.
*   **Returns:** Same as `VolleySpellFn`.

### `GetSkillElement(user)`
*   **Description:** Evaluates the user’s skill tree to determine active elemental mastery: `"hybrid"` (both or neither), `"shadow"`, or `"lunar"`.
*   **Parameters:**  
    - `user` (entity) - The player using the remote.  
*   **Returns:** `"shadow"`, `"lunar"`, or `"hybrid"`.

## Events & listeners
- **Listens to:**  
  - `engineeringcircuitchanged` — Triggers `OnCircuitChanged` to notify all connected nodes.  
  - `on_no_longer_landed` — Triggers `OnNoLongerLanded`, disconnecting from batteries.  
  - `on_landed` — Triggers `OnLanded`, reconnecting to batteries if not held and not already connected.  
- **Pushes:** None directly, but `inst:PushEvent` is used internally (e.g., `activewakeup`, `dovolley`, `doelementalvolley`) on connected catapults during spell casts.