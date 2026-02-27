---
id: shadowthrall_mimics
title: Shadowthrall Mimics
description: This component manages the spawning and lifecycle of shadow thrall mimics near player-adjacent entities during Cavenight, triggered by active shadow rifts.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 0f527ebb
---

# Shadowthrall Mimics

## Overview
This component enables a Shadowthrall entity to spawn mimic versions of nearby items and creatures during Cavenight (darkness phases), provided active shadow rifts are present. It coordinates mimic spawning logic, tracks active mimics and players, and manages scheduling based on rift state and time of day.

## Dependencies & Tags
- **Components Added to Mimics:** `itemmimic` (via `mimic:AddComponent("itemmimic")`)
- **World State Watched:** `iscavenight` (via `inst:WatchWorldState`)
- **Events listend for:** `ms_playerjoined`, `ms_playerleft`, `ms_riftaddedtopool`, `ms_riftremovedfrompool`
- **Tags Used (from `itemmimic_data`):** `MUST_TAGS` (required tags), `CANT_TAGS` (forbidden tags)
- **Conditional Requirement:** Requires `TheWorld.ismastersim` (server-side only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The Shadowthrall entity instance. Initialized in constructor. |
| `_activeplayers` | `table` | `{}` | Internal list of players currently in the world; triggers mimic spawning. |
| `_activemimics` | `table` | `{}` | Tracks active mimic entities (keyed by entity ref). |
| `_scheduled_spawn_attempts` | `table` | `{}` | Maps each player to an active periodic task for mimic spawning attempts. |
| `_rift_enabled_modifiers` | `SourceModifierList` | — | Tracks active rifts with shadow affinity; enables mimic spawning when non-empty. |

## Main Functions

### `self.IsTargetMimicable(target)`
* **Description:** Checks whether a given entity meets the criteria to be mimicked (has required tags and lacks forbidden tags).
* **Parameters:**  
  `target` (`Entity`) — The entity to evaluate.

### `self.SpawnMimicFor(item)`
* **Description:** Attempts to spawn a mimic of the provided item/entity. Only succeeds if `IsTargetMimicable` returns true.
* **Parameters:**  
  `item` (`Entity`) — The entity to copy and spawn as a mimic.  
  *Returns:* `boolean` — `true` if mimic spawned successfully, `false` otherwise.

### `self.IsEnabled()`
* **Description:** Returns whether mimic spawning is currently enabled (i.e., at least one shadow rift with shadow affinity is active).
* **Parameters:** None  
  *Returns:* `boolean`

### `self.GetDebugString()`
* **Description:** Generates a human-readable debug string with current mimic count, cap, and enabled/disabled status.
* **Parameters:** None  
  *Returns:* `string`

### `self.Debug_PlayerSpawns(player)`
* **Description:** Forces an immediate mimic spawning attempt for the specified player (for debugging).
* **Parameters:**  
  `player` (`Entity`) — The player on whose behalf to trigger a spawn attempt.

## Events & Listeners
- `ms_playerjoined` → `OnPlayerJoined` — Adds new player to tracking list; starts spawning attempts if Cavenight is active.
- `ms_playerleft` → `OnPlayerLeft` — Removes player from tracking; cancels scheduled attempts.
- `ms_riftaddedtopool` → `OnRiftAddedToPool` — Registers a new shadow rift and conditionally enables/disables spawning.
- `ms_riftremovedfrompool` → `OnRiftRemovedFromPool` — Removes rift reference; disables spawning if no rifts remain.
- `onremove` (on each mimic) → `on_mimic_removed` — Internal callback that removes the mimic from `_activemimics` table.