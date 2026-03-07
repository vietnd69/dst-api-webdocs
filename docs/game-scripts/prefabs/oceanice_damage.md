---
id: oceanice_damage
title: Oceanice Damage
description: A non-persistent visual and repairable entity that represents damage state of ocean ice and triggers ice restoration when repaired.
tags: [environment, repair, visual]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 197b3488
system_scope: environment
---

# Oceanice Damage

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`oceanice_damage` is a lightweight prefab used to visually represent the severity of damage on ocean ice sheets. It has no gameplay logic on its own but integrates with the `repairable` component to allow in-game objects (like repair items) to restore ice health. When repaired, it notifies `TheWorld.components.oceanicemanager` to reverse the ice damage at its world position. This prefab is not persisted across sessions (`inst.persists = false`) and only exists temporarily in the world.

## Usage example
This prefab is instantiated automatically by the game's world generation and ice management systems, not directly by modders. However, a typical instantiation pattern (if needed) would be:
```lua
local inst = SpawnPrefab("oceanice_damage")
if inst then
    inst.Transform:SetWorldPosition(x, y, z)
    inst.components.repairable:SetHealth(1)  -- Optional: set initial state
    inst.setdamagepecent(0.5)  -- Visually update to mid-damage state
end
```

## Dependencies & tags
**Components used:** `repairable`, `transform`, `animstate`, `network`, `soundemitter`  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `damage` | number | `0` | Internal float representing damage level (0 = intact, higher = more damaged). Not serialized. |
| `persists` | boolean | `false` | Prevents the entity from being saved in the world save. |

## Main functions
### `setdamagepercent(damage)`
*   **Description:** Internal utility function used to visually update the damage state via animation selection based on severity thresholds. The animation frame changes depending on how much damage is present.
*   **Parameters:** `damage` (number) – A float value used to select the appropriate animation sequence.
*   **Returns:** Nothing.
*   **Error states:** Uses hardcoded thresholds: `damage < 0.33` → `"idle1"`, `damage < 0.66` → `"idle2"`, else `"idle3"`. Not meant for external use.

## Events & listeners
- **Listens to:** None.  
- **Pushes:** None.  
*(Note: The `OnRepaired` callback fires when `repairable.onrepaired` is invoked by the `repairable` component, but `oceanice_damage` itself does not register event listeners.)*