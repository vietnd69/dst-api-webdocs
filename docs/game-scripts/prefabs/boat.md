---
id: boat
title: Boat
description: Manages the creation, behavior, and physics of ocean-going vessels, including variant-specific functionality (wood, grass, ice, pirate, ancient, otterden).
tags: [locomotion, physics, entity, water]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3118ee85
system_scope: physics
---

# Boat

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `boat` prefab is responsible for spawning and configuring all boat variants in the game (wood, grass, ice, pirate, ancient, otterden). It establishes core functionality through shared pre-initialization (`create_common_pre`) and post-initialization (`create_master_pst`) functions, integrates physics, collision, and entity tracking, and handles variant-specific behaviors such as self-degradation (grass/otterden), fire mechanics (wood/pirate/ancient), and den-based erosion (otterden). It does not define a reusable component class; instead, it defines prefab factory functions that construct fully configured entities with all required components.

## Usage example
Boats are not instantiated directly via a component API. Instead, prefabs are spawned through the game's prefab system (e.g., via deploy kits or world generation). Below is a typical usage pattern when deploying a boat from an item:

```lua
-- In a deploy handler (e.g., ondeploy):
local boat = SpawnPrefab(inst.deploy_product) -- e.g., "boat", "boat_grass"
boat.Physics:Teleport(pt.x, 0, pt.z)
boat.sg:GoToState("place")
-- Boat automatically handles physics, hull health, and platform updates post-deploy
```

## Dependencies & tags
**Components used:** `walkableplatform`, `healthsyncer`, `waterphysics`, `reticule`, `boatringdata`, `hull`, `repairable`, `boatring`, `hullhealth`, `boatphysics`, `boatdrifter`, `savedrotation`, `entitytracker`, `deployable`, `health`, `placer`, `inspectable`, `inventoryitem`, `fuel`, `burnable`, `propagator`, `hauntable`, `physicswaker`.

**Tags added on boat entities:**
- `"ignorewalkableplatforms"` (common)
- `"antlion_sinkhole_blocker"` (common)
- `"boat"` (common)
- `"wood"` (wood, pirate, ancient, otterden boats; removed for ice boats)
- `"NOBLOCK"`, `"NOCLICK"` (collision entities only)
- `"CLASSIFIED"` (collision entities only)

**Tags checked:** `"controlled_burner"`, `"boatbumper"`, `"boatcannon"`, `"angry_when_rowed"` (otterden), `"player"`, `"fireimmune"`.

## Properties
Boat prefabs do not define public properties on a component class. Instead, they set instance-level properties during creation.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `material` | string | `"wood"`, `"grass"`, `"ice"`, or `"kelp"` (otterden) | Determines behavior such as sounds, degradation rate, repair material, and visual style. |
| `leak_build` / `leak_build_override` | string or nil | `nil` | Specifies the animation build used for leak effects. |
| `sounds` | table | `sounds`, `sounds_grass`, `sounds_ice` | Sound keys and paths for events like `place`, `damage`, `sink`. |
| `sinkloot` | function | custom per variant | Defines how fragments spawn on sink. |
| `postsinkfn` | function | custom per variant | Executed immediately after `sinkloot`, often to spawn FX. |
| `activefires` | number | `0` | Counter for active fires; influences fragment ignition on sink. |
| `_container` | entity or nil | `nil` (ancient boats) | The anchored container for ancient boats. |
| `walksound` / `second_walk_sound` | string or nil | e.g., `"wood"`, `"marsh"`, `"tallgrass"`, `"ice"` | Sound bank keys used for walking sounds on the boat. |
| `leaky` | boolean | `true` (grass boats) | Indirectly tracked by `hullhealth` via `leakproof`. |
| `stopupdatingtask` | task or nil | `nil` | Task handle for deferred physics sleep. |

## Main functions
The file defines several internal helper and factory functions; these are not component methods but are called during entity construction or gameplay events.

### `create_common_pre(inst, bank, build, data)`
* **Description:** Initializes common transform, animstate, sound, network, physics, and tagging for all boat variants. Sets up shared components: `walkableplatform`, `healthsyncer`, `waterphysics`, `reticule`, and `boatringdata`. Adds stategraph listener hooks for steering reticule.
* **Parameters:**
  - `inst` (Entity) — The entity being constructed.
  - `bank` (string) — Animation bank name (e.g., `"boat_01"`).
  - `build` (string) — Build name (e.g., `"boat_test"`).
  - `data` (table) — Variant-specific data including `radius`, `max_health`, `item_collision_prefab`, `boatlip_prefab`, `plank_prefab`, `minimap_image`, and optional `scale`.
* **Returns:** `inst` — The partially initialized entity.

### `create_master_pst(inst, data)`
* **Description:** Server-side initialization for boat functionality, including hull geometry, leak detection, repair, physics coordination, and stategraph assignment. Adds components and methods specific to the active boat type.
* **Parameters:**
  - `inst` (Entity) — The partially initialized entity (from `create_common_pre`).
  - `data` (table) — Same as in `create_common_pre`.
* **Returns:** `inst` — The fully initialized server-side boat entity.

### `OnSpawnNewBoatLeak(inst, data)`
* **Description:** Spawns a dynamic leak entity, attaches it to the platform, and notifies players on the boat. Used for wood/pirate/ancient boats.
* **Parameters:**
  - `inst` (Entity) — The boat entity.
  - `data` (table) — Must include `pt` (Vector3) for leak position and optionally `leak_size` and `playsoundfx`.
