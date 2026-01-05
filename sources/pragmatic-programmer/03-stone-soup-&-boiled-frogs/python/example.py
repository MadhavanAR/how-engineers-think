# Day 3: Stone Soup and Boiled Frogs
# Small additions slowly increase complexity without breaking functionality.


def calculate_price(base_price, is_sale, is_vip, is_international):
    price = base_price

    # small rule added early
    if is_sale:
        price *= 0.9

    # added later for VIP customers
    if is_vip:
        price *= 0.8

    # added months later for international shipping
    if is_international:
        price += 10

    # nothing is broken,
    # but complexity is quietly growing
    return price


final_price = calculate_price(
    base_price=100,
    is_sale=True,
    is_vip=True,
    is_international=True
)

print(final_price)