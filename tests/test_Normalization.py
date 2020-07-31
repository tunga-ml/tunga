import unittest

from tunga.preprocessing import normalization


class TestNormalization(unittest.TestCase):
    def test_remove_punctuation(self):
        actual = normalization.remove_punctuations(
            "Ahmet! Pazardan gelirken domates, peynir, biber ve kimyon al. Kalmazsa; patates al.")
        expected = "Ahmet Pazardan gelirken domates peynir biber ve kimyon al Kalmazsa patates al"
        self.assertEqual(actual, expected)

        actual = normalization.remove_punctuations("-Bu anahtar köşkü de açar, dedi.")
        expected = "Bu anahtar köşkü de açar dedi"
        self.assertEqual(actual, expected)

        actual = normalization.remove_punctuations(
            "Doğduğu yere, Erzurum'a gitmişti")
        expected = "Doğduğu yere Erzuruma gitmişti"
        self.assertEqual(actual, expected)

    def test_remove_digits(self):
        actual = normalization.remove_digits("24 yaşında 1.86 boyunda harbiyeden mezun bir komutan vardı sene 2012ydi")
        expected = "yaşında . boyunda harbiyeden mezun bir komutan vardı sene ydi"
        self.assertEqual(actual, expected)

        actual = normalization.remove_digits("2012 yılında 10 Temmuzda saat 13:40 da gördüm")
        expected = "yılında  Temmuzda saat : da gördüm"
        self.assertEqual(actual, expected)

        actual = normalization.remove_digits("42 yaşındaki adam evine gidiyordu.3 küçük çocuğu yanındaydı")
        expected = "yaşındaki adam evine gidiyordu. küçük çocuğu yanındaydı"
        self.assertEqual(actual, expected)

    def test_remove_digits_type_mismatch(self):
        actual = normalization.remove_digits(3872812341234)
        expected = ""
        self.assertEqual(actual, expected)

        actual = normalization.remove_digits("Bu sene onuncu yaş gününü kutladı")
        expected = "Bu sene onuncu yaş gününü kutladı"
        self.assertEqual(actual, expected)

    def test_remove_stopwords(self):
        actual = normalization.remove_stopwords("sen ve ben ayni duvarda asili duran bir civi ve fotograf gibiyiz")
        expected = "ayni duvarda asili duran civi fotograf gibiyiz"
        self.assertEqual(actual, expected)

        actual = normalization.remove_stopwords("Ne kralların tacı, ne kısa günün kazancı")
        expected = "kralların tacı, kısa günün kazancı"
        self.assertEqual(actual, expected)

        actual = normalization.remove_stopwords("Ya bende sevdiğin şeyden dolayı benden nefret ediyorsan")
        expected = "bende sevdiğin nefret ediyorsan"
        self.assertEqual(actual, expected)

    def test_remove_emojis(self):
        actual = normalization.remove_emojis("bugün biraz hastayım 🦠😵😳😱😨😎")
        expected = "bugün biraz hastayım "
        self.assertEqual(actual, expected)

        actual = normalization.remove_emojis("geçen gün bahçeden meyve 🍏🍎🍐🍋🍌🍉🍇🍓🍈🍒🍑 topladım")
        expected = "geçen gün bahçeden meyve  topladım"
        self.assertEqual(actual, expected)

        actual = normalization.remove_emojis("Bu sene yurtdışına 🧳✈️🛄 tatile 👙🏖️⛵ gideceğim ")
        expected = "Bu sene yurtdışına  tatile  gideceğim "
        self.assertEqual(actual, expected)

    def test_remove_email(self):
        actual = normalization.remove_email("beyzanın mail adresi olduğu için beyzacanbay34@gmail")
        expected = "beyzanın mail adresi olduğu için "
        self.assertEqual(actual, expected)

        actual = normalization.remove_email("beyza@gmail.com burak@gmail ayşe@gmail.com")
        expected = "  "
        self.assertEqual(actual, expected)

    def test_remove_url(self):
        actual = normalization.remove_url("beyzanın internet adresi http:beyzacanbay")
        expected = "beyzanın internet adresi "
        self.assertEqual(actual, expected)

    def test_remove_mentions(self):
        actual = normalization.remove_mentions("@beyzacanbay @buraktahtaci birlikte çalışıyor")
        expected = "  birlikte çalışıyor"
        self.assertEqual(actual, expected)

    def test_remove_hashtag(self):
        actual = normalization.remove_hashtag("#beyza çalışıyor #CRYPTTECH")
        expected = " çalışıyor "
        self.assertEqual(actual, expected)

        actual = normalization.remove_hashtag("#parkta #oturuyoruz #köpek #seviyoruz")
        expected = "   "
        self.assertEqual(actual, expected)

        actual = normalization.remove_hashtag("dışarıda #kar ve #yağmur var")
        expected = "dışarıda  ve  var"
        self.assertEqual(actual, expected)

    def test_deasciify(self):
        actual = normalization.deasciify("Cok calisiyor")
        expected = "Çok çalışıyor"
        self.assertEqual(actual, expected)

        actual = normalization.deasciify("Aydinlik yarinlarimizin acik zihinleri")
        expected = "Aydınlık yarınlarımızın açık zihinleri"
        self.assertEqual(actual, expected)

    def test_correct_typo(self):
        actual = normalization.correct_typo("idrae edre ancaka daha güezl oalbilir")
        expected = "idare eder ancak daha güzel olabilir"
        self.assertEqual(actual, expected)

        actual = normalization.correct_typo(
            "yrmi birinçi yüzyilin bu ilkk güünlerinde bilgisayarlar hepimisin yakin ilkisini çekemektedir")
        expected = "yirmi birinci yüzyılın bu ilk günlerinde bilgisayarlar hepimizin yakın ilgisini çekmektedir"
        self.assertEqual(actual, expected)

    def test_stem(self):
        actual = normalization.stem("arkadaşları aralarında konuşuyorlar")
        expected = "arkadaş ara konuşuyor"
        self.assertEqual(actual, expected)

        actual = normalization.stem("sınıftakiler ve okuldakiler")
        expected = "sınıf ve okul"
        self.assertEqual(actual, expected)

        actual = normalization.stem("aşağıdakilerden biri midir")
        expected = "aşağı bir mi"
        self.assertEqual(actual, expected)

    def test_custom_regex_removal(self):
        actual = normalization.custom_regex_removal('\S', "Merhaba bugün hava çok güzel")
        expected = "    "
        self.assertEqual(actual, expected)

        actual = normalization.custom_regex_removal('\D', "20 Temmuz 2020 Pazartesi")
        expected = "202020"
        self.assertEqual(actual, expected)

        actual = normalization.custom_regex_removal('\w', "Hey! Buraya baksana. Sana dedim. ")
        expected = "!  .  . "
        self.assertEqual(actual, expected)

    def test_syllable(self):
        actual = normalization.syllable("merhaba")
        expected = 'mer ha ba'
        self.assertEqual(actual, expected)

        actual = normalization.syllable("Her sabah kahvaltıda yumurta yerim")
        expected = "Her sa bah kah val tı da yu mur ta ye rim"
        self.assertEqual(actual, expected)

    def test_tokenization(self):
        actual = normalization.tokenization("Baharda kırlara gidip kır çiçeklerinden bir demet yaparız.")
        expected = "Baharda:Word kırlara:Word gidip:Word kır:Word çiçeklerinden:Word bir:Word demet:Word yaparız:Word .:Punctuation "
        self.assertEqual(actual, expected)

        actual = normalization.tokenization(
            "Düğünde, doğum günlerinde, ziyaretlerde, törenlerde hediye olarak bir buket çiçek ya da çelenk götürürler")
        expected = "Düğünde:Word ,:Punctuation doğum:Word günlerinde:Word ,:Punctuation ziyaretlerde:Word ,:Punctuation törenlerde:Word hediye:Word olarak:Word bir:Word buket:Word çiçek:Word ya:Word da:Word çelenk:Word götürürler:Word "
        self.assertEqual(actual, expected)

    def test_lemmatization(self):
        actual = normalization.lemmatization("O kavanozun kapağını açamayan dengesiz bir insandı.")
        expected = "o kavanoz kapak aç denge bir insan ."
        self.assertEqual(actual, expected)

    def test_find_lang(self):
        actual = normalization.find_lang("Hoşgeldin")
        expected = "tr"
        self.assertEqual(actual, expected)

        actual = normalization.find_lang("こんにちは")
        expected = "ja"
        self.assertEqual(actual, expected)

        actual = normalization.find_lang("das ist eine tomaten")
        expected = "de"
        self.assertEqual(actual, expected)

        actual = normalization.find_lang("are you cola")
        expected = "en"
        self.assertEqual(actual, expected)


if __name__ == '__main__':
    unittest.main()
