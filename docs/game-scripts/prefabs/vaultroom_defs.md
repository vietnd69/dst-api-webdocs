---
id: vaultroom_defs
title: Vaultroom Defs
description: Defines room generation logic for vault areas, including terrain terraforming and layout spawning.
tags: [vault, room, procedural, environment, layout]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c7b9efc8
system_scope: environment
---

# Vaultroom Defs

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`vaultroom_defs.lua` defines procedural generation templates for vault rooms. It contains a global `defs` table mapping room IDs (e.g., `"puzzle1"`, `"hall3"`) to objects with `TerraformRoomAtXZ` and `LayoutNewRoomAtXZ` functions. These functions control terrain shaping (via a private `Terraformer` class) and entity placement (pillars, lights, relics, statues, etc.) when vault rooms are generated. It integrates with `VaultRoom` and `VaultRoomManager` components for room identification and randomness seeding, and uses `FurnitureDecorTaker` to attach decorative items.

## Usage example
```lua
local room_id = "puzzle1"
if defs[room_id] and defs[room_id].LayoutNewRoomAtXZ then
    local x, z = 10 * TILE_SIZE, -20 * TILE_SIZE
    TheWorld:PushEvent("ms_vault_terraform", {x = x, z = z})
    defs[room_id].TerraformRoomAtXZ(inst, x, z)
    defs[room_id].LayoutNewRoomAtXZ(inst, x, z)
end
```

## Dependencies & tags
**Components used:** `vaultroom` (`inst.components.vaultroom.roomid`), `vaultroommanager` (`inst.components.vaultroommanager:GetPRNGSeed()`), `furnituredecortaker` (`furnituredecortaker:AcceptDecor()`).  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `ResetTerraformRoomAtXZ(inst, x, z)`
*   **Description:** Resets terrain in a 11×11 tile area centered at `(x, z)` to default vault terrain, clearing all tiles except impassable border ring.
*   **Parameters:**  
    `inst` (Entity) — unused placeholder; `x` (number) — world X coordinate; `z` (number) — world Z coordinate.  
*   **Returns:** Nothing.
*   **Error states:** None.

### `puzzle1.TerraformRoomAtXZ(inst, x, z)`
*   **Description:** Terraforms a 7×7 central clear area, plus four eroded tiles along the top edge, within an 11×11 region.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `puzzle1.LayoutNewRoomAtXZ(inst, x, z)`
*   **Description:** Spawns room layout for `puzzle1`, including trial entity, runes, pillar variations, exit chandelier, and two minion-statue columns with randomized broken states.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `puzzle2.TerraformRoomAtXZ(inst, x, z)`
*   **Description:** Terraforms a room with a central passable zone shaped like an inverted “T” within an 11×11 region.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `puzzle2.LayoutNewRoomAtXZ(inst, x, z)`
*   **Description:** Spawns layout for `puzzle2`: runes, trial, relics, pillar variations, groundFX, and lighting.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `halldef.TerraformRoomAtXZ(inst, x, z)`
*   **Description:** Terraforms a hall room layout with clear corridors on axes and a cleared 3×3 center box.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `halldef.LayoutNewRoomAtXZ(inst, x, z)`
*   **Description:** Spawns hall layout: pillars, chandeliers (broken or decorated), and optional groundFX based on room ID or RNG. Uses PRNG seed if available for determinism.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `lore1.LayoutNewRoomAtXZ(inst, x, z)`
*   **Description:** Spawns lore room with runes, statues, pillars, and lighting; uses RNG for ground and broken pillar variants.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `lore2.LayoutNewRoomAtXZ(inst, x, z)`
*   **Description:** Spawns lore room with gate statue, ancient statues in a circle, pillars, lighting, and centered groundFX.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `lore3.LayoutNewRoomAtXZ(inst, x, z)`
*   **Description:** Spawns lore room with guardian statues, pillars, lighting, and centered groundFX.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `teleport1.LayoutNewRoomAtXZ(inst, x, z)`
*   **Description:** Spawns teleport room with runes, pillars, lighting, and centered groundFX.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `mask1.LayoutNewRoomAtXZ(inst, x, z)`
*   **Description:** Spawns mask room with husks, masks, pillars, lighting, and groundFX patterns; includes RNG-based variations.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `generator1.LayoutNewRoomAtXZ(inst, x, z)`
*   **Description:** Spawns generator room with switch, pillars, lighting (3 chandeliers), and groundFX.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `fountain1.LayoutNewRoomAtXZ(inst, x, z)`
*   **Description:** Spawns fountain room dispensing `"turf_vault"` items.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `fountain2.LayoutNewRoomAtXZ(inst, x, z)`
*   **Description:** Spawns fountain room dispensing `"vaultrelic"` items.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

### `playbill1.LayoutNewRoomAtXZ(inst, x, z)`
*   **Description:** Spawns tavern-style room with tables, stools, groundFX, and one table decorated via `furnituredecortaker:AcceptDecor()`.
*   **Parameters:** Same as `ResetTerraformRoomAtXZ`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.