---
id: bernie_big
title: Bernie Big
description: A large companion boss entity that manages combat behavior, AI taunting, skill-based stat adjustments, and planar allegiance visual/artistic effects.
tags: [combat, ai, boss, companion, planar]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a3c5275f
system_scope: entity
---

# Bernie Big

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bernie_big` is a prefabricated entity representing a large companion-type boss character with dynamic stat scaling, taunt/retarget behaviors, skill-based allegiance effects (lunar/shadow aligned), and planar combat mechanics. It integrates deeply with the `combat`, `health`, `locomotor`, `activatable`, `damagereflect`, `damagetyperesist`, `damagetypebonus`, `planardamage`, `planardefense`, `colouraddersync`, and `skilltreeupdater` components. The entity transforms into an inactive state (`bernie_inactive`) when destroyed and manages fire-based reflection FX via `damagereflect` and visual effects layered with `AnimState` overrides.

## Usage example
```lua
local inst = SpawnPrefab("bernie_big")
if inst ~= nil then
    inst.bernieleader = some_leader_entity
    inst.onLeaderChanged(inst, some_leader_entity)  -- Applies skill-based stats and allegiance effects
    inst.components.health:SetPercent(0.8)         -- Restore health
    inst.components.locomotor.walkspeed = 5        -- Adjust speed if needed
    inst.components.combat:SetTarget(some_target)  -- Force targeting
    inst:GoInactive()                              -- Transform to Bernie Inactive state
end
```

## Dependencies & tags
**Components used:**  
`activatable`, `colouraddersync`, `combat`, `damagereflect`, `damagetyperesist`, `damagetypebonus`, `drownable`, `fueled`, `hauntable`, `health`, `inspectable`, `locomotor`, `planardamage`, `planardefense`, `planarentity`, `skilltreeupdater`, `timer`

**Tags added:**  
`largecreature`, `companion`, `soulless`, `crazy`, `bigbernie`, `canlight`, `shadow_aligned`, `lunar_aligned`, `FX`, `NOCLICK`

**Tags checked/filtered:**  
Taunt filtering uses `must_tags: "_combat"`, `cant_tags: "INLIMBO", "player", "companion", "epic", "notaunt"`, `oneof_tags: "locomotor", "lunarthrall_plant"`  
Retarget filtering uses `must_tags: "_combat"`, `cant_tags: "INLIMBO", "player", "companion", "retaliates"`, `oneof_tags: "locomotor", "epic", "NPCcanaggro"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `current_allegiance` | `net_tinybyte` | `0` | Networked enum value for allegiance state: `0=none`, `BERNIEALLEGIANCE.SHADOW`, `BERNIEALLEGIANCE.LUNAR`. Triggers `current_allegiancedirty` callback. |
| `bernieleader` | `entity?` | `nil` | Reference to the controlling leader entity used to read skill upgrades. |
| `should_shrink` | `boolean?` | `nil` | Flag set during leadership changes or activation to indicate a shrinking/reskin operation is pending. |
| `fire_thorns_task` | `task?` | `nil` | Delayed task for extinguishing fire-thorns after 20 seconds. |
| `fire_fx` | `entity?` | `nil` | Reference to spawned fire FX entity during thorns phase. |
| `highlightchildren` | `table?` | `nil` | Array of FX entities used for visual flair on shadow/lunar builds. |
| `hit_recovery` | `number` | `TUNING.BERNIE_BIG_HIT_RECOVERY` | Recovery time after being hit. |
| `scrapbook_specialinfo` | `string` | `"BERNIE"` | Metadata for scrapbook categorization. |
| `ReskinToolFilterFn` | `function` | `ReskinToolFilterFn` | Callback used by reskin tools to validate valid skins. |
| `SetBernieSkinBuild`, `ClearBernieSkinBuild` | `function` | Custom skin modifiers for lunar/shadow builds. |

## Main functions
### `GoInactive()`
*   **Description:** Transforms `bernie_big` into a `bernie_inactive` entity, transferring health percentage as fuel and preserving position/rotation. Removes this instance after spawning the inactive form.
*   **Parameters:** None.
*   **Returns:** `entity?` — The newly spawned `bernie_inactive` prefab instance, or `nil` if creation failed.
*   **Error states:** Calls `endthornsfire()` to clean up fire-related components before removal.

