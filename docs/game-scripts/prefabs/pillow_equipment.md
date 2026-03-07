---
id: pillow_equipment
title: Pillow equipment
description: Generates prefabs for body and hand pillows, including associated attack FX, with equipment and weapon behavior tailored for combat and minigames.
tags: [combat, inventory, equipment, fx, minigame]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f01a2714
system_scope: entity
---

# Pillow equipment

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pillow_equipment.lua` defines the creation logic for three types of prefabs: body pillows, hand pillows, and their associated attack FX. It uses `MakeBodyPillow` and `MakeHandPillow` to generate configurable pillow prefabs with specific behaviors: body pillows act as wearable defense items with block-related callbacks, while hand pillows function as weapons with knockback and minigame-aware attack logic. The script also defines `MakePillowFX` for visual effects triggered during hand pillow attacks. Dependencies are drawn from `pillow_common.lua` (for shared utilities like knockback handling) and `pillow_defs.lua` (for material-specific data). Components like `equippable`, `weapon`, and `minigame_participator` are used to integrate with DST’s ECS.

## Usage example
```lua
-- Example: spawn a hand pillow and equip it
local pillow = SpawnPrefab("handpillow_wool")
if pillow and pillow.components.equippable then
    local player = ThePlayer
    player.components.inventory:Equip(pillow, EQUIPSLOTS.HANDS)
end

-- Example: spawn a body pillow
local bodypillow = SpawnPrefab("bodypillow_wool")
```

## Dependencies & tags
**Components used:** `named`, `inspectable`, `inventoryitem`, `equippable`, `weapon`, `minigame_participator` (read-only via `CurrentMinigameType`), `smallburnable`, `smallpropagator`, `hauntablelaunch`  
**Tags:** `bodypillow`, `pillow`, `propweapon`, `FX`, `NOCLICK`, `_named` (temporary, removed post-pristine state on master)

## Properties
No public properties are exposed directly by this script. Instances created by `MakeHandPillow` and `MakeBodyPillow` set internal state (e.g., `inst._knockback`, `inst._defense_callback`), but these are private implementation details.

## Main functions
### `MakeBodyPillow(materialname, pillowdata)`
*   **Description:** Constructs and returns a `Prefab` for a wearable body pillow. Sets up animation overrides on equip/unequip and registers block/attack event handlers to trigger defense callbacks with cooldowns.
*   **Parameters:** `materialname` (string) - identifies the visual material and animation; `pillowdata` (table, optional) - configuration with keys like `defense_cooldown`, `defense_callback`, `body_prize_value`.
*   **Returns:** `Prefab` instance (non-nil).
*   **Error states:** None; `pillowdata` defaults to empty table if omitted.

### `MakeHandPillow(materialname, pillowdata)`
*   **Description:** Constructs and returns a `Prefab` for a hand pillow weapon. Configures weapon damage/range, equip animation, and attack behavior—including minigame-aware knockback or simple damage event propagation.
*   **Parameters:** `materialname` (string) - identifies the visual material and animation; `pillowdata` (table, optional) - configuration with keys like `knockback`, `strengthmult`, `hand_prize_value`.
*   **Returns:** `Prefab` instance (non-nil).
*   **Error states:** None; `pillowdata` defaults to empty table if omitted.

### `MakePillowFX(materialname, data)`
*   **Description:** Constructs and returns a `Prefab` for a short-lived visual FX entity used during hand pillow attacks. Plays debris animation and supports fast-forwarding.
*   **Parameters:** `materialname` (string) - identifies the FX animation; `data` (table) - unused in current implementation.
*   **Returns:** `Prefab` instance (non-nil).

### `FastForwardAttackFX(inst, pct)`
*   **Description:** Utility on FX entities to skip part of the animation and延时 removal. Called externally to accelerate FX playback.
*   **Parameters:** `inst` (Entity) - the FX instance; `pct` (number, clamped `0`–`1`) - fraction of animation to skip to.
*   **Returns:** Nothing. Schedules a delayed removal task.

## Events & listeners
- **Listens to:** `blocked`, `attacked` (on body pillow owner entity, via `inst:ListenForEvent`) to trigger defense callback logic.
- **Pushes:** None directly (attacks push `attacked` on target entities, but this is handled by the weapon component's `SetOnAttack` callback).
