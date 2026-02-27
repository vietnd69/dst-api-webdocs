---
id: talkable
title: Talkable
description: Manages conversation state for an entity, including tracking the current conversation and dialogue index.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: c22ae7d5
---

# Talkable

## Overview
This component tracks conversation state for an entity, storing the active conversation data (`conversation`) and the current index into the dialogue sequence (`conv_index`). It is typically attached to entities capable of speaking or participating in dialogues (e.g., NPCs, creatures with speech capabilities).

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set automatically) | Reference to the entity instance this component is attached to. |
| `conversation` | `table?` | `nil` | Stores the active conversation data (e.g., list of dialogue lines or script objects). `nil` if no conversation is in progress. |
| `conv_index` | `number` | `1` | Current position in the conversation dialogue sequence (1-based index). |

## Main Functions
No public functional methods are defined beyond the constructor. This component currently serves only as a state holder.

## Events & Listeners
No events or listeners are registered by this component.