---
id: caveventmitebrain
title: Caveventmitebrain
description: Manages the AI behavior of cave vent mites, including combat, foraging, and navigation using a behavior tree.
tags: [ai, combat, foraging, navigation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 9acb7e05
system_scope: brain
---

# Caveventmitebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Caveventmitebrain` defines the artificial intelligence for cave vent mites in Don't Starve Together. It orchestrates high-priority survival behaviors such as panic reactions, shield usage, combat chasing, and food foraging via a behavior tree. It leverages the `combat`, `eater`, `knownlocations`, and `timer` components to make decisions and interact with the world.

## Usage example
```lua
local inst = CreateEntity()
-- ... entity setup ...
inst:AddBrain("caveventmitebrain")
```
The brain is attached automatically via prefab definition; manual instantiation is not typically required.

## Dependencies & tags
**Components used:** `combat`, `eater`, `knownlocations`, `timer`  
**Tags:** None identified (uses tag-based filtering only via `EATFOOD_CANT_TAGS` and edible tag lookups).

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree root with a prioritized sequence of behaviors: panic, shield usage, chasing/attacking, foraging, and wandering.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None — behavior tree construction is robust.

### `OnInitializationComplete()`
* **Description:** Records the entity’s current position as its “home” location for navigation reference.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
