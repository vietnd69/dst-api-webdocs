---
id: damagenumber
title: Damagenumber
description: Renders a damage popup number for the local player when damage is applied, synchronized across the network.
tags: [network, fx, ui, combat,Prefab]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6160d008
system_scope: fx
---

# Damagenumber

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`damagenumber` is a lightweight prefab component that displays floating damage text above a target entity. It uses networked values (`net_entity`, `net_shortint`, `net_bool`) to synchronize damage state from the master to clients. Clients render the visual popup via `HUD:ShowPopupNumber` when the `damagedirty` event is received. The component has no game logic of its own — it is purely a client-facing display mechanism.

## Usage example
```lua
-- Typically spawned automatically by the combat system (e.g., after an entity takes damage)
-- Manually triggering is not recommended; this prefab is not meant for direct instantiation
-- Example of internal use in combat code:
local inst = SpawnPrefab("damagenumber")
inst.target:Set(player)  -- the player who will see the popup
inst.damage:Set(damage_amount)
inst.large:Set(true)
inst:PushEvent("damagedirty")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `CLASSIFIED`; relies on network tags defined via `net_*` helpers.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `net_entity` | `nil` | Networked reference to the entity *receiving* the damage (the target), used to position the popup. |
| `damage` | `net_shortint` | `0` | Networked damage value (signed 16-bit integer). |
| `large` | `net_bool` | `false` | Networked flag indicating whether to render a large (48pt) or small (32pt) font. Triggers `damagedirty` on change. |

## Main functions
### `PushDamageNumber(player, target, damage, large)`
*   **Description:** Private helper function that calls `HUD:ShowPopupNumber` to render the damage number visually. This is exposed to server-side code (e.g., for master post-init).
*   **Parameters:**
    * `player` (entity) — The player entity whose HUD will display the popup.
    * `target` (entity) — The entity where the popup appears (position used).
    * `damage` (number) — Integer damage value to display.
    * `large` (boolean) — If `true`, renders a large font (48); otherwise small font (32).
*   **Returns:** Nothing.
*   **Error states:** No-op if `player.HUD` is `nil`.

## Events & listeners
- **Listens to:** `damagedirty` — Triggered when any of the networked values (`target`, `damage`, or `large`) is updated. Causes `OnDamageDirty` to fire on clients, which calls `HUD:ShowPopupNumber`.
- **Pushes:** None identified.

### Notes
- Clients only: The `OnDamageDirty` callback executes *only* when `TheWorld.ismastersim == false`.
- Server: The `PushDamageNumber` function is attached directly to the instance and invoked by the combat system to initiate the popup.
- The `CLASSIFIED` tag prevents this entity from appearing in `GetEntities` queries by default.