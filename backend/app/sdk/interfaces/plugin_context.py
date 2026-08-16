from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.core.event_bus import EventBus
    from app.core.plugin_manager import PluginManager


@dataclass(slots=True)
class PluginContext:
    """
    Shared runtime context passed to every VisionTwin plugin.

    The PluginContext provides controlled access to framework
    services without requiring plugins to know about the
    internal implementation of the application.

    New framework services should be added here rather than
    injected individually into plugins.
    """

    event_bus: "EventBus"
    plugin_manager: "PluginManager"
    