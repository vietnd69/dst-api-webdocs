---
id: bernie_big
title: Bernie Big
description: Defines the active Bernie companion prefab with combat, movement, and skill tree integration for Willow's character mechanics.
tags: [companion, combat, willow, prefab]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: a3c5275f
system_scope: entity
---

# Bernie Big

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`bernie_big` is a prefab definition that creates the active Bernie companion entity in Don't Starve Together. This component handles Bernie's combat behavior, movement, health management, and integration with Willow's skill tree system. It supports lunar and shadow allegiances, fire-based damage reflection, and automatic taunting of nearby hostile creatures. The prefab works alongside `bernie_inactive` for cooldown states and integrates with the `berniebigbrain` for AI behavior.

## Usage example
```lua
local inst = SpawnPrefab("bernie_big")
inst.components.health:SetMaxHealth(TUNING.BERNIE_BIG_HEALTH)
inst.components.combat:SetTarget(some_enemy)
inst.components.activatable:OnActivate(player)
inst.onLeaderChanged(inst, willow_player)
```

## Dependencies & tags
**Components used:** `health`, `combat`, `locomotor`, `activatable`, `timer`, `hauntable`, `damagetyperesist`, `damagetypebonus`, `colouraddersync`, `drownable`, `embarker`, `planarentity`, `planardamage`, `planardefense`

**Tags:** Adds `largecreature`, `companion`, `soulless`, `crazy`, `bigbernie`, `canlight`, `shadow_aligned`, `lunar_aligned`, `FX`, `NOCLICK`. Checks `shadowcreature`, `hostile`, `brightmare`, `lunar_aligned`, `shadow_aligned`, `player`, `retaliates`, `INLIMBO`, `epic`, `notaunt`, `locomotor`, `lunarthrall_plant`, `NPCcanaggro`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `TARGET_DIST` | number | `12` | Maximum distance for combat retargeting. |
| `TAUNT_DIST` | number | `16` | Radius for taunting nearby creatures. |
| `TAUNT_PERIOD` | number | `2` | Interval in seconds between taunt attempts. |
| `bernieleader` | entity | `nil` | Reference to the Willow player who owns this Bernie. |
| `fire_fx` | entity | `nil` | Reference to the fire effect prefab when burning is active. |
| `fire_thorns_task` | task | `nil` | Scheduled task for ending fire thorns effect. |
| `highlightchildren` | table | `nil` | Array of child effect entities for visual highlights. |
| `current_allegiance` | net_tinybyte | `0` | Network variable tracking lunar/shadow allegiance state. |
| `should_shrink` | boolean | `nil` | Flag indicating Bernie should transition to inactive state. |

## Main functions
### `fn()`
*   **Description:** Constructor function that creates and configures the Bernie Big entity instance. Called internally by the prefab system.
*   **Parameters:** None.
*   **Returns:** Entity instance (`inst`).

### `firefn()`
*   **Description:** Constructor function for the Bernie fire effect prefab. Creates visual and audio effects for burning Bernie.
*   **Parameters:** None.
*   **Returns:** Entity instance for fire effects.

### `OnLoad(inst)`
*   **Description:** Initializes Bernie when loading from save. Cancels existing taunt task and creates new periodic taunt task.
*   **Parameters:** `inst` (entity) - the Bernie instance.
*   **Returns:** Nothing.

### `goinactive(inst)`
*   **Description:** Transitions Bernie to inactive state, spawning `bernie_inactive` prefab and preserving health percentage as fuel.
*   **Parameters:** `inst` (entity) - the Bernie instance.
*   **Returns:** Inactive Bernie entity instance or `nil` on failure.

### `TauntCreatures(inst)`
*   **Description:** Searches for nearby hostile creatures within taunt distance and forces them to target Bernie.
*   **Parameters:** `inst` (entity) - the Bernie instance.
*   **Returns:** Nothing.

### `RetargetFn(inst)`
*   **Description:** Combat retargeting function that finds valid targets within attack range.
*   **Parameters:** `inst` (entity) - the Bernie instance.
*   **Returns:** Target entity or `nil` if no valid target found.

### `KeepTargetFn(inst, target)`
*   **Description:** Determines whether Bernie should maintain current combat target.
*   **Parameters:** `inst` (entity) - Bernie instance, `target` (entity) - current target.
*   **Returns:** `true` if target should be kept, `false` otherwise.

### `ShouldAggro(combat, target)`
*   **Description:** Determines whether Bernie should aggro on a given target based on PVP settings.
*   **Parameters:** `combat` (component) - combat component, `target` (entity) - potential target.
*   **Returns:** `true` if should aggro, `false` otherwise.

### `OnAttacked(inst, data)`
*   **Description:** Event handler for when Bernie is attacked. Sets attacker as combat target if valid.
*   **Parameters:** `inst` (entity) - Bernie instance, `data` (table) - attack event data containing `attacker`.
*   **Returns:** Nothing.

### `onLeaderChanged(inst, leader)`
*   **Description:** Updates Bernie's stats and abilities based on Willow's skill tree activations. Handles speed, health regen, max health, and allegiance bonuses.
*   **Parameters:** `inst` (entity) - Bernie instance, `leader` (entity) - Willow player instance.
*   **Returns:** Nothing.

### `CheckForAllegiances(inst, leader)`
*   **Description:** Configures Bernie's lunar or shadow allegiance based on leader's skill tree. Adds/removes components and tags accordingly.
*   **Parameters:** `inst` (entity) - Bernie instance, `leader` (entity) - Willow player instance.
*   **Returns:** Nothing.

### `OnLighterLight(inst)`
*   **Description:** Activates Bernie's fire thorns effect when lighter is lit. Spawns fire FX and enables damage reflection.
*   **Parameters:** `inst` (entity) - Bernie instance.
*   **Returns:** Nothing.

### `endthornsfire(inst)`
*   **Description:** Deactivates Bernie's fire thorns effect, removes damage reflection component, and restores `canlight` tag.
*   **Parameters:** `inst` (entity) - Bernie instance.
*   **Returns:** Nothing.

### `canactivate(inst, doer)`
*   **Description:** Validates whether a player can activate Bernie. Only the owning Willow player can activate.
*   **Parameters:** `inst` (entity) - Bernie instance, `doer` (entity) - player attempting activation.
*   **Returns:** `true, nil` if valid; `false, "NOTMYBERNIE"` if invalid.

### `OnActivate(inst, doer)`
*   **Description:** Handles Bernie activation by player. Sets shrink flag to transition to inactive state.
*   **Parameters:** `inst` (entity) - Bernie instance, `doer` (entity) - activating player.
*   **Returns:** `true`.

### `OnReflectDamage(inst, data)`
*   **Description:** Event handler for damage reflection. Spawns impact FX on attacker.
*   **Parameters:** `inst` (entity) - Bernie instance, `data` (table) - reflect damage data containing `attacker`.
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Schedules Bernie to go inactive after sleeping for 0.5 seconds.
*   **Parameters:** `inst` (entity) - Bernie instance.
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Cancels pending sleep task if Bernie wakes before task completes.
*   **Parameters:** `inst` (entity) - Bernie instance.
*   **Returns:** Nothing.

### `OnColourChanged(inst, r, g, b, a)`
*   **Description:** Updates colour additive on all highlight child effects when colour changes.
*   **Parameters:** `inst` (entity) - Bernie instance, `r, g, b, a` (numbers) - colour values.
*   **Returns:** Nothing.

### `doshadowbernieart(inst)`
*   **Description:** Spawns shadow allegiance visual effects (flame children) on client.
*   **Parameters:** `inst` (entity) - Bernie instance.
*   **Returns:** Nothing.

### `dolunarbernieart(inst)`
*   **Description:** Spawns lunar allegiance visual effects (flame children) on client.
*   **Parameters:** `inst` (entity) - Bernie instance.
*   **Returns:** Nothing.

### `clearshadowlunarbernieart(inst)`
*   **Description:** Removes shadow/lunar visual effects and clears colour change function.
*   **Parameters:** `inst` (entity) - Bernie instance.
*   **Returns:** Nothing.

### `SetBernieSkinBuild(inst, skin_build)`
*   **Description:** Applies skin build overrides based on allegiance state.
*   **Parameters:** `inst` (entity) - Bernie instance, `skin_build` (string) - skin build name.
*   **Returns:** Nothing.

### `ClearBernieSkinBuild(inst)`
*   **Description:** Clears skin build overrides and resets to default build.
*   **Parameters:** `inst` (entity) - Bernie instance.
*   **Returns:** Nothing.

### `ReskinToolFilterFn(inst)`
*   **Description:** Filter function for reskin tool that determines valid builds based on current allegiance.
*   **Parameters:** `inst` (entity) - Bernie instance.
*   **Returns:** `must_have, must_not_have` (tables) - build filter arrays.

### `GetVerb()`
*   **Description:** Returns the activation verb for Bernie's activatable component.
*   **Parameters:** None.
*   **Returns:** String `"CALM"`.

### `EndBernieFire(inst)`
*   **Description:** Plays fire end animation on Bernie fire effect prefab.
*   **Parameters:** `inst` (entity) - fire effect instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` - triggers target acquisition on attack. `onreflectdamage` - spawns impact FX on damage reflection. `onlighterlight` - activates fire thorns effect. `current_allegiancedirty` - updates allegiance visual state. `animover` - removes fire effect prefab after animation completes.
- **Pushes:** None identified in this file.