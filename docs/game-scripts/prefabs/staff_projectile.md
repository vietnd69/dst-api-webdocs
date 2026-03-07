---
id: staff_projectile
title: Staff Projectile
description: Creates animated projectile prefabs for ice and fire magical attacks, handling hit behavior with specialized effects and cleanup.
tags: [combat, fx, projectile, magic]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8d4e1b15
system_scope: combat
---

# Staff Projectile

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`staff_projectile.lua` defines two prefabs — `ice_projectile` and `fire_projectile` — used for magical projectiles fired by staff-like items. It constructs a basic projectile entity with animation and physics, attaches the `projectile` component for movement and collision handling, and configures custom hit behavior specific to each element type. The prefabs are designed to be lightweight, non-persistent entities that self-remove upon impact or after a short lifetime.

## Usage example
```lua
-- Spawn an ice projectile
local ice_proj = SpawnPrefab("ice_projectile")
if ice_proj and ice_proj:IsValid() then
    ice_proj.Transform:SetPosition(player.Transform:GetWorldPosition())
    ice_proj.components.projectile:SetSpeed(60)
end

-- Spawn a fire projectile
local fire_proj = SpawnPrefab("fire_projectile")
if fire_proj and fire_proj:IsValid() then
    fire_proj.Transform:SetPosition(player.Transform:GetWorldPosition())
    fire_proj.components.projectile:SetSpeed(60)
end
```

## Dependencies & tags
**Components used:** `projectile`, `animstate`, `transform`, `network`, `shatterfx`, `burnable`  
**Tags:** Adds `projectile` tag; does not remove or check other tags directly.

## Properties
No public properties initialized directly by this script. Entity behavior is controlled via component APIs.

## Main functions
### `common(anim, bloom, lightoverride)`
*   **Description:** Shared constructor helper that builds the base projectile entity with physics, animation, and projectile component configuration. Returns a fully configured but non-persistent entity.
*   **Parameters:**  
  - `anim` (string) – Name of the animation to play.  
  - `bloom` (string or `nil`) – Shader path for bloom effect, or `nil` to skip.  
  - `lightoverride` (number or `nil`) – Light override intensity, or `nil` to use default.  
*   **Returns:** `inst` (entity) – The configured entity, ready for element-specific customization.
*   **Error states:** Returns early without adding the `projectile` component on non-master simulation clients (`TheWorld.ismastersim == false`).

### `ice()`
*   **Description:** Builds and returns the `ice_projectile` prefab instance. Attaches element-specific hit logic that spawns shatter effects on non-freezable targets.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) – The configured ice projectile.
*   **Error states:** Returns early without setting `onhit` handler on non-master clients.

### `fire()`
*   **Description:** Builds and returns the `fire_projectile` prefab instance. Attaches element-specific hit logic that spawns fire-fail effects only if the target is valid and not already burning.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) – The configured fire projectile.
*   **Error states:** Returns early without setting `onhit` handler on non-master clients.

## Events & listeners
None identified — this script does not register event listeners. Entity cleanup is handled directly in `OnHitIce` and `OnHitFire` callbacks via `inst:Remove()`.

