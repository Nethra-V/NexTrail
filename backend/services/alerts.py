from models import Alert

def generate_alerts(device, db):

    if device.tamper:
        db.add(Alert(
            device_id=device.device_id,
            message="Tamper detected"
        ))

    if device.battery < 15:
        db.add(Alert(
            device_id=device.device_id,
            message="Battery low"
        ))

    if device.risk_score > 80:
        db.add(Alert(
            device_id=device.device_id,
            message="High risk"
        ))