---
id: frog
title: Frog
description: Implements the frog and lunarfrog prefabs with combat, thieving, and sleep behavior for DST creatures.
tags: [combat, ai, creature]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7f050182
system_scope: entity
---

# Frog

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `frog.lua` prefab file defines two creature variants—standard frog and lunar frog—with distinct behaviors including retargeting logic, thieving, sleep cycles, and special abilities. It constructs the entity via `commonfn`, then branches into `normalfn` and `lunarfn` to configure stats, tags, and components specific to each type. The frog uses the `SGfrog` stategraph and `frogbrain` AI, integrates with `combat`, `thief`, `sleeper`, `locomotor`, and `planardamage` components, and reacts to world events such as nightfall and attacks.

## Usage example
```lua
-- Create a standard frog entity
local frog = Prefab("frog", nil, nil, nil)
local entity = frog:Spawn(0, 0, 0)

-- Create a lunar frog with increased health and planar damage
local lunarfrog = Prefab("lunarfrog", nil, nil, nil)
local lentity = lunarfrog:Spawn(10, 0, 0)
lentity.components.health:SetMaxHealth(150)
```

## Dependencies & tags
**Components used:** `health`, `combat`, `thief`, `locomotor`, `sleeper`, `lootdropper`, `knownlocations`, `planardamage`, `embarker`, `drownable`, `inspectable`
**Tags:** Adds `"animal"`, `"prey"`, `"hostile"`, `"smallcreature"`, `"frog"`, `"canbetrapped"` on all variants; lunar variant additionally adds `"lunar_aligned"`, `"gestaltmutant"`, `"soulless"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `islunar` | boolean | `false` | Set to `true` for lunar frog to enable altered behavior and stats. |
| `sounds` | table | `NORMAL_SOUNDS` or `LUNAR_SOUNDS` | Sound path mapping used by the entity's sound emitter. |
| `sg.mem.nocorpse` | boolean | `false` | If `true`, prevents corpse generation on death (set for lunar frog). |
| `scrapbook_adddeps` | table | `nil` | Dependencies for scrapbook entry, set for lunar frog. |

## Main functions
### `commonfn(build, common_postinit)`
* **Description:** Core constructor logic shared between normal and lunar frog prefabs. Sets up transforms, physics, components, brain, stategraph, tags, and event listeners. Returns a pristine entity on the client and fully configured entity on the master simulation.
* **Parameters:** 
  * `build` (string) — Name of the anim build (e.g., `"frog"` or `"froglunar_build"`).
  * `common_postinit` (function?) — Optional post-initialization hook (used for lunar frog).
* **Returns:** `inst` — The constructed entity.
* **Error states:** On the client (`not TheWorld.ismastersim`), returns a minimal entity without components or behavior logic.

### `normalfn()`
* **Description:** Constructs and configures the standard frog prefab with default stats and sleep behavior.
* **Parameters:** None.
* **Returns:** `inst` — Configured frog entity on master simulation, minimal entity on client.
* **Error states:** Returns early on client without component or state configuration.

### `lunarfn()`
* **Description:** Constructs and configures the lunar frog prefab with enhanced stats, planar damage, loot, and post-initialization.
* **Parameters:** None.
* **Returns:** `inst` — Configured lunarfrog entity on master simulation, minimal entity on client.
* **Error states:** Returns early on client without component or state configuration.

### `retargetfn(inst)`
* **Description:** Internal function used by `combat` component to search for new valid targets based on distance and tags.
* **Parameters:** `inst` — The frog instance.
* **Returns:** Entity or `nil` — The closest valid target or `nil` if none found.
* **Error states:** Returns `nil` if frog is dead or asleep.

### `ShouldSleep(inst)`
* **Description:** Determines whether the frog should enter sleep state based on whether it has a known home location and time of day.
* **Parameters:** `inst` — The frog instance.
* **Returns:** `boolean` — `true` if sleeping is appropriate (`not has home and is night`), else `false`.

### `OnAttacked(inst, data)`
* **Description:** Event handler called when the frog is attacked; sets the attacker as the target and shares aggro with nearby frogs.
* **Parameters:** 
  * `inst` — The frog instance.
  * `data` (table) — Attack event data containing `attacker`.
* **Returns:** Nothing.

### `OnHitOther(inst, other, damage, stimuli, weapon, damageresolved, spdamage, damageredirecttarget)`
* **Description:** Called on successful frog attack; applies thieving, planar damage, or grogginess depending on variant.
* **Parameters:** See `combat.onhitotherfn` signature.
* **Returns:** Nothing.
* **Error states:** Does nothing if `damageredirecttarget` is `true`; lunar variant checks grogginess resistance before adding.

## Events & listeners
- **Listens to:** 
  * `"attacked"` — Triggers `OnAttacked` to acquire new target and share aggro.
  * `"goinghome"` — Triggers `OnGoingHome` to spawn a splash effect.
- **Pushes:** None (relies on component-level event pushes).