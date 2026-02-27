---
id: mutatedbuzzardmanager
title: Mutatedbuzzardmanager
description: Manages the lifecycle, migration, and shadow spawning of mutated buzzards in response to player positions, rift states, and in-game events like megaflare detonations and entity deaths.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 83ac3648
---

# Mutatedbuzzardmanager

## Overview
The `MutatedBuzzardManager` is a world-scoped component responsible for tracking migrating mutated buzzard groups, spawning and managing circling shadow entities that follow players, and coordinating buzzard behavior based on environmental conditions (e.g., rift activity, time of day, moon phase). It integrates with the `migrationmanager`, `corpsepersistmanager`, and `riftspawner` systems to control spawn conditions, persistence, and population tracking.

## Dependencies & Tags
- **Component dependencies**: `inst:AddComponent("migrationmanager")`, `inst:AddComponent("corpsepersistmanager")`, `inst:AddComponent("riftspawner")` (optional, used conditionally).
- **Tags**: Uses `MIGRATION_TYPES.MUTATED_BUZZARD_GESTALT` internally as a custom migration type.
- **Source modifications**: Adds a persistent corpse attraction source `"mutatedbuzzard_corpse_persist"` to `corpsepersistmanager`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `self.inst` | Reference to the component's owning entity (typically `TheWorld`). |
| `UPDATE_TIME_SECONDS` | `number` | `0.5` | Interval (in seconds) for the main `OnUpdate` loop. |
| `UPDATE_DROP_BUZZARD_SECONDS` | `number` | `3` | Interval (in seconds) for dropping buzzards when active. |
| `CORPSE_PERSIST_SOURCE` | `string` | `"mutatedbuzzard_corpse_corpse_persist"` | Identifier used when registering corpse persistence logic. |
| `MUTATEDBUZZARD_MAX_SHADOWS` | `number` | `10` | Maximum circling shadows permitted per player. |
| `MUTATEDBUZZARD_CORPSE_RANGE_SQ` | `number` | Squared value of `TUNING.MUTATEDBUZZARD_CORPSE_RANGE` | Distance threshold squared used to check proximity for corpse attraction. |
| `_activeplayers` | `table` | `{}` | Tracks per-player migration state (e.g., `population_uid`, `population_time`). |
| `_buzzards` | `table` | `{}` | List of active mutated buzzard entities tracked by this component. |
| `_buzzardshadows` | `table` | `{}` | List of active circling buzzard shadow entities. |
| `_dropbuzzardsources` | `SourceModifierList` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Controls whether buzzards should be dropped (disabled by default). |
| `megaflare_nodes` | `table` | `{}` | Maps migration nodes to remaining time (in seconds) after a megaflare detonation. |
| `death_nodes` | `table` | `{}` | Maps migration nodes to lists of decay timers triggered by entity deaths. |
| `lunarrifts_nodes` | `table` | `{}` | Maps rift entities to their associated migration nodes. |

## Main Functions

### `SetDropBuzzardsSource(source, boolval)`
* **Description:** Enables or disables buzzard dropping based on a named source (e.g., `"rift_inactive"` or `"winter_active"`). Multiple sources can be active simultaneously; dropping is enabled if any source is `true`.
* **Parameters:**
  - `source` (`string`): Identifier for the condition causing buzzard dropping.
  - `boolval` (`boolean`): Whether to enable dropping for this source.

### `GetDropBuzzards()`
* **Description:** Returns whether buzzard dropping is currently enabled (i.e., if any registered source is active).
* **Returns:** `boolean` — `true` if dropping is active, otherwise `false`.

### `TrackPopulationOnPlayer(player, population)`
* **Description:** Associates a player with a specific mutated buzzard population group and starts a timed tracking window. Used when a