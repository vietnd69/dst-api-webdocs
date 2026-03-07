---
id: shadowthrall_centipede
title: Shadowthrall Centipede
description: Manages the spawn, structure, and shared behavior of shadow thrall centipede entities (controller, head, body) within the Entity Component System.
tags: [combat, ai, boss, centipede]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 994e9bbe
system_scope: entity
---

# Shadowthrall Centipede

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines three prefabs for the Shadowthrall Centipede: `shadowthrall_centipede_controller`, `shadowthrall_centipede_head`, and `shadowthrall_centipede_body`, plus a temporary spawner. The controller is the logical center that manages a body of segments via the `centipedebody` component, while heads and bodies are physical components with shared behavior and interaction logic (e.g., collisions, sound, damage handling). The centipede functions as a boss-style entity with complex AI, planar damage, and world interaction (smashing structures, eating miasma, ignoring many environmental hazards).

## Usage example
```lua
-- The centipede is spawned as a controller entity with attached segments:
local controller = SpawnPrefab("shadowthrall_centipede_controller")
if controller and controller:IsValid() then
    -- Segments are spawned automatically via the controller's brain after a delay
    -- The head can be accessed via controller.heads[1] if available
    -- Brains are assigned automatically during construction
end
```

## Dependencies & tags
**Components used:** `health`, `combat`, `eater`, `locomotor`, `lootdropper`, `planarentity`, `planardamage`, `sanityaura`, `teleportedoverride`, `inspectable`, `drownable`, `timer`, `knownlocations`, `centipedebody`, ` riftspawner` (via event listener).

**Tags added:**
- Common to all segments: `shadow_aligned`, `shadowthrall`, `electricdamageimmune`, `shadowthrall_centipede`, `toughworker`, `tree_rock_breaker`, `groundpound_immune`, `quakeimmune`, `quakebreaker`, `largecreature`.
- Head-only: `centipede_head`.
- Body-only: `centipede_body`.
- Controller-only: `shadowthrall_centipede_controller`, `NOCLICK`, `INLIMBO`, `NOBLOCK`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `miasma_counter` | number | `0` | Tracks miasma consumed; resets after slurping 3 units. Defined only on heads. |
| `control_priority` | number | `PRIORITY_BEHAVIOURS.WANDERING` | Current behavior priority (WANDERING, EATING, etc.). Defined only on heads. |
| `PRIORITY_BEHAVIOURS` | table | `{RUN_AWAY=3, CHARGING=2, EATING=1, WANDERING=0, STUCK=-1}` | Behavior priority constants. Defined only on heads. |
| `spike_variation` | number | random (1–3) | Selected from `{"spikeA", "spikeB", "spikeC"}`; determines visible sprite. Saved/loaded. |
| `flipped` | boolean | `false` | Tracks if the segment is inverted; used by second head logic. |
| `controller` | entity reference | `nil` | Reference to controller entity. Not set directly in this file. |
| `recoil_effect_offset` | Vector3 | `Vector3(0, 1.5, 0)` | Offset for particle effects during attacks. |
| `rot` | number | `0` | Placeholder for rotation tracking (TODO). |

## Main functions
### `commonfn(data)`
*   **Description:** Shared constructor for all centipede segment types (head, body, controller). Sets up transforms, physics, animations, tags, and common components. Returns a fully constructed entity.
*   **Parameters:** `data` (table) - Includes `MASS`, `BANK`, and optionally `TAG` (e.g., `HEAD_DATA`, `BODY_DATA`).
*   **Returns:** `inst` (entity) — The constructed entity with components attached.
*   **Error states:** None documented; returns early on clients if `TheWorld.ismastersim` is false.

### `headfn()`
*   **Description:** Constructor specifically for the centipede head. Extends `commonfn` with AI brain, idle sound, and head-specific properties.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — The head entity.
*   **Error states:** Returns early on clients if `TheWorld.ismastersim` is false.

### `torsofn()`
*   **Description:** Constructor specifically for the centipede body segments. Extends `commonfn` and marks it as a proxy for scrapbook display.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — The body segment entity.
*   **Error states:** None documented.

### `controller_fn()`
*   **Description:** Constructor for the centipede controller entity. Creates the logical center with `centipedebody` component, health, combat, and brain; triggers segment spawning.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — The controller entity.
*   **Error states:** May defer segment spawning if `POPULATING` is true.

### `SetSpikeVariation(inst, variation)`
*   **Description:** Sets the visible spike sprite variation on a centipede segment.
*   **Parameters:** 
  - `inst` (entity) — Target segment.
  - `variation` (number, optional) — Index into `SPIKE_SYMBOLS`; defaults to random.
*   **Returns:** Nothing.
*   **Error states:** Skips invisible layers via `AnimState:Hide()`, shows selected layer.

### `SetBackwardsLocomotion(inst, bool)`
*   **Description:** Enables or disables backwards movement by applying a speed multiplier of `-1` to the locomotor.
*   **Parameters:** 
  - `inst` (entity) — Target segment.
  - `bool` (boolean) — `true` to enable backwards movement.
*   **Returns:** Nothing.

### `DamageRedirectFn(inst, attacker, damage, weapon, stimuli)`
*   **Description:** Combat callback to redirect damage to the controller entity when the segment is attacked.
*   **Parameters:** Standard combat callback arguments.
*   **Returns:** `inst.controller` if valid, else `nil`.
*   **Error states:** Does nothing if `inst.controller` is invalid or missing.

### `TeleportOverrideFn(inst)`
*   **Description:** Disables teleportation for centipede segments; returns current position.
*   **Parameters:** `inst` (entity).
*   **Returns:** `inst:GetPosition()` — Current world position.
*   **Error states:** None.

### `OnDeath(inst)`
*   **Description:** Called when the controller dies; forces all body segments to be killed.
*   **Parameters:** `inst` (entity) — The controller.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `blocked` — Plays hit sound and may trigger vibration effects.
- **Listens to:** `broke_tree_rock` — Pushes `start_struggle` event to the controlling head.
- **Listens to:** `death` (controller only) — Triggers `OnDeath` to kill body segments.
- **Listens to:** `ms_riftaddedtopool`, `ms_riftremovedfrompool` (spawner only) — Controls when the centipede spawns/despawns via rift state.
- **Pushes:** `attacked` — Fired on controller head when any segment takes damage.
- **Pushes:** `invincibletoggle` — Fired by `health` component when invincibility changes.