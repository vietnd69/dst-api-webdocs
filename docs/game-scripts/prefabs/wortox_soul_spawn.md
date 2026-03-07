---
id: wortox_soul_spawn
title: Wortox Soul Spawn
description: Handles the behavior and lifecycle of Wortox's thrown soul projectile, including homing, tail spawning, soul stealing, and soul spear effects.
tags: [combat, projectile, wortox, fx, soul]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 61890827
system_scope: entity
---

# Wortox Soul Spawn

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wortox_soul_spawn` is a prefab component that defines the behavior of Wortox's thrown soul projectile. It acts as a projectile entity that seeks out and delivers souls to nearby "soul stealer" players, applying homing logic, managing soul spear damage ticks, and spawning visual effects (tails) during flight. It integrates closely with the `projectile`, `weapon`, `updatelooper`, and `skilltreeupdater` components to handle combat, targeting, and skill-based modifiers.

## Usage example
```lua
local soul_spawn = SpawnPrefab("wortox_soul_spawn")
soul_spawn.components.projectile:Throw(owner, target, attacker)
soul_spawn:Setup(target)
-- The projectile will automatically seek the target and apply effects based on player skills
```

## Dependencies & tags
**Components used:** `combat`, `explosiveresist`, `health`, `highlight`, `inventory`, `inventoryitem`, `projectile`, `skilltreeupdater`, `updatelooper`, `weapon`  
**Tags added:** `weapon`, `projectile`  
**Tags checked:** `FX`, `NOCLICK`, `INLIMBO`, `soul`, `noauradamage`, `companion`, `soulstealer`, `playerghost`, `nomorph`, `silentmorph`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_target` | net_entity | `nil` | Networked reference to the target entity for the spawn effect. |
| `_hastail` | net_bool | `false` | Networked flag indicating whether a tail is active. |
| `_tails` | table | `nil` | Table tracking active tail FX entities (client-side only). |
| `_tinttarget` | Entity | `nil` | The entity receiving color tint effects during the spawn animation (client-side). |
| `soul_spear_cooldown` | number | `nil` | Cooldown frames before next soul spear damage tick. |
| `_timeouttask` | Task | `nil` | Task handle for the projectile's timeout timer. |
| `_seektask` | Task | `nil` | Periodic task for seeking soul stealers. |

## Main functions
### `OnUpdateProjectileTail(inst)`
*   **Description:** Updates all active tail FX entities to align with the projectile's current position and orientation, and spawns new tail segments at intervals while visible.
*   **Parameters:** `inst` (Entity) — the soul spawn projectile instance.
*   **Returns:** Nothing.
*   **Error states:** Runs only on the client (`TheNet:IsDedicated()` is false).

### `OnHit(inst, attacker, target)`
*   **Description:** Handles projectile impact — spawns visual FX, attempts to add a soul to the target's inventory (if open), or drops a soul item on the ground.
*   **Parameters:**  
    * `inst` (Entity) — the soul spawn projectile.  
    * `attacker` (Entity) — the entity that threw the projectile (may be `nil`).  
    * `target` (Entity) — the entity hit by the projectile.  
*   **Returns:** Nothing.
*   **Error states:** No effect if `target` is `nil`; projectile is removed after impact.

### `OnThrown(inst, owner, target, attacker)`
*   **Description:** Initializes projectile behavior on throw: sets homing, starts timeout and seek tasks, hides "blob" animation, and triggers tail generation.
*   **Parameters:**  
    * `inst` (Entity) — the soul spawn projectile.  
    * `owner` (Entity) — the entity that threw the projectile.  
    * `target` (Entity) — the intended target entity.  
    * `attacker` (Entity) — the actual attacker (e.g., for skill bonuses).  
*   **Returns:** Nothing.
*   **Error states:** Adjusts lifetime based on skill `wortox_thief_2`; skips tail creation on dedicated servers.

