---
id: plantregistryupdater
title: Plantregistryupdater
description: Manages player-specific plant registry state and synchronizes newly learned plants, fertilizers, and oversized pictures to clients via RPC.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: fdb0cad6
---

# Plantregistryupdater

## Overview
This component tracks and persists plant-related progress (such as discovered plant stages, fertilizers, and oversized pictures) for a player entity. It interfaces with a global `plantregistrydata` registry, plays feedback sounds upon new discoveries, and initiates network synchronization via RPC when running in a multiplayer context.

## Dependencies & Tags
- **Component Usage:** None explicitly added via `inst:AddComponent(...)`.
- **Tags:** None identified.
- **External Dependencies:** Relies on:
  - `ThePlantRegistry` (global, assigned at runtime on player activation),
  - `TheNet` (networking interface),
  - `TheWorld` (world simulation context),
  - `TheFocalPoint` (UI/focal entity for sound feedback),
  - `CLIENT_RPC` (remote procedure calls for client updates).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned) | Reference to the entity this component is attached to. |
| `plantregistry` | `table` (object from `plantregistrydata`) | `require("plantregistrydata")()` | Player-specific registry instance for tracking plant data. Initialized on construction. |

## Main Functions

### `LearnPlantStage(plant, stage)`
* **Description:** Records that the player has discovered a specific plant at a given growth stage. Triggers a sound effect if the discovery is made while the player is the focal entity, and syncs new discoveries to remote clients via RPC.
* **Parameters:**
  - `plant` (string or plant identifier): The plant type to learn.
  - `stage` (string or stage identifier): The growth stage of the plant learned.

### `LearnFertilizer(fertilizer)`
* **Description:** Records that the player has discovered a new fertilizer. Triggers sound feedback on discovery (if focal) and pushes updates to clients for new fertilizers via RPC.
* **Parameters:**
  - `fertilizer` (string or fertilizer identifier): The fertilizer type to learn.

### `TakeOversizedPicture(plant, weight, beardskin, beardlength)`
* **Description:** Records an oversized picture of a plant, capturing its weight, beard skin type, and beard length. Only triggers network sync if the picture entry is newly recorded.
* **Parameters:**
  - `plant` (string or plant identifier): The plant type photographed.
  - `weight` (number): The measured weight of the plant.
  - `beardskin` (string, optional): The beard skin used.
  - `beardlength` (number, optional): The beard length used.

## Events & Listeners
- **Listens to:** `"playeractivated"` → Triggers `onplayeractivated` handler.
  - On local player activation (non-dedicated server), assigns `ThePlantRegistry` and enables saving.

## Notes
- RPC calls (`SendRPCToClient`) are only sent when the change is *new* (`updated == true`) and the entity is valid for network sync (`self.inst.userid` exists), optimizing bandwidth by relying on the server to detect novelty in world state.
- Sound feedback is played only when the discovering player is the current focal point (i.e., actively viewing UI).
- The component does not itself store persistent data; it defers storage and lookup to the `plantregistry` object (an instance of `plantregistrydata`).