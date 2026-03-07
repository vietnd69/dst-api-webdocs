---
id: gestalt_guard_evolved
title: Gestalt Guard Evolved
description: Manages the behavior, combat, and lifecycle of the evolved Gestalt Guardian boss enemy, including ranged attacks, teleportation, sanity-based transparency, and loot generation.
tags: [combat, boss, ai, projectile, loot]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 200d2671
system_scope: entity
---

# Gestalt Guard Evolved

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`gestalt_guard_evolved` defines the full prefab and client-side behavior for the evolved Gestalt Guardian, a boss entity in DST. It integrates the `combat`, `health`, `lootdropper`, `follower`, `locomotor`, and `sanityaura` components to implement complex boss mechanics—including close-range physical attacks, mid-range moonglass-hat projectiles, and far-range multi-split projectiles—alongside sanity-based transparency, timer-based teleportation, and loot generation tied to pet count or health loss. The component also includes supporting projectile prefabs for ranged attacks.

## Usage example
```lua
-- This prefab is created by the game engine during world load or boss summoning.
-- Modders typically interact with it via its component API after spawning:

local guard = SpawnPrefab("gestalt_guard_evolved")
guard.components.combat:SetDefaultDamage(50) -- modify damage
guard.components.health:SetMaxHealth(500)
guard.components.lootdropper:SetLoot({"moonglass_charged", "purebrilliance"})
```

## Dependencies & tags
**Components used:** `combat`, `health`, `lootdropper`, `follower`, `locomotor`, `sanityaura`, `planardamage`, `planarentity`, `inspectable`, `timer`, `transparentonsanity`, `migrationpetsoverrider`, `weapon`, `projectile`, `burnable`, `followermemory`, `leader`, `inventoryitem`, `catcher`, `petitioner`.  
**Tags added:** `brightmare`, `brightmare_guard`, `crazy`, `extinguisher`, `lunar_aligned`, `NOBLOCK`, `scarytoprey`, `soulless`, `hostile`, `alwayshostile`.  
**Tags checked:** `player`, `gestalt_possessable`, `shadow_item`, `shadow_fire`, `nightmarecreature`, `shadowcreature`, `stalker`, `nightmare`, `shadow_fire`, `bedroll`, `knockout`, `sleeping`, `tent`, `waking`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_petcount` | number | `0` | Tracks how many Gestalt Guardians were defeated, influencing loot table weights. |
| `_times_hit_since_last_teleport` | number | `0` | Counts hits taken to determine when teleportation evades are allowed. |
| `blobhead` | Entity | `nil` | Client-only visual head prop, attached as a child entity. |
| `scrapbook_overridedata` | table | `{"head_fx_big", "brightmare_gestalt_head_evolved", "head_fx_big"}` | Data used for scrapbook display. |
| `no_spawn_fx` | boolean | `true` | Suppresses default spawn effects on the master instance. |

## Main functions
### `GetLevelForTarget(target)`
* **Description:** Determines how the guardian interacts with a target based on sanity and equipped shadow items. Returns a level (1–3) and optional sanity value for client-side transparency calculation.
* **Parameters:** `target` (Entity or `nil`) — the target entity to evaluate.
* **Returns:** `level` (number), `sanity` (number) — `level` encodes interaction (1: ignore, 2: observe, 3: attack); `sanity` is used for client-side alpha interpolation.
* **Error states:** If `target` is `nil`, returns `(1, 1)`.

### `KeepTarget(inst, target)`
* **Description:** Implements a target-keep rule: persists aggro if the target is the leader, or if recent attacks or attacks against this guardian occurred within a configured time window.
* **Parameters:** `inst` (Entity), `target` (Entity).
* **Returns:** `true` if aggro should be kept, `false` otherwise.

### `Retarget(inst)`
* **Description:** Returns the leader (owner) as a fallback if the current combat target is `nil`.
* **Parameters:** `inst` (Entity).
* **Returns:** `inst.components.follower:GetLeader()` or `nil`.

### `TryAttack_Teleport_Do(inst)`
* **Description:** Attempts to teleport the guardian near its combat target using a random walkable offset. Resets teleport-hit counter on success.
* **Parameters:** `inst` (Entity).
* **Returns:** `true` (always, regardless of success—teleport failure is non-fatal).
* **Error states:** May fail silently if no walkable offset is found within 10 tries.

### `TryAttack_Teleport_Evade(inst)`
* **Description:** Initiates a teleport evade only if the guard has been hit enough times and is outside the teleport cooldown.
* **Parameters:** `inst` (Entity).
* **Returns:** `true` if teleport was executed; `false` otherwise.

### `TryAttack_Close(inst)`
* **Description:** Attempts a standard melee attack via the `combat` component.
* **Parameters:** `inst` (Entity).
* **Returns:** Boolean result of `combat:TryAttack()`.

### `DoAttack_Mid(inst)`
* **Description:** Spawns a moonglass-hat projectile around the target and sets it to orbit. Sets default and planar damage values.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Does nothing if target is invalid.

### `TryAttack_Mid(inst)`
* **Description:** Triggers mid-range attack animation and sets cooldown timer.
* **Parameters:** `inst` (Entity).
* **Returns:** `true` if `doattack_mid` event initiated the correct state; `false` if already on cooldown or state mismatch.

### `DoAttack_Far(inst)`
* **Description:** Fires three split moonglass shards using the `gestalt_guard_projectile` prefab: center, left, and right.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `TryAttack_Far(inst)`
* **Description:** Triggers far-range attack and sets a cooldown timer.
* **Parameters:** `inst` (Entity).
* **Returns:** `true` if `doattack_far` event started the attack state; `false` otherwise.

### `SetHeadAlpha(inst, a)`
* **Description:** Sets the alpha channel of the client-side head blob (`blobhead`) for visual transparency updates.
* **Parameters:** `a` (number, 0–1) — alpha value.

### `OnDespawn(inst)`
* **Description:** Handles cleanup on despawn: detaches from leader pet leash, sets despawn loot (moonglass based on health %), drops loot, and removes the entity.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `SetupKilledPetLoot(inst, petcount)`
* **Description:** Configures loot table based on number of Gestalt Guardians killed.
* **Parameters:** `inst` (Entity), `petcount` (number).
* **Returns:** Nothing.

### `SetupDespawnPetLoot(inst)`
* **Description:** Generates loot with `moonglass_charged` count proportional to current HP % and current tuning.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `Client_CalcTransparencyRating(inst, observer)`
* **Description:** Calculates client-side transparency for the boss based on observer sanity and current combat status. Returns a number between `0.2` and `TUNING.GESTALT_COMBAT_TRANSPERENCY`.
* **Parameters:** `inst` (Entity), `observer` (Entity).
* **Returns:** `number` — transparency level.

### `OnAttacked(inst, data)`
* **Description:** Handles incoming attacks: increments hit counter and switches/aggroes target if the attacker is not the leader.
* **Parameters:** `inst` (Entity), `data` (table) — includes `attacker`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `attacked` — fires `OnAttacked`, triggering retargeting and shared aggro.
  - `onattackother` — fires `onattackother`, extinguishing shadow-fire effects.
  - `onremove` — handled via `OnEntitySleep`/`OnEntityWake` to manage sleep-despawn timer.
- **Pushes:**
  - `teleport` — triggers teleportation event.
  - `doattack_mid`, `doattack_far` — initiates ranged attack animations/states.
  - `leaderchanged` — pushed by `follower` component.
  - `hostileprojectile`, `onthrown`, `entity_droploot` — via components or helpers.
  - `buff_expired`, `onhitother`, `hostileprojectile` — via related components.
