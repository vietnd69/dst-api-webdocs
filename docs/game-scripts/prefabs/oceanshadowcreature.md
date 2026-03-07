---
id: oceanshadowcreature
title: Oceanshadowcreature
description: A highly specialized entity component for the Ocean Horror (Shadow Creature) that manages boat attachment, sanity-based targeting, teleportation logic, and network-aware transparency and ripple effects.
tags: [combat, ai, sanity, locomotion, boss]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7e72af95
system_scope: entity
---

# Oceanshadowcreature

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`oceanshadowcreature` defines the behavior and properties for the Ocean Horror, a boss-style shadow creature that swims on oceans and can attach to boats. It integrates heavily with multiple components—`combat`, `health`, `sanity`, `locomotor`, `shadowsubmissive`, `transparentonsanity`, and `walkableplatform`—to implement complex targeting logic, sanity-based behavior, and dynamic physics transitions between ocean and boat modes. The component orchestrates state changes, teleportation, and ripple effects while enforcing strict dominance rules for shadow-aligned targets.

## Usage example
```lua
local inst = SpawnPrefab("oceanhorror")
inst.components.health:SetMaxHealth(500)
inst.components.combat:SetDefaultDamage(15)
inst.components.locomotor.walkspeed = 6
-- Automatically transitions between ocean and boat modes via internal logic
-- Uses SGoceanshadowcreature stategraph for animation/state control
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `lootdropper`, `sanityaura`, `shadowsubmissive`, `transparentonsanity`, `walkableplatform` (via external access to `.platform_radius`)  
**Tags added by the component's entity:** `shadowcreature`, `monster`, `hostile`, `shadow`, `notraptrigger`, `ignorewalkableplatforms`, `shadow_aligned`, `NOBLOCK`, `shadowsubmissive`, `NOCLICK` (ripples/attachpivot), `ignorewalkableplatformdrowning` (attachpivot)  
**Tags checked:** `boat`, `crazy`, `playerghost`, `shadowdominance`, `inherentshadowdominance`, `shadow_aligned`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._current_boat` | `entity?` | `nil` | Reference to the boat the creature is currently attached to (if any). |
| `inst._should_teleport_time` | `number` | `GetTime()` | Timestamp used to govern cooldowns for teleporting after attacks or detachment. |
| `inst._deaggrotime` | `number?` | `nil` | Timestamp marking when the current target last became sane (used in deaggro logic). |
| `inst._block_teleport_on_hit_task` | `DoTask?` | `nil` | Task handle blocking teleportation immediately after being attacked. |
| `inst._attach_to_boat_fn` | `function` | `AttachToBoat` | Cached reference to the boat attachment function (to avoid stategraph lookup issues). |
| `inst._detach_from_boat_fn` | `function` | `DetachFromBoat` | Cached reference to the boat detachment function. |
| `inst._current_boat_remove_listener` | `function?` | `nil` | Event callback handle for listening to the boat's `onremove` event. |
| `inst._ripples` | `entity?` | `nil` | Reference to the attached ripple FX entity (shared on client/server). |
| `inst.sanityreward` | `number` | `TUNING.SANITY_MED` | Sanity gained by a player who kills this entity. |

## Main functions
### `AttachToBoat(inst, boat)`
* **Description:** Attaches the Ocean Horror to a nearby boat, stops physics/locomotion, creates an attach pivot parent entity, and positions the creature relative to the boat’s edge. Sets collision capsule to boat size (`0.5`).
* **Parameters:**  
  `inst` (entity) — the Ocean Horror instance.  
  `boat` (entity) — the boat to attach to.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; assumes `boat.components.walkableplatform` exists.

### `DetachFromBoat(inst)`
* **Description:** Detaches the Ocean Horror from its current boat, removes the attach pivot, resets collision capsule to ocean size (`1.5`), and clears boat-related state.
* **Parameters:**  
  `inst` (entity) — the Ocean Horror instance.
