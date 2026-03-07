---
id: eyeturret
title: Eyeturret
description: A deployable companion turret that automatically engages enemies within range, emits a dynamic light, and shares aggro with nearby turrets.
tags: [combat, deployable, companion, light, ai]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0e48b4f0
system_scope: entity
---

# Eyeturret

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`eyeturret` is a companion entity that serves as a deployable defensive structure. When placed, it functions as an autonomous combatant that targets and attacks enemies within its range, maintains a dynamic light source that pulses on activation, and shares aggro with up to 10 other turrets in proximity. It is built as a two-part prefab: the full entity (`eyeturret`) and a non-networked base placeholder (`eyeturret_base`) used for visual synchronization during deployment and skinning.

The turret integrates multiple core components: `health`, `combat`, `inventory`, `sanityaura`, `lootdropper`, and `inspectable`, and is controlled by the `SGeyeturret` state graph and `eyeturretbrain`. It is typically deployed via the `eyeturret_item` deployable item, which spawns and initializes the main entity.

## Usage example
```lua
-- Deploy an eyeturret at position (10, 0, 10)
local item = SpawnPrefab("eyeturret_item")
item.Transform:SetPosition(10, 0, 10)
item:PushEvent("deploy", { pt = { x = 10, y = 0, z = 10 }, deployer = player })

-- Access deployed turret properties (post-deploy)
local turret = SpawnPrefab("eyeturret")
turret.components.combat:SetDefaultDamage(15)
turret.components.health:SetMaxHealth(300)
```

## Dependencies & tags
**Components used:** `health`, `combat`, `inventory`, `sanityaura`, `lootdropper`, `inspectable`, `deployable`, `light`, `minimap`, `sound`, `animstate`, `transform`, `network`, `physics`.

**Tags:** Adds `eyeturret`, `companion`, `largecreature` (to spawned weapon for sound effects); checks `player`, `eyeturret`, `_combat`, `INLIMBO`, `engineering`, `debuffed`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_lightframe` | `net_smallbyte` (networked) | `0` | Tracks the current light animation frame; controls radius, intensity, and falloff of the emitted light. |
| `_lighttask` | `DoTask` or `nil` | `nil` | Task responsible for updating the light animation. |
| `base` | `Entity` | `eyeturret_base` instance | Visual base entity parented to the turret, used for skin syncing. |
| `syncanim` | function | `syncanim` function | Helper to synchronize animation states between turret and base. |
| `syncanimpush` | function | `syncanimpush` function | Helper to push animations to both turret and base anim states. |
| `triggerlight` | function | `triggerlight` function | Resets and re-initiates the light pulse animation. |

## Main functions
### `triggerlight(inst)`
* **Description:** Resets the light frame to 0 and starts the light pulsing animation by calling `OnLightDirty`.
* **Parameters:** `inst` (Entity) — the eyeturret instance.
* **Returns:** Nothing.

### `retargetfn(inst)`
* **Description:** Determines the next valid target for the turret. Prioritizes entities currently targeted by players or that are targeting the turret, provided they are within range and not excluded by tags. If the current target remains valid and nearby, it is retained.
* **Parameters:** `inst` (Entity) — the eyeturret instance.
* **Returns:** Entity (new target) or `nil` (no suitable target found).
* **Error states:** Returns `nil` if no entities match criteria or all candidates are invalid.

### `shouldKeepTarget(inst, target)`
* **Description:** Decision function used by `combat` to decide whether to retain the current target.
* **Parameters:**  
  `inst` (Entity) — the eyeturret instance.  
  `target` (Entity) — the proposed target.
* **Returns:** `true` if target is valid and within range (`TUNING.EYETURRET_RANGE + 3`), otherwise `false`.

### `ShareTargetFn(dude)`
* **Description:** Predicate used when sharing aggro; verifies the entity is another eyeturret.
* **Parameters:** `dude` (Entity) — candidate helper turret.
* **Returns:** `true` if `dude:HasTag("eyeturret")`, otherwise `false`.

### `ShouldAggro(combat, target)`
* **Description:** Controls whether the turret should engage a given target. Allows player aggression only if PvP is enabled; all other entities are always aggroed.
* **Parameters:**  
  `combat` (Combat) — the combat component instance.  
  `target` (Entity) — the candidate target.
* **Returns:** `true` if PvE or target is non-player, or if PvP is enabled and target is a player; otherwise `false`.

### `OnAttacked(inst, data)`
* **Description:** Event handler fired when the turret is attacked. Sets the attacker as the new target and shares aggro with up to 10 nearby turrets within a 15-unit radius.
* **Parameters:**  
  `inst` (Entity) — the eyeturret instance.  
  `data` (table) — event data, optionally containing `attacker`.
* **Returns:** Nothing.

### `EquipWeapon(inst)`
* **Description:** Spawns and equips a non-networked weapon entity with the turret’s damage and range settings. The weapon uses `eye_charge` as its projectile and auto-cleans up when dropped.
* **Parameters:** `inst` (Entity) — the eyeturret instance.
* **Returns:** Nothing.

### `ondeploy(inst, pt, deployer)`
* **Description:** Deployment callback for `eyeturret_item`. Spawns a new `eyeturret`, positions it at `pt`, configures collision and animation, and removes the deployer item.
* **Parameters:**  
  `inst` (Entity) — the deployable item instance.  
  `pt` (table) — `{x, y, z}` deployment position.  
  `deployer` (Entity or nil) — entity that deployed the item.
* **Returns:** Nothing.

### `syncanim(inst, animname, loop)`
* **Description:** Plays the given animation on both the turret and base anim states.
* **Parameters:**  
  `inst` (Entity) — the eyeturret instance.  
  `animname` (string) — animation name.  
  `loop` (boolean) — whether to loop the animation.
* **Returns:** Nothing.

### `syncanimpush(inst, animname, loop)`
* **Description:** Pushes the given animation onto both the turret and base anim state queues.
* **Parameters:** Same as `syncanim`.
* **Returns:** Nothing.

### `FixupSkins(inst)`
* **Description:** Applies skin overrides to the turret’s base so that visual parts (e.g., “horn”) match the parent’s skin if present.
* **Parameters:** `inst` (Entity) — the turret base instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `attacked` — triggers `OnAttacked` to set attacker as target and share aggro.  
  - `lightdirty` (client only) — triggers `OnLightDirty` to update the light animation.

- **Pushes:**  
  None directly; relies on component events (`combat`, `health`, etc.) and internal `PushEvent("lightdirty")` for light sync (handled via the `_lightframe` network variable).