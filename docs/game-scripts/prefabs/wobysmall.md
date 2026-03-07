---
id: wobysmall
title: Wobysmall
description: Manages the small form of Woby, including hunger-based transformation to wobybig, skill-based alignment and rack features, and foraging delegation from the player.
tags: [transform, hunger, pet, foraging, alignment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fd100d19
system_scope: entity
---

# Wobysmall

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wobysmall` is a prefab script defining the small-form companion entity (Woby). It implements hunger-based progression logic: when hunger reaches ≥95%, it triggers transformation to `wobybig`. The entity acts as a follower, sleeper, and foraging proxy for the player, delegating object-picking via queueing. It supports dynamic alignment (lunar/shadow) and rack interactions via skilltree updates, and manages item containers and drying racks. The logic is implemented through the `fn()` constructor, which attaches components, sets event callbacks, and defines helper functions for synchronization with player skills.

## Usage example
```lua
local inst = SpawnPrefab("wobysmall")
local player = GetPlayer()
inst:LinkToPlayer(player)
-- Hunger will auto-trigger transformation at ≥95%
-- Foraging delegation is enabled via skill "walter_woby_foraging"
```

## Dependencies & tags
**Components used:** `spawnfader`, `follower`, `knownlocations`, `sleeper`, `eater`, `hunger`, `locomotor`, `embarker`, `drownable`, `colourtweener`, `crittertraits`, `timer`, `container`, `wobyrack`, `inspectable`, `skilltreeupdater`, `storyteller`.  
**Tags added:** `critter`, `fedbyall`, `companion`, `notraptrigger`, `noauradamage`, `small_livestock`, `noabandon`, `NOBLOCK`, `_hunger` (temporary).  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_playerlink` | entity or `nil` | `nil` | The player entity Woby is linked to. |
| `alignment` | string or `nil` | `nil` | Current alignment: `"lunar"`, `"shadow"`, or `nil` (normal). |
| `_forager_targets` | table of entities | `{}` | Queue of targets queued for foraging by the player. |
| `_hasbigbuild` | boolean | `false` | Flag indicating whether big build overrides are applied (set on transform). |
| `pet_hunger_classified` | entity or `nil` | `nil` | Classified prefab for pet hunger display. |
| `woby_commands_classified` | entity or `nil` | `nil` | Classified prefab for command/wheel controls. |

## Main functions
### `LinkToPlayer(player, containerrestrictedoverride)`
*   **Description:** Links Woby to a player entity, sets the player as leader, initializes and attaches `pet_hunger_classified` and `woby_commands_classified`, sets container restrictions based on skill state, and registers skill refresh events.
*   **Parameters:** `player` (entity) - the player to link to; `containerrestrictedoverride` (boolean or `nil`) - optional override for container restriction.
*   **Returns:** Nothing.
*   **Error states:** Does not throw; silently skips classified creation if already attached (asserts `parent == player` in debug builds).

### `TriggerTransformation()`
*   **Description:** Initiates the small-to-big transformation sequence by closing the container, adding `NOCLICK`, and pushing the `transform` event. Only triggers if currently not in the `transform` state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnHungerDelta(inst, data)`
*   **Description:** Listens to `hungerdelta` events and calls `TriggerTransformation()` if `data.newpercent >= 0.95`.
*   **Parameters:** `inst` (entity), `data` (table with `newpercent` number) - the new hunger percentage.
*   **Returns:** Nothing.

### `SetAlignmentBuild(inst, alignment, showfx)`
*   **Description:** Updates Woby's alignment (normal/lunar/shadow) by setting flags on `pet_hunger_classified`, reskinning the entity, and optionally showing alignment-change FX.
*   **Parameters:** `alignment` (string or `nil`), `showfx` (boolean) - whether to show FX and push state graph event.
*   **Returns:** Nothing.

### `EnableRack(inst, enable, showanim)`
*   **Description:** Adds or removes the `wobyrack` component on demand (e.g., via skill `walter_camp_wobyholder`). When enabling, sets up `wobyrack` with show/hide callbacks and rack animations.
*   **Parameters:** `enable` (boolean), `showanim` (boolean) - whether to signal state graph event.
*   **Returns:** Nothing.

### `FinishTransformation()`
*   **Description:** Converts `wobysmall` to `wobybig`. Preserves all inventory items, drying rack contents, and drying state; transfers classifiers; updates hunger/hunger modifiers; notifies the player. Called during transformation logic.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `QueueForagerTarget(target)`
*   **Description:** Adds a `pickable` entity to Woby’s foraging queue. Enforces a timeout and queue limit (`MAX_FORAGING_TARGETS = 5`). Called when the player queues a valid pick action and Woby is permitted to forage.
*   **Parameters:** `target` (entity) - the `pickable` entity to queue.
*   **Returns:** Nothing.

### `GetForagerTarget(inst)`
*   **Description:** Returns the first valid target in the foraging queue (within max distance), dropping stale or too-far targets.
*   **Parameters:** `inst` (entity).
*   **Returns:** entity or `nil`.

### `UpdateOwnerNewStateListener(player)`
*   **Description:** Enables/disables the `newstate` event listener on the player based on activation of `walter_woby_foraging` skill. If disabled, clears the foraging queue.
*   **Parameters:** `player` (entity or `nil`).
*   **Returns:** Nothing.

### `RefreshAttunedSkills(inst, player, data)`
*   **Description:** Synchronizes Woby’s behavior (endurance hunger rate, alignment, rack presence, and foraging) with the linked player’s active skills. Called on skill activation/deactivation and initialization.
*   **Parameters:** `inst` (entity), `player` (entity or `nil`), `data` (table with `skill` string or `nil`).
*   **Returns:** Nothing.

### `CustomFoodStatsMod(inst, health_delta, hunger_delta, sanity_delta, food, feeder)`
*   **Description:** Modifies stats when eating. Triplies `hunger_delta` if the food is `woby_treat`.
*   **Parameters:** All standard eater modifier args.
*   **Returns:** Updated `hunger_delta` (or original if not treat).

### `IsAllowedToQueueForaging(inst, target)`
*   **Description:** Checks if Woby is allowed to forage for the given target, respecting sit/recall commands and distance.
*   **Parameters:** `inst` (entity), `target` (entity).
*   **Returns:** boolean.

## Events & listeners
- **Listens to:** `hungerdelta` - triggers transformation at high hunger; `onactivateskill_server`, `ondeactivateskill_server` - skill change sync; `ms_skilltreeinitialized` - post-initialization sync; `newstate` - player action buffer for foraging; `onremove` (on player, target) - cleanup and queue removal.
- **Pushes:** `transform`, `ondropped`, `playernewstate`, `praisewoby`, `treatwoby`.