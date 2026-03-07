---
id: wagboss_robot_constructionsite
title: Wagboss Robot Constructionsite
description: Manages the construction progression and finalization of the Wagboss robot structure, including animation state transitions and completion logic.
tags: [construction, npc, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 393098f2
system_scope: entity
---

# Wagboss Robot Constructionsite

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wagboss_robot_constructionsite` is a prefab that represents an incomplete construction stage of the Wagboss robot in the WagPunk Arena. It uses the `constructionsite` component to track material progress and transitions through visual construction animations (`construction_small` → `construction_small_to_med` → `construction_med_to_large` → `construction_large` → `construction_large_to_off`) before finalizing into the full `wagboss_robot` entity. It interacts with the `deployable` and `placer` systems via related prefabs (e.g., the construction kit and placer indicator) to enforce placement rules within the arena.

## Usage example
```lua
local site = SpawnPrefab("wagboss_robot_constructionsite")
site.Transform:SetPosition(x, y, z)
site:PushEvent("onbuilt", {builder = player, pos = Vector3(x, y, z)})
```

## Dependencies & tags
**Components used:** `constructionsite`, `inspectable`
**Tags:** Adds `constructionsite` to the constructionsite entity; related prefabs add `CLASSIFIED`, `wagboss_robot_constructionsite_placerindicator`, `deploykititem`, `usedeployspacingasoffset`, `placer`, `NOCLICK`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_animstate` (via `AnimState`) | object | — | Manages visual construction animation states. |
| `physicsradiusoverride` | number | `3.5` | Physical collision radius, synced with `wagboss_robot`. |
| `MiniMapEntity` (via component) | object | — | Sets minimap icon to `"wagboss_robot_constructionsite.png"`. |
| `placer.onupdatetransform` | function | `OnUpdateTransform_Placer` | Snap logic for the placement helper. |
| `placer.override_build_point_fn` | function | `OverrideBuildPoint_Placer` | Returnsplacer position instead of mouse position for placement. |

## Main functions
### `OnConstructed_constructionsite(inst, doer)`
*   **Description:** Handles animation progression based on construction material progress. Triggers the next phase of animation sequence upon partial or full completion and sets up a one-time listener to finalize replacement on animation completion.
*   **Parameters:** `inst` (Entity), `doer` (Entity or nil) — the actor triggering construction update.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; relies on animation state checks to avoid redundant transitions.

### `OnConstructed_FinalizeReplacement(inst)`
*   **Description:** Replaces the constructionsite with the `wagboss_robot` prefab, disables entity collisions, fires the `"ms_wagboss_robot_constructed"` event, and plays a sound.
*   **Parameters:** `inst` (Entity) — the constructionsite instance.
*   **Returns:** Nothing.

### `OnBuilt_constructionsite(inst, data)`
*   **Description:** Runs immediately when the constructionsite is fully built/placed. Initializes animation and sound for initial placement.
*   **Parameters:** `inst` (Entity), `data` (table) — contains `builder` and `pos`.
*   **Returns:** Nothing.

### `OnLoad_constructionsite(inst, data)`
*   **Description:** Restores state on world load by re-invoking construction progress logic (e.g., animation sequencing).
*   **Parameters:** `inst` (Entity), `data` (table) — saved state data.
*   **Returns:** Nothing.

### `CLIENT_CanDeployKit(inst, pt, mouseover, deployer, rotation)`
*   **Description:** Custom deployment validator for the construction kit. Ensures placement is within the WagPunk Arena and that at least one `placerindicator` entity is already present within the placement radius.
*   **Parameters:** `inst` (Entity), `pt` (Vector3), `mouseover` (bool), `deployer` (Entity), `rotation` (number).
*   **Returns:** `true` if placement conditions are met, otherwise `false`.

### `OnDeploy_kit(inst, pt, deployer)`
*   **Description:** Executes kit deployment: removes nearby placer indicators, spawns the constructionsite at the target location, and triggers the `"onbuilt"` event.
*   **Parameters:** `inst` (Entity) — the kit, `pt` (Vector3), `deployer` (Entity).
*   **Returns:** Nothing.

### `OnUpdateTransform_Placer(inst)`
*   **Description:** Snap helper to align the placer indicator with an existing `placerindicator` within range, ensuring multiple kits share a valid anchor point.
*   **Parameters:** `inst` (Entity) — the placer entity.
*   **Returns:** Nothing.

### `OverrideBuildPoint_Placer(inst)`
*   **Description:** Overrides build point logic to prioritize placer position over mouse position, enabling consistent snapping for placement.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `inst:GetPosition()` (Vector3).

### `OnEnableHelper(inst, enabled, recipename, placerinst)`
*   **Description:** Manages the visual floor decal (helper indicator) for the placement area during kit deployment.
*   **Parameters:** `inst` (Entity), `enabled` (boolean), `recipename` (string), `placerinst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animqueueover` — triggers `OnConstructed_FinalizeReplacement` to replace the constructionsite with the completed robot.
- **Pushes:** `"onbuilt"` — fired when the constructionsite is placed and animations begin.
- **Pushes:** `"ms_wagboss_robot_constructed"` — fired server-side when construction completes and the final robot is spawned.