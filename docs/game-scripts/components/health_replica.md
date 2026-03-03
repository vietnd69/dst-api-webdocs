---
id: health_replica
title: Health Replica
description: Manages network-synchronized health state for player entities, mirroring properties from the master-side Health component for client-side UI and logic.
tags: [network, player, health, replication]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4d450d0c
system_scope: network
---

# Health Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`health_replica` is a client-side component that replicates health-related properties from the server (via `player_classified`) to keep client logic and UI synchronized. It provides a consistent interface for querying health state (e.g., `GetCurrent`, `GetPercent`, `IsHurt`) regardless of whether the local instance has direct access to the full `health` component—ideal for UI threads or early initialization states. It does not perform combat logic itself but acts as a read/write proxy to the `player_classified` table over the network.

## Usage example
```lua
local inst = TheSim:GetPlayerEntity()
if inst and inst.components.health_replica then
    local hp = inst.components.health_replica
    print("Current HP:", hp:GetCurrent())
    print("Max HP (with penalty):", hp:MaxWithPenalty())
    print("Health %:", hp:GetPercent() * 100)
    print("Is dead?", hp:IsDead())
end
```

## Dependencies & tags
**Components used:** None directly (relies on `player_classified` and optionally `health` on master).  
**Tags:** Adds/Removes `isdead` and `cannotheal`, `cannotmurder` via `SetIsDead`, `SetCanHeal`, `SetCanMurder`.  
**Related components:** `health` (primary counterpart on master sim).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `classified` | `player_classified` table (or `nil`) | `nil` | Reference to the network-synchronized classified data on non-master clients. |
| `ondetachclassified` | function | `nil` | Internal callback to handle detachment from `classified` on entity removal. |

## Main functions
### `SetCurrent(current)`
* **Description:** Sets the current health value on the `classified` data, which is synced to clients.
* **Parameters:** `current` (number) - the new current health value.
* **Returns:** Nothing.
* **Error states:** No-op if `classified` is `nil`.

### `SetMax(max)`
* **Description:** Sets the max health value on the `classified` data for replication.
* **Parameters:** `max` (number) - the new max health value.
* **Returns:** Nothing.
* **Error states:** No-op if `classified` is `nil`.

### `SetPenalty(penalty)`
* **Description:** Sets the health penalty (reduction to effective max health) as an integer scaled by 200 (e.g., `0.15` → `30`), used by `classified.healthpenalty`.
* **Parameters:** `penalty` (number) - a value between `0` and `1` (inclusive).
* **Returns:** Nothing.
* **Error states:** Raises an assertion error if `penalty` is outside `[0, 1]`. No-op if `classified` is `nil`.

### `Max()`
* **Description:** Returns the max health, preferring the live `health` component if present (e.g., on master sim), otherwise reading from `classified.maxhealth`.
* **Parameters:** None.
* **Returns:** number - the max health value (default `100` if neither source is available).

### `MaxWithPenalty()`
* **Description:** Returns the max health adjusted for current penalty, using the same priority order as `Max`.
* **Parameters:** None.
* **Returns:** number - effective max health after penalty.

### `GetPercent()`
* **Description:** Returns health as a decimal fraction (`0.0` to `1.0`) of max health, using live or replicated values.
* **Parameters:** None.
* **Returns:** number - health percentage.

### `GetCurrent()`
* **Description:** Returns the current health value.
* **Parameters:** None.
* **Returns:** number - current health.

### `GetPenaltyPercent()`
* **Description:** Returns the health penalty as a fraction (`0.0` to `1.0`).
* **Parameters:** None.
* **Returns:** number - penalty percentage.

### `IsHurt()`
* **Description:** Returns `true` if current health is less than max health *with penalty*.
* **Parameters:** None.
* **Returns:** boolean.

### `SetIsDead(isdead)`
* **Description:** Adds or removes the `isdead` tag based on the `isdead` flag.
* **Parameters:** `isdead` (boolean) - whether the entity is dead.
* **Returns:** Nothing.

### `IsDead()`
* **Description:** Returns `true` if the entity has the `isdead` tag.
* **Parameters:** None.
* **Returns:** boolean.

### `SetIsTakingFireDamage(istakingfiredamage)`
* **Description:** Updates the `istakingfiredamage` field in `classified`, used for fire-related UI effects.
* **Parameters:** `istakingfiredamage` (boolean).
* **Returns:** Nothing.
* **Error states:** No-op if `classified` is `nil`.

### `IsTakingFireDamage()`
* **Description:** Returns whether the entity is currently taking fire damage (from any source).
* **Parameters:** None.
* **Returns:** boolean.

### `SetIsTakingFireDamageLow(istakingfiredamagelow)`
* **Description:** Updates the `istakingfiredamagelow` field in `classified`, indicating low-intensity fire damage.
* **Parameters:** `istakingfiredamagelow` (boolean).
* **Returns:** Nothing.
* **Error states:** No-op if `classified` is `nil`.

### `IsTakingFireDamageLow()`
* **Description:** Returns whether the entity is taking low-intensity fire damage.
* **Parameters:** None.
* **Returns:** boolean.

### `IsTakingFireDamageFull()`
* **Description:** Returns `true` if taking full-intensity fire damage (fire active *and not* low intensity).
* **Parameters:** None.
* **Returns:** boolean.

### `SetLunarBurnFlags(flags)`
* **Description:** Sets the lunar burn flags bitmask in `classified`, used for lunar eclipse effects.
* **Parameters:** `flags` (number) - bitmask of lunar burn states.
* **Returns:** Nothing.
* **Error states:** No-op if `classified` is `nil`.

### `GetLunarBurnFlags()`
* **Description:** Returns the current lunar burn flags, using `health` component if available, otherwise from `classified`.
* **Parameters:** None.
* **Returns:** number - bitmask of flags (default `0`).

### `SetCanHeal(canheal)`
* **Description:** Controls whether the entity can heal naturally or via healing items.
* **Parameters:** `canheal` (boolean).
* **Returns:** Nothing.

### `CanHeal()`
* **Description:** Returns `true` if the entity is not flagged with `cannotheal`.
* **Parameters:** None.
* **Returns:** boolean.

### `SetCanMurder(canmurder)`
* **Description:** Controls whether the entity can perform murder-related actions (e.g., kill other players).
* **Parameters:** `canmurder` (boolean).
* **Returns:** Nothing.

### `CanMurder()`
* **Description:** Returns `true` if the entity is not flagged with `cannotmurder`.
* **Parameters:** None.
* **Returns:** boolean.

## Events & listeners
- **Listens to:** `onremove` on the `classified` entity — triggers internal cleanup via `DetachClassified()` when the classified object is removed.
- **Pushes:** No events directly. Events are typically emitted by the associated `health` component on master sim; this replica reflects state changes.
