---
id: shadowmeteor
title: Shadowmeteor
description: Handles the behavior and impact effects of a shadow meteor falling from the sky, including visual warnings, terrain damage, entity destruction, and loot spawning.
tags: [combat, world, environment, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f82a915b
system_scope: environment
---

# Shadowmeteor

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shadowmeteor` prefab represents a falling meteor that originates from the sky and impacts the world. It is primarily used during meteor showers. When it strikes, it triggers a chain of effects: screen shake, ground modification (scorch or splash), destruction of nearby entities based on smashability rules, and spawning of loot items. It cooperates closely with the `worldmeteorshower` component to allow loot customization and integrates with `workable`, `combat`, and `inventoryitem` components of affected entities.

## Usage example
```lua
-- Example: Spawning a shadow meteor at a specific world position
local meteor = SpawnPrefab("shadowmeteor")
if meteor ~= nil then
    meteor.Transform:SetPosition(x, y, z)
    meteor:SetSize("large", 1.5)
end
```

## Dependencies & tags
**Components used:** `worldmeteorshower` (via `TheWorld.components.worldmeteorshower:GetMeteorLootPrefab`), `workable`, `combat`, `inventoryitem`, `container`, `mine`, `placer`, `spawner`, `childspawner`.  
**Tags:** `NOCLICK`, `meteor_protection`, `INLIMBO`, `playerghost`. Smashable tags include: `_combat`, `_inventoryitem`, `NPC_workable`, and dynamic suffixes like `CHOP_workable`, `DIG_workable`, etc.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `size` | number | `0.7` (small) | Scale factor for visual size, shake intensity, damage radius, and damage amount. |
| `workdone` | number | `1` (small) | Work amount applied to `workable` entities on impact. |
| `loot` | table of `{prefab: string, chance: number}` | `{}` | List of loot items and spawn probabilities for this meteor. |
| `warnshadow` | Entity? | `nil` | Reference to the `meteorwarning` prefab shown before impact. |
| `striketask` | Task? | `nil` | Task handle for the scheduled impact event. |
| `autosizetask` | Task? | `nil` | Fallback task to set meteor size if not explicitly set. |
| `peripheral` | boolean? | `nil` | Flag indicating whether this meteor is at the periphery (affects loot-dropping behavior). |

## Main functions
### `SetSize(inst, sz, mod)`
* **Description:** Configures the meteor's size, scale, warning visual, loot table, and schedules the impact after a brief warning period.
* **Parameters:** `sz` (string) — Size variant (`"small"`, `"medium"`, `"large"`, `"rockmoonshell"`); defaults to `"small"` if invalid. `mod` (number?) — Multiplier applied to loot probabilities.
* **Returns:** Nothing.
* **Error states:** No-op if impact (`striketask`) is already scheduled. Sets `warnshadow`, applies scale, and schedules `striketask` using `DoTaskInTime`.

### `SetPeripheral(inst, peripheral)`
* **Description:** Marks this meteor as being at the edge of the meteor shower radius.
* **Parameters:** `peripheral` (boolean) — Sets `inst.peripheral` for use during loot dropping logic.
* **Returns:** Nothing.

### `onexplode(inst)`
* **Description:** Core impact logic triggered after animation completes. Handles sound, camera shake, terrain scorch/splash, entity destruction, and loot spawning.
* **Parameters:** `inst` — The shadow meteor entity.
* **Returns:** Nothing.

### `dostrike(inst)`
* **Description:** Executes the strike animation and delays the explosion logic (`onexplode`) slightly to allow animation to play.
* **Parameters:** `inst` — The shadow meteor entity.
* **Returns:** Nothing.

### `AutoSize(inst)`
* **Description:** Randomly sets the meteor size (`small`, `medium`, `large`) via `SetSize` if not manually configured.
* **Parameters:** `inst` — The shadow meteor entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — Cleans up and removes the meteor after its impact animation completes.
- **Pushes:** None directly (relies on `inst:Remove()` after `animover` or timeout).