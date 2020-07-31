from googletrans import Translator


def translate(text, dest):
    translator = Translator()
    return (translator.translate(text, dest=dest))
