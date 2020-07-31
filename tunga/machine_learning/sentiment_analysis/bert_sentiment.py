from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

model = AutoModelForSequenceClassification.from_pretrained("savasy/bert-base-turkish-sentiment-cased")
tokenizer = AutoTokenizer.from_pretrained("savasy/bert-base-turkish-sentiment-cased")
sa = pipeline("sentiment-analysis", tokenizer=tokenizer, model=model)


def get_sentiment(text):
    result = sa(text)[0]
    return result["label"], result["score"]
