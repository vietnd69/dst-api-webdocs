---
id: mushroomsprout
title: Mushroomsprout
description: Represents a growable, light-emitting mushroom tree that can be chopped and transitions through stages based on links to a Toadstool entity.
tags: [environment, lighting, entity]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c99b0324
system_scope: environment
---

# Mushroomsprout

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mushroomsprout` is a prefab for a growable mushroom tree entity used in the game's environment. It supports multiple growth stages controlled by an external Toadstool entity via event messaging. The prefab features animated fading, dynamic lighting, chopping interactions, and burning behavior. It integrates with several core systems including `burnable`, `workable`, `inspectable`, `entitytracker`, and `propagator` components to manage state changes, lighting, and gameplay interactions.

## Usage example
```lua
local sprout = SpawnPrefab("mushroomsprout")
sprout.Transform:SetPosition(x, y, z)

-- Link to a Toadstool to enable growth
local toadstool = GetToadstoolEntity()
sprout:PushEvent("linktoadstool", toadstool)

-- Manually trigger level change via the linked Toadstool
toadstool:PushEvent("toadstoollevel", 2)
```

## Dependencies & tags
**Components used:** `burnable`, `workable`, `inspectable`, `entitytracker`, `propagator`, `hauntable`
**Tags:** Adds `blocker`, `tree`, `mushroomsprout`, `cavedweller`, and conditionally `NOCLICK` when burnt/fallen.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_level` | number | `0` | Current growth stage level. |
| `_targetlevel` | number | `0` | Target growth stage requested by the linked Toadstool. |
| `_link` | entity reference | `nil` | Reference to the Toadstool entity controlling growth. |
| `_fade` | networked small byte | `net_smallbyte` | Tracks fade animation progress. |
| `_fadetask` | task reference | `nil` | Task driving the fade animation. |
| `_buildtask` | task reference | `nil` | Task animating growth-stage transitions. |
| `_destroy` | boolean | `nil` | Flag indicating the sprout should be destroyed on next Sway loop. |
| `persists` | boolean | `true` | Controls whether the entity is saved to disk; set false after falling/burning. |

## Main functions
### `DoLink(inst, link)`
*   **Description:** Establishes a bidirectional link between the Mushroomsprout and a Toadstool entity. Registers event listeners for level updates and Toadstool removal, then notifies the Toadstool that the link is active.
*   **Parameters:** `link` (entity) - The Toadstool entity to link with.
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Handles destruction of the Mushroomsprout after it has burned completely. Removes fire-related components, spawns a spore cloud, updates visuals, and disables persistence.
*   **Parameters:** `inst` (entity) - The Mushroomsprout entity instance.
*   **Returns:** Nothing.
*   **Error states:** Early exit if `inst.persists` is false (e.g., during initial load from save).

### `chop_tree(inst, chopper)`
*   **Description:** Invoked on work callbacks (e.g., player chopping). Plays sound and chop animation; cancels build tasks and triggers update of lighting if in progress.
*   **Parameters:** `inst` (entity) - The Mushroomsprout instance; `chopper` (entity) - The entity performing the chopping.
*   **Returns:** Nothing.

### `chop_down_tree(inst, worker)`
*   **Description:** Final callback when chopping completes. Initiates the fall animation, removes interaction capabilities, and triggers fade-out.
*   **Parameters:** `inst` (entity) - The Mushroomsprout instance; `worker` (entity) - The entity that chopped it.
*   **Returns:** Nothing.

### `FadeOut(inst)`
*   **Description:** Starts the fade-out animation sequence that gradually dims lighting and hides the entity before removal.
*   **Parameters:** `inst` (entity) - The Mushroomsprout instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"fadedirty"` (client) — triggers fade animation updates.
  - `"animover"` — triggers Sway logic to continue animation or begin removal.
  - `"linktoadstool"` — links to a new Toadstool entity.
  - `"toadstoollevel"` (on linked entity) — updates `_targetlevel` based on Toadstool state.
  - `"onremove"` and `"death"` (on linked entity) — marks the sprout for destruction if the Toadstool is removed.
- **Pushes:**  
  - `"fadedirty"` (on fade progress change) — broadcast to clients via `net_smallbyte`.
  - `"unlinkmushroomsprout"` — notifies the Toadstool when unlinking occurs.  
  - `"linkmushroomsprout"` — notifies the Toadstool after linking succeeds.