---
id: attunable_classified
title: Attunable Classified
description: A networked classified entity used to track and manage attunement relationships between a proxy source and a player's Attuner component.
tags: [network, attunement, classified]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9042c36f
system_scope: network
---

# Attunable Classified

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`attunable_classified` is a lightweight, non-persistent entity that acts as a proxy source for attunement purposes. It registers itself with a target player’s `attuner` component when attached, and automatically unregisters when removed. It is designed to be used as a classified data carrier in attunement systems — particularly for items or effects that must bind to a specific player and report their GUID to the Attuner.

## Usage example
```lua
-- Typical usage pattern (server-side only)
local classified = Prefab("attunable_classified", fn)
local player = TheSim:FindFirstEntityWithTag("player")
classified.components.attunable_classified.AttachToPlayer(classified, player, source_item)
```

## Dependencies & tags
**Components used:** `attuner` (accessed via parent entity), `entity` (for network and hierarchy management)  
**Tags:** Adds `CLASSIFIED`; no other tags are managed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `source_guid` | `net_uint` | `net_uint(inst.GUID, ...)` | Networked field storing the GUID of the attunement source entity. |
| `_parent` | entity reference or `nil` | `nil` | Reference to the parent (player) entity. Used for unregistering on removal. |

## Main functions
### `IsAttunableType(tag)`
*   **Description:** Checks whether this classified entity has the given tag.
*   **Parameters:** `tag` (string) — the tag to check.
*   **Returns:** `boolean` — `true` if the entity has the tag, otherwise `false`.

### `AttachToPlayer(inst, player, source)`
*   **Description:** Binds the classified entity to a player, sets the networked classified target, establishes parent-child hierarchy, records the source GUID, and registers it with the player’s `attuner` component.
*   **Parameters:**
    *   `inst` — the classified entity instance (self).
    *   `player` (entity) — the target player entity.
    *   `source` (entity) — the attunement source whose GUID will be recorded.
*   **Returns:** Nothing.
*   **Error states:** Raises no errors, but silently does nothing if `player` or `source` is `nil` (though the function itself does not check).

## Events & listeners
- **Pushes:** None directly. However, via `RegisterAttunedSource`, it triggers events on the parent's `attuner` component:
  - `"gotnewattunement"` when first registered.
  - `"attunementlost"` when removed via `OnRemoveEntity`.
- **Listens to:** None directly. Uses `OnRemoveEntity` callback for cleanup (assigned to `inst.OnRemoveEntity` to be invoked externally on entity removal).