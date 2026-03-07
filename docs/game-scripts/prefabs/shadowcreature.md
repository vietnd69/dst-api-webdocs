---
id: shadowcreature
title: Shadowcreature
description: Spawns shadow creatures that attack sane players and drain sanity when targets are nearby.
tags: [combat, sanity, ai, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3cf01bde
system_scope: entity
---

# Shadowcreature

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadowcreature.lua` is a factory function that generates two distinct shadow creature prefabs: `crawlinghorror` and `terrorbeak`. These prefabs are non-persistent, sanity-aligned hostile entities that seek out and attack players who are currently insane, using dominance rules and proximity to select targets. The component orchestrates combat behavior via the `combat` and `health` components, interacts with the `shadowsubmissive` system, and dynamically modifies sanity aura. It delegates state management and brain logic to `SGshadowcreature` and `shadowcreaturebrain`.

## Usage example
```lua
-- The prefabs are automatically registered by this file; they are referenced via prefabs array.
-- Example instantiation by the game engine (not user-facing):
local crawlinghorror = SpawnPrefab("crawlinghorror")
crawlinghorror.Transform:SetPosition(x, y, z)
crawlinghorror.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `lootdropper`, `sanityaura`, `shadowsubmissive`, `transparentonsanity` (client-only), `locomotor`.  
**Tags added:** `shadowcreature`, `gestaltnoloot`, `monster`, `hostile`, `shadow`, `notraptrigger`, `shadow_aligned`, `NOBLOCK`, `shadowsubmissive`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sanityreward` | number | `nil` (per-instance, e.g. `TUNING.SANITY_MED`) | Sanity points granted to the killer on death. |
| `followtosea` | boolean | `false` | Whether this instance migrates to the ocean (set only for `terrorbeak` when ocean exists). |
| `ExchangeWithOceanTerror` | function | `nil` | Custom migration logic bound to `terrorbeak`. |
| `_deaggrotime` | number or nil | `nil` | Internal timer tracking when target became sane (reset on target switch). |
| `forceretarget` | boolean | `nil` | Flag used to force immediate target switch. |
| `wantstodespawn` | boolean | `nil` | Signal used by stategraph to prevent deaggro during despawn. |

## Main functions
### `retargetfn(inst)`
*   **Description:** Global retarget function used by the combat component. Scans all players to find the best valid target among insane players, prioritizing those with shadow dominance within half the range. Returns a target and a boolean indicating whether the current target should be forced to switch.
*   **Parameters:** `inst` (Entity) - the shadow creature instance.
*   **Returns:** `target` (Entity or `nil`) and `forcechange` (boolean).
*   **Error states:** Returns `nil, false` if no valid targets are found.

### `keeptargetfn(inst, target)`
*   **Description:** Custom target retention logic. Returns `true` to keep target, `false` to deaggro. Enforces a 2.5-second "sane grace period" after target sanity recovers, combined with hit/attack timers. Allows forced continuation during despawn or for non-player entities.
*   **Parameters:** `inst` (Entity), `target` (Entity or `nil`).
*   **Returns:** `true` to maintain target, `false` to drop target.
*   **Error states:** Does not validate argument types; may crash if `target.components.sanity` or `target.components.combat` are missing.

### `OnAttacked(inst, data)`
*   **Description:** Event handler triggered when the shadow creature is attacked. Sets the attacker as the new combat target and notifies one nearby ally shadow creature via `ShareTarget`.
*   **Parameters:** `inst` (Entity), `data` (table with `attacker` field).
*   **Returns:** Nothing.

### `OnNewCombatTarget(inst, data)`
*   **Description:** Notifies the brain of a new combat target and resets the internal deaggro timer.
*   **Parameters:** `inst` (Entity), `data` (table with `target` field).
*   **Returns:** Nothing.

### `OnDeath(inst, data)`
*   **Description:** Adjusts loot table on death if killed by a "crazy" entity, limiting loot to a single `nightmarefuel`.
*   **Parameters:** `inst` (Entity), `data` (table with optional `afflicter`).
*   **Returns:** Nothing.

### `CalcSanityAura(inst, observer)`
*   **Description:** Calculates sanity aura effect for observers. Returns `-TUNING.SANITYAURA_LARGE` if the shadow creature has a target and the observer is insane; otherwise `0`.
*   **Parameters:** `inst` (Entity), `observer` (Entity).
*   **Returns:** `number` — negative value for aura penalty, `0` otherwise.

### `CLIENT_ShadowSubmissive_HostileToPlayerTest(inst, player)`
*   **Description:** Client-side test for whether a shadow creature is hostile to a given player. Returns `true` if the player lacks `shadowdominance`, the creature has the player as target, or the player is insane.
*   **Parameters:** `inst` (Entity), `player` (Entity).
*   **Returns:** `boolean`.

### `ExchangeWithOceanTerror(inst)`
*   **Description:** Migration logic unique to `terrorbeak`. Replaces itself with an `oceanhorror` at the target’s location if the target is not on visual ground (e.g., in the ocean). Used to enable ocean-based targeting behavior.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `nil` — side-effect only.

### `MakeShadowCreature(data)`
*   **Description:** Main factory function that builds a prefab for a specific shadow creature variant using provided tuning data.
*   **Parameters:** `data` (table) — includes `name`, `build`, `bank`, `speed`, `health`, `damage`, `attackperiod`, `sanityreward`.
*   **Returns:** `Prefab` instance.

## Events & listeners
- **Listens to:**
  - `attacked` — triggers `OnAttacked`.
  - `newcombattarget` — triggers `OnNewCombatTarget`.
  - `death` — triggers `OnDeath`.
- **Pushes:**
  - None — this file does not directly fire events via `inst:PushEvent`.
