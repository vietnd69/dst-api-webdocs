---
id: quagmire_casseroledish
title: Quagmire Casseroledish
description: Creates inventory prefabs for Quagmire casserole dishes used in cooking.
tags: [crafting, cooking, inventory, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dc37ce9f
system_scope: crafting
---

# Quagmire Casseroledish

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This file defines and registers two prefab variants (`quagmire_casseroledish` and `quagmire_casseroledish_small`) for Quagmire-style casserole cooking vessels. It configures visual assets, sound, transform, and network components, and adds the tags `quagmire_stewer` and `quagmire_casseroledish`. The actual gameplay logic (e.g., cooking behavior) is delegated to a separate `master_postinit` function via an event call on the server.

## Usage example
```lua
local casserole = Prefab("quagmire_casseroledish")
-- The prefab is automatically available in-game as `quagmire_casseroledish`
-- No manual component addition required — this file itself *is* the prefab definition
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network`, `inventoryphysics`
**Tags:** Adds `quagmire_stewer`, `quagmire_casseroledish`

## Properties
No public properties — this file defines prefabs, not reusable component logic.

## Main functions
### `MakePot(suffix, numslots)`
* **Description:** Factory function that constructs and returns a `Prefab` for a casserole dish variant. Used internally to define both the standard (4-slot) and small (3-slot) versions.
* **Parameters:**  
  `suffix` (string) — appended to base name to form `quagmire_casseroledish` or `quagmire_casseroledish_small`.  
  `numslots` (number) — used to load the correct UI symbol asset (`quagmire_ui_pot_1x<numslots>.zip`).  
* **Returns:** `Prefab` instance.  
* **Error states:** On non-master simulations (clients), returns early without calling `master_postinit`, preserving client-side rendering while avoiding duplicate logic.

## Events & listeners
- **Listens to:** `event_server_data("quagmire", "prefabs/quagmire_casseroledish").master_postinit` — server-side event dispatched to initialize gameplay logic after the entity is fully constructed.
- **Pushes:** None — this file does not fire custom events.

Not applicable: Properties, Main functions (beyond `MakePot`), and Events & listeners sections are exhaustive based on source code.