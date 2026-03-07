---
id: brilliance_projectile_fx
title: Brilliance Projectile Fx
description: Handles visual effects and physics for the Brilliance Projectile weapon projectile, including bouncing logic and hit/miss animations.
tags: [combat, fx, projectile]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0a0ffbca
system_scope: fx
---

# Brilliance Projectile Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`brilliance_projectile_fx` is a prefab that represents the visual projectile entity used by the Brilliance weapon in DST. It implements projectile movement via the `projectile` component, handles bouncing behavior when hitting valid targets, and triggers a visual blast effect on impact. It also applies temporary colour fading effects to the hit target via the `colouradder` component.

## Usage example
This prefab is spawned internally by the game (e.g., when the Brilliance weapon is used) and is not intended for direct manual instantiation by modders. However, a modder could replicate its behavior by adding the `projectile` component and implementing custom hit logic:
```lua
local proj = SpawnPrefab("brilliance_projectile_fx")
proj.components.projectile:SetSpeed(15)
proj.components.projectile:SetRange(25)
proj.components.projectile:Throw(owner, target, attacker)
```

## Dependencies & tags
**Components used:** `projectile`, `combat`, `health`, `inventory`, `locomotor`, `colouradder`
**Tags:** Adds `FX`, `NOCLICK`, `projectile`

## Properties
No public properties exposed directly on the prefab instance. Internal state is managed via component properties (e.g., `inst.bounces`, `inst.owner`, `inst.recenttargets`) set during projectile flight.

## Main functions
### `PlayAnimAndRemove(inst, anim)`
*   **Description:** Plays a specified animation and removes the entity once the animation completes. Prevents duplicate removal logic.
*   **Parameters:**  
    `inst` (EntityInstance) — the projectile entity.  
    `anim` (string) — name of the animation to play.
*   **Returns:** Nothing.

### `OnThrown(inst, owner, target, attacker)`
*   **Description:** Initializes projectile bounce count and tracks whether the initial target was hostile. Used to influence subsequent bounce behavior.
*   **Parameters:**  
    `inst` (EntityInstance) — the projectile entity.  
    `owner` (EntityInstance) — the entity that launched the projectile.  
    `target` (EntityInstance) — the primary target of the throw.  
    `attacker` (EntityInstance) — the entity performing the attack (may differ from owner).
*   **Returns:** Nothing.

### `TryBounce(inst, x, z, attacker, target)`
*   **Description:** Scans for a new valid target within `BOUNCE_RANGE` after a bounce, applying preference logic (e.g., prioritizing hostile or recently hit targets). If a new target is found, throws the projectile at it; otherwise, removes the projectile.
*   **Parameters:**  
    `inst` (EntityInstance) — the projectile entity.  
    `x` (number) — X-coordinate of the bounce position.  
    `z` (number) — Z-coordinate of the bounce position.  
    `attacker` (EntityInstance) — the entity performing the attack.  
    `target` (EntityInstance) — the previous target.
*   **Returns:** Nothing.
*   **Error states:** Immediately removes the projectile if `attacker` is invalid or lacks a `combat` component.

### `OnHit(inst, attacker, target)`
*   **Description:** Handles projectile impact: spawns a blast effect, optionally triggers bouncing if bounces remain, and manages visual fading of the hit target’s colour.
*   **Parameters:**  
    `inst` (EntityInstance) — the projectile entity.  
    `attacker` (EntityInstance) — the entity performing the attack.  
    `target` (EntityInstance) — the entity that was hit.
*   **Returns:** Nothing.

### `OnMiss(inst, attacker, target)`
*   **Description:** Triggers the "disappear" animation and removes the projectile after the animation completes.
*   **Parameters:**  
    `inst` (EntityInstance) — the projectile entity.  
    `attacker` (EntityInstance) — the entity performing the attack.  
    `target` (EntityInstance) — the intended target (may be invalid).
*   **Returns:** Nothing.

### `PushFlash(inst, target)`
*   **Description:** Applies a sequence of decreasing colour flashes to the target using `colouradder:PushColour`, creating a fading visual effect. Registered as a method on the `brilliance_projectile_blast_fx` prefab.
*   **Parameters:**  
    `inst` (EntityInstance) — the blast effect instance.  
    `target` (EntityInstance) — the entity to flash.
*   **Returns:** Nothing.

### `PushColour(inst, r, g, b)`
*   **Description:** Helper to push a colour adjustment to the target’s `colouradder` component, creating the flash effect. Adds the component to the target if missing.
*   **Parameters:**  
    `inst` (EntityInstance) — the blast effect instance.  
    `r`, `g`, `b` (number) — RGB colour values (0–1).
*   **Returns:** Nothing.

### `PopColour(inst)`
*   **Description:** Removes the blast effect’s colour contribution from the target’s `colouradder`.
*   **Parameters:**  
    `inst` (EntityInstance) — the blast effect instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` — triggers removal of the projectile or blast entity when an animation finishes.  
  - `onthrown` — internally used by the `projectile` component; calls `OnThrown`.
- **Pushes:**  
  - `hostileprojectile` — fired on the target via the `projectile` component when thrown.  
  - No custom events beyond what the `projectile` component uses.
