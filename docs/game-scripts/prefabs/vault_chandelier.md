---
id: vault_chandelier
title: Vault Chandelier
description: "Defines two prefabs: a broken chandelier and a decor variant, used for static environmental props in the Vault area."
tags: [environment, decor, props]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3e17c10f
system_scope: environment
---

# Vault Chandelier

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines two prefabs for static environmental props in the Vault area: `vault_chandelier_broken` and `vault_chandelier_decor`. The broken variant is a static obstacle with physics, while the decor variant is a non-interactive lighting fixture that supports frame-randomized and chain-variation visuals. Both use the same animation asset (`anim/chandelier_vault.zip`) and rely on `Transform`, `AnimState`, and `Network` components. Neither prefab implements custom behavior beyond basic setup.

## Usage example
```lua
-- Spawn broken chandelier
local broken = SpawnPrefab("vault_chandelier_broken")
broken.Transform:SetPos(x, y, z)

-- Spawn decor chandelier and set variation
local decor = SpawnPrefab("vault_chandelier_decor")
decor:SetVariation(2)  -- Plays "chain_idle_2" animation
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network`, `inspectable` (broken only)
**Tags:** `NOCLICK`, `decor` (decor variant only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variation` | number | `1` | Chain animation variation; used by `SetVariation()` to switch `"chain_idle_X"` animations. |

## Main functions
### `SetVariation(variation)`
*   **Description:** Sets the chain animation variation (e.g., `"chain_idle_2"`) and replays the animation. No-op if `variation` matches current.
*   **Parameters:** `variation` (number) - The variation index appended to `"chain_idle_"`.
*   **Returns:** `self` (`inst`) for chaining.
*   **Error states:** None.

### `OnSave(inst, data)`
*   **Description:** Serializes the `variation` property into the save data. Only saves if `variation` is not `1` (default).
*   **Parameters:** `inst` (entity instance), `data` (table) — save data table to modify.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores the `variation` property from save data if present.
*   **Parameters:** `inst` (entity instance), `data` (table) — loaded save data.
*   **Returns:** Nothing.

## Events & listeners
None identified.