### `RethrowProjectile(inst, speed, soulthiefreceiver)`
*   **Description:** Reprojects the soul toward a new receiver (e.g., after repel effect) with updated parameters.
*   **Parameters:**  
    * `inst` (Entity) — the soul spawn projectile.  
    * `speed` (number) — new projectile speed.  
    * `soulthiefreceiver` (Entity) — new target entity.  
*   **Returns:** Nothing.
*   **Error states:** No effect if `soulthiefreceiver` is invalid.

### `SoulSpearTick(inst, owner)`
*   **Description:** Periodically scans for nearby combat-capable entities and deals soul-based damage, applying cooldowns and modifiers based on skill `wortox_souljar_3`.
*   **Parameters:**  
    * `inst` (Entity) — the soul spawn projectile.  
    * `owner` (Entity) — the owner performing the attack (for damage scaling).  
*   **Returns:** Nothing.
*   **Error states:** Skips tick if `owner` is invalid or cooldown active; checks `wortox_souljar_3` for bonus damage scaling.

### `SeekSoulStealer(inst)`
*   **Description:** Finds eligible soul stealers within range, selects a primary receiver, and throws the projectile toward them with skill-based homing and soul spear logic.
*   **Parameters:** `inst` (Entity) — the soul spawn projectile.
*   **Returns:** Nothing.
*   **Error states:** Uses small or large range based on skill `wortox_thief_1`; respects `wortox_thief_4` repel and `wortox_thief_3` soul spear.

### `OnTimeout(inst)`
*   **Description:** Handles timeout expiration — cancels seek task, animates "idle_pst", plays sound, and triggers soul healing.
*   **Parameters:** `inst` (Entity) — the soul spawn projectile.
*   **Returns:** Nothing.

### `Setup(inst, target)`
*   **Description:** Initializes target reference and plays spawn sound. Required for the spawn effect FX.
*   **Parameters:**  
    * `inst` (Entity) — the soul spawn projectile.  
    * `target` (Entity) — the intended recipient for the spawn effect.  
*   **Returns:** Nothing.

### `OnUpdateTargetTint(inst)`
*   **Description:** Applies and fades color tint on the target during the spawn animation (client-side).
*   **Parameters:** `inst` (Entity) — the soul spawn projectile instance.
*   **Returns:** Nothing.
*   **Error states:** Stops updating if target becomes invalid or animation completes.

### `OnTargetDirty(inst)`
*   **Description:** Responds to target change by starting tint update loop and registering cleanup.
*   **Parameters:** `inst` (Entity) — the soul spawn projectile.
*   **Returns:** Nothing.

### `OnHasTailDirty(inst)`
*   **Description:** Responds to `_hastail` change by starting or stopping tail generation loop.
*   **Parameters:** `inst` (Entity) — the soul spawn projectile.
*   **Returns:** Nothing.

### `PushColour(inst, addval, multval)`
*   **Description:** Sets or overrides color properties on the highlight component orAnimState for tinting.
*   **Parameters:**  
    * `inst` (Entity) — entity whose color to modify.  
    * `addval` (number) — additive tint value.  
    * `multval` (number) — multiplicative tint value.  
*   **Returns:** Nothing.

### `PopColour(inst)`
*   **Description:** Resets color overrides applied by `PushColour`.
*   **Parameters:** `inst` (Entity) — entity whose color to reset.
*   **Returns:** Nothing.

### `OnRemoveEntity(inst)`
*   **Description:** Cleanup handler that pops color tint when the projectile is removed.
*   **Parameters:** `inst` (Entity) — the soul spawn projectile.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  * `targetdirty` — triggers `OnTargetDirty` on client.  
  * `hastaildirty` — triggers `OnHasTailDirty` on client.  
  * `animover` — removes the entity or prepares for timeout state.  
  * `onremove` (on tail entities) — removes tail from internal `_tails` table.  
- **Pushes:**  
  * None directly (relies on attached components like `projectile` and `inventoryitem` for events).