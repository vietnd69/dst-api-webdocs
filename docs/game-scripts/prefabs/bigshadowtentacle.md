---
id: bigshadowtentacle
title: Bigshadowtentacle
description: A boss-like shadow entity that engages in combat by attacking nearby targets, tracking them within range, and periodically reevaluating its target.
tags: [combat, boss, enemy, shadow, npc]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9833d298
system_scope: combat
---

# Bigshadowtentacle

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `bigshadowtentacle` prefab is a hostile shadow entity that acts as a combatant with auto-targeting capabilities. It is typically used in high-stakes encounters (e.g., boss fights or seasonal events) and relies on the `combat`, `sanityaura`, and `inspectable` components. It automatically selects valid targets from nearby characters, animals, or monsters while respecting tags and visibility rules, and reduces nearby players' sanity over time.

## Usage example
This prefab is used internally by the game and not meant to be spawned manually in most mods. For modders, it can be referenced as a template or extended via stategraph customization:

```lua
local inst = CreateEntity()
inst.prefab = "bigshadowtentacle"
inst:AddComponent("combat")
inst.components.combat:SetRange(TUNING.TENTACLE_ATTACK_DIST)
inst.components.combat:SetDefaultDamage(TUNING.BIG_TENTACLE_DAMAGE)
-- ... additional setup needed for full behavior
```

Note: Full behavior requires additional setup (e.g., `sanityaura`, `inspectable`, `SGbigshadowtentacle` stategraph, and physical/animation setup) as defined in the main constructor.

## Dependencies & tags
**Components used:**  
- `combat` — sets attack range, damage, period, retargeting, and keep-target logic  
- `sanityaura` — applies a sanity drain aura  
- `inspectable` — allows inspection via UI  

**Tags added:**  
- `"shadow"`  
- `"notarget"`  
- `"NOCLICK"`  
- `"shadow_aligned"`  

## Properties
No public properties are defined in this prefab's constructor beyond component-level state (e.g., `inst.components.combat.target`). Internal private variables `_last_attacker` and `_last_attacked_time` are declared but unused.

## Main functions
No public functions are defined in the `bigshadowtentacle` prefab itself. All logic is encapsulated in:
- The factory function `fn()` (entry point to entity construction)
- Three inner helper functions used by the combat system:
  - `retargetfn(inst)` — determines the next target
  - `shouldKeepTarget(inst, target)` — determines whether to continue attacking the current target
  - `testremove(inst)` — schedules entity removal after 30 seconds if idle

### `retargetfn(inst)`
*   **Description:** Returns a valid combat target from among nearby characters, animals, or monsters. Ignores dead or hidden entities (e.g., in a "hiding" stategraph state). Excludes the tentacle itself and entities tagged `minotaur`.
*   **Parameters:** `inst` (Entity) — the big shadow tentacle instance.
*   **Returns:** `Entity?` — a reference to a valid target, or `nil` if none found.
*   **Error states:** May return `nil` if no entities meet criteria or no valid path exists.

### `shouldKeepTarget(inst, target)`
*   **Description:** Evaluates whether the tentacle should continue attacking its current target.
*   **Parameters:**  
    - `inst` (Entity) — the tentacle  
    - `target` (Entity) — the current target  
*   **Returns:** `boolean` — `true` if the target is valid, visible, non-dead, and within `TUNING.TENTACLE_STOPATTACK_DIST`, and is either a player or not currently hiding.
*   **Error states:** Returns `false` if `target` is `nil`, invalid, invisible, or hidden.

### `testremove(inst)`
*   **Description:** Checks if the entity is idle; if so, pushes a `"leave"` event to signal removal. Otherwise, rechecks in 30 seconds.
*   **Parameters:** `inst` (Entity) — the tentacle instance.
*   **Returns:** Nothing.
*   **Error states:** Recursively calls itself every 30 seconds until `"idle"` state is reached or the entity is destroyed.

## Events & listeners
- **Listens to:** None directly (stategraph and combat system handle most state transitions).
- **Pushes:**  
  - `"arrive"` — fired on creation (post-construction).  
  - `"leave"` — fired when `testremove` detects idle state and schedules removal.