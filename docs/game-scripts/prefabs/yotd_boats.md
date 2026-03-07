---
id: yotd_boats
title: Yotd Boats
description: Defines the data and logic for the Year of the Dragon Boat (YOTD) prefabs in DST, including the boat body, deployable kits, item packs, and AI shadowboat variants.
tags: [boat, prefabs, network, deployment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 068a13a6
system_scope: entity
---

# Yotd Boats

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`yotd_boats.lua` defines multiple prefabs related to the Year of the Dragon Boat content: the main `dragonboat_body` entity, deployable kits (`dragonboat_kit`, `dragonboat_pack`), AI-controlled `dragonboat_shadowboat`, and supporting collision/placeholder prefabs. It implements shared initialization logic via `dragonboat_common()` for client and `dragonboat_server()` for server-side entity setup, and provides factory functions to instantiate each variant. The prefabs integrate with core boat systems including physics, hull integrity, walkable platforms, and deployment constraints.

## Usage example
```lua
-- Spawn a deployable boat kit
local kit = SpawnPrefab("dragonboat_kit")
-- Player uses inventory to deploy the kit at a water point
local boat = SpawnPrefab("dragonboat_body")
-- The boat automatically adds required components and assets
```

## Dependencies & tags
**Components used:** `walkableplatform`, `healthsyncer`, `waterphysics`, `reticule`, `boattrail`, `boatringdata`, `health`, `repairable`, `boatring`, `hull`, `hullhealth`, `boatphysics`, `boatdrifter`, `savedrotation`, `physicswaker`, `platformhopdelay`, `boatracecrew`, `deployable`, `fuel`, `inspectable`, `inventoryitem`, `placer`

**Tags added:**
- `antlion_sinkhole_blocker`, `boat`, `ignorewalkableplatforms`, `wood` (body/pack entities)
- `boatbuilder`, `deploykititem`, `usedeployspacingasoffset` (kits)
- `CLASSIFIED`, `NOBLOCK`, `NOCLICK`, `ignorewalkableplatforms` (collision prefabs)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `boat_data.radius` | number | `TUNING.DRAGON_BOAT_RADIUS` | Radius used for physics and platform logic. |
| `RETICULE_RANGE` | number | `7` | Controls how far ahead the steering reticule appears when steering via controller. |
| `PLANK_OFFSET` | number | `0.05` | Radial offset for the walking plank placement. |
| `EXTRA_SPACING` | number | `0.2` | Extra spacing margin added during boat deployment checks. |
| `BOAT_COLLISION_SEGMENT_COUNT` | number | `20` | Number of segments used in collision/edge-over-land checks. |
| `is_pack` | boolean | `false` | Set only on pack prefabs (`dragonboat_pack`), triggers piece spawning on deploy. |

## Main functions
### `dragonboat_common(inst, boat_data)`
*   **Description:** Common client and server initialization for Dragon Boat prefabs. Adds visual, audio, physics, and foundational components (e.g., `walkableplatform`, `hullhealth`, `boatring`). Client-only logic includes `boattrail` and steering reticule event listeners.
*   **Parameters:** `inst` (Entity) - the entity instance; `boat_data` (table) - optional config override (e.g., `bank`, `build`, `scale`, `max_health`).
*   **Returns:** The modified `inst`.
*   **Error states:** Does not fail; defaults are applied if `boat_data` is `nil`.

### `dragonboat_server(inst, boat_data)`
*   **Description:** Server-side initialization for Dragon Boat prefabs. Adds robust boat behavior, including `hull`, `hullhealth`, `boatphysics`, `repairable`, `boatdrifter`, and custom callbacks for physics sleep/wake, leak spawning, and sinking.
*   **Parameters:** `inst` (Entity); `boat_data` (table, optional).
*   **Returns:** The modified `inst`.
*   **Error states:** Does not fail; config overrides apply.

### `CLIENT_CanDeployDragonBoat(inst, pt, mouseover, deployer, rotation)`
*   **Description:** Client-side validation function used by `deployable` to determine if the boat can be deployed at a given point, considering player floaters, boat radius, and land proximity.
*   **Parameters:** `inst` (Entity) - the kit item; `pt` (Vector3) - deployment point; `mouseover` (boolean) - whether mouse is hovering target; `deployer` (Entity) - player attempting deploy; `rotation` (number) - ignored.
*   **Returns:** `true` if deployment is valid; `false` otherwise.
*   **Error states:** Returns `false` if player holds a floater and is outside the hop range + boat radius bounds.

### `on_dragonboat_kit_deployed(inst, pt, deployer)`
*   **Description:** Handles deployment of a boat kit: spawns the `dragonboat_body`, positions and orients it, applies skinning to the plank (if applicable), and optionally spawns extra pieces for packs.
*   **Parameters:** `inst` (Entity) - the kit item; `pt` (Vector3) - target deployment position; `deployer` (Entity) - deploying player.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `deploy_product` fails to spawn.

### `build_boat_collision_mesh(radius, height)`
*   **Description:** Constructs a cylindrical triangle mesh for boat collision entities (`dragonboat_player_collision` and `dragonboat_item_collision`) used in physics.
*   **Parameters:** `radius` (number); `height` (number).
*   **Returns:** A flat Lua table of coordinates in `x0,y0,z0,x1,y1,z1,...` order.
*   **Error states:** None; valid for positive radius and height.

## Events & listeners
- **Listens to:**
  - `"spawnnewboatleak"` (server): Triggers `OnSpawnNewBoatLeak` to instantiate and position dynamic leaks on the hull.
  - `"starsteeringreticule"` (client): Creates the steering reticule for controller users.
  - `"endsteeringreticule"` (client): Destroys the steering reticule and clears angle memory.
  - `"onremove"` (client-side, on `boat_item_collision`): Removes constraint and the collision entity.
- **Pushes:** None defined directly in this file; events are handled via callbacks on owned entities.