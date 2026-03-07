---
id: oceanshadowcreaturebrain
title: Oceanshadowcreaturebrain
description: Controls the AI behavior of ocean-based shadow creatures, including target management, harassment actions, and conditional teleportation to land.
tags: [ai, combat, boss, movement, shadow]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: fba10394
---

# Oceanshadowcreaturebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component defines the artificial intelligence logic for ocean-dwelling shadow creatures (such as the Shadow Companion). It manages target selection and tracking, conditional harassment via battle cries and taunting, and terrain-aware movement—including periodic teleportation to land when in a boat. The brain integrates with the combat system for attacks and vocalizations, and uses the `ShadowSubmissive` component to determine whether the creature should avoid engaging certain targets. Behavior is implemented using a Behavior Tree (BT) with priority-based node selection.

## Usage example
Add the component to an entity during its `prefab` definition:
```lua
inst:AddComponent("oceanshadowcreaturebrain")
```
The component does not expose public API calls beyond internal brain functions; behavior is triggered automatically via the Behavior Tree when the entity's stategraph enters the appropriate state. The brain expects components `combat`, `shadowsubmissive`, and `transform` to be present on `inst`.

## Dependencies & tags
**Components used:** `combat`, `shadowsubmissive`, `talker`, `transform`.
**Tags:** This component does not add or remove tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mytarget` | `Entity` or `nil` | `nil` | The currently tracked target entity. Set via `SetTarget`. |
| `listenerfunc` | `function` or `nil` | `nil` | Callback function that clears `mytarget` when the target entity is removed. Initialized on first target assignment. |
| `_harasstarget` | `Entity` or `nil` | `nil` | Temporary reference to the target being harassed; set in `ShouldAttack` when a target is submissive. |

## Main functions
### `OceanShadowCreatureBrain:SetTarget(target)`
* **Description:** Sets or updates the primary tracking target. Automatically manages event callbacks for the target's removal.
* **Parameters:**  
  - `target` (`Entity` or `nil`): The entity to track. If invalid, it is treated as `nil`.  
* **Returns:** None.  
* **Error states:** No error states; invalid targets are safely converted to `nil`.

### `OceanShadowCreatureBrain:OnStop()`
* **Description:** Cleans up the current target by clearing `mytarget`. Called when the brain stops (e.g., when the entity falls asleep or dies).
* **Parameters:** None.  
* **Returns:** None.  

### `OceanShadowCreatureBrain:OnStart()`
* **Description:** Initializes the behavior tree when the brain starts (e.g., upon waking). Sets the initial target using `inst.spawnedforplayer` and constructs a priority-based Behavior Tree that handles teleportation, boat-specific behaviors (including harassment and combat), and land-based wandering.
* **Parameters:** None.  
* **Returns:** None.  

## Events & listeners
- **Listens to:**  
  - `"onremove"` on the current target (via `self.inst:ListenForEvent` in `SetTarget`) to clear `mytarget` when the target is destroyed.
- **Pushes:**  
  - `"teleport_to_land"` via `inst:PushEvent` when the creature is on land and in a boat (in `teleport` action node).  
  - `"boatteleport"` via `inst:PushEvent` periodically while on a boat to trigger boat-based teleportation logic.