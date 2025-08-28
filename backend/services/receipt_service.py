from config import receipts_collection

def save_receipt(receipt_id, pin, amount, url):
    receipts_collection.insert_one({"receipt_id": receipt_id, "pin": pin, "amount": float(amount), "url": url})

def get_receipt(receipt_id):
    return receipts_collection.find_one({"receipt_id": receipt_id})
