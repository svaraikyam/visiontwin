from __future__ import annotations

from abc import ABC, abstractmethod

from app.sdk.interfaces.plugin_context import PluginContext


class IPlugin(ABC):
    """
    Base interface implemented by every VisionTwin backend plugin.
    """

    @abstractmethod
    def load(self) -> None:
        """Load plugin resources."""

    @abstractmethod
    def initialize(self, context: PluginContext) -> None:
        """Initialize the plugin using the shared runtime context."""

    @abstractmethod
    def start(self) -> None:
        """Start plugin execution."""

    @abstractmethod
    def stop(self) -> None:
        """Stop plugin execution."""

    @abstractmethod
    def shutdown(self) -> None:
        """Release plugin resources."""