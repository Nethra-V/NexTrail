def detect_zone(lat, lon):

    if lat > 11 and lon > 76:
        return "Warehouse-A"
    elif lat > 10:
        return "City-Hub"
    else:
        return "Transit"