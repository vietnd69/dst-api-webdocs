---
id: spellbookcooldowns
title: Spellbookcooldowns
description: Manages spell cooldowns for spellbook-equipped entities by tracking active cooldown instances and providing query and manipulation methods.
tags: [spellbook, cooldown, inventory, magic]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3a1290ed
system_scope: entity
---

# Spellbookcooldowns

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SpellbookCooldowns` is a client-server aware component that manages active spell cooldowns for an entity, such as a player using a spellbook. It maintains a dictionary of active cooldown instances keyed by spell name hash, and provides utility functions to check cooldown status, register new cooldowns, restart or stop cooldowns, and generate debug output. Cooldown instances are small prefabs (`spellbookcooldown`) parented to the entity and synced over the network via the `Network` interface.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("spellbookcooldowns")

-- Start a 5-second cooldown for "fireball"
inst.components.spellbookcooldowns:RestartSpellCooldown("fireball", 5)

-- Check if a spell is on cooldown
if inst.components.spellbookcooldowns:IsInCooldown("fireball") then
    print("Fireball is cooling down!")
end

-- Stop and clear the cooldown early
inst.components.spellbookcooldowns:StopSpellCooldown("fireball")
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `spellbookcooldowns` tag via `inst:AddComponent("spellbookcooldowns")` (implicit).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed in) | The entity instance this component belongs to. |
| `ismastersim` | boolean | `false` or `true` | Whether this component instance is running on the master simulation (server). |
| `cooldowns` | table | `{}` | Dictionary mapping spell name hashes to active `spellbookcooldown` instances. |
| `_onremovecd` | function | internal | Private callback invoked when a cooldown entity is removed. |

## Main functions
### `IsInCooldown(spellname)`
*   **Description:** Checks whether the specified spell is currently on cooldown.
*   **Parameters:** `spellname` (string or number) — spell identifier; if a string, it is hashed internally.
*   **Returns:** `true` if the spell has an active cooldown, otherwise `false`.
*   **Error states:** None.

### `GetSpellCooldownPercent(spellname)`
*   **Description:** Returns the remaining cooldown progress (as a percentage from `0.0` to `1.0`) for the specified spell.
*   **Parameters:** `spellname` (string or number) — spell identifier.
*   **Returns:** `number` (percent) or `nil` if no active cooldown exists.
*   **Error states:** Returns `nil` if the spell has no active cooldown.

### `RegisterSpellbookCooldown(cd)`
*   **Description:** Registers a new `spellbookcooldown` prefab instance as the active cooldown for its associated spell. Listens for the `onremove` event on the cooldown to clean up the internal registry.
*   **Parameters:** `cd` (Spawned `spellbookcooldown` prefab instance).
*   **Returns:** Nothing.
*   **Error states:** Prints warnings if the cooldown has an invalid spellname (`0`) or if a duplicate cooldown for the same spell is registered.

### `RestartSpellCooldown(spellname, duration)`
*   **Description:** (Server-only) Restarts or creates a new cooldown for the specified spell. If a cooldown already exists, it restarts it; otherwise, it spawns a new `spellbookcooldown` prefab.
*   **Parameters:**  
    * `spellname` (string) — name of the spell.  
    * `duration` (number) — duration in seconds.
*   **Returns:** Nothing.
*   **Error states:** No-op if `ismastersim` is `false`. Prints warning for invalid or duplicate spellnames.

### `StopSpellCooldown(spellname)`
*   **Description:** (Server-only) Immediately removes and destroys the active cooldown for the specified spell.
*   **Parameters:** `spellname` (string or number) — spell identifier.
*   **Returns:** Nothing.
*   **Error states:** No-op if `ismastersim` is `false` or if no cooldown exists.

### `GetDebugString()`
*   **Description:** Returns a multi-line string containing debugging information for all active cooldowns, including spell hash, optional debug name, percentage remaining, and total duration.
*   **Parameters:** None.
*   **Returns:** `string` — formatted debug output (e.g., `"[123456](fireball): 45.23% (5s)"`).
*   **Error states:** None.

## Events & listeners
- **Listens to:** `onremove` — attached to each registered cooldown entity; removes the cooldown from the internal registry when the cooldown prefab is destroyed.
- **Pushes:** None.
