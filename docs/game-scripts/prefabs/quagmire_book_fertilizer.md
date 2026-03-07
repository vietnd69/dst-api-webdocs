---
id: quagmire_book_fertilizer
title: Quagmire Book Fertilizer
description: A server-side-only prefab representing the gardening book item in the Quagmire DLC, used to spawn and configure related gameplay elements via a master post-initialization hook.
tags: [quagmire, item, book, gardening]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5c3f43f7
system_scope: world
---

# Quagmire Book Fertilizer

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_book_fertilizer` is a client-compatible prefab definition for the gardening book item in the Quagmire DLC. It sets up the visual, audio, and network state for the item but defers all gameplay logic to a separate `master_postinit` function provided by `event_server_data`. The prefab is purely a container for assets and client-side initialization, with server-side behavior implemented externally (not part of this file).

## Usage example
This prefab is instantiated automatically by the game when the item is spawned (e.g., via world generation or crafting). Modders typically do not instantiate it directly, but if needed:
```lua
local inst = SpawnPrefabs("quagmire_book_fertilizer")
if inst and TheWorld.ismastersim then
    -- Server-side logic is handled in the event_server_data master_postinit hook
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `fn()`
*   **Description:** The prefab construction function. Creates the entity instance, attaches required transforms and animations, sets bank/build/animation, overrides the prefab name, marks as pristine, and dispatches to `master_postinit` on the server.
*   **Parameters:** None.
*   **Returns:** The fully constructed entity instance (`inst`).
*   **Error states:** On the client (non-master simulation), returns early after basic setup; on master, calls the external `master_postinit`.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
