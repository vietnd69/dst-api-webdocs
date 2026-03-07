---
id: walrus_camp
title: Walrus Camp
description: Manages the walrus camp structure that spawns walruses, little walruses, and icehounds during winter when occupied, and handles their regeneration timers.
tags: [winter, boss, ai, camp, entity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 27275db8
system_scope: entity
---

# Walrus Camp

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `walrus_camp` prefab represents the walrus camp structure (an igloo-like building) that serves as a spawner and command center for walrus-based NPCs during winter. It manages the spawning and regeneration of walruses, little walruses, and icehounds using timers from the `worldsettingstimer` component. It tracks membership via `homeseeker` and `follower` components and reacts to world state changes (e.g., `iswinter`, `startday`) and events like `megaflare_detonated` to summon reinforcements. The camp is occupied only during winter and becomes empty when winter ends and all spawned members are gone.

## Usage example
```lua
-- The walrus_camp is typically spawned automatically via worldgen.
-- For modding, you can spawn it manually:
local camp = SpawnPrefab("walrus_camp")
camp.Transform:SetPosition(x, y, z)
-- Camp automatically starts tracking winter state and regenerating members.
```

## Dependencies & tags
**Components used:** `worldsettingstimer`, `inspectable`
**Tags added:** `antlion_sinkhole_blocker`
**Tags referenced (via FindEntities/FindPlayersInRange):** `player`, `walrus`, `little_walrus`, `icehound`, `pet_hound`, `flare_summoned`

## Properties
No public properties.

## Main functions
### `SpawnHuntingParty(target, houndsonly)`
* **Description:** Spawns a hunting party (walrus, little walrus, and up to two icehounds) if regeneration timers allow and the camp is occupied during winter. Sets up leader/follower relationships and assigns the combat target if provided.
* **Parameters:** 
  * `target` (entity or nil) — the combat target to assign to the walruses; if `nil`, no target is assigned.
  * `houndsonly` (boolean) — if `true`, only icehounds are spawned; if `false`, walruses and little walruses may also be spawned.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; silent no-op if timers are active or world conditions not met.

### `CanSpawn(prefab)`
* **Description:** Checks whether a member of the specified `prefab` type can be spawned — i.e., regeneration is enabled globally and no active timer exists for that prefab.
* **Parameters:** 
  * `prefab` (string) — the prefab name (`"walrus"`, `"little_walrus"`, or `"icehound"`).
* **Returns:** `boolean` — `true` if the member can spawn, `false` otherwise.

### `TrackMember(member)`
* **Description:** Registers event callbacks and sets up `homeseeker` on a spawned member to bind it to the camp as its home. Ensures consistent tracking across spawns and despawn events.
* **Parameters:** 
  * `member` (entity) — the spawned walrus or icehound entity.
* **Returns:** Nothing.

### `RemoveMember(member)`
* **Description:** Stops tracking a member (removes event listeners and leader/follower bindings) and updates camp occupancy if necessary.
* **Parameters:** 
  * `member` (entity) — the member to stop tracking.
* **Returns:** Nothing.

### `UpdateCampOccupied(inst)`
* **Description:** Updates the camp’s occupancy state based on world season and presence of living children. If winter ends and no children remain, the camp becomes unoccupied.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetOccupied(occupied)`
* **Description:** Switches the camp’s visual and physical state. Occupied state uses the `walrus_house` build (collision active, foreground layer); unoccupied uses `igloo_track` (no collision, background layer). Also manages light state.
* **Parameters:** 
  * `occupied` (boolean) — `true` for occupied (winter), `false` for unoccupied.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  - `death`, `onremove`, `newcombattarget`, `despawnedfromhaunt`, `detachchild` (on members only)
  - `onwenthome` (on self) — removes the member who went home
  - `megaflare_detonated` (on `TheWorld`) — triggers delayed spawning near flare
- **Pushes:** None.
- **World states watched:** `startday`, `iswinter` — both trigger `OnStartDay` or `OnIsWinter` callbacks respectively.