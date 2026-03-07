---
id: lantern_posts_defs
title: Lantern Posts Defs
description: Defines configuration structures for lantern post prefabs, including lighting, sound, and behavior parameters.
tags: [prefabs, lighting, deployment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 05a98dd3
system_scope: world
---

# Lantern Posts Defs

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lantern_posts_defs.lua` defines configuration tables for lantern post prefabs, specifying visual, audio, material, and functional properties used during prefab instantiation. It serves as a declarative schema for constructing lantern-based structures such as the `yots_lantern_post` and `hermitcrab_lightpost`. The definitions include callbacks for variation selection, skin handling, abandonment logic, and serialization (`OnSave`/`OnLoad`). It does not define a component itself but describes metadata consumed by the prefab system.

## Usage example
```lua
local lantern_defs = require "prefabs/lantern_posts_defs"
local post_def = lantern_defs.lantern_posts[2] -- hermitcrab_lightpost

-- Typically used by prefabs during construction:
local inst = CreateEntity()
-- ... setup assets and components ...
-- Deployment logic would reference `post_def.kit_data.deployable_data`
```

## Dependencies & tags
**Components used:** None directly. This file defines prefabricated configuration data. Related prefabs may use `container`, `inspectable`, and other components during instantiation.  
**Tags:** Adds `hermitcrab_lantern_post` to the `hermitcrab_lightpost` instance (in `common_postinit`).  
**Connected external APIs:**  
- `MakeHermitCrabAreaListener(inst, handler)` — sets up area-listening for abandonment logic.  
- `inst.components.container:DropEverything()`, `inst.components.container:Close()` — called when the post becomes abandoned.  
- `inst.components.inspectable.getstatus = fn` — registers a custom status display function.

## Properties
No public properties. This file exports a table containing `lantern_posts` with static configuration entries.

## Main functions
This file does not define standalone functions. All behavior is encoded in table values and callback functions embedded in each lantern definition.

## Events & listeners
- **Listens to:** None directly. Instances created from these definitions may listen to events via `MakeHermitCrabAreaListener`, but this file itself registers no event listeners.
- **Pushes:** None. Events are pushed by prefabs using these definitions, not by this file.
