"""
NotificationService

Sends immediate & scheduled alerts:
  - notify_user()
  - schedule_follow_up()
  - cancel_notification()
  - bulk_notify()
  - get_notification_status()
"""

from typing import List, Dict, Any


class NotificationService:
    def __init__(self):
        # TODO: configure SMS/email/in-app providers
        pass

    def notify_user(self, role: str, message: str) -> None:
        """Send a real-time notification to the specified role."""
        # TODO
        print(f"Notify {role}: {message}")

    def schedule_follow_up(self, patient_id: str, when: str) -> None:
        """Schedule a future notification (e.g., if not ready to discharge)."""
        # TODO
        print(f"Scheduled follow-up for {patient_id} at {when}")

    def cancel_notification(self, notification_id: str) -> None:
        """Cancel a previously scheduled notification."""
        # TODO
        pass

    def bulk_notify(self, role: str, messages: List[str]) -> None:
        """Send multiple notifications in batch."""
        # TODO
        pass

    def get_notification_status(self, notification_id: str) -> str:
        """Check delivery status of a notification."""
        # TODO
        pass