* **Returns:** Nothing.

### `OnSpawnNewBoatLeak_Grass(inst, data)`
* **Description:** Handles leak logic for grass and otterden boats: spawns visual FX and directly applies health damage based on leak size. Does not spawn persistent leak entities.
* **Parameters:**
  - `inst` (Entity) — The boat entity.
  - `data` (table) — Must include `pt` (Vector3) and `leak_size`, optionally `playsoundfx`.
* **Returns:** Nothing.

### `InstantlyBreakBoat(inst)`
* **Description:** Immediately breaks the boat without going through the full sink stategraph. Abandons ships on platform, triggers sink loot, and removes the boat. Used for physics safety or manual breakage.
* **Parameters:**
  - `inst` (Entity) — The boat entity.
* **Returns:** Nothing.

### `GetSafePhysicsRadius(inst)`
* **Description:** Returns the hull radius plus a small offset (0.18) to account for item overhangs.
* **Parameters:**
  - `inst` (Entity) — The boat entity.
* **Returns:** number — Safe physics radius.

### `IsBoatEdgeOverLand(inst, override_position_pt)`
* **Description:** Checks if any segment of the boat's perimeter overlaps non-ocean tiles (land, visual ground, etc.) using 40 collision segments. Useful for deployment validation and hazard checks.
* **Parameters:**
  - `inst` (Entity) — The boat entity.
  - `override_position_pt` (Vector3 or nil) — Optional point to test instead of current boat position.
* **Returns:** boolean — `true` if any edge segment overlaps land or non-ocean tile.

### `CLIENT_CanDeployBoat(inst, pt, mouseover, deployer, rotation)`
* **Description:** Client-side deployment validation function. Checks distance constraints (including floating hop range) and tile validity for deployment.
* **Parameters:**
  - `inst` (Entity) — The boat item entity (not the boat itself).
  - `pt` (Vector3) — Target deployment point.
  - `mouseover`, `deployer`, `rotation` — Deployment metadata.
* **Returns:** boolean — `true` if deployment is valid at `pt`.

### `ice_ondeath(inst)`
* **Description:** Server-side event handler for ice floe death. If asleep, triggers "abandon_ship" for platform entities and sinks the floe.
* **Parameters:**
  - `inst` (Entity) — The ice floe entity.
* **Returns:** Nothing.

### `boat_player_collision_template(radius)`
* **Description:** Constructs a pristined, non-networked collision entity used to detect player movement over the boat (for platform entry/exit).
* **Parameters:**
  - `radius` (number) — Boat radius; used to build the triangle mesh.
* **Returns:** Entity — The collision entity.

### `boat_item_collision_template(radius)`
* **Description:** Constructs a pristined, non-networked item collision entity to keep items from falling off the boat.
* **Parameters:**
  - `radius` (number) — Boat radius.
* **Returns:** Entity — The item collision entity.

### `SpawnFragment(lp, prefix, offset_x, offset_y, offset_z, ignite)`
* **Description:** Helper used in sink loot functions. Spawns a fragment prefab at an offset, sets velocity if `offset_y > 0`, and optionally ignites it if `ignite` is true.
* **Parameters:**
  - `lp` (Vector3) — Loot point origin (boat position).
  - `prefix` (string) — Prefab name prefix (e.g., `"boards"`, `"kelp"`, `"ice"`).
  - `offset_x`, `offset_y`, `offset_z` (numbers) — Position offsets relative to `lp`.
  - `ignite` (boolean) — Whether to ignite via `Burnable:Ignite()` if present.
* **Returns:** Entity — The spawned fragment.

## Events & listeners
The boat entities listen to the following events; most are registered in `create_common_pre` or variant functions.

- `"spawnnewboatleak"` — Triggers leak creation via `OnSpawnNewBoatLeak` or `OnSpawnNewBoatLeak_Grass`.
- `"death"` — For ice boats: calls `ice_ondeath`.
- `"rowed"` — For otterden boats: triggers `OnRowed_OtterDen`.
- `"onremove"` — Tracks removal of attached entities (e.g., bumpers, anchors, collision entities).
- `"endsteeringreticule"` / `"starsteeringreticule"` — Client-side steering hooks to create/destroy the reticule.
- `"postinit"` / `"OnLoadPostPass"` — Late post-pass logic like bumper rotation (`OnLoadPostPass`).
- `"dead_otterden_added"` — Tracks dead otterdens for leak indicators.
- `"onpresink"` — Pushed to players before sink (in `InstantlyBreakBoat` and stategraph).

The boat pushes the following events (via component hooks or `PushEvent`):

- `"abandon_ship"` — Pushed to all entities on the platform (including players) when boat is about to break/sink.
- `"on_standing_on_new_leak"` — Pushed to players standing on a newly spawned leak (wood/pirate/ancient).
- `"onpresink"` — Pushed to players just before sink.
- `"otterboaterosion_begin"` — Pushed to players when otterden erosion starts or den is removed.

**Note:** Some events (e.g., `"death"`, `"abandon_ship"`) are handled directly by components (`health`, `walkableplatform`), while others are routed through custom callbacks defined in the prefab factory functions.