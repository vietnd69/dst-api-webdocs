---
id: bee
title: Bee Prefab
description: Defines the worker and killer bee prefabs, configuring their AI, combat, and inventory behaviors.
tags: [prefab, insect, ai, combat, inventory]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: dc3f7247
system_scope: entity
---

# Bee Prefab

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
This script defines the `bee` and `killerbee` prefabs. It configures their entity components, including locomotion (flying), combat (retargeting logic), inventory handling (stackable, catchable), and AI brains. Worker bees pollinate flowers and become aggressive in Spring, while killer bees are permanently hostile. The script also manages sound emission and sleep/wake states.

## Usage example
```lua
-- Spawn a worker bee
local bee = SpawnPrefab("bee")

-- Check if the bee is currently buzzing
if bee.buzzing then
    bee.EnableBuzz(false) -- Stop the buzzing sound
end

-- Access combat configuration
bee.components.combat:SetDefaultDamage(10)
```

## Dependencies & tags
**Components used:** `locomotor`, `stackable`, `inventoryitem`, `lootdropper`, `workable`, `health`, `combat`, `sleeper`, `knownlocations`, `inspectable`, `tradable`, `pollinator` (worker only), `hauntable`.
**Tags:** Adds `bee`, `insect`, `smallcreature`, `cattoyairborne`, `flying`, `ignorewalkableplatformdrowning`.
- Worker bees add: `worker`, `pollinator`.
- Killer bees add: `killer`, `scarytoprey`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buzzing` | boolean | `true` | Indicates if the bee is currently emitting a buzzing sound. |
| `sounds` | table | `workersounds` or `killersounds` | Table containing sound paths for takeoff, attack, buzz, hit, and death. |
| `incineratesound` | string | `sounds.death` | Sound played when the bee is burned or destroyed. |
| `EnableBuzz` | function | `EnableBuzz` | Instance method to toggle the buzzing sound state. |
| `OnEntityWake` | function | `OnWake` | Callback triggered when the entity wakes from sleep. |
| `OnEntitySleep` | function | `OnSleep` | Callback triggered when the entity falls asleep. |

## Main functions
### `EnableBuzz(enable)`
*   **Description:** Toggles the ambient buzzing sound for the bee. Ensures sound does not play if held, asleep, or already playing.
*   **Parameters:** `enable` (boolean) - Whether to start or stop the buzzing.
*   **Returns:** Nothing.

### `KillerRetarget(inst)`
*   **Description:** Internal logic used by killer bees to find targets. Prioritizes characters, animals, or monsters within range.
*   **Parameters:** `inst` (entity) - The bee instance.
*   **Returns:** `entity` or `nil` - The target entity if found.
*   **Error states:** Returns `nil` if no valid target is within 8 units or if target has `wormwood_bugs` skill active.

### `SpringBeeRetarget(inst)`
*   **Description:** Internal logic used by worker bees to find targets. Only active during Spring season.
*   **Parameters:** `inst` (entity) - The bee instance.
*   **Returns:** `entity` or `nil` - The target entity if found and it is Spring.
*   **Error states:** Returns `nil` if not Spring or no valid target within 4 units.

### `OnWorked(inst, worker)`
*   **Description:** Callback when a player uses a Bug Net on the bee. Transfers the bee to the player's inventory.
*   **Parameters:** `inst` (entity) - The bee. `worker` (entity) - The player performing the action.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` - Triggers common bee attack response logic.
- **Listens to:** `worked` - Triggers capture logic when netted.
- **Listens to:** `spawnedfromhaunt` - Triggers panic state if spawned by a ghost.
- **Listens to:** `isspring` (World State) - Worker bees change build and aggression based on season.
- **Pushes:** `detachchild` - Fired when the bee is successfully netted by a player.