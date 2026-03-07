---
id: vault_statues
title: Vault Statues
description: Manages visual and narrative state for vault-themed statues, including scene-specific animation and lore display in scrapbook mode.
tags: [structure, lore, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: efe77b68
system_scope: environment
---

# Vault Statues

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`vault_statues` is a prefab definition for interactive vault-themed statues used in the game's world. It establishes core visual components (animation, minimap icon), physical properties, and persistence support (save/load). It also integrates with the `inspectable` component to provide scene-based status text (e.g., "LORE1" → "LORE1") when examined by the player. The component is primarily responsible for managing statue identity (`id`) and associated narrative scene (`scene`), updating visuals accordingly.

## Usage example
```lua
-- Create and configure a vault statue entity
local inst = Prefab("vault_statue", fn, assets)()
inst:SetId("guard1")
inst:SetScene("lore2")

-- The `inspectable` component will now report status as "LORE2"
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `minimapentity`, `network`, `inspectable`  
**Tags:** `structure`, `statue`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `id` | string | `"king"` | Identifier selecting the statue type (e.g., `"king"`, `"guard1"`, `"guard2"`, `"gate"`), used to set animation and minimap icon. |
| `scene` | string | `"lore1"` | Narrative scene label, used for scrapbook status display and persistence. |
| `animstate` | `AnimState` | — | Handles animation playback (e.g., `"idle_king"`, `"idle_guard1"`). |
| `MiniMapEntity` | `MiniMapEntity` | — | Manages minimap icon (e.g., `"vault_statue_king.png"`). |

## Main functions
### `SetId(id)`
* **Description:** Updates the statue's visual representation to match the given `id`. Changes the animation clip and minimap icon.
* **Parameters:** `id` (string) — one of `"king"`, `"guard1"`, `"guard2"`, `"guard3"`, `"gate"`, etc.
* **Returns:** Nothing.

### `SetScene(scene)`
* **Description:** Assigns the narrative scene label; does not affect visuals directly but is persisted and used by `inspectable.getstatus`.
* **Parameters:** `scene` (string) — e.g., `"lore1"`, `"lore2"`.
* **Returns:** Nothing.

### `GetStatus(viewer)`
* **Description:** Returns the uppercase version of the current `scene` string for display in the scrapbook or inspect UI.
* **Parameters:** `viewer` (unused) — kept for API compatibility with `inspectable.getstatus`.
* **Returns:** string — uppercase of `inst.scene` (e.g., `"LORE1"`).

### `OnSave(data)`
* **Description:** Serializes state for persistence. Omits default values (`id == "king"` or `scene == "lore1"`) to reduce save data size.
* **Parameters:** `data` (table) — destination table for serialized state.
* **Returns:** Nothing.

### `OnLoad(data)`
* **Description:** Restores state from saved data. Calls `SetId` and/or `SetScene` if corresponding values exist.
* **Parameters:** `data` (table) — contains `id` and/or `scene` keys if saved.
* **Returns:** Nothing.

## Events & listeners
None identified.