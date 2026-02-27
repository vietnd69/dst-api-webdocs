---
id: health_replica
title: Health Replica
description: This component synchronizes and manages health-related state for player entities across server and client, especially for remote or classified instances.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 4d450d0c
---

# Health Replica

## Overview
The `Health` component serves as a network-aware health management system for player entities. It ensures health state (current/max health, penalty, fire damage status, lunar burn flags, etc.) is synchronized between the master simulation (server) and clients by delegating authoritative state to a `player_classified` component when present. On the master, it uses the local `player_classified`; on clients, it mirrors the same data via the classified replica, enabling consistent behavior across networked copies.

## Dependencies & Tags
- **Adds Tags:** `isdead`, `cannotheal`, `cannotmurder`
- **Listens For:** `"onremove"` event on `player_classified` to clean up `classified` reference
- **Component Usage Pattern:** Relies on the presence of a `player_classified` component (not added by this script itself)

## Properties
No public properties are initialized directly in `_ctor`. The component stores internal state via instance variables, primarily:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (none) | Reference to the entity this component is attached to |
| `classified` | `Component` or `nil` | `nil` | Reference to `player_classified` component (set via `AttachClassified`) |
| `ondetachclassified` | `function` or `nil` | `nil` | Callback function used to detach from `classified` on removal |

## Main Functions

### `AttachClassified(classified)`
* **Description:** Attaches to a `player_classified` component, stores a reference, and sets up a listener to auto-detach if the classified component is removed.
* **Parameters:**
  * `classified` (`Component`): The `player_classified` component instance to link.

### `DetachClassified()`
* **Description:** Clears the `classified` reference and removes the associated cleanup listener callback.

### `SetCurrent(current)`
* **Description:** Sets the current health value in the `classified` component.
* **Parameters:**
  * `current` (`number`): The new current health value.

### `SetMax(max)`
* **Description:** Sets the maximum health value in the `classified` component.
* **Parameters:**
  * `max` (`number`): The new maximum health value.

### `SetPenalty(penalty)`
* **Description:** Sets the health penalty (a multiplier reducing max health) on the `classified` component. Penalties are stored internally as 1/200ths (scaled to integer).
* **Parameters:**
  * `penalty` (`number`): A value between `0` and `1` inclusive, indicating the penalty fraction.

### `Max()`
* **Description:** Returns the effective maximum health, preferring the local `health` component if present, otherwise falling back to `classified`, and finally defaulting to `100`.
* **Parameters:** None.

### `MaxWithPenalty()`
* **Description:** Returns the maximum health *after* applying the penalty multiplier.
* **Parameters:** None.

### `GetPercent()`
* **Description:** Returns the health percentage (`current / max`) using local or classified data.
* **Parameters:** None.

### `GetCurrent()`
* **Description:** Returns the current health value.
* **Parameters:** None.

### `GetPenaltyPercent()`
* **Description:** Returns the currently applied health penalty as a decimal (e.g., `0.1` for 10%).
* **Parameters:** None.

### `IsHurt()`
* **Description:** Returns `true` if current health is below effective max (accounting for penalty).
* **Parameters:** None.

### `SetIsDead(isdead)`
* **Description:** Adds/removes the `isdead` tag on the entity based on state.
* **Parameters:**
  * `isdead` (`boolean`): Whether the entity is dead.

### `IsDead()`
* **Description:** Returns `true` if the `isdead` tag is present.
* **Parameters:** None.

### `SetIsTakingFireDamage(istakingfiredamage)`
* **Description:** Updates the fire damage flag on the `classified` component.
* **Parameters:**
  * `istakingfiredamage` (`boolean`): Whether the entity is currently taking fire damage.

### `IsTakingFireDamage()`
* **Description:** Returns whether the entity is taking fire damage (checked locally or from `classified`).
* **Parameters:** None.

### `SetIsTakingFireDamageLow(istakingfiredamagelow)`
* **Description:** Updates the low-intensity fire damage flag on the `classified` component.
* **Parameters:**
  * `istakingfiredamagelow` (`boolean`): Whether fire damage is low-intensity (e.g., smoldering).

### `IsTakingFireDamageLow()`
* **Description:** Returns `true` if taking low-intensity fire damage.
* **Parameters:** None.

### `IsTakingFireDamageFull()`
* **Description:** Returns `true` if taking full-intensity fire damage (i.e., `IsTakingFireDamage` but *not* `IsTakingFireDamageLow`).
* **Parameters:** None.

### `SetLunarBurnFlags(flags)`
* **Description:** Sets the lunar burn state flags in the `classified` component.
* **Parameters:**
  * `flags` (`number`): Bitmask flags representing lunar burn status.

### `GetLunarBurnFlags()`
* **Description:** Returns lunar burn flags (from `health` component if local, else `classified`).
* **Parameters:** None.

### `SetCanHeal(canheal)`
* **Description:** Adds/removes the `cannotheal` tag based on whether healing is permitted.
* **Parameters:**
  * `canheal` (`boolean`): Whether the entity can heal.

### `CanHeal()`
* **Description:** Returns `true` if healing is allowed (i.e., `cannotheal` tag is absent).
* **Parameters:** None.

### `SetCanMurder(canmurder)`
* **Description:** Adds/removes the `cannotmurder` tag based on murder permission.
* **Parameters:**
  * `canmurder` (`boolean`): Whether the entity can be murdered.

### `CanMurder()`
* **Description:** Returns `true` if murder is permitted (i.e., `cannotmurder` tag is absent).
* **Parameters:** None.

## Events & Listeners
- **Listens For:**
  - `"onremove"` event on `classified` → triggers `DetatchClassified` cleanup
- **Tags Used:**
  - `isdead`, `cannotheal`, `cannotmurder` (added/removed via `SetIsDead`, `SetCanHeal`, `SetCanMurder`)