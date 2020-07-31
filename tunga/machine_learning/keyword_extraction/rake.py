from multi_rake import Rake

rake = Rake()


def extract_keywords(text, max_keywords=10):
    """
    Extract keywords from given arbitrary text
    :param text: arbitrary string
    :param max_keywords: max number of keywords extracted from text
    :return: keywords as array
    """
    keywords = rake.apply(text)
    return " ; ".join([item[0] for item in keywords[:max_keywords]]).strip()
