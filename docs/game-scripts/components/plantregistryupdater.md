---
id: plantregistryupdater
title: Plantregistryupdater
description: Manages plant and fertilizer discovery data for a player, syncing learned content across clients in multiplayer.
tags: [network, plant, player]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: fdb0cad6
system_scope: network
---

# Plantregistryupdater

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlantRegistryUpdater` tracks which plant stages, fertilizers, and oversized photographs a player has discovered in the current world. It integrates with `ThePlantRegistry` (loaded from `plantregistrydata.lua`) and ensures discovery events trigger sound feedback on the local player and broadcast updated registry state to other clients when necessary. This component is primarily attached to player entities and handles both client-side updates and cross-network synchronization.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("plantregistryupdater")

-- Learn a new plant stage
inst.components.plantregistryupdater:LearnPlantStage("cactus", "flowering")

-- Learn a new fertilizer
inst.components.plantregistryupdater:LearnFertilizer("manure")

-- Record an oversized photograph
inst.components.plantregistryupdater:TakeOversizedPicture("cactus", 1.2, "beard", 0.8)
```

## Dependencies & tags
**Components used:** None accessed via `inst.components.X`.
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `LearnPlantStage(plant, stage)`
*   **Description:** Records that the player has discovered a specific growth stage of a plant. Triggers sound feedback locally if the player is the focal entity and propagates the update to remote clients when appropriate.
*   **Parameters:**  
    `plant` (string) — the plant's prefabricated name (e.g., `"cactus"`).  
    `stage` (string) — the discovered growth stage identifier (e.g., `"flowering"`).  
*   **Returns:** Nothing.
*   **Error states:** No-op if `plant` or `stage` is `nil`.

### `LearnFertilizer(fertilizer)`
*   **Description:** Records that the player has discovered a new fertilizer type. Triggers sound feedback locally if the player is the focal entity and propagates the update to remote clients when appropriate.
*   **Parameters:**  
    `fertilizer` (string) — the fertilizer's prefabricated name (e.g., `"manure"`).  
*   **Returns:** Nothing.
*   **Error states:** No-op if `fertilizer` is `nil`.

### `TakeOversizedPicture(plant, weight, beardskin, beardlength)`
*   **Description:** Records an oversized photograph entry for a plant, including physical attributes. Propagates the update to remote clients if the data is new for this world session.
*   **Parameters:**  
    `plant` (string) — the plant's prefabricated name.  
    `weight` (number) — the weight value recorded in the photo.  
    `beardskin` (string) — beard skin identifier (e.g., `"beard"`).  
    `beardlength` (number) — beard length value (0.0–1.0).  
*   **Returns:** Nothing.
*   **Error states:** No-op if `plant` or `weight` is `nil`.

## Events & listeners
- **Listens to:** `playeractivated` — triggers binding of `ThePlantRegistry` and enables saving for the local player on non-dedicated clients.

## Constructors
### `PlantRegistryUpdater(inst)`
*   **Description:** Initializes the component and registers an event listener for `playeractivated`.
*   **Parameters:**  
    `inst` (Entity) — the entity instance the component is attached to.
*   **Returns:** Nothing.
