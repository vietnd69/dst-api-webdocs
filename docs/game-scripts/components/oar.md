---
id: oar
title: Oar
description: Handles rowing mechanics for boats, applying directional force and managing rowing success/fail behavior.
tags: [locomotion, physics, boat, player]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6a7ba30b
system_scope: physics
---

# Oar

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Oar` component implements rowing functionality for boats in DST. It calculates the direction and magnitude of force applied to a boat when the player rows, adjusting for the player'sExpertSailor proficiency. When rowing fails (e.g., poor timing), it also simulates the effect of splash water soaking nearby entities within a small radius.

This component is typically added to boat-related prefabs or tools used for rowing, and depends on the `boatphysics`, `expertsailor`, and `moisture` components for its core behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("oar")

-- Typically invoked during a rowing input event
local rower = GetPlayer()
local target_pos = Vector3(rower:GetPosition())
rower.components.oar:Row(rower, target_pos)

-- In case of poor timing
local failure_msg = rower.components.oar:RowFail(rower)
```

## Dependencies & tags
**Components used:** `boatphysics`, `expertsailor`, `moisture`, `playercontroller`  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fail_idx` | number | `0` | Index tracking the current failure animation/sound variant (cycled modulo `fail_string_count`). |
| `fail_string_count` | number | `3` | Total number of distinct failure variants (`"BAD_TIMING0"`, `"BAD_TIMING1"`, `"BAD_TIMING2"`). |
| `fail_wetness` | number | `9` | Base moisture added to entities when rowing fails. |
| `max_velocity` | number | `TUNING.BOAT.MAX_FORCE_VELOCITY` | Maximum velocity the boat can achieve when rowing. |
| `force` | number | `0.4` | Base rowing force multiplier applied to the boat. |

## Main functions
### `Row(doer, pos)`
*   **Description:** Applies rowing force to the current platform (boat) the `doer` is on. Direction is computed relative to the platform unless a client controller is attached, in which case it is inverted for responsiveness. Proficiency from `expertsailor` is applied to both force and max velocity.
*   **Parameters:**
    *   `doer` (Entity) – The entity performing the rowing action.
    *   `pos` (Vector3) – World position used to determine the intended rowing direction (typically mouse cursor or target point).
*   **Returns:** Nothing.
*   **Error states:** Returns early without applying force if `doer` has no valid platform, or if the platform lacks a `boatphysics` component.

### `RowFail(doer)`
*   **Description:** Handles failed rowing attempts. Applies splash moisture to nearby entities (within radius 2) based on their waterproofness. Also increments and returns a failure string identifier.
*   **Parameters:**
    *   `doer` (Entity) – The entity performing the failed rowing action.
*   **Returns:** `string` – One of `"BAD_TIMING0"`, `"BAD_TIMING1"`, or `"BAD_TIMING2"`, depending on the current `fail_idx`.
*   **Error states:** If an entity lacks a `moisture` component, it is safely skipped. No errors occur from missing components.

## Events & listeners
- **Pushes:**
  - `rowing` – Fired on the `doer` entity upon successful row.
  - `rowed` – Fired on the platform entity, passing `doer` as event data.
- **Listens to:** None identified.
