---
id: yoth_buffs
title: Yoth Buffs
description: Applies a timed buff to a target entity, automatically removing itself when the timer expires or the target dies.
tags: [combat, buff, yoth]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 28395237
system_scope: entity
---

# Yoth Buffs

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`yoth_buffs` defines a non-persistent, non-networked prefab that acts as a temporary buff entity for the Yoth Princess ability. It is instantiated and attached to a target as a debuff component, managing the buff's duration via a timer and ensuring clean cleanup on expiration or target death. It relies on the `debuff` and `timer` components for lifecycle management.

## Usage example
```lua
-- Typically used internally by the game via Debuff system
local buff = Prefab("yoth_princesscooldown_buff", fn)
local target = GetPlayer()
target:AddDebuff(buff, {
    duration = TUNING.YOTH_PRINCESS_SUMMON_COOLDOWN,
})
```

## Dependencies & tags
**Components used:** `debuff`, `timer`  
**Tags:** Adds `CLASSIFIED` to the buff entity itself.

## Properties
No public properties.

## Main functions
The component itself is a Prefab constructor, and its behavior is defined entirely through the callback functions (`OnAttached`, `OnDetached`, `OnExtendedBuff`, `OnTimerDone`) passed to the `debuff` component. These are invoked automatically by the `debuff` component and not called directly.

### `OnAttached(inst, target, followsymbol, followoffset, data)`
*   **Description:** Sets up the buff when attached to a target. Parents the entity to the target, resets position, starts the "buffover" timer, and listens for the target's "death" event to stop the debuff.
*   **Parameters:**  
    `inst` (Entity) – the buff entity instance.  
    `target` (Entity) – the entity the buff is attached to.  
    `followsymbol` (string) – unused in this implementation.  
    `followoffset` (Vector3) – unused in this implementation.  
    `data` (table or nil) – optional metadata, expected to contain `duration` (number).  
*   **Returns:** Nothing.

### `OnDetached(inst, target)`
*   **Description:** Removes the buff entity immediately upon detachment.
*   **Parameters:**  
    `inst` (Entity) – the buff entity instance.  
    `target` (Entity) – the entity the buff was attached to.  
*   **Returns:** Nothing.

### `OnExtendedBuff(inst, target, followsymbol, followoffset, data)`
*   **Description:** Extends the buff duration if a new application provides a longer duration than the current remaining time.
*   **Parameters:**  
    `inst` (Entity) – the buff entity instance.  
    `target` (Entity) – the entity the buff is attached to.  
    `followsymbol` (string) – unused in this implementation.  
    `followoffset` (Vector3) – unused in this implementation.  
    `data` (table or nil) – optional metadata, expected to contain `duration` (number).  
*   **Returns:** Nothing.  
*   **Error states:** Does nothing if current `time_remaining` is `nil` or if the provided `duration` is not greater than remaining time.

### `OnTimerDone(inst, data)`
*   **Description:** Internal callback triggered when the "buffover" timer completes. Stops the debuff, which will eventually trigger `OnDetached`.
*   **Parameters:**  
    `inst` (Entity) – the buff entity instance.  
    `data` (table) – timer event data, must contain `name == "buffover"`.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `death` – on the target entity; triggers immediate debuff stop.  
  `timerdone` – internal timer completion; triggers debuff stop.  
- **Pushes:** None.