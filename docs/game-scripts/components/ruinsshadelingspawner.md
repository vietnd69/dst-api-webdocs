---
id: ruinsshadelingspawner
title: Ruinsshadelingspawner
description: Spawns and manages a Ruin Shadeling entity when a specific unsittable chair is placed in a Nightmare-tier ruin, with cooldown and cleanup logic.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 5d0916fb
---

# Ruinsshadelingspawner

## Overview
This component is attached to the world (`TheWorld`) and governs the conditional spawning of a Ruin Shadeling entity on a designated chair inside Nightmare-tier ruins. It enforces a cooldown period between spawns, listens for key events (e.g., shadeling removal, chair unsittability), and manages the shadeling’s lifecycle—including spawning, sit occupation, and automatic despawning when conditions change.

## Dependencies & Tags
- Relies on `TheWorld.components.ruinsshadelingspawner` being registered globally.
- Listens to events on the spawned `ruins_shadeling` and `chair` entities.
- No explicit component additions or tags are applied to the spawner entity itself.
- Uses `TUNING.TOTAL_DAY_TIME` as the default cooldown duration.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (constructor argument) | Reference to the entity the component is attached to (typically `TheWorld`). |
| `shadeling` | `Entity?` | `nil` | Reference to the currently active Ruin Shadeling prefab instance, or `nil` if none is spawned. |
| `cooldowntask` | `Task?` | `nil` | A scheduled task representing the current cooldown timer; `nil` when no cooldown is active. |
| `cooldown` | `number` | `TUNING.TOTAL_DAY_TIME` | Duration (in seconds) between shadeling spawns. |

## Main Functions

### `TrySpawnShadeling(chair)`
* **Description:** Attempts to spawn a Ruin Shadeling at the given chair’s position if a shadeling is not already spawned, the cooldown has elapsed, and the chair is valid and unoccupied. Spawning only occurs if the chair’s location has a Nightmare-tier visual node.
* **Parameters:**
  - `chair` (`Entity`): The chair entity where the shadeling should spawn. Must have a `sittable` component.

### `LongUpdate(dt)`
* **Description:** Adjusts the remaining cooldown time when the world transitions between time-of-day states (e.g., skipping night). It reschedules the cooldown task to account for time dilation, preserving the intended cooldown duration.
* **Parameters:**
  - `dt` (`number`): Delta time (in seconds) to adjust the remaining cooldown.

## Events & Listeners

- **Listens on spawned `shadeling`:**
  - `"ruins_shadeling_looted"` → triggers `OnShadelingLooted`: Cancels any existing cooldown task and restarts cooldown.
  - `"onremove"` → triggers `OnShadelingRemoved`: Clears `self.shadeling` reference.
  
- **Listens on `chair`:**
  - `"onremove"` → triggers `OnChairRemoved`: Despawns the shadeling if the chair is removed.
  - `"becomeunsittable"` → triggers `OnChairBecameUnsittable`: Despawns the shadeling if the chair is no longer occupied by it (e.g., player stand-up or external force).