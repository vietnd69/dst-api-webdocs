---
id: fused_shadeling
title: Fused Shadeling
description: Prefab for a hostile boss-like shadow entity that spawns from portals, maintains aggression range, and interacts with sanity, combat, and planar damage systems.
tags: [combat, ai, boss, shadow, planar]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d5404824
system_scope: entity
---

# Fused Shadeling

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`fused_shadeling` is a prefab definition for a mobile, aggressive shadow entity that exhibits boss-like behavior in DST. It integrates with multiple core systems: `combat` (aggression, retargeting, attack range), `locomotor` (movement speed, creep ignoring), `sanityaura` (sanity drain based on target state), `planardamage` (extra planar damage output), and `entitytracker` (tracking its portal of origin). The entity de-spawns if its spawn portal is destroyed while inactive, or emits a custom `do_despawn` event otherwise.

## Usage example
This prefab is not manually instantiated by mods; it is loaded automatically by the game when spawned as part of a level or event. However, a modder may reference it in loot tables or respond to its events:
```lua
-- Example: Listen for fused_shadeling's do_despawn event
TheWorld:ListenForEvent("do_despawn", function(event)
    local inst = event.inst
    if inst and inst.prefab == "fused_shadeling" then
        -- Custom cleanup or countermeasure logic
    end
end, TheWorld)

-- Example: Reference its loot table
AddPreInitFunction(function()
    AddPrefabPostInit("fused_shadeling", function(inst)
        inst.components.lootdropper:AddLoot("custom_item", 0.1)
    end)
end)
```

## Dependencies & tags
**Components used:** `sanityaura`, `combat`, `entitytracker`, `health`, `inspectable`, `knownlocations`, `locomotor`, `lootdropper`, `planarentity`, `planardamage`, `timer`, `transparentonsanity` (client-only).  
**Tags added:** `hostile`, `monster`, `notraptrigger`, `shadow`, `shadow_aligned`, `NOBLOCK`.

## Properties
No public properties are exposed for direct access. Internal state is managed via components and event listeners.

## Main functions
### `CalcSanityAura(inst, observer)`
* **Description:** Calculates the sanity aura effect applied to a given observer. Returns a negative value when the observer is targeted (large drain) or targeted by someone else (medium drain); otherwise zero.
* **Parameters:** `inst` (Entity) — the fused_shadeling instance; `observer` (Entity) — the player being affected.
* **Returns:** number — either `-TUNING.SANITYAURA_LARGE`, `-TUNING.SANITYAURA_MED`, or `0`.

### `keep_target(inst, current_target)`
* **Description:** Determines if the current target remains within aggression range, using the known spawn location as reference. Used by the `combat` component to decide whether to retain the current target.
* **Parameters:** `inst` (Entity) — the fused_shadeling instance; `current_target` (Entity) — the entity currently being targeted.
* **Returns:** boolean — `true` if within squared aggro range, otherwise `false`.

### `try_retarget(inst)`
* **Description:** Attempts to find a new valid target within range using `FindEntity`. Checks the target list against combat constraints and retarget filters (tags, targetability). Prefers targeting via the tracked portal.
* **Parameters:** `inst` (Entity) — the fused_shadeling instance.
* **Returns:** Entity or `nil` — a newly found target, or `nil` if none found or current target is still in range.

### `OnSpawnedBy(inst, portal, delay)`
* **Description:** Called when the fused_shadeling is spawned by a portal. Registers the portal as a tracked entity and starts a spawn delay state.
* **Parameters:** `inst` (Entity) — the fused_shadeling instance; `portal` (Entity or `nil`) — the spawning portal; `delay` (number or `nil`) — optional delay duration.
* **Returns:** Nothing.

### `on_timer_done(inst, data)`
* **Description:** Event handler for `timerdone`. Remembers the spawn position when the `initialize` timer completes.
* **Parameters:** `inst` (Entity); `data` (table) — must contain `name == "initialize"`.
* **Returns:** Nothing.

### `on_attacked(inst, data)`
* **Description:** Sets the attacker as the current combat target upon being attacked.
* **Parameters:** `inst` (Entity); `data` (table) — must contain `attacker` (Entity).
* **Returns:** Nothing.

### `CLIENT_CalculateSanityTransparencyForPlayer(inst, player)`
* **Description:** Client-side callback used by `transparentonsanity` to determine entity transparency based on player sanity. Returns a fixed minimum transparency or blends based on player sanity percentage.
* **Parameters:** `inst` (Entity); `player` (Entity) — the player whose transparency state to evaluate.
* **Returns:** number — clamped between `MIN_TRANSPARENCY` (`0.4`) and `1.0`.

## Events & listeners
- **Listens to:** `timerdone` — handled by `on_timer_done`; `attacked` — handled by `on_attacked`; `onremove` (on portal) — handled by `inst._on_portal_removed`.
- **Pushes:** `do_despawn` — pushed when the entity’s spawn portal is removed but the entity is not asleep.
