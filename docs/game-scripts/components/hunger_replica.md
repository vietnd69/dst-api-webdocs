---
id: hunger_replica
title: Hunger Replica
description: Provides network-replicated access to hunger state (current, max, and starvation status) for entities on client or non-master simulation instances.
tags: [network, hunger, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b82c6329
system_scope: network
---

# Hunger Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`HungerReplica` is a network-aware component that exposes hunger data from the authoritative `hunger` component (running on the master simulation) to clients and non-master instances. It acts as a client-side or slave-side proxy, reading hunger values from a remote `classified` object (typically provided by the server via `player_classified` or `pet_hunger_classified`). It does not manage hunger logic itself — it only reflects the state managed by the master-side `hunger` component.

## Usage example
```lua
-- Typically added automatically to player entities on non-master instances
-- e.g., via the player's network setup; manual usage is rare.
local inst = ThePlayer
if inst.replica.hunger then
    local percent = inst.replica.hunger:GetPercent()
    if inst.replica.hunger:IsStarving() then
        print("Player is starving!")
    end
end
```

## Dependencies & tags
**Components used:** `hunger` (for authoritative values on master sim), `classified` objects (`player_classified` or `pet_hunger_classified`)
**Tags:** None identified.

## Properties
No public properties are initialized in the constructor.

## Main functions
### `SetCurrent(current)`
* **Description:** Sets the current hunger value on the authoritative `classified` object (only valid if running on master simulation).  
* **Parameters:** `current` (number) — the new current hunger value.
* **Returns:** Nothing.
* **Error states:** No-op if `self.classified` is `nil`.

### `SetMax(max)`
* **Description:** Sets the maximum hunger value on the authoritative `classified` object (only valid if running on master simulation).  
* **Parameters:** `max` (number) — the new maximum hunger value.
* **Returns:** Nothing.
* **Error states:** No-op if `self.classified` is `nil`.

### `Max()`
* **Description:** Returns the maximum hunger value. Prioritizes local authoritative source (`inst.components.hunger.max`) if present (master sim), otherwise reads from `classified`. Falls back to `100` if neither is available.
* **Parameters:** None.
* **Returns:** number — current maximum hunger.
* **Error states:** Returns `100` as a safe default if no source is available (e.g., before network sync completes).

### `GetPercent()`
* **Description:** Returns the current hunger as a decimal percentage (`current / max`). Prioritizes authoritative `hunger` component on master sim, otherwise reads from `classified`, and defaults to `1` if neither is available.
* **Parameters:** None.
* **Returns:** number — hunger percentage in range `[0.0, 1.0]`.
* **Error states:** Returns `1` if both `hunger` component and `classified` are unavailable.

### `GetCurrent()`
* **Description:** Returns the current hunger value. Prioritizes authoritative `hunger.current` on master sim, otherwise reads from `classified.currenthunger`, and defaults to `100` if neither is available.
* **Parameters:** None.
* **Returns:** number — current hunger amount.
* **Error states:** Returns `100` if both sources are unavailable.

### `IsStarving()`
* **Description:** Returns `true` if the entity is currently starving (`current <= 0`). Uses authoritative `hunger:IsStarving()` on master sim; otherwise checks `classified.currenthunger <= 0`.
* **Parameters:** None.
* **Returns:** boolean — `true` if starving, `false` otherwise.
* **Error states:** Returns `false` if `classified` is `nil` (no data available).

## Events & listeners
- **Listens to:** `onremove` — fires `self.ondetachclassified` callback to cleanly detach from `classified` object when the entity is removed.
