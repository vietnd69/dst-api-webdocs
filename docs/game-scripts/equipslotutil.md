---
id: equipslotutil
title: Equipslotutil
description: Provides utilities for mapping equip slot names to IDs and vice versa during networked gameplay.
tags: [inventory, network, util]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 783a4906
system_scope: inventory
---

# Equipslotutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`equipslotutil` is a utility module that establishes deterministic bidirectional mappings between equip slot names (e.g., `"head"`, `"body"`) and numeric IDs. It is used to support networking and serialization of equipped items by translating between human-readable slot names and compact integer representations. Initialization must occur once after mod loading completes and before gameplay begins, ensuring consistent ordering across clients and server.

## Usage example
```lua
-- After the game has initialized (e.g., in a component or after "postinit" phase)
equipslotutil = require("equipslotutil")
equipslotutil.Initialize()

local slot_name = equipslotutil.FromID(1)
local slot_id = equipslotutil.ToID("head")
local total_slots = equipslotutil.Count()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties

## Main functions
### `Initialize()`
*   **Description:** Initializes internal slot name and ID mappings based on `GLOBAL.EQUIPSLOTS`. Must be called exactly once after mods load and before any calls to `ToID`, `FromID`, or `Count`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Raises an assertion error if called more than once.

### `ToID(slot_name)`
*   **Description:** Returns the numeric ID corresponding to a given equip slot name.
*   **Parameters:** `slot_name` (string) — the canonical name of the equip slot (e.g., `"head"`, `"body"`).
*   **Returns:** (number or `nil`) — the integer ID of the slot; `nil` if the slot name is unknown.

### `FromID(slot_id)`
*   **Description:** Returns the equip slot name corresponding to a numeric ID.
*   **Parameters:** `slot_id` (number) — the integer ID of the slot.
*   **Returns:** (string or `nil`) — the canonical slot name; `nil` if the ID is out of range.

### `Count()`
*   **Description:** Returns the total number of equip slots.
*   **Parameters:** None.
*   **Returns:** (number) — the count of valid equip slots.

## Events & listeners
None identified