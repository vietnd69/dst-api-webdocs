---
id: lavaarena_bernie
title: Lavaarena Bernie
description: Creates a non-player companion entity for the Lava Arena event that serves as a revivable stand-in for the player, accessible only to entities with the "bernie_reviver" tag.
tags: [boss, companion, event, revivable]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5bcc8fd3
system_scope: entity
---

# Lavaarena Bernie

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_bernie` is a prefab definition that creates a companion entity used exclusively during the Lava Arena event. It functions as a revivable stand-in character with specialized revivability restrictions. The entity has minimal behavior—it is initially hidden, physics-enabled, and configured with a custom revivability callback. It does not include AI, combat, or autonomous behavior; it relies on external systems (e.g., the Lava Arena event logic) for activation and interaction. The entity is network-aware and loads its master-side setup via `event_server_data(...).master_postinit`.

## Usage example
This prefab is not manually added by mods; it is instantiated internally by the Lava Arena event system. Modders typically interact with it via its `revivablecorpse` component, for example:
```lua
-- Example: Check revivability condition for a potential reviver
if entity.components.revivablecorpse and entity.components.revivablecorpse.canberevivedbyfn then
    local can_revive = entity.components.revivablecorpse.canberevivedbyfn(entity, some_reviver)
end
```

## Dependencies & tags
**Components used:** `revivablecorpse`
**Tags:** `character`, `smallcreature`, `companion`, `notarget`

## Properties
No public properties.

## Main functions
None.

## Events & listeners
None identified.
