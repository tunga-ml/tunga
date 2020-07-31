from transformers import pipeline, AutoModelForTokenClassification, AutoTokenizer

model = AutoModelForTokenClassification.from_pretrained("savasy/bert-base-turkish-ner-cased")
tokenizer = AutoTokenizer.from_pretrained("savasy/bert-base-turkish-ner-cased")
ner = pipeline('ner', model=model, tokenizer=tokenizer)


def __clean_entity(arr):
    elem_str = ""
    for item in arr:
        if item.startswith("#"):
            elem_str += item.replace("#", "")
        else:
            elem_str += " " + item
    return elem_str


def get_result(text):
    my_dict = {
        "PER": [],
        "ORG": [],
        "LOC": []
    }
    result_dict = {
        "PER": [],
        "ORG": [],
        "LOC": []

    }
    ner_result = ner(text)
    for item in ner_result:
        entity = item["entity"][2:]
        my_dict[entity].append(item)

    groups = []
    temp_group = []
    for i, key in enumerate(my_dict):
        for item in my_dict[key]:
            if item["word"] != "[CLS]":
                if item["entity"][0] == "B":
                    if len(temp_group) > 0:
                        groups.append(temp_group)
                        # print(__clean_entity(temp_group),list(my_dict.keys())[0 if i== 0 else i-1])
                        result_dict[list(my_dict.keys())[0 if i == 0 else i - 1]].append(__clean_entity(temp_group))
                    temp_group = []
                temp_group.append(item["word"])
    result_dict[list(my_dict.keys())[0 if i == 0 else i]].append(__clean_entity(temp_group))
    return result_dict
