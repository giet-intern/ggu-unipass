def receipt_schema(receipt_id, pin, amount, url):
    return {
        "receipt_id": receipt_id,
        "pin": pin,
        "amount": float(amount),
        "url": url
    }
