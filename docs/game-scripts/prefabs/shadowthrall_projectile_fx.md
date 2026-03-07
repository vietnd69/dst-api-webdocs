---
id: shadowthrall_projectile_fx
title: Shadowthrall Projectile Fx
description: A visual and damage-dealing effect prefab that travels as a projectile, deals area-of-effect damage on impact, and leaves behind a scorch mark.
tags: [fx, combat, projectile, AoE]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 447f1faf
system_scope: fx
---

# Shadowthrall Projectile Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shadowthrall_projectile_fx` prefab is a non-player, transient effect entity that functions as a visual projectile launched by the Shadowthrall. It travels using physics-based motion, spawns impact animations and sound, and applies area-of-effect (AoE) combat damage to nearby valid targets upon collision. It is tightly integrated with the `complexprojectile`, `planardamage`, and `combat` components, and is designed to persist only during its flight and impact lifecycle.

## Usage example
This prefab is automatically spawned by the game internally (e.g., as part of the Shadowthrall’s attack) and is not intended for direct manual instantiation in mod code. However, a modder may reference its behavior or extend it by subclassing:

```lua
-- Example: checking how the projectile damage is applied (internal usage)
local fx = SpawnPrefab("shadowthrall_projectile_fx")
-- The component setup is handled automatically in fn()
```

## Dependencies & tags
**Components used:**  
- `complexprojectile` — for projectile motion and launch/impact callbacks  
- `planardamage` — for base damage calculation  
- `combat` (on target entities) — invoked via `GetAttacked()`  
- `health` (on target entities) — checked via `IsDead()`  
- `spdamageutil` — for special damage collection  

**Tags added:**  
- `"FX"`, `"NOCLICK"`, `"shadow_aligned"`, `"projectile"`, `"complexprojectile"`  

**Tags checked (on target entities):**  
- `"INLIMBO"`, `"flight"`, `"invisible"`, `"notarget"`, `"noattack"`, `"shadow_aligned"`  

## Properties
No public properties are exposed on the `shadowthrall_projectile_fx` instance itself. Internal state is stored on the entity (e.g., `inst.owner`, `inst.targets`, `inst.sfx`) but these are not part of the public API.

## Main functions
### `OnHit(inst)`
*   **Description:** Callback invoked when the projectile collides or reaches the end of its trajectory. Stops the projectile, plays impact animation and sound, creates a scorch mark, and applies AoE damage to eligible entities within radius.  
*   **Parameters:** `inst` (entity) — the projectile instance.  
*   **Returns:** Nothing.  
*   **Error states:** Skips sound playback if `inst.sfx.played` is `true`; ignores entities that are dead, in limbo, or match a forbidden tag.

### `OnLaunch(inst, attacker)`
*   **Description:** Callback invoked at projectile launch. Assigns the `attacker` (owner) to the instance for damage attribution.  
*   **Parameters:**  
  - `inst` (entity) — the projectile instance  
  - `attacker` (entity) — the entity that launched the projectile  
*   **Returns:** Nothing.  

## Events & listeners
- **Listens to:** `"animover"` — triggers `inst.Remove` after impact animation completes.  
- **Pushes:** None.