---
id: platformpostload
title: Platformpostload
description: Applies platform-specific modifications to user commands for the WIN32_RAIL platform, including command localization, vote logic adjustments, and command registration/removal.
tags: [network, ui, platform]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 84f44142
system_scope: network
---

# Platformpostload

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`platformpostload.lua` applies Windows-specific platform tweaks for the `WIN32_RAIL` build of DST. It modifies user command behavior (e.g., vote voting rules for `kick`) and registers or removes specific in-game commands with localized names. This file ensures that platform-specific user interface and moderation workflows are correctly configured without altering core game logic.

## Usage example
This script is automatically loaded during platform initialization and does not require manual usage. However, the modifications it applies become active when players execute registered commands (e.g., `kick`, `ban`) or emotes via the in-game chat UI.

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  
**External references:** Requires `usercommands.lua` and uses `RailUserCommandInject`, `RailUserCommandRemove`, and `UserCommands.GetCommandFromName`.

## Properties
No public properties.

## Main functions
Not applicable (this file is a top-level script, not a component class with methods).

## Events & listeners
Not applicable.
