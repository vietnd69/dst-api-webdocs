---
id: lavaarena_battlestandard
title: Lavaarena Battlestandard
description: Creates and manages visual and gameplay effects for Lava Arena battle standards, including applying debuffs to nearby mobs via a world-wide tracker.
tags: [combat, boss, fx, arena]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b55d94fa
system_scope: world
---

# Lavaarena Battlestandard

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_battlestandard` is not a component but a prefab factory module that defines reusable prefabs for the Lava Arena boss encounter. It provides three distinct battle standard prefabs (damager, shield, and heal), each with unique visual and gameplay behavior, and three associated buff prefabs. The prefabs are configured with animation overrides and debuff templates, and they coordinate with the `lavaarenamobtracker` component on the world entity to pulse effects to all debuffable entities within the arena.

## Usage example
```lua
-- Typical usage occurs when spawning battle standards during the Lava Arena boss fight
local damager_standard = SpawnPrefab("lavaarena_battlestandard_damager")
damager_standard.Transform:SetPosition(x, y, z)

-- This prefab automatically applies attacks to nearby mobs via the world’s lavaarenamobtracker
```

## Dependencies & tags
**Components used:** None — this is a prefab definition, not a component.
**Tags:** Adds `battlestandard`, `LA_mob`, and `DECOR`/`NOCLICK` to FX sub-entities.

## Properties
No public properties are exposed at the prefab level. The factory functions `MakeBattleStandard` and `MakeBuff` return configured `Prefab` objects.

## Main functions
### `MakeBattleStandard(name, build_swap, debuffprefab, fx_anim)`
* **Description:** Creates and returns a `Prefab` for a battle standard with custom animation, debuff, and FX behavior. Used to define the three battle standard prefabs.
* **Parameters:**
  - `name` (string) – The prefab name (e.g., `"lavaarena_battlestandard_damager"`).
  - `build_swap` (string or `nil`) – Optional build swap animation override for the standard’s model.
  - `debuffprefab` (string) – The name of the debuff prefab to be applied during pulses.
  - `fx_anim` (string) – Name of the animation to play on pulse FX.
* **Returns:** A `Prefab` instance configured for the specified role.
* **Error states:** No direct error handling; nil `build_swap` is safely handled.

### `MakeBuff(name, buffid)`
* **Description:** Creates a minimal `Prefab` for a battle standard buff (damager, shield, or heal). Delegates actual instantiation to a server-side hook.
* **Parameters:**
  - `name` (string) – The prefab name.
  - `buffid` (string) – Identifier passed to the `createbuff` hook.
* **Returns:** A `Prefab` instance.

### `OnPulse(inst)`
* **Description:** Triggers the FX animation for the local instance and broadcasts a pulse to all debuffable entities via `lavaarenamobtracker`.
* **Parameters:** `inst` (entity reference) – The battle standard entity.
* **Returns:** Nothing.

### `ApplyPulse(ent, params)`
* **Description:** Applies an FX pulse to a single debuffable entity if it is valid and alive. Only runs on the client.
* **Parameters:**
  - `ent` (entity) – Target entity to pulse.
  - `params` (table) – Contains `fxanim` (string).
* **Returns:** Nothing.

### `CreatePulse(target)`
* **Description:** Creates a local FX sub-entity attached to the battle standard for visual feedback.
* **Parameters:** `target` (entity) – The battle standard to parent the FX to.
* **Returns:** The FX entity (`inst`), configured with transform, animation, and tags.
* **Error states:** FX is only created on non-dedicated clients.

## Events & listeners
- **Listens to:** `lavaarena_battlestandard_damager.pulse` – triggers `OnPulse` on the battle standard entity.
- **Pushes:** `animover` – listened to on FX entities to trigger removal.
- **Uses network event:** `lavaarena_battlestandard_damager.pulse` – sent via `net_event` for client-server sync.
