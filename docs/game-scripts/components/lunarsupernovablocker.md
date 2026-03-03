---
id: lunarsupernovablocker
title: Lunarsupernovablocker
description: Manages visual and gameplay effects for the Lunar Supernova ability by tracking blocking sources and updating related FX and colour properties.
tags: [boss, combat, visual, world, lavaarena]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: eeb1d0fc
system_scope: world
---

# Lunarsupernovablocker

> Based on game build **7140114** | Last updated: 2026-03-03

## Overview
`LunarSupernovaBlocker` tracks entities that are blocking the Lunar Supernova attack, spawns associated visual FX (robot leg effects), manages colour flickering via `colouradder`, and ensures the blocking entity remains within valid arena constraints. It is primarily used in the WagPunk arena context to visually and functionally represent supernova shielding effects.

The component integrates with:
- `colouradder`: To dynamically set and remove a flickering white tint.
- `easing`: To calculate flicker intensity using `inOutQuad`.
- `WagBossUtil`: To validate distance limits in non-arena zones.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lunarsupernovablocker")
inst.components.lunarsupernovablocker:AddSource(supernova_burning_entity)
inst.components.lunarsupernovablocker:SetOnStopBlockingFn(function(inst)
    print("Supernova blocking ended")
end)
```

## Dependencies & tags
**Components used:** `colouradder`  
**Tags:** Adds `lunarsupernovablocker` to the owning entity on initialization.

## Properties
No public properties.

## Main functions
### `AddSource(source)`
*   **Description:** Registers an entity as a source blocking the Lunar Supernova, spawns and positions a related FX entity (`wagboss_robot_leg_fx`), and begins updates if this is the first source.
*   **Parameters:** `source` (Entity) — the entity blocking the supernova; must have a valid `Transform` component.
*   **Returns:** Nothing.
*   **Error states:** No-op if `source` is already registered.

### `RemoveSource(source)`
*   **Description:** Unregisters a blocking source, removes its associated FX, and stops updates if no sources remain. Also removes the `lunarsupernovablocker` colour contribution.
*   **Parameters:** `source` (Entity) — previously added blocking source.
*   **Returns:** Nothing.
*   **Error states:** No-op if `source` is not currently registered.

### `SetOnStartBlockingFn(fn)`
*   **Description:** Sets a callback that fires when the first source begins blocking (i.e., when `AddSource` transitions the blocker from inactive to active).
*   **Parameters:** `fn` (function) — a function that takes the blocking entity as its only argument.
*   **Returns:** Nothing.

### `SetOnStopBlockingFn(fn)`
*   **Description:** Sets a callback that fires when the last source stops blocking (i.e., when `RemoveSource` deactivates the blocker).
*   **Parameters:** `fn` (function) — a function that takes the blocking entity as its only argument.
*   **Returns:** Nothing.

### `UpdateFlicker()`
*   **Description:** Toggles the flicker state and updates the `colouradder` with a randomized white tint using `inOutQuad` easing to modulate opacity. Only applies effect on every other call.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early without modification if `flickerdelay` is `true`.

### `OnUpdate(dt)`
*   **Description:** Periodically updates blocking sources: validates their continued eligibility (e.g., state, location, arena bounds), updates FX visibility and rotation, and calls `UpdateFlicker()`.
*   **Parameters:** `dt` (number) — time since last update.
*   **Returns:** Nothing.
*   **Error states:** Removes invalid sources if they lack `supernovaburning` state tag, are no longer valid, or violate arena or distance constraints.

## Events & listeners
- **Listens to:** `onremove` — handled implicitly via `colouradder` when registered sources are removed (via `PushColour`).
- **Pushes:** None directly; does not fire custom events.

## Components and internal state
- `self.sources`: A dictionary mapping each source entity to its spawned FX instance.
- `self.flickerdelay`: Boolean toggle used to limit flicker update frequency.
- `self.onstartblockingfn` / `self.onstopblockingfn`: Optional callbacks for start/stop lifecycle hooks (disabled by default; uncommented in constructor but used externally via setters).
