---
id: SGoceanfish
title: Sgoceanfish
description: Defines the state machine for ocean-dwelling fish entities, handling behaviors such as breaching, biting fishing hooks, and exiting water.
tags: [ai, ocean, fishing, npc]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 203ec7a9
system_scope: entity
---

# Sgoceanfish

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGoceanfish` is the stategraph for ocean fish prefabs (e.g., ocean fish that can be fished or attacked by players). It orchestrates transitions between states such as `idle`, `breach`, `eat`, `bitehook_loop`, and `shoot`, enabling the entity to respond to player actions (e.g., eating, fishing, fire suppression). It integrates closely with the `locomotor`, `firedetector`, `oceanfishable`, and `oceanfishingrod` components to control physics, animation, and behavior synchronization during interactions.

## Usage example
This stategraph is automatically assigned to ocean fish prefabs (e.g., `oceanfish`, `oceanfish_spawning`) at construction time. It is not meant to be added manually; however, a typical modder might extend it by adding new states or modifying its action handlers and event callbacks:

```lua
-- Example: Check if a fish is currently in the 'breach' state
if fish.inst.sg.currentstate.name == "breach" then
    print("Fish is breaching!")
end
```

## Dependencies & tags
**Components used:** `locomotor`, `firedetector`, `oceanfishable`, `oceanfishingrod`  
**Tags handled internally:** `busy`, `idle`, `canrotate`, `jumping`, `shooting`, `partiallyhooked` (added/removed via `inst:AddTag()`/`RemoveTag()` elsewhere)  
**Tags checked:** `oceantrawler`, `partiallyhooked`

## Properties
No public properties are defined in this stategraph file.

## Main functions
This is a `StateGraph` definition (returned from `return StateGraph(...)`), not a component with traditional methods. The "main functions" are the state callbacks:

### State callbacks (by name)
*   **Description:** These are per-state functions (`onenter`, `onexit`, `onupdate`, `ontimeout`, `timeline`, `events`) embedded in the `states` array. Each defines behavior during specific phases of the fish's animation/behavior cycle.
*   **Parameters:** State callbacks receive `(inst, data?)` where `inst` is the entity instance and `data` may contain action or event payload (e.g., `{ fire_pos = ... }`).
*   **Returns:** None — these are event-driven handlers.
*   **Error states:** N/A — invalid state transitions are prevented by state tags and conditional `GoToState` guards.

### `SpawnSplashFx(inst)`
*   **Description:** Spawns a random breach/fish splash FX prefab if defined in `inst.fish_def.breach_fx`, provided the fish is not under a boat.
*   **Parameters:** `inst` (entity instance) — the fish entity.
*   **Returns:** Nothing.
*   **Error states:** No FX is spawned if `breach_fx` is `nil` or `inst.sg.statemem.underboat` is true.

### `IsUnderBoat(inst)`
*   **Description:** Detects if the fish is positioned under a platform (e.g., a boat) using the world map API.
*   **Parameters:** `inst` (entity instance) — the fish entity.
*   **Returns:** `true` if under a platform, `false` otherwise.
*   **Error states:** None.

### `SetBreaching(inst, is_in_air)`
*   **Description:** Switches the fish's animation layer and facing mode depending on whether it is in the air (`breaching`) or submerged.
*   **Parameters:** `inst` (entity instance); `is_in_air` (boolean).
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
- **Listens to:**
    - `locomote` — via `CommonHandlers.OnLocomote(true, true)` (from `commonstates.lua`)
    - `dobreach` — triggers `breach` state unless jumping or `food_target` is a trawler
    - `doleave` — triggers `leave` state unless busy or jumping
    - `oceanfishing_stoppedfishing` — triggers `breach` on rod removal unless leaving or jumping
    - `putoutfire` — triggers `shoot` state (with fire position) unless jumping or busy

- **Pushes:** This stategraph itself does not push events — it responds to them. However, entity behavior is coordinated through events fired *by* the state graph (e.g., via `PerformBufferedAction()`, `PushEvent("animover")` in timelines).
