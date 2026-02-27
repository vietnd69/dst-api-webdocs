---
id: spellbookcooldowns
title: Spellbookcooldowns
description: Manages active spellbook spell cooldowns for an entity, tracking and updating cooldown states via dedicated spellbookcooldown prefabs.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 3a1290ed
---

# Spellbookcooldowns

## Overview
This component tracks and manages spellbook spell cooldowns for an entity. It maintains a table of active `spellbookcooldown` prefabs, registers them when a spell enters cooldown, and removes them when the cooldown ends. It provides methods to query cooldown status (`IsInCooldown`, `GetSpellCooldownPercent`), start new cooldowns (`RestartSpellCooldown`), and cancel them (`StopSpellCooldown`). All state-modifying operations are restricted to the master simulation in multiplayer.

## Dependencies & Tags
- **Component Dependencies**: Relies on `spellbookcooldown` prefab (created via `SpawnPrefab("spellbookcooldown")`).
- **Tags**: None explicitly added or removed by this component.
- **Events Listened**: Listens for `"onremove"` events from registered cooldown prefabs to automatically clean up internal state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | The entity instance this component belongs to. |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | Indicates whether this instance is running in master simulation (i.e., server or single-player). |
| `cooldowns` | `table` | `{}` | Dictionary mapping spell hash keys to active `spellbookcooldown` prefab instances. Keys are integer hashes derived from spell names via `GetHash()`. |

## Main Functions
### `IsInCooldown(spellname)`
* **Description:** Checks whether the specified spell is currently on cooldown.
* **Parameters:**  
  `spellname` (`string` or `number`): Either a string spell name (e.g., `"fireball"`) or its precomputed hash integer. String names are automatically hashed.

### `GetSpellCooldownPercent(spellname)`
* **Description:** Returns the current progress of the cooldown as a decimal between `0` and `1`, where `1` means fully elapsed. Returns `nil` if the spell is not on cooldown.
* **Parameters:**  
  `spellname` (`string` or `number`): Spell name or hash (see `IsInCooldown`).

### `RegisterSpellbookCooldown(cd)`
* **Description:** Registers a new `spellbookcooldown` prefab instance for a spell, adding it to the internal `cooldowns` table and setting up an `"onremove"` event listener to automatically deregister it later. Includes duplicate and invalid name checks with debug logging.
* **Parameters:**  
  `cd` (`Component/Instance`): A `spellbookcooldown` prefab instance that is starting its cooldown.

### `RestartSpellCooldown(spellname, duration)`
* **Description:** Starts or restarts the cooldown for a spell. If the cooldown already exists, it is restarted with the new duration; otherwise, a new `spellbookcooldown` prefab is spawned and initialized. Only executes on the master simulation.
* **Parameters:**  
  `spellname` (`string` or `number`): Spell identifier (name or hash).  
  `duration` (`number`): Cooldown duration in seconds.

### `StopSpellCooldown(spellname)`
* **Description:** Immediately ends the cooldown for a spell by destroying its associated `spellbookcooldown` prefab. Only executes on the master simulation.
* **Parameters:**  
  `spellname` (`string` or `number`): Spell identifier (name or hash).

### `GetDebugString()`
* **Description:** Returns a formatted string listing all active cooldowns, including hash, optional debug spell name, elapsed percentage, and total duration. Used for diagnostics.
* **Parameters:** None.

## Events & Listeners
- Listens to `"onremove"` event from each registered `spellbookcooldown` prefab (via `inst:ListenForEvent("onremove", self._onremovecd, cd)`). When triggered, `_onremovecd` removes the corresponding entry from `self.cooldowns`.
- Does **not** push events itself.