---
id: forest_network
title: Forest Network
description: Creates and configures the network entity for the Forest world type, initializing world-level systems like weather, moonstorms, and event-specific managers.
tags: [world, network, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b0585777
system_scope: world
---

# Forest Network

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`forest_network` is a world network prefab responsible for initializing and managing the Forest world’s shared world-level systems. It leverages the `MakeWorldNetwork` factory from `world_network.lua` to set up an invisible entity that hosts components required for the world’s core behaviors—such as weather, moonstorms, and event managers—without representing any physical object in the game. It is used by the world generation system to ensure consistent infrastructure across all Forest world instances.

## Usage example
This prefab is instantiated internally by the game’s world setup system and is not typically added directly by modders. A typical use case in worldgen or scenario code would involve referencing it as part of the world setup, but direct manipulation is unnecessary and unsupported.

## Dependencies & tags
**Components used:** `weather`, `moonstorms`, `sharkboimanagerhelper`, `wagpunk_floor_helper`, `lunarhailbirdsoundmanager`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `custom_postinit(inst)`
*   **Description:** Applies required world-level components to the network entity. This function is passed to `MakeWorldNetwork` and invoked during the network entity’s initialization.
*   **Parameters:** `inst` (GGameEntity) — the network entity instance.
*   **Returns:** Nothing.
*   **Error states:** Fails if any component fails to add (e.g., due to missing component registration).

## Events & listeners
None identified.

