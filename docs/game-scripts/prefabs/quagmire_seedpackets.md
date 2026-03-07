---
id: quagmire_seedpackets
title: Quagmire Seedpackets
description: Generates prefabs for Quagmire seed packets, including a base packet, a mixed variant, and individual seed-type packets.
tags: [quagmire, item, crafting, loot]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a9348959
system_scope: inventory
---

# Quagmire Seedpackets

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This file defines the prefab generation logic for Quagmire seed packets, which are consumable items in the *Quagmire* DLC. It programmatically creates three types of seed packets: a default (unidentified) packet, a "mix" packet containing random seeds, and individual packets tied to specific seed types. The prefabs include visual, physics, and network components required for standard inventory items.

## Usage example
```lua
-- Example usage inside a mod (e.g., in a recipe or spawn event)
local packet = Prefab("quagmire_seedpacket")()
packet.components.inventoryitem.couldoccupy = "hand"
packet.components.container:Add("ash") -- example content for demonstration
```

## Dependencies & tags
**Components used:** None identified (uses engine-provided components only: `Transform`, `AnimState`, `Network`, `InventoryItem`, `Container`, `Unwrappable` via tag-based optimizations)
**Tags:** Adds `bundle` and `unwrappable`

## Properties
No public properties

## Main functions
This file is a factory script that returns prefabs; it does not define a component with runtime methods. All logic is executed at load time during prefab registration.

### `MakeSeedPacket(id)`
*   **Description:** Internal factory function that constructs and returns a `Prefab` object for a seed packet variant based on `id`. It configures assets, animations, network replication, and tags. If running on the master simulation, triggers a `master_postinit` hook for seed-specific server-side setup.
*   **Parameters:** `id` (string | nil) — Either `nil` (default packet), `"mix"` (contains random seeds), or a numeric string `1..N` identifying a specific seed type.
*   **Returns:** A `Prefab` instance configured for the requested seed packet variant.

## Events & listeners
- **Listens to:** None (no `ListenForEvent` calls in this file).
- **Pushes:** None (no `PushEvent` calls in this file).