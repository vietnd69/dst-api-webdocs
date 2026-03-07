---
id: lightninggoat
title: Lightninggoat
description: Implements the lightning goat entity with charging behavior, passive electric retaliation, and herd-based AI.
tags: [combat, ai, animal, electricity, herd]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 47ede9db
system_scope: entity
---

# Lightninggoat

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lightninggoat` prefab defines the behavior for the Lightning Goat creature in DST. It handles state transitions (especially charging and discharging), combat interactions (including electric retaliation when charged), herd membership, and dynamic lighting effects. Key interactions include responding to attacks (charging on electric stimuli), discharging after a fixed number of cycles, and sharing aggro with nearby charged lightning goats.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("lightninggoat")
-- The full initialization is handled by Prefab("lightninggoat", fn, ...)
-- Typical modding usage includes:
inst.components.health:SetMaxHealth(200)
inst.components.combat:SetDefaultDamage(50)
```

## Dependencies & tags
**Components used:** `health`, `combat`, `sleeper`, `lootdropper`, `inspectable`, `knownlocations`, `herdmember`, `timer`, `saltlicker`, `locomotor`, `animstate`, `transform`, `soundemitter`, `dynamicshadow`, `light`, `network`  
**Tags added:** `lightninggoat`, `animal`, `lightningrod`, `herdmember`, `saltlicker`, `charged`, `electricdamageimmune` (temporarily added on charge)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `charged` | boolean | `false` | Whether the goat is currently charged and emitting electricity. |
| `chargeleft` | number | `nil` | Number of world cycles remaining before discharge; set on charge. |
| `setcharged` | function | `setcharged` (local) | Public reference to the charge function, exposed to allow external triggers (e.g., `lightningstrike`). |

## Main functions
### `setcharged(inst, instant)`
*   **Description:** Activates the goat's charged state: adds electric immunity and charged tags, enables lighting, plays the shocked animation, and starts a countdown (default 3 cycles) before discharge. Must be called on the master simulation.
*   **Parameters:**  
    `inst` (Entity instance) – the lightning goat entity.  
    `instant` (boolean) – if `true`, skips the "shocked" transition animation and applies the charged look immediately.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect if the entity is dead (`health:IsDead()`).

### `discharge(inst)`
*   **Description:** Deactivates the charged state: removes tags, stops lighting, resets loot table to default, and triggers the "discharge" state graph animation.
*   **Parameters:**  
    `inst` (Entity instance) – the lightning goat entity.
*   **Returns:** Nothing.

### `OnAttacked(inst, data)`
*   **Description:** Handles incoming damage. If the goat is *not* charged and receives electric stimuli, it triggers `setcharged`. If already *charged*, it deals electric damage to the attacker (unless insulated or projectile-based). Also engages combat with the attacker and shares aggro with nearby charged lightning goats within range.
*   **Parameters:**  
    `inst` (Entity instance) – the lightning goat entity.  
    `data` (table) – combat attack data containing `attacker`, `stimuli`, `weapon`, and other combat info.
*   **Returns:** Nothing.

### `OnElectrocute(inst)`
*   **Description:** Event callback for "electrocute" events. Triggers `setcharged(inst)` to forcibly charge the goat.
*   **Parameters:**  
    `inst` (Entity instance) – the lightning goat entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked` – handled by `OnAttacked`.  
  `electrocute` – handled by `OnElectrocute`.  
  `lightningstrike` – handled by `setcharged`.  
  `spawnedforhunt` – handled by `onspawnedforhunt` (triggers a world lightning strike).  
  `timerdone`, `enterlimbo`, `exitlimbo`, `gotosleep`, `onwakeup`, `freeze`, `unfreeze`, `death` – managed internally by `saltlicker` via `SetUp`.
- **Pushes:** None.

## Save/Load Integration
- `inst.OnSave = OnSave(inst, data)` – saves `charged` and `chargeleft` if the goat is charged.  
- `inst.OnLoad = OnLoad(inst, data)` – restores charged state and charge count on load using `setcharged(inst, true)`.

## Key Tuning Constants Used
- `LIGHTNING_GOAT_HEALTH`, `LIGHTNING_GOAT_DAMAGE`, `LIGHTNING_GOAT_ATTACK_RANGE`, `LIGHTNING_GOAT_ATTACK_PERIOD`  
- `LIGHTNING_GOAT_WALK_SPEED`, `LIGHTNING_GOAT_RUN_SPEED`  
- `LIGHTNING_GOAT_TARGET_DIST`, `LIGHTNING_GOAT_CHASE_DIST`  
- `SALTLICK_LIGHTNINGGOAT_USES`, `ELECTRIC_DAMAGE_MULT`, `ELECTRIC_WET_DAMAGE_MULT`