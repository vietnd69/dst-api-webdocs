---
id: shadowthrall_mouth
title: Shadowthrall Mouth
description: A hostile NPC component that manages stealth behavior, combat functionality, and planar damage effects for the Shadowthrall Mouth entity.
tags: [combat, stealth, planar, ai, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 28ad3a4c
system_scope: entity
---

# Shadowthrall Mouth

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shadowthrall_mouth` prefab implements a boss-like hostile entity with stealth capabilities, combat mechanics, and planar damage. It supports dynamic health, sanity aura effects, and loot dropping. The component is tightly integrated with the `SGshadowthrall_mouth` stategraph and `shadowthrall_mouth_brain` AI. Key behaviors include transitioning between stealth and active modes (adjusting movement speed, attack period, and detection range), maintaining bite target locks to prevent overlapping damage, and synchronizing visual effects with a duplicate FX entity.

## Usage example
```lua
-- Typical usage occurs automatically when the prefab is spawned
local mouth = SpawnPrefab("shadowthrall_mouth")

-- Access core behaviors after spawn
mouth.components.health:SetMaxHealth(100)
mouth.components.combat:SetDefaultDamage(20)
mouth.components.sanityaura.aura = -TUNING.SANITYAURA_MED
mouth.components.locomotor.walkspeed = 5.5
```

## Dependencies & tags
**Components used:** `sanityaura`, `locomotor`, `health`, `combat`, `timer`, `planarentity`, `planardamage`, `lootdropper`, `colouradder`, `bloomer`, `knownlocations`, `inspectable`  
**Tags added:** `monster`, `hostile`, `scarytoprey`, `shadowthrall`, `shadow_aligned`  
**Tags conditionally added/removed:** `stealth` (based on state tag)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_stealth` | boolean | `nil` | Whether the mouth is currently in stealth mode. |
| `_bite_target` | Entity | `nil` | The entity currently being bitten; used to prevent overlapping bite attempts. |
| `dupe` | Entity | `nil` | Reference to the attached visual FX duplicate entity. |
| `displaynamefn` | function | `DisplayNameFn` | Callback to provide dynamic display name based on player alignment. |
| `CanMouseThrough` | function | `CanMouseThrough` | Returns `[stealth, true]` — allows mouse interaction only outside stealth. |

## Main functions
### `TryRegisterBiteTarget(inst, target)`
* **Description:** Attempts to register a target for a bite attack. Prevents multiple shadowthrall mouths from biting the same target simultaneously during stealth mode.
* **Parameters:** `target` (Entity or `nil`) — the entity to target.
* **Returns:** `boolean` — `true` if successfully registered, `false` otherwise.
* **Error states:** Returns `false` if `target` is `nil`, invalid, already targeted, or if another stealth-mouth is already biting it.

### `ClearBiteTarget(inst, cooldown)`
* **Description:** Clears the current bite target, optionally scheduling a cooldown before allowing re-targeting.
* **Parameters:** `cooldown` (number or `nil`) — delay in seconds before the target may be targeted again.
* **Returns:** Nothing.
* **Error states:** No effect if `_bite_target` is `nil`.

### `OnNewState(inst)`
* **Description:** Called on state transitions to enable/disable stealth mode, toggling physics, visual effects, and combat parameters.
* **Parameters:** None (uses `inst.sg:HasStateTag("stealth")` internally).
* **Returns:** Nothing.

### `RetargetFn(inst)`
* **Description:** Brain retarget function — returns the closest player within aggro range unless a valid close target exists (especially in stealth).
* **Parameters:** None.
* **Returns:** `Entity?` — the selected target, or `nil`.

### `KeepTargetFn(inst, target)`
* **Description:** Determines whether the current combat target remains valid (e.g., not too far or no longer targetable).
* **Parameters:** `target` (Entity) — the candidate target.
* **Returns:** `boolean` — `true` if the target should be kept.

## Events & listeners
- **Listens to:** `newstate` — triggers `OnNewState` to respond to state changes.
- **Pushes (via dupe):** `dupe_animover` — fired when the duplicate FX animation completes.