* **Returns:** Nothing.

### `retargetfn(inst)`
* **Description:** Calculates the optimal target among players who are `crazy` and not ghosts. Prioritizes players with shadow dominance within a reduced range (`≤25%` of max range), otherwise selects the closest valid target. Returns target and a flag indicating whether to force a switch.
* **Parameters:**  
  `inst` (entity) — the Ocean Horror instance.
* **Returns:** `target` (entity?) — the selected player or `nil`.  
  If multiple targets exist and shadow-dominant targets are within range, returns `(target1, true)` to force a switch even if current target is valid.

### `keeptargetfn(inst, target)`
* **Description:** Implements custom target retention logic (used directly via `inst.ShouldKeepTarget` instead of via `combat` component). Continues targeting if the entity is marked for forced despawn, is non-player, or the target is `crazy`. If the target becomes sane, a deaggro timer starts; targeting ends only if the target has been sane for ≥2.5s, the entity hasn’t been attacked by the target in ≥6s, and the target hasn’t attempted an attack in ≥5s.
* **Parameters:**  
  `inst` (entity) — the Ocean Horror instance.  
  `target` (entity) — the proposed target to keep.
* **Returns:** `true` if the target should be retained, `false` to deaggro.

### `OnAttacked(inst, data)`
* **Description:** Triggered when the entity is attacked. Immediately switches combat target to the attacker, triggers one nearby `shadowcreature` helper to share aggro, and initiates a teleport event (e.g., boat jump or ocean leap). Blocks further teleportation for a short duration (see `_block_teleport_on_hit_task`).
* **Parameters:**  
  `inst` (entity) — the Ocean Horror instance.  
  `data` (table) — event data containing `{ attacker = entity }`.
* **Returns:** Nothing.

### `ExchangeWithTerrorBeak(inst)`
* **Description:** If a valid combat target exists and can be reached via visual ground, spawns a `terrorbeak` at a calculated position, transfers current health/combat target, and triggers a teleport FX. Used for boss transition mechanics.
* **Parameters:**  
  `inst` (entity) — the Ocean Horror instance.
* **Returns:** `nil` if exchange fails (e.g., no valid spawn point found); otherwise, the spawned terrorbeak instance.

## Events & listeners
- **Listens to:**  
  `"attacked"` — triggers `OnAttacked` to switch target, share aggro, and teleport.  
  `"newcombattarget"` — triggers `OnNewCombatTarget` to notify brain and reset deaggro timer.  
  `"death"` — triggers `OnDeath` to adjust loot drops if killed by a `crazy` afflicter.  
  `"onattackother"` — triggers `OnAttackOther` to set `_should_teleport_time`.  
  `"onremove"` — triggers `OnRemove` to clean up the parent pivot entity.  
  `"onsink"` (attachpivot only) — triggers `attachpivot_onsink` to force detachment.  
  `"onremove"` (ripples only) — triggers `OnRipplesReplicated` on client to wire up the parent reference.  
  `"ms_exchangeshadowcreature"` — pushed internally during `ExchangeWithTerrorBeak`.
- **Pushes:**  
  `"boatteleport"` — used to trigger boat teleport behavior with `{force_random_angle_on_boat = true}`.

## Notes
- The Ocean Horror uses a custom stategraph (`SGoceanshadowcreature`) and brain (`oceanshadowcreaturebrain`).
- `transparentonsanity` is client-only and affects visual transparency and ripple FX alpha.
- Boat attachment is checked periodically via `_update_task` (`FRAMES` interval). The creature detaches and repositions if moving toward dry land.
- Client-side `HostileToPlayerTest` function is set to `CLIENT_ShadowSubmissive_HostileToPlayerTest` to determine hostility based on `shadowdominance` and current combat target.
- Loot is shared via the global table `"ocean_shadow_creature"` (2x `nightmarefuel` drops with 100% and 50% chance).