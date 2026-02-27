---
id: beecommon
title: Beecommon
description: Provides shared constants and utility functions for bee AI behavior, including target sharing, combat response, and hive retreat logic.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: dcf15014
---

# Beecommon

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `beecommon.lua` file defines a shared Lua module containing constants and helper functions used by bee-related AI behaviors in Don't Starve Together. It centralizes logic for combat reaction, target sharing with nearby bees, and hive retreat decisions. It is not a component itself, but a collection of reusable functions and constants intended to be imported and referenced by brain scripts or state machines for bees.

Key responsibilities include:
- Triggering target sharing when attacked or worked on (`OnAttacked`, `OnWorked`)
- Determining safe retreat actions to the hive (`GoHomeAction`)
- Enforcing hive membership and spawning conditions for child bees (`childspawner.childreninside`, `ReleaseAllChildren`)

It depends on several core components: `combat`, `health`, `homeseeker`, `burnable`, and `childspawner`.

## Dependencies & Tags

- **Components used:**
  - `combat` (via `inst.components.combat`)
  - `health` (via `inst.components.health`)
  - `homeseeker` (via `inst.components.homeseeker`)
  - `burnable` (via `inst.components.burnable`)
  - `childspawner` (via `inst.components.childspawner`)
- **Tags checked:**
  - `"bee"`: used to filter valid share targets
  - `"companion"`: used to ensure only bees of the same type (regular vs companion) share targets
  - `"epic"`: used to exclude epic bees from target sharing

## Properties

No public properties are defined by this module. It exports only constants and functions.

## Main Functions

### `GoHomeAction(inst)`
* **Description:** Constructs and returns a buffered action that moves the entity (`inst`) to its assigned hive (`homeseeker.home`), but only if the hive is valid, exists, and is not currently on fire.
* **Parameters:**
  - `inst` (`Entity`): The entity requesting the home action.
* **Returns:** `BufferedAction` or `nil` — returns an action if conditions are met, otherwise `nil`.

### `OnAttacked(inst, data)`
* **Description:** Handles response when the entity is attacked. Sets the attacker as the combat target, spawns child bees (`killerbee` prefab) from the hive if present, and shares the target with nearby bees belonging to the same hive.
* **Parameters:**
  - `inst` (`Entity`): The entity being attacked.
  - `data` (`Table?`): Event data containing at least `{attacker = Entity}`. May be `nil`.
* **Returns:** `nil`

### `OnWorked(inst, data)`
* **Description:** Callback triggered when the entity is worked on (e.g., by a player using an item). Internally calls `OnAttacked` with the worker as the attacker, effectively treating interaction as aggression.
* **Parameters:**
  - `inst` (`Entity`): The entity being worked on.
  - `data` (`Table`): Event data containing `{worker = Entity}`.
* **Returns:** `nil`

## Constants

| Constant | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `RUN_AWAY_DIST` | number | 10 | Maximum distance within which a bee will attempt to flee. |
| `SEE_FLOWER_DIST` | number | 10 | Distance threshold for detecting flowers. |
| `SEE_TARGET_DIST` | number | 6 | Distance threshold for detecting combat targets. |
| `MAX_CHASE_DIST` | number | 7 | Maximum distance a bee will chase a target. |
| `MAX_CHASE_TIME` | number | 8 | Maximum duration (in seconds) a bee will chase a target. |
| `MAX_WANDER_DIST` | number | 32 | Maximum distance from hive a bee may wander. |
| `SHARE_TARGET_DIST` | number | 30 | Radius around the bee within which other bees are considered for target sharing. |
| `MAX_TARGET_SHARES` | number | 10 | Upper limit on the number of bees a target can be shared to, reduced by number of bees inside the hive. |

## Events & Listeners

This module does not define any event listeners or push events directly. It is intended to be invoked by event handlers defined in external stategraphs or scripts (e.g., `SGbee.lua`).