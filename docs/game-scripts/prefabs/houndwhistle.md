---
id: houndwhistle
title: Houndwhistle
description: A consumable tool that emits a whistle sound to attract hounds and wargs, adding them as followers to the user.
tags: [combat, ai, tool, consumable]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 65127a4b
system_scope: entity
---

# Houndwhistle

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `houndwhistle` prefab is an inventory item that acts as a tool to command nearby hounds and wargs. When used (via `ACTIONS.PLAY`), it emits a whistle sound audible within a defined radius, prompting eligible enemies to cease combat and follow the user. It utilizes the `instrument`, `tool`, and `finiteuses` components to manage sound propagation, tool behavior, and durability.

The core logic resides in two local functions: `HearHoundWhistle` (triggered when a hound/warg hears the whistle) and `TryAddFollower` (handles the actual addition of the follower to the user’s leader component, with loyalty tracking and target clearing).

## Usage example
```lua
local whistle = CreateEntity()
whistle:AddTag("whistle")
whistle:AddTag("tool")

whistle:AddComponent("instrument")
whistle.components.instrument:SetRange(15)
whistle.components.instrument:SetOnHeardFn(HearHoundWhistle)

whistle:AddComponent("tool")
whistle.components.tool:SetAction(ACTIONS.PLAY)

whistle:AddComponent("finiteuses")
whistle.components.finiteuses:SetMaxUses(5)
whistle.components.finiteuses:SetUses(5)
whistle.components.finiteuses:SetOnFinished(function(inst) inst:Remove() end)
whistle.components.finiteuses:SetConsumption(ACTIONS.PLAY, 1)
```

## Dependencies & tags
**Components used:** `instrument`, `tool`, `finiteuses`, `inspectable`, `inventoryitem`  
**Tags added:** `whistle`, `tool`  
**Tags checked (at runtime):** `hound`, `warg`, `moonbeast`, `statue`, `player`

## Properties
No public properties.

## Main functions
### `TryAddFollower(leader, follower)`
*   **Description:** Attempts to add a hound or warg as a follower to the leader if conditions are met (e.g., within follower count limit, not already following another leader, not statues). Also grants loyalty time and clears the follower's current combat target if applicable.
*   **Parameters:**
    *   `leader` (Entity) – The entity attempting to command followers.
    *   `follower` (Entity) – The hound or warg to be added as a follower.
*   **Returns:** Nothing.
*   **Error states:** No-op if `follower` is not a hound/warg, is a moonbeast, is statues, or exceeds the follower limit (`TUNING.HOUNDWHISTLE_MAX_FOLLOWERS`). Also skips if the follower already follows the leader.

### `HearHoundWhistle(inst, musician, instrument)`
*   **Description:** Called when an eligible entity (a non-lunar-aligned hound or warg) hears the whistle. Ends its current combat and triggers `TryAddFollower`.
*   **Parameters:**
    *   `inst` (Entity) – The entity hearing the whistle (the potential follower).
    *   `musician` (Entity) – The entity that played the whistle (the leader).
    *   `instrument` (Entity) – The instrument instance (unused in this implementation).
*   **Returns:** Nothing.
*   **Error states:** No-op if `inst` is not a hound/warg, is lunar-aligned, or is in a statue state.

## Events & listeners
- **Listens to:**
    - `floater_startfloating` – Triggers `AnimState:PlayAnimation("float")`.
    - `floater_stopfloating` – Triggers `AnimState:PlayAnimation("idle")`.
- **Pushes:** None directly. (Delegates event emission to `follower:PushEvent("heardwhistle", ...)` via `DoTaskInTime`.)