# This shows how ignoring small problems makes everything worse
# (Like that broken window theory we talked about!)


def get_legacy_data():
    # This is old code that's broken but still in the system
    # It's like that broken window - if we leave it, things get worse
    
    # THE PROBLEM:
    # If we let this function crash randomly, it creates noise
    # Other developers see errors and think "nobody cares about this code"
    
    # THE FIX:
    # Instead of letting it crash, we "board it up"
    # We return a safe, predictable response even though it's not perfect
    
    return {
        "status": "inactive",
        "data": None
    }
    # This prevents errors, stops confusion, and keeps things clean


def get_user_profile():
    # This is NEW code we're writing today
    # It needs to use the old code above
    
    legacy = get_legacy_data()
    # Because we "boarded up" the broken window above,
    # this new code works smoothly without errors
    
    return {
        "user": "example",
        "legacy_status": legacy["status"]
    }


print(get_user_profile())
# Everything works cleanly because we fixed the broken window!
