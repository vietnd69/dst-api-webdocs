---
id: quagmire_book_shadow
title: Quagmire Book Shadow
description: A prefabricated item representing Maxwell's journal used in the Quagmire event, which spawns a shadow version of Maxwell upon interaction.
tags: [quagmire, event, interactible, maxwell]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e6f130fb
system_scope: entity
---

# Quagmire Book Shadow

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_book_shadow` is a prefab that represents Maxwell's journal as part of the Quagmire event. It is an interactive item with an animation state, sound emitter, and network synchronization. When used in-game, it spawns the `quagmire_shadowwaxwell` prefab and a `shadow_despawn` entity. The component itself is minimal — it defines asset references, child prefabs, and performs basic initialization on both the client and server side.

## Usage example
This prefab is not added as a component to arbitrary entities. It is defined as a standalone prefab and instantiated via the game's entity system. A typical usage is when the game spawns it during Quagmire event setup or via level generation. Modders should not instantiate it manually with `AddComponent`; instead, reference it via `Prefabs:quagmire_book_shadow()`.

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `SoundEmitter`, `Network`, `inventory`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
Not applicable — this is a prefab definition, not a component.

## Events & listeners
Not applicable — this prefab does not define event listeners or push events itself. Event handling (e.g., interaction or spawning logic) is implemented elsewhere, such as in the `master_postinit` function called during server-side initialization.