---
id: wormwood_lightflier
title: Wormwood Lightflier
description: A flying pet entity summoned by Wormwood that orbits the player in a rotating formation, emits light, and transforms into a lightbulb upon death or timer expiration.
tags: [pet, flying, light, formation, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 08aaabaf
system_scope: entity
---

# Wormwood Lightflier

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wormwood_lightflier` is a prefab used to create the Lightflier pet entity in *Don't Starve Together*. This entity serves as a mobile light source and companion for the Wormwood character. It follows a circular formation around its leader (typically Wormwood) using the `follower` and `locomotor` components, emits dynamic light via the `light` component, and automatically transforms into a `lightbulb` upon timer expiration or when killed by its own leader during combat. It integrates with the stategraph `SGwormwood_lightflier` and a dedicated brain `wormwood_lightflierbrain`.

## Usage example
```lua
-- Typical usage occurs internally via the game's prefabs system
local flier = SpawnPrefab("wormwood_lightflier")
flier.Transform:SetPosition(x, y, z)

-- Manually trigger transformation before timer
if flier.components.follower:GetLeader() == player then
    flier.RemoveWormwoodPet(flier)
end
```

## Dependencies & tags
**Components used:** `locomotor`, `combat`, `health`, `lootdropper`, `follower`, `inspectable`, `knownlocations`, `homeseeker`, `timer`, `updatelooper`, `soundemitter`, `animstate`, `dynamicshadow`, `light`, `transform`, `network`

**Tags:** Adds `lightflier`, `flying`, `ignorewalkableplatformdrowning`, `insect`, `smallcreature`, `lightbattery`, `lunar_aligned`, `NOBLOCK`, `notraptrigger`, `wormwood_pet`, `noauradamage`, `soulless`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buzzing` | boolean | `false` | Tracks whether the flight loop sound is playing. |
| `RemoveWormwoodPet` | function | `finish_transformed_life` | Reference to the function that terminates and transforms the lightflier. |
| `EnableBuzz` | function | `EnableBuzz` | Public function to toggle flight sound. |

## Main functions
### `EnableBuzz(enable)`
*   **Description:** Toggles the flight loop sound (`grotto/creatures/light_bug/fly_LP`). Activated automatically upon spawn.
*   **Parameters:** `enable` (boolean) — if `true`, starts the sound; if `false`, stops it.
*   **Returns:** Nothing.

### `finish_transformed_life(inst)`
*   **Description:** Terminates the lightflier by spawning a `lightbulb` at its position (via `lootdropper:FlingItem`) and a transformation FX prefab (`wormwood_lunar_transformation_finish`), then removes the entity.
*   **Parameters:** `inst` (Entity) — the lightflier instance.
*   **Returns:** Nothing.

### `OnUpdate(inst, dt)`
*   **Description:** Called every frame via `updatelooper`. Computes and updates position to maintain a rotating circular formation around the leader. Adjusts speed and orientation using `locomotor:WalkForward`.
*   **Parameters:** `inst` (Entity), `dt` (number) — time since last frame.
*   **Returns:** Nothing.

### `OnAttacked(inst, data)`
*   **Description:** Event handler for `attacked`. If the attacker is the leader and is recognized as a pet owner, immediately ends the lightflier's life and triggers transformation.
*   **Parameters:** `inst` (Entity), `data` (table) — event data containing `attacker`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` — triggers `OnAttacked` to detect leader-inflicted damage.
- **Listens to:** `timerdone` — triggers `OnTimerDone` to detect timer expiration and call `finish_transformed_life`.
- **Pushes:** None — the component itself does not fire custom events.