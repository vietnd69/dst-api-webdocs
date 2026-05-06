---
id: wx78_abilitycooldowns
title: Wx78 Abilitycooldowns
description: Manages cooldown timers for WX-78's upgrade abilities.
tags: [wx78, ability, cooldown]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: e3b1bc83
system_scope: entity
---

# Wx78 Abilitycooldowns

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Wx78_AbilityCooldowns` tracks active ability cooldowns for the WX-78 character. It manages cooldown entities (prefab `wx78_abilitycooldown`) that handle the actual timing and network replication. The component ensures only one cooldown per ability exists at a time and provides query methods for UI and logic checks. Modification methods are server-only; clients can query status via read-only methods.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wx78_abilitycooldowns")

-- Server: Start a cooldown for "overclock" ability
if TheWorld.ismastersim then
    inst.components.wx78_abilitycooldowns:RestartAbilityCooldown("overclock", 30)
end

-- Check cooldown status (client or server)
if inst.components.wx78_abilitycooldowns:IsInCooldown("overclock") then
    local percent = inst.components.wx78_abilitycooldowns:GetAbilityCooldownPercent("overclock")
    print("Cooldown progress: "..percent)
end
```

## Dependencies & tags
**External dependencies:**
- `TheWorld` -- checks `ismastersim` to gate server-only logic
- `SpawnPrefab` -- instantiates `wx78_abilitycooldown` entities for tracking

**Components used:**
- None identified

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The entity instance that owns this component. |
| `ismastersim` | boolean | --- | Caches `TheWorld.ismastersim`; gates server-only logic. |
| `cooldowns` | table | `{}` | Maps ability hash to active cooldown entity. |
| `_onremovecd` | function | --- | Callback triggered when a cooldown entity is removed; cleans up `cooldowns` table. |

## Main functions
### `IsInCooldown(abilityname)`
*   **Description:** Checks if a specific ability is currently on cooldown.
*   **Parameters:**
    - `abilityname` -- string ability name or number hash.
*   **Returns:** `true` if cooldown exists, `false` otherwise.
*   **Error states:** None.

### `GetAbilityCooldownPercent(abilityname)`
*   **Description:** Returns the completion percentage of an ability's cooldown.
*   **Parameters:**
    - `abilityname` -- string ability name or number hash.
*   **Returns:** Number between `0` and `1` (0% to 100%), or `nil` if no cooldown exists.
*   **Error states:** None.

### `RegisterAbilityCooldown(cd)`
*   **Description:** Registers a cooldown entity with the component. Starts listening for the entity's removal to clean up internal state.
*   **Parameters:**
    - `cd` -- cooldown entity instance (prefab `wx78_abilitycooldown`).
*   **Returns:** nil
*   **Error states:** Logs error if `cd:GetAbilityName()` returns `0` (invalid) or if the ability is already registered (duplicate). Does not crash, but state may be inconsistent if duplicates are forced.

### `RestartAbilityCooldown(abilityname, duration)`
*   **Description:** **Server only.** Starts or resets a cooldown for the specified ability. If a cooldown entity already exists, it restarts the timer. If not, it spawns a new `wx78_abilitycooldown` prefab.
*   **Parameters:**
    - `abilityname` -- string ability name or number hash.
    - `duration` -- number duration in seconds.
*   **Returns:** nil
*   **Error states:** No-op if called on client (`ismastersim` is false). Logs error if `abilityname` is invalid (hash `0`).

### `StopAbilityCooldown(abilityname)`
*   **Description:** **Server only.** Immediately stops and removes the cooldown entity for the specified ability.
*   **Parameters:**
    - `abilityname` -- string ability name or number hash.
*   **Returns:** nil
*   **Error states:** No-op if called on client (`ismastersim` is false).

### `GetDebugString()`
*   **Description:** Returns a formatted string listing all active cooldowns, their names, progress percentages, and durations. Used for console debugging.
*   **Parameters:** None
*   **Returns:** String or `nil` if no cooldowns are active.
*   **Error states:** None.

### `_onremovecd(cd)`
*   **Description:** **Internal callback.** Removes the cooldown entry from the `cooldowns` table when the associated cooldown entity is removed from the world. Validates the ability name before removal.
*   **Parameters:**
    - `cd` -- cooldown entity instance triggering the event.
*   **Returns:** nil
*   **Error states:** Logs error if `cd:GetAbilityName()` returns `0` or if the ability name is not found in `self.cooldowns`.

## Events & listeners
- **Listens to:** `onremove` (on cooldown entity `cd`) -- triggers `_onremovecd` to clean up the `cooldowns` table when a cooldown entity is removed.