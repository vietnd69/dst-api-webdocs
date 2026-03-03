---
id: lavaepetbrain
title: Lavaepetbrain
description: Implements the decision-making logic for the Lavae pet, handling hunger-driven behavior, following its owner, and interacting with food and the owner through a behavior tree.
tags: [ai, brain, hunger, pet]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: df9ef8ec
system_scope: brain
---

# Lavaepetbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LavaePetBrain` defines the AI behavior tree for the Lavae pet entity in DST. It manages core survival priorities—hunger maintenance, following its owner, and social interactions like nuzzling—by combining reusable behavior components (`Follow`, `FaceEntity`, `Wander`) with custom action functions. It relies on several components (`follower`, `hunger`, `inventory`, `eater`) to make context-aware decisions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("follower")
inst:AddComponent("hunger")
inst:AddComponent("inventory")
inst:AddComponent("eater")
inst:AddBrain("lavaepetbrain")
inst.components.follower:SetLeader(some_owner)
inst.components.hunger:Set(80, 100)
```

## Dependencies & tags
**Components used:** `follower`, `hunger`, `inventory`, `eater`, `inventoryitem`  
**Tags:** Checks `player`, `edible_BURNT`, `_inventoryitem`, `INLIMBO`, `fire`, `catchable`, `outofreach`; internally prevents execution when `busy` state tag is active.

## Properties
No public properties.

## Main functions
### `OnStart()`
*   **Description:** Initializes and assigns the behavior tree for the entity. Constructs a `PriorityNode`-based behavior tree that prioritizes panic and starvation responses, followed by following, eating, facing, and nuzzling.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `GetOwner(inst)`
*   **Description:** Returns the pet's owner only if the leader is not a pocket dimension container (e.g., not inside a bag).
*   **Parameters:** `inst` (Entity) — the pet entity instance.
*   **Returns:** `entity` — the owner if valid; otherwise `nil`.
*   **Error states:** Returns `nil` if `follower:GetLeader()` is `nil` or if the leader has the `pocketdimension_container` tag.

### `EatFoodAction(inst)`
*   **Description:** Attempts to find an edible item in inventory and generate an `EAT` action against it.
*   **Parameters:** `inst` (Entity) — the pet entity.
*   **Returns:** `BufferedAction` — action instance if an edible item is found; otherwise `nil`.
*   **Error states:** Returns `nil` if `inventory`/`eater` is missing, pet is `busy`, or no edible item exists.

### `MakeFoodAction(inst)`
*   **Description:** Attempts to nuzzle nearby food (e.g., unburnt items with tags `canlight`, `fire`, `smolder`) to "cook" them, ignoring items tagged as `INLIMBO`, `_equippable`, `outofreach`, or fuel types.
*   **Parameters:** `inst` (Entity) — the pet entity.
*   **Returns:** `BufferedAction` — action instance if such an item is found within range; otherwise `nil`.
*   **Error states:** Returns early with no effect if `busy`.

### `FindFoodAction(inst)`
*   **Description:** Finds a pickupable edible item (tagged `edible_BURNT`, `_inventoryitem`) outside the pet’s inventory and initiates pickup.
*   **Parameters:** `inst` (Entity) — the pet entity.
*   **Returns:** `BufferedAction` — action instance if item found; otherwise `nil`.
*   **Error states:** Returns early with no effect if `busy`. Item must satisfy `CanPickup` and tag constraints.

### `LoveOwner(inst)`
*   **Description:** Attempts to nuzzle the owner if they are close enough, healthy enough (hunger > 50%), and pass a luck roll (`TUNING.CRITTER_NUZZLE_CHANCE`).
*   **Parameters:** `inst` (Entity) — the pet entity.
*   **Returns:** `BufferedAction` — action instance if conditions met; otherwise `nil`.
*   **Error states:** Returns early with no effect if `busy`, owner missing, owner lacks `player` tag, or hunger percent `<= 0.5`.

## Events & listeners
None identified.
