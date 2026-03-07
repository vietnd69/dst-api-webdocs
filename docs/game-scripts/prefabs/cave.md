---
id: cave
title: Cave
description: Defines the cave world type, including prefabs, assets, spawners, and world initialization logic.
tags: [world, spawner, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6f177e6d
system_scope: world
---

# Cave

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cave.lua` defines the *Cave* world type for Don't Starve Together. It specifies all prefabs used in the cave, loads required assets (sound, image), and sets up world-level components via `common_postinit` (client+server) and `master_postinit` (server-only). It integrates spawners for enemies (e.g., worms, acid bats), world features (e.g., gelblobs), and meta-structure managers (e.g., Archive, Vault, Rifts). The world is constructed using `MakeWorld`, registering physics for tile collision and enabling flying creatures to cross barriers.

## Usage example
This file is not manually instantiated by modders. It is used internally by the game engine when the *Cave* world type is selected during world generation. Modders extend or override its behavior by creating new prefabs or wrapping its spawner components.

## Dependencies & tags
**Components used:**  
`ambientlighting`, `dynamicmusic`, `ambientsound`, `dsp`, `colourcube`, `hallucinations`, `grottowaterfallsoundcontroller`, `shadowcreaturespawner`, `shadowhandspawner`, `brightmarespawner`, `toadstoolspawner`, `grottowarmanager`, `acidbatwavemanager`, `rabbitkingmanager`, `shadowparasitemanager`, `caveins`, `kramped`, `chessunlocks`, `townportalregistry`, `linkeditemmanager`, `forestresourcespawner`, `regrowthmanager`, `desolationspawner`, `mermkingmanager`, `feasts`, `yotd_raceprizemanager`, `yotc_raceprizemanager`, `yotb_stagemanager`, `worldoverseer`, `daywalkerspawner`, `hounded`, `ropebridgemanager`, `gelblobspawner`, `retrofitcavemap_anr`, `archivemanager`, `riftspawner`, `miasmamanager`, `shadowthrallmanager`, `ruinsshadelingspawner`, `shadowthrall_mimics`, `decoratedgrave_ghostmanager`, `vaultroommanager`  
**Tags:** `cave` (passed to `MakeWorld`)

## Properties
No public properties exposed. The only instance-level state is encapsulated in components added during `master_postinit`.

## Main functions
### `tile_physics_init(inst)`
*   **Description:** Initializes tile collision for the cave world, marking certain terrain tiles as impassable to land units and setting underwater depth.
*   **Parameters:** `inst` (TheWorld instance).
*   **Returns:** Nothing.
*   **Error states:** None.

### `common_postinit(inst)`
*   **Description:** Initializes client/server shared components (e.g., lighting, ambient sound). On dedicated servers, most client-only components are skipped.
*   **Parameters:** `inst` (TheWorld instance).
*   **Returns:** Nothing.
*   **Error states:** None.

### `master_postinit(inst)`
*   **Description:** Initializes server-only spawner and management components required for cave gameplay (e.g., worm waves, Rabbit King, Archive structures, Rifts).
*   **Parameters:** `inst` (TheWorld instance).
*   **Returns:** `inst` (for chaining, per DST convention).
*   **Error states:** None.

### `AddCaveGelSpawns(inst)`
*   **Description:** Scans the world tilemap to find eligible locations for `gelblobspawningground` entities based on terrain edge detection and bucket aggregation, ensuring even spacing and valid placement. Runs once after world load.
*   **Parameters:** `inst` (TheWorld instance).
*   **Returns:** Nothing (spawns `gelblobspawningground` prefabs via `SpawnPrefab`).
*   **Error states:** Exits early if `gelblobspawningground` already exists. Does not spawn if location conflicts with Archive/Labyrinth/Atrium zones.

## Events & listeners
None identified. Event handling occurs inside individual spawner components (e.g., `hounded`) rather than on the world instance itself.