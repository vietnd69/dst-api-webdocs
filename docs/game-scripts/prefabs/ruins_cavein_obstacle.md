---
id: ruins_cavein_obstacle
title: Ruins Cavein Obstacle
description: Acts as a dynamic, physics-based obstacle in ruins caves that shrinks to allow character passage and falls when triggered, dealing damage or destroying nearby entities upon impact.
tags: [environment, collision, physics, obstacle]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b0564787
system_scope: environment
---

# Ruins Cavein Obstacle

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `ruins_cavein_obstacle` is a specialized environmental obstacle used in ruins cave maps. It functions as a large, static boulder that dynamically adjusts its collision radius based on nearby character proximity to allow passage when characters get close. When triggered to fall (via the `fall` function), it descends from height, lands, and transitions into a static obstacle with a reduced radius. Upon landing, it may strike nearby entities, destroying smashable items or attacking combat-capable entities with fall damage. The obstacle supports multiple visual variants (`version`) and includes sound and visual feedback (e.g., rubble FX, camera shake, shadow).

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddNetwork()
inst.entity:AddSoundEmitter()
inst.entity:AddMiniMapEntity()

MakeCharacterPhysics(inst, 99999, 0.5)
inst:AddTag("boulder")
inst:AddTag("charge_barrier")

inst:AddComponent("workable")
inst.components.workable:SetWorkAction(ACTIONS.MINE)
inst.components.workable:SetWorkLeft(TUNING.ROCKS_MINE)

inst.fall = fall -- assign the fall function
inst.fall(inst, {x = 10, y = 0, z = -5}) -- trigger a fall at position
```

## Dependencies & tags
**Components used:** `health`, `workable`, `lootdropper`, `inspectable`, `combat` (via external calls only).
**Tags added by this prefab:**  
- Primary entity (`ruins_cavein_obstacle`): `boulder`, `charge_barrier`, `smashable`, `quakedebris`, `_combat`, `INLIMBO` (removed on spawn), `irreplaceable` (removed on spawn)  
- Rubble FX entity (`ruins_cavein_obstacle_rubble_fx`): `FX`  
**Tags used for logic:** `character`, `locomotor`, `INLIMBO`, `flying`, `ghost`, `smashable`, `_combat`, `_inventoryitem`, `NPC_workable`, `CHOP_workable`, `DIG_workable`, `HAMMER_workable`, `MINE_workable`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | number | `math.random(1,4)` | Visual variant index (controls animation name suffix). |
| `maxradius` | number | `1` (set after fall completes) | Target radius to shrink toward; initially `99999` (via `MakeCharacterPhysics`). |
| `currentradius` | number | Dynamic | Current physics capsule radius; updated periodically based on character proximity. |
| `ischaracterpassthrough` | boolean | `true` initially | Indicates if character collisions are disabled for passage. |

## Main functions
### `fall(inst, pt)`
* **Description:** Initiates the falling sequence of the obstacle. Sets physics for freefall, spawns a shadow indicator, plays fall animation, and schedules ground detection updates. Upon ground contact, it triggers impact effects, destroys or damages nearby entities, and transitions the obstacle into static mode.
* **Parameters:**  
  - `inst` (Entity) – The obstacle instance.  
  - `pt` (table or Vector3) – Optional world position `{x, y, z}` where to begin fall. Defaults to current position.  
* **Returns:** Nothing.
* **Error states:** Does nothing if `pt` is `nil`.

### `OnUpdateObstacleSize(inst)`
* **Description:** Periodically updates the obstacle’s collision capsule radius to shrink as characters approach (within 2 units), allowing passage without collisions. If the radius reaches `maxradius`, it cancels the update task.
* **Parameters:**  
  - `inst` (Entity) – The obstacle instance.  
* **Returns:** Nothing.

### `SetCurrentRadius(inst, radius)`
* **Description:** Sets the physics capsule radius for the obstacle and updates the internal `currentradius` tracking. Used to enable/disable collision with characters dynamically.
* **Parameters:**  
  - `inst` (Entity) – The obstacle instance.  
  - `radius` (number) – New collision radius.  
* **Returns:** Nothing.

### `droponother(debris, other)`
* **Description:** Handles impact logic for entities near the obstacle upon landing. Kills `smashable` entities with health, destroys workable entities, or deals fall damage to combat-capable entities within 3 units.
* **Parameters:**  
  - `debris` (Entity) – Falling obstacle entity.  
  - `other` (Entity) – Nearby entity to affect.  
* **Returns:** Nothing.

### `OnChangeToObstacle(inst)`
* **Description:** Finalizes the transition after landing. Restores collision with characters, sets mass, collision group, and schedules periodic size updates to re-enable dynamic passage behavior.
* **Parameters:**  
  - `inst` (Entity) – The obstacle instance after landing.  
* **Returns:** Nothing.

### `setversion(inst, version)`
* **Description:** Assigns the obstacle's `version` property, which selects the animation set (`fallN`, `break_big`, `break_small`, etc.). Defaults to a random integer between 1 and 4.
* **Parameters:**  
  - `inst` (Entity) – The obstacle instance.  
  - `version` (number, optional) – Integer 1–4 (or `nil` for random).  
* **Returns:** Nothing.

### `CancelObstacleTask(inst)`
* **Description:** Cancels the periodic task that shrinks the obstacle radius and clears the `ischaracterpassthrough` flag.
* **Parameters:**  
  - `inst` (Entity) – The obstacle instance.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` (on debris) – Triggers `_endfall` or `ErodeAway` after animations complete.  
  - `onremove` (on shadow) – Cleans up shadow reference when removed.  
- **Pushes:**  
  - `healthdelta` (via `health:DoDelta` in `droponother`) – Notified of fall damage dealt.  
  - `entity_droploot` (via `lootdropper:DropLoot`) – Notifies system of loot drops.  
  - `detachchild` – Pushed when debris detaches from world geometry (e.g., falling through holes).  
