# This file demonstrates how small ignored issues
# slowly degrade code quality (software entropy).


def get_legacy_data():
    # This function represents old, fragile code
    # that is no longer reliable but still exists.

    # BROKEN WINDOW:
    # Leaving this function to fail randomly
    # creates noise and makes the system feel neglected.

    # Pragmatic approach:
    # If we cannot fix it fully today, we "board it up"
    # so it stops causing damage.

    return {
        "status": "inactive",
        "data": None
    }
    # Returning a safe fallback prevents warnings,
    # avoids confusion, and stops the rot from spreading.


def get_user_profile():
    # This is new code being added today.
    # It depends on older parts of the system.

    legacy = get_legacy_data()
    # Because the broken window was handled,
    # new code stays clean and predictable.

    return {
        "user": "example",
        "legacy_status": legacy["status"]
    }


print(get_user_profile())
# Output is stable and logs stay clean.