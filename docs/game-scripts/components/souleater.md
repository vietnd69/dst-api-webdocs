---
id: souleater
title: Souleater
description: Enables an entity to consume soul entities, triggering custom logic and removing the consumed soul.
tags: [combat, soul, consumption]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2d179474
system_scope: entity
---

# Souleater

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Souleater` allows an entity to consume soul entities by calling `EatSoul()`. It handles validation, stack splitting (via `Stackable`), event notification (`oneatsoul`), and optional custom logic provided via a callback. It also automatically adds the `souleater` tag to the owning entity during construction, making it identifiable by other systems.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("souleater")

inst.components.souleater:SetOnEatSoulFn(function(owner, soul)
    -- Custom logic when soul is eaten, e.g., gain health
    if owner.components.health then
        owner.components.health:DoDelta(5)
    end
end)

-- Later, consume a soul entity
inst.components.souleater:EatSoul(soul_entity)
```

## Dependencies & tags
**Components used:** `soul` (via `soul.components.soul`), `stackable` (via `soul.components.stackable:Get()`)
**Tags:** Adds `souleater` to `inst`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GGameEntity` | *(assigned in constructor)* | The entity instance that owns this component. |
| `oneatsoulfn` | function or `nil` | `nil` | Optional callback function invoked when a soul is eaten. Signature: `fn(owner, soul)`. |

## Main functions
### `SetOnEatSoulFn(fn)`
* **Description:** Sets a custom callback to be executed when `EatSoul()` is called. This allows modders to define per-entity behavior (e.g., health gain, FX, sound).
* **Parameters:** `fn` (function or `nil`) — a function taking two arguments: the eater (`owner`) and the eaten soul (`soul`), or `nil` to clear.
* **Returns:** Nothing.

### `EatSoul(soul)`
* **Description:** Consumes the given soul entity. Validates that the target has a `soul` component; if stackable, splits off one stack; fires the `oneatsoul` event; runs the optional callback; and removes the soul entity.
* **Parameters:** `soul` (GGameEntity) — the entity to consume. Must have a `soul` component.
* **Returns:** `true` — always returns `true` upon successful execution (even if the soul was later removed).
* **Error states:** Returns `false` if `soul.components.soul == nil`, and does nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `oneatsoul` — fired *before* the soul is removed, with payload `{ soul = soul }`. May be used for visual/audio feedback or game-logic reactions.
