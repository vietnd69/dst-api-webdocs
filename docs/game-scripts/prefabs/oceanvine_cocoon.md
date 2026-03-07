---
id: oceanvine_cocoon
title: Oceanvine Cocoon
description: A flying spider cocoon that slowly spawns water spiders to hunt for ocean fish; it can be ignited or frozen, and drops silk, twigs, or ash upon destruction.
tags: [entity, mob, boss, environment, spawning]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fbee508a
system_scope: environment
---

# Oceanvine Cocoon

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `oceanvine_cocoon` is a static, flying environmental entity that spawns water spiders (`spider_water`) to hunt for ocean fish. It functions as a boss-like spawning node for oceanic threats, using the `childspawner` component to manage regeneration and release of spider offspring. The cocoon can be ignited (transitioning to a burnt state), frozen, or destroyed, with each outcome triggering distinct behaviors and consequences.

Key interactions include:
- Responding to fire via the `burnable` component and state transition to `oceanvine_cocoon_burnt`
- Freezing via the `freezable` component, halting spawner activity
- Taking damage to release investigating spiders via the `combat` and `childspawner` components
- Spawning fish-investigating spiders on a recurring timer

It integrates with world settings via `WorldSettings_ChildSpawner_*` functions to enable/disable behavior based on `TUNING.OCEANVINE_ENABLED`.

## Usage example
```lua
-- Create a new oceanvine_cocoon instance
local cocoon = SpawnPrefab("oceanvine_cocoon")
cocoon.Transform:SetPosition(x, y, z)

-- Trigger cocoon to release all children immediately
if cocoon.SummonChildren then
    cocoon:SummonChildren()
end

-- Manually ignite the cocoon (e.g., from external fire source)
cocoon:PushEvent("activated", { target = player })
```

## Dependencies & tags
**Components used:** `burnable`, `childspawner`, `combat`, `distancefade` (client-only), `freezable`, `health`, `inspectable`, `lootdropper`, `sleeper`, `timer`  
**Tags added:** `flying`, `ignorewalkableplatforms`, `NOBLOCK`, `plant`, `spidercocoon`, `webbed`, `soulless`  
**Tags dynamically added/removed during lifecycle:** `burnt`, `notarget`, `noattack` (on burnt death)

## Properties
No public properties are initialized in the constructor. All state is encapsulated in components.

## Main functions
The `oceanvine_cocoon` prefab uses several internal callback functions registered via component APIs. These are not called directly by modders but may be referenced in event handling.

### `cocoon_ignited(inst, source, doer)`
* **Description:** Triggered when the cocoon is ignited. Releases all pending spiders, stops spawning, and pauses the fish-search timer.
* **Parameters:**  
  `inst` (Entity) — the cocoon instance  
  `source`, `doer` — ignition context (unused in logic)
* **Returns:** Nothing.
* **Error states:** No direct failure conditions; child release may return empty table if cocoon has no children.

### `cocoon_burnt(inst)`
* **Description:** Transitions cocoon to burnt state: adds `burnt` and `notarget` tags, disables minimap, spawns a temporary fire FX entity, and schedules transition to `oceanvine_cocoon_burnt` after animation.
* **Parameters:** `inst` (Entity)
* **Returns:** Nothing.

### `cocoon_extinguish(inst)`
* **Description:** Called when the cocoon is extinguished (e.g., rain, water). Restarts spider spawning and resumes the fish timer.
* **Parameters:** `inst` (Entity)
* **Returns:** Nothing.

### `play_hit(inst)`
* **Description:** Plays the cocoon’s hit animation and sound. Used by `OnHit` and other trigger events.
* **Parameters:** `inst` (Entity)
* **Returns:** Nothing.

### `spawn_investigators(inst, data)`
* **Description:** Spawns up to two water spiders to investigate an attack target, with staggered timing.
* **Parameters:**  
  `inst` (Entity) — cocoon instance  
  `data` (table) — must contain `target` entity for positioning; optional
* **Returns:** Nothing.
* **Error states:** Returns early if `freezable` component reports frozen state.

### `look_for_fish(inst)`
* **Description:** Scans for ocean fish within 10 units; if found, spawns one spider to investigate, then schedules the next check.
* **Parameters:** `inst` (Entity)
* **Returns:** Nothing.

### `OnHit(inst, attacker)`
* **Description:** Combat hook called when cocoon takes damage. Triggers `spawn_investigators`.
* **Parameters:**  
  `inst` (Entity)  
  `attacker` (Entity)
* **Returns:** Nothing.

### `OnFreeze(inst)`
* **Description:** Responds to freeze event: plays frozen animation, stops spider spawning.
* **Parameters:** `inst` (Entity)
* **Returns:** Nothing.

### `OnUnFreeze(inst)`
* **Description:** Responds to unfreeze event: clears frozen override, resumes spawning.
* **Parameters:** `inst` (Entity)
* **Returns:** Nothing.

### `OnKilled(inst)`
* **Description:** Handles cocoon destruction. Releases remaining spiders, drops loot, plays destruction sound, and notifies nearby `cocoon_home` trees.
* **Parameters:** `inst` (Entity)
* **Returns:** Nothing.

### `SummonChildren(inst)`
* **Description:** Public API exposed as `inst.SummonChildren` for external triggers (e.g., `spider_whistle`). Spawns all remaining spiders immediately.
* **Parameters:** `inst` (Entity)
* **Returns:** Nothing.
* **Error states:** Silently returns if cocoon is dead or frozen.

## Events & listeners
- **Listens to:**
  - `animover` — triggers `go_to_burnt` after burnt pre-animation
  - `death` — triggers `OnKilled`
  - `activated` — triggers `spawn_investigators`
  - `freeze` — triggers `OnFreeze`
  - `onthaw` — triggers `OnThaw`
  - `unfreeze` — triggers `OnUnFreeze`
  - `lunarhailbuildupworked` — triggers `OnHit` (via `data.doer`)
  - `startquake`, `endquake` (on `TheWorld.net`) — manages `_quaking` state on released spiders
  - `timerdone` — calls `on_timer_finished` to cycle `look_for_fish`

- **Pushes:**
  - `burntup` — fired when entering burnt phase
  - `cocoon_destroyed` — notifies nearby `cocoon_home` trees (position passed in event data)