### `endthornsfire(inst)`
*   **Description:** Cleans up fire-thorns effects: destroys or ends `fire_fx`, cancels `fire_thorns_task`, removes `damagereflect` and `onreflectdamage` listener, and re-adds `canlight` tag.
*   **Parameters:** `inst` (entity) — The instance on which to terminate thorns.
*   **Returns:** Nothing.

### `TauntCreatures(inst)`
*   **Description:** Scans nearby entities within `TAUNT_DIST` (16 units) and forces combat targeting of this entity if they meet `IsTauntable()` criteria.
*   **Parameters:** `inst` (entity) — The taunting Bernie Big instance.
*   **Returns:** Nothing.

### `RetargetFn(inst)`
*   **Description:** Finds a valid new target within `TARGET_DIST` (12 units) if this entity has no current target. Returns first valid candidate entity.
*   **Parameters:** `inst` (entity) — The entity performing the retarget search.
*   **Returns:** `entity?` — First found valid target, or `nil` if none found.

### `IsTargetable(inst, target)`
*   **Description:** Evaluates whether `target` can be targeted by this Bernie Big instance, considering death, combat capability, alignment tags, and current target relationships.
*   **Parameters:**  
  - `inst` (entity) — Bernie Big instance.  
  - `target` (entity) — Candidate target entity.
*   **Returns:** `boolean` — `true` if targetable, `false` otherwise.

### `IsTauntable(inst, target)`
*   **Description:** Same as `IsTargetable`, but with additional conditions: target must *not* currently target Bernie Big, and must satisfy either taunt-eligible tags or already have a player/companion target.
*   **Parameters:**  
  - `inst` (entity) — Bernie Big instance.  
  - `target` (entity) — Candidate tauntee.
*   **Returns:** `boolean` — `true` if taunt-eligible, `false` otherwise.

### `onLeaderChanged(inst, leader)`
*   **Description:** Updates stats and properties based on the leader's skill tree (e.g., `willow_berniehealth_1/2`, `willow_berniespeed_1/2`, `willow_bernieregen_1/2`, `willow_burnignbernie`, and allegiance skills). Adjusts max health, speed, regen, taunt/retarget range, and adds/removes planar resistances/bonuses and FX.
*   **Parameters:**  
  - `inst` (entity) — Bernie Big instance.  
  - `leader` (entity?).
*   **Returns:** Nothing.

### `CheckForAllegiances(inst, leader)`
*   **Description:** Applies or clears lunar/shadow allegiance visual overrides, adds/removed `planarentity`, `planardamage`, and `planardefense`, sets allegiance enum, and toggles bloom on `blob_body`.
*   **Parameters:**  
  - `inst` (entity).  
  - `leader` (entity).
*   **Returns:** Nothing.

### `OnLighterLight(inst)`
*   **Description:** Activates thorns fire effect if not active (spawning `bernie_big_fire`, adding `damagereflect` component with listener). Cancels existing timer if fire is already active; starts 20-second auto-extinguish timer.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `SetBernieSkinBuild(inst, skin_build)`
*   **Description:** Dynamically overrides symbols for lunar/shadow builds if applicable.
*   **Parameters:**  
  - `inst` (entity).  
  - `skin_build` (`string?`) — Base skin build name.
*   **Returns:** Nothing.

### `ClearBernieSkinBuild(inst)`
*   **Description:** Clears all lunar/shadow symbol overrides and reverts to default `"bernie_build"`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `EndBernieFire(inst)`
*   **Description:** Plays the post-animation `"bernie_fire_reg_pst"` on fire FX; will be removed on `animover`.
*   **Parameters:** `inst` (entity) — Fire FX instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `onreflectdamage` — Triggers `OnReflectDamage` to spawn impact FX on attacker.  
  `current_allegiancedirty` — Triggers `current_allegiancedirty()` on non-dedicated clients to update shadow/lunar FX.  
  `attacked` — Triggers `OnAttacked` to possibly retarget attacker.  
  `onlighterlight` — Triggers `OnLighterLight` to activate fire thorns.  
  `animover` — Used internally by fire FX to remove itself after playback.

- **Pushes:** None directly.

