---
id: domesticplantherd
title: Domesticplantherd
description: Creates a non-networked herd entity for Lunar Plants that manages group spawning, member aggregation, and automatic removal when the herd becomes empty.
tags: [herd, lunar, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1cfdc6eb
system_scope: world
---

# Domesticplantherd

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`domesticplantherd` is a prefab factory function that instantiates a hidden, non-networked herd entity used specifically for Lunar Plant management. It acts as a container for `lunarplant_target` members, enforces gathering and update ranges, and automatically destroys itself when no members remain. It hooks into the `mood` component for season validation and emits a world-level event upon spawn.

## Usage example
```lua
-- The prefab is instantiated automatically by the game when Lunar Plants are spawned.
-- Modders typically do not directly call this; instead, they interact with the herd via its components after creation.
-- Example of reacting to herd spawn:
TheWorld:ListenForEvent("plantherdspawned", function(inst, data)
    local herd_entity = data
    -- herd_entity.components.herd now provides herd controls
end)
```

## Dependencies & tags
**Components used:** `mood`, `herd`
**Tags:** Adds `herd`, `NOBLOCK`, `NOCLICK` — does not use `CLASSIFIED` to ensure `FindEntities("herd")` works.

## Properties
No public properties — the component is used only as a factory for the `herd` prefab instance.

## Main functions
### `fn()`
*   **Description:** Factory function that constructs and configures a new `domesticplantherd` entity instance.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — a fully initialized entity with the `herd` and `mood` components.
*   **Error states:** None.

### `OnInit(inst)`
*   **Description:** Initializes the `mood` component by validating current mood state against the active season.
*   **Parameters:** `inst` (entity) — the entity instance passed during construction.
*   **Returns:** Nothing.
*   **Error states:** None.

### `RegisterWithWorld(inst)`
*   **Description:** Notifies the world that a new plant herd has been spawned by firing the `plantherdspawned` event.
*   **Parameters:** `inst` (entity) — the spawned herd entity.
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
- **Pushes:** `plantherdspawned` — fired via `TheWorld:PushEvent("plantherdspawned", inst)` when the entity is fully initialized.

## Connected components behavior
The `herd` component is configured as follows:
- `SetGatherRange(TUNING.DOMESTICPLANTHERD_RANGE)` — members must remain within this radius to stay in the herd.
- `SetUpdateRange(20)` — the herd is only active and updated within 20 world units of an active player.
- `SetOnEmptyFn(inst.Remove)` — removes the entity when no members remain.
- `SetMemberTag("lunarplant_target")` — only entities with the `lunarplant_target` tag are considered herd members.
- `SetMaxSize(36)` — maximum number of members allowed in the herd.