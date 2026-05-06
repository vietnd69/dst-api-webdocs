---
id: wormwood_lightflier
title: Wormwood Lightflier
description: Prefab definition for Wormwood's Lightflier pet entity with formation movement and transformation mechanics.
tags: [prefab, pet, wormwood, lunar]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 24f3b04a
system_scope: entity
---

# Wormwood Lightflier

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`wormwood_lightflier` is a prefab for Wormwood's lunar-aligned pet entity that orbits its owner in a formation pattern. The Lightflier provides light, follows formation movement logic around its leader, and transforms into a lightbulb item upon death or timer expiration. It integrates with the follower, locomotor, combat, and timer components to manage pet behavior, movement, and lifecycle events.

## Usage example
```lua
-- Spawn the Lightflier prefab
local lightflier = SpawnPrefab("wormwood_lightflier")

-- Enable or disable buzzing sound
lightflier:EnableBuzz(true)

-- Manually trigger transformation (removes pet, spawns lightbulb)
lightflier:RemoveWormwoodPet()
```

## Dependencies & tags
**External dependencies:**
- `brains/wormwood_lightflierbrain` -- AI behavior tree for Lightflier

**Components used:**
- `locomotor` -- movement control with formation speed scaling and ocean pathing
- `combat` -- hit effect symbol configuration and attack event listening
- `health` -- max health setting from TUNING
- `lootdropper` -- flings lightbulb item on transformation
- `follower` -- leader tracking and pet leash integration
- `timer` -- manages transformation lifecycle timer
- `inspectable` -- allows player inspection
- `knownlocations` -- location memory for navigation
- `homeseeker` -- homing behavior support
- `updatelooper` -- periodic update function for formation movement

**Tags:**
- `lightflier` -- entity identification
- `flying` -- movement type classification
- `ignorewalkableplatformdrowning` -- prevents drowning on platforms
- `insect` -- creature type classification
- `smallcreature` -- size classification
- `lightbattery` -- light source classification
- `lunar_aligned` -- lunar faction alignment
- `NOBLOCK` -- collision exclusion
- `notraptrigger` -- trap immunity
- `wormwood_pet` -- pet ownership marker
- `noauradamage` -- aura damage immunity
- `soulless` -- soul-related mechanic exclusion

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._time_since_formation_attacked` | number | `-TUNING.LIGHTFLIER.ON_ATTACKED_ALERT_DURATION` | Cooldown timer for formation attack alerts. |
| `inst.no_spawn_fx` | boolean | `true` | Disables spawn effects for this prefab. |
| `inst.scrapbook_deps` | table | `{"lightbulb"}` | Dependencies for scrapbook tracking. |
| `inst.EnableBuzz` | function | `EnableBuzz` | Method to toggle buzzing sound effect. |
| `inst.RemoveWormwoodPet` | function | `finish_transformed_life` | Method to trigger pet transformation/removal. |

## Main functions
### `EnableBuzz(inst, enable)`
* **Description:** Toggles the Lightflier's buzzing sound loop. Plays the sound if enabled and not already playing; kills the sound if disabled.
* **Parameters:**
  - `inst` -- the Lightflier entity instance
  - `enable` -- boolean to enable or disable buzzing
* **Returns:** None
* **Error states:** None

### `finish_transformed_life(inst)`
* **Description:** Spawns a lightbulb item and transformation FX at the Lightflier's position, then removes the Lightflier entity. Called on timer expiration or when attacked by owner's pet.
* **Parameters:** `inst` -- the Lightflier entity instance
* **Returns:** None
* **Error states:** Errors if `inst.Transform` is nil when calling `GetWorldPosition()` — no nil guard present.

### `OnTimerDone(inst, data)`
* **Description:** Event handler for timer completion. Triggers transformation when the `finish_transformed_life` timer expires.
* **Parameters:**
  - `inst` -- the Lightflier entity instance
  - `data` -- timer event data table containing `name` field
* **Returns:** None
* **Error states:** None

### `OnUpdate(inst, dt)`
* **Description:** Updates formation movement logic. Calculates orbital position around leader based on pet index, rotates formation over time, and adjusts walk speed based on distance from target position.
* **Parameters:**
  - `inst` -- the Lightflier entity instance
  - `dt` -- delta time since last update
* **Returns:** None
* **Error states:** Errors if `leader.Transform` is nil when leader exists but has no Transform component — no nil guard present. Errors if `inst.brain` is nil when leader has pattern defined.

### `OnAttacked(inst, data)`
* **Description:** Handles attack events. If attacked by a pet owned by the Lightflier's leader, stops the transformation timer and immediately triggers transformation.
* **Parameters:**
  - `inst` -- the Lightflier entity instance
  - `data` -- attack event data table containing `attacker` field
* **Returns:** None
* **Error states:** None

### `OnEntity_Init(inst)`
* **Description:** Initialization function called on entity sleep and wake. Plays the buzzing sound loop and clears sleep/wake handlers to prevent re-registration.
* **Parameters:** `inst` -- the Lightflier entity instance
* **Returns:** None
* **Error states:** Errors if `inst.SoundEmitter` is nil — no nil guard present.

### `fn()`
* **Description:** Main prefab constructor function. Creates the entity, attaches all components, configures visuals and lighting, sets up tags, and initializes behavior systems. Returns the configured entity instance.
* **Parameters:** None
* **Returns:** Entity instance with all components attached
* **Error states:** Errors if `TheWorld` is nil when checking `ismastersim` — no nil guard present.

## Events & listeners
- **Listens to:** `attacked` - triggers OnAttacked handler when entity is attacked
- **Listens to:** `timerdone` - triggers OnTimerDone handler when transformation timer completes
- **Pushes:** None identified