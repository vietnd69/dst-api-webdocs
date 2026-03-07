---
id: minisign
title: Minisign
description: Implements the mini sign prefab, a deployable and drawable crafting object that can be placed in the world and inscribed with custom text by the player.
tags: [crafting, deployable, drawable, world]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b34ec68a
system_scope: world
---

# Minisign

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `minisign` prefab represents a deployable sign that players can craft and place in the world. It supports dynamic rendering via the `drawable` component, allowing the sign to display custom text once "drawn" by the player. When placed, it spawns a stationary `minisign` entity with workable and burnable properties. It supports two forms: an undrawn item (`minisign_item`) and a drawn item (`minisign_drawn`). The sign uses networked string state (`_imagename`) to synchronize drawn text across client and server.

## Usage example
```lua
local sign = SpawnPrefab("minisign")
sign.Transform:SetPosition(position)
sign.components.deployable.ondeploy(sign, position)
```

## Dependencies & tags
**Components used:** `deployable`, `drawable`, `fuel`, `inspectable`, `lootdropper`, `workable`, `burnable`, `stackable`, `inventoryitem`
**Tags:** Adds `sign`, `drawable`. Checks `fire`, `sign`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_imagename` | net_string | `""` | Networked string storing the custom drawn text displayed on the sign. |
| `displaynamefn` | function | `displaynamefn` | Custom function computing the display name based on `_imagename`. |
| `CanMouseThrough` | function | `CanMouseThrough` | Function determining if the player can move through the entity during interaction. |

## Main functions
### `ondeploy(inst, pt)`
*   **Description:** Deploys the sign from an item into the world. Spawns a `minisign` entity, transfers drawn state if present, and plays a sound.
*   **Parameters:** `inst` (Entity) — the deployed item; `pt` (Vector3) — the deployment position.
*   **Returns:** Nothing.
*   **Error states:** Removes the item stack only if `stackable` is present; otherwise copies drawn state directly and removes the item.

### `dig_up(inst)`
*   **Description:** Retrieves the sign, converting it back into a `minisign_drawn` or `minisign_item` depending on whether text has been set.
*   **Parameters:** `inst` (Entity) — the planted sign.
*   **Returns:** Nothing.

### `OnDrawnFn(inst, image, src, atlas, bgimage, bgatlas)`
*   **Description:** Updates rendering of the sign when text is applied or cleared, overriding sprite symbols (`SWAP_SIGN`, `SWAP_SIGN_BG`). Handles visual feedback and sound on draw.
*   **Parameters:** 
    * `inst` (Entity) — the sign entity.
    * `image` (string or nil) — the texture name of the drawn image.
    * `src` (Entity or nil) — optional source entity (e.g., drawing tool).
    * `atlas`, `bgatlas` (string or nil) — custom atlas names.
    * `bgimage` (string or nil) — background image name.
*   **Returns:** Nothing.
*   **Error states:** Clears draw symbols if `image` is `nil`; may suppress drawing (`SetCanDraw(false)`) while `sign` tag is active.

### `CanMouseThrough(inst)`
*   **Description:** Client-side function determining if the player's cursor can pass over the sign during navigation (i.e., no meaningful LMB/RMB action is active).
*   **Parameters:** `inst` (Entity) — the sign entity.
*   **Returns:** `true` if mouse can pass through (no overriding actions); otherwise `false`.
*   **Error states:** Returns early if `fire` tag is present or player missing.

### `displaynamefn(inst)`
*   **Description:** Computes the sign's display name based on its drawn text. Returns formatted name if text is present; otherwise falls back to base name.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `string` — localized display name.
*   **Error states:** Returns base name if `_imagename` is empty.

## Events & listeners
- **Listens to:** 
  - None explicitly via `inst:ListenForEvent`. Event handlers are attached via component callbacks (`SetOnIgniteFn`, `SetOnExtinguishFn`, `SetOnFinishCallback`).
- **Pushes:** 
  - `loot_prefab_spawned` — via `lootdropper:SpawnLootPrefab` during `dig_up`.
  - Custom events (`on_loot_dropped`) are pushed on spawned loot, not the sign itself.