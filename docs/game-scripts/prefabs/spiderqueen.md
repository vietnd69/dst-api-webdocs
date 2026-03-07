---
id: spiderqueen
title: Spiderqueen
description: A boss-level spider entity that commands a hive of followers, generates eggs and spiders, and uses shared aggro mechanics to coordinate attacks with nearby spiders.
tags: [combat, ai, boss, follower, spawn]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 15209c06
system_scope: entity
---

# Spiderqueen

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `spiderqueen` prefab represents a boss-level spider entity that acts as a leader, spawning followers (spiders) over time, sharing aggro with nearby allies, and applying a strong sanity aura to nearby players. It relies on multiple components to manage health, combat, follower behavior, sanity, sleep mechanics, movement, and production of offspring. It is distinct for its ability to spawn better spider variants (warrior/healer) under certain conditions and to coordinate target sharing across a local group of spiders.

## Usage example
This prefab is instantiated automatically by the world generation and game events. It is not intended for manual instantiation by modders. A typical usage context involves hooking into its events (e.g., `attacked`, `death`) or extending its behavior via stategraph or brain overrides.

```lua
-- Example: Listening to spiderqueen death event (from another script)
TheWorld:ListenForEvent("spiderqueen_killed", function(event)
    print("The spider queen has been slain!")
end, false)

-- Note: Direct instantiation requires full setup (not shown here)
-- as the prefabs/spiderqueen.lua defines its complete initialization logic.
```

## Dependencies & tags
**Components used:** `lootdropper`, `burnable`, `freezable`, `health`, `combat`, `sanityaura`, `sleeper`, `locomotor`, `eater`, `incrementalproducer`, `drownable`, `inspectable`, `leader`, `hauntable`

**Tags added:** `cavedweller`, `monster`, `hostile`, `epic`, `smallepic`, `largecreature`, `spiderqueen`, `spider`, `strongstomach`, `HORRIBLE_eater`

**Tags checked/used in filters:** `character`, `_combat`, `spiderwhisperer`, `spiderdisguise`, `INLIMBO`, `player`, `playerghost`, `monster`

## Properties
No public properties are exposed directly. All behavior is encapsulated in component instances and event listeners.

## Main functions
### `Retarget(inst)`
*   **Description:** Periodically updates the queen's combat target if the current target is lost. Prioritizes non-monsters or players within range, respecting must/cant tags.
*   **Parameters:** `inst` (entity) – the spiderqueen instance.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the queen is dead or sleeping.

### `CalcSanityAura(inst, observer)`
*   **Description:** Calculates the sanity aura value applied to an observer near the queen.
*   **Parameters:**  
    * `inst` (entity) – the spiderqueen instance (unused).  
    * `observer` (entity) – the nearby entity.  
*   **Returns:** `0` if the observer has tag `spiderwhisperer`; otherwise `-TUNING.SANITYAURA_HUGE`.

### `ShareTargetFn(dude)`
*   **Description:** Predicate used to determine whether another entity should share the queen’s current target.
*   **Parameters:** `dude` (entity) – the candidate follower.
*   **Returns:** `true` if the candidate is another `spiderqueen` that is alive; otherwise `false`.

### `OnAttacked(inst, data)`
*   **Description:** Event handler triggered when the queen is attacked. Sets the attacker as the new target and asks nearby spiders to join the fight.
*   **Parameters:**  
    * `inst` (entity) – the spiderqueen instance.  
    * `data` (table) – event data containing `attacker`.  
*   **Returns:** Nothing.

### `MakeBaby(inst)`
*   **Description:** Spawns a spider (standard, warrior, or healer) behind the queen and adds it as a follower. May spawn a stronger variant based on luck and tuned probabilities.
*   **Parameters:** `inst` (entity) – the spiderqueen instance.
*   **Returns:** Nothing.
*   **Error states:** May silently fail if spawning fails (e.g., `SpawnLootPrefab` returns `nil`).

### `BabyCount(inst)`
*   **Description:** Returns the current number of spider followers (via `leader.numfollowers`).
*   **Parameters:** `inst` (entity) – the spiderqueen instance.
*   **Returns:** `number` – number of followers.

### `MaxBabies(inst)`
*   **Description:** Calculates the maximum number of followers the queen can have based on nearby players.
*   **Parameters:** `inst` (entity) – the spiderqueen instance.
*   **Returns:** `number` – upper bound on follower count.

### `AdditionalBabies(inst)`
*   **Description:** Calculates the *incremental* production target — how many *additional* followers the queen should aim to produce.
*   **Parameters:** `inst` (entity) – the spiderqueen instance.
*   **Returns:** `number` – recommended additional follower count.

### `OnDead(inst)`
*   **Description:** Event handler triggered upon queen's death; awards the `spiderqueen_killed` radial achievement.
*   **Parameters:** `inst` (entity) – the spiderqueen instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `attacked` – triggers `OnAttacked(inst, data)` to retarget and share aggro.  
  - `death` – triggers `OnDead(inst)` to award achievement.

- **Pushes:**  
  -None identified in this file.