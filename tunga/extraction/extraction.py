import re
from price_parser import Price
from collections import OrderedDict


def extract_emoji(text):
    """
    Extract emojis from given text.
    :param text: arbitrary string
    :return: Emojis in text
    """
    regrex_pattern = re.compile(pattern="["
                                        u"\U0001F600-\U0001F64F"  # emoticons
                                        u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                                        u"\U0001F680-\U0001F6FF"  # transport & map symbols
                                        u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                                        u"\U00002702-\U000027B0"
                                        u"\U000024C2-\U0001F251"
                                        u"\U0001f926-\U0001f937"
                                        u"\U00010000-\U0010ffff"
                                        u"\u200d"
                                        u"\u2640-\u2642"
                                        u"\u2600-\u2B55"
                                        u"\u23cf"
                                        u"\u23e9"
                                        u"\u231a"
                                        u"\u3030"
                                        u"\ufe0f"

                                        "]+", flags=re.UNICODE)
    text = regrex_pattern.findall(text)

    return ' '.join(OrderedDict.fromkeys(text))


def extract_email(text):
    """
    Extract email addressed in given text.
    :param text: arbitrary string
    :return: Email addresses in text
    """
    text = re.findall(r"[a-z0-9\.\-+_]+@[a-z0-9\.\-+_]+\.[a-z]+", text)
    return ' '.join(OrderedDict.fromkeys(text))


def extract_url(text):
    """
    Extract URLs in given text
    :param text:arbitrary string
    :return: URL's in text
    """
    text = re.findall('https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+', text)
    return ' '.join(OrderedDict.fromkeys(text))


def extract_hashtags(text):
    """
    Extract hashtags in given text
    :param text: arbitrary string
    :return: Hashtags in text
    """
    text = re.findall(r"#(\w+)", text)
    return ' '.join(OrderedDict.fromkeys(text))


def extract_price(text):
    """
    Extract prices in given text
    :param text: arbitrary string
    :return: price and currency in text
    """
    price = Price.fromstring(text)
    if price.currency:
        text = str(price.amount) + str(price.currency)
    else:
        text = str(price.amount)
    return str(text)
