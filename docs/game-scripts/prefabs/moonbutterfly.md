---
id: moonbutterfly
title: Moonbutterfly
description: A flying lunar-aligned insect that spawns moon saplings when deployed and provides wings as loot.
tags: [locomotion, inventory, deployable, creature, loot]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 824950ad
system_scope: entity
---

# Moonbutterfly

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moonbutterfly` is a prebuilt entity prefab that defines a small, glowing, flying insect found in the Ruins and Lunar Biomes. It is designed to be harvested with a net, deployed onto the ground to plant a `moonbutterfly_sapling`, and provides `moonbutterflywings` as loot upon death. It interacts with multiple systems: `inventoryitem` (for pickup and drop handling), `deployable` (for planting), `workable` (for netting), `perishable` (for spoilage when held or dropped), and `eater` (for consuming vegetation). The prefab uses a custom stategraph and brain for autonomous behavior.

## Usage example
```lua
local fly = SpawnPrefab("moonbutterfly")
if fly then
    -- Example: Harvest it directly into the player's inventory
    local player = ThePlayer
    player.components.inventory:GiveItem(fly, nil, fly:GetPosition())
end
```

## Dependencies & tags
**Components used:** `locomotor`, `stackable`, `inventoryitem`, `health`, `combat`, `knownlocations`, `workable`, `deployable`, `eater`, `perishable`, `inspectable`, `lootdropper`, `soundemitter`, `light`, `animstate`, `transform`, `network`.  
**Tags added:** `butterfly`, `flying`, `ignorewalkableplatformdrowning`, `insect`, `smallcreature`, `cattoyairborne`, `wildfireprotected`, `show_spoilage`, `small_livestock`, `deployedplant`, `lunar_aligned`.  
**Tags removed:** `spore` (on death).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `LIGHT_RADIUS` | number | `0.5` | Base light radius of the butterfly. |
| `LIGHT_INTENSITY` | number | `0.5` | Base light intensity. |
| `LIGHT_FALLOFF` | number | `0.8` | Light falloff exponent. |
| `inst.components.locomotor.walkspeed` | number | `TUNING.MOONBUTTERFLY_SPEED` | Flight speed. |
| `inst.components.health.maxhealth` | number | `1` | Health pool (1 hit to kill). |
| `inst.components.inventoryitem.canbepickedup` | boolean | `false` | Cannot be picked up while alive unless held by an entity. |
| `inst.components.inventoryitem.canbepickedupalive` | boolean | `true` | Allows pickup when alive (e.g., by a net). |

## Main functions
### `OnDropped(inst)`
*   **Description:** Handles behavior when the moonbutterfly is dropped (e.g., from inventory). Resets perish rate, remembers home location, enables light, transitions to idle state, sets workable work left to `1`, and unstacks if needed.
*   **Parameters:** `inst` (entity) — the moonbutterfly instance.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnPickedUp(inst)`
*   **Description:** Called when picked up (e.g., via net or held by another entity). Increases spoilage time and disables light.
*   **Parameters:** `inst` (entity) — the moonbutterfly instance.
*   **Returns:** Nothing.

### `OnWorked(inst, worker)`
*   **Description:** Invoked after successful netting (workable finish callback). Transfers the moonbutterfly to the worker's inventory and plays a sound.
*   **Parameters:** `inst` (entity) — the moonbutterfly, `worker` (entity) — the entity that worked on it.
*   **Returns:** Nothing.

### `OnDeploy(inst, pt, deployer)`
*   **Description:** Deploy callback for planting. Spawns a `moonbutterfly_sapling`, positions it at `pt`, plays a plant sound, and consumes one unit from the stack.
*   **Parameters:** `inst` (entity) — the moonbutterfly, `pt` (vector position) — deployment position, `deployer` (entity) — deployer (unused).
*   **Returns:** Nothing.

### `oneat(inst)`
*   **Description:** Eater callback — instantly spoils the moonbutterfly upon consumption (`SetPercent(1)`).
*   **Parameters:** `inst` (entity) — the moonbutterfly.
*   **Returns:** Nothing.

### `onperish(inst)`
*   **Description:** Perish callback — triggers on spoilage. Disables workable and light, sends `death` event, removes `spore` tag, sets `persists = false`, and schedules removal after 3 seconds.
*   **Parameters:** `inst` (entity) — the moonbutterfly.
*   **Returns:** Nothing.

### `ondeath(inst)`
*   **Description:** Listens for the `death` event. Disables light and sets `AnimState` light override to `0`.
*   **Parameters:** `inst` (entity) — the moonbutterfly.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `death` — triggers `ondeath` handler.
- **Pushes:** `death` — fired in `onperish` to signal entity death.