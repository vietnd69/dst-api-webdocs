---
id: quagmire_safe
title: Quagmire Safe
description: A locked storage container used in the Quagmire biome, requiring a key to open.
tags: [storage, locked, structure]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 114a7d5d
system_scope: entity
---

# Quagmire Safe

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_safe` is a preconfigured prefab representing a secure storage container found in the Quagmire biome. It is a non-interactive entity on the client and fully instantiated on the server with core animation, sound, and network capabilities. It uses a custom display name function to show `"LOCKED"` when the container cannot be opened, and integrates with the `quagmire` mod's server-side post-initialization logic via `event_server_data`.

## Usage example
```lua
-- This prefab is not meant to be manually instantiated by mods.
-- It is automatically created by the world generation system when Quagmire content spawns.
-- Example of referencing it in a mod (e.g., to listen for its spawn):
local function OnEntityCreate(inst)
    if inst.prefab == "quagmire_safe" then
        -- perform custom logic here
    end
end
TheSim:ListenForEvent("entitycreate", OnEntityCreate)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `structure` to the entity.

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
Not applicable
