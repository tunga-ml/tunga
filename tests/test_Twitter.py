import unittest

from tunga.retrieval import Twitter


class TestTwitter(unittest.TestCase):
    def test_read_tweets_from_user(self):
        actual = Twitter.read_tweets_from_user("btahtaci", 5)
        expected = [{'tweet_text': '@YasarAcarFenLis Çünkü Mehmet Çobankent var'},
                    {'tweet_text': 'Next, next, next olmadan paket mi kurulur, windoz neler '
                                   'yapıyor böyle https://t.co/bQalVclJ7v'},
                    {'tweet_text': "ARGE'nin duvarlarının dili olsa da konuşsa... @enscngvn "
                                   'https://t.co/AYD0LHonJN'},
                    {'tweet_text': '@mschoening Approving pull request with Tinder-like swipe UI'},
                    {'tweet_text': '@ProfDemirtas Simetrik İnternet seçeneklerini '
                                   'değerlendirebilirsiniz. Upload ve download hızının birbirine '
                                   'neredeyse eşit.'}]
        self.assertEqual(actual, expected)

    def test_read_tweets_from_hashtag(self):
        actual = Twitter.read_tweets_from_hashtag("#karantina", "2020-03-18", 10)
        expected = [{'tweet_text': 'Aile ziyaretleri seyahat kapsamı dışında tutuldu... '
                                   'https://t.co/zUuMi417pC @YouTube aracılığıyla \n'
                                   ',#Karantina… https://t.co/DKpYqMwDgU'},
                    {'tweet_text': "KOCAELİ'DE BİR SOKAK DAHA KARANTİNAYA ALINDI !\n"
                                   '\n'
                                   'https://t.co/idW795ZYPy #kocaeli #körfez #karantina '
                                   '#koronavirüs… https://t.co/gKHyajiDpj'},
                    {'tweet_text': 'Van’da iki mahalle ve bir mezra karantinaya alındı   \n'
                                   '\n'
                                   'https://t.co/FZNIHKBXeD\n'
                                   '\n'
                                   '@tcvanvaliligi @BaskaleG #esenyamaç… https://t.co/KZlmgulOjc'},
                    {'tweet_text': 'Virüs pilav günüyle bulaştı! 15 vaka, 10 evde karantina…\n'
                                   '#Korona #koronavirus #Karantina \n'
                                   'https://t.co/e0n39HqUui'},
                    {'tweet_text': 'Pilav gününde Corona paniği! 15 kişide virüs çıktı '
                                   'https://t.co/pHuvkAKhXk #coronavirüs #koronavirüs #pilav… '
                                   'https://t.co/QUnBMmBb8v'},
                    {'tweet_text': '“Nasıl buldun öyle bırak..” #karantina #tb '
                                   'https://t.co/np4ctU7icP'},
                    {'tweet_text': "Eskişehir'de 10 ev karantinaya alındı  \r"
                                   'https://t.co/fGf5QgASqm \r'
                                   '#eskişehir #coronavirüs #karantina #afgan #pilav… '
                                   'https://t.co/gY2L06h8h0'},
                    {'tweet_text': 'Umarım bu kitabı bir gün herkez okur. #HepimizOnurZorluyuz '
                                   '#Karantina #BeyzaAlkoç @beyzaalkoc https://t.co/DbuVfjEIM1'},
                    {'tweet_text': '\U0001f7e1#KORONAVİRÜS \n'
                                   "İngiltere, 50'den fazla ülkeden gelenlere karantina "
                                   'uygulamasını kaldırıyor\n'
                                   'https://t.co/SJKbSh2RYM… https://t.co/HuqTPPsJmS'},
                    {'tweet_text': '#Karantina evlerine gıda yardımları sürüyor - #UrfaHaber, '
                                   '#ŞanlıurfaHaberleri, Şanlıurfa https://t.co/ZEvKCuRdQW'}]
        self.assertEqual(actual, expected)

    def test_read_tweets_from_mention(self):
        actual = Twitter.read_tweets_from_mention(15)
        expected = [{'tweet_text': '@btahtaci Yanarız'},
                    {'tweet_text': '@btahtaci Selamlar, gündemimizin yoğun olduğu bu günlerde; '
                                   "Türkiye'den ihracat yapan firmaları listeleyeceğimiz bir… "
                                   'https://t.co/g3qthtocLF'},
                    {'tweet_text': '@btahtaci 🤪 https://t.co/xYyVrdzqzK'},
                    {'tweet_text': '@btahtaci 😎👍'},
                    {'tweet_text': '@btahtaci nothing fancy, got a Windows 10 pre-installed '
                                   'gaming laptop.'},
                    {'tweet_text': '@btahtaci Bir ölücü sözü der ki: kaptım 5 tane'},
                    {'tweet_text': '@Th3Gundy @mrdogang @tolgaakkapulu @btahtaci @Burakcarikci '
                                   '@StmCTF Tebrik ederim. Başarılarınızın devamını dilerim.'},
                    {'tweet_text': '@btahtaci @heersli Koptum geldim gurbet ellere\n'
                                   'Sivasımı unutmadım bir gün bile \n'
                                   'Hanları, hamamları, tarihi ile\n'
                                   'Gardaş ben Sivas’ın içindenim'},
                    {'tweet_text': '@tkobalas @tolgaakkapulu @btahtaci @Burakcarikci @StmCTF '
                                   'teşekkürler kral. keşke sende buralarda olaydın :/'},
                    {'tweet_text': '@Th3Gundy @tolgaakkapulu @btahtaci @Burakcarikci @StmCTF '
                                   'Tebrikler beyler gurur duydum'},
                    {'tweet_text': '@btahtaci @Th3Gundy @mserdark Tebrikler bro 👏👏'},
                    {'tweet_text': "Son dakikasına kadar çekişmeli geçen #STMCTF'i 3.lük ile "
                                   'bitirdik.\n'
                                   'Takım arkadaşlarımı @tolgaakkapulu @btahtaci… '
                                   'https://t.co/1vG9s06sbw'},
                    {'tweet_text': "@btahtaci Thanks for calling this out, Burak. 👍 I've "
                                   'forwarded your feedback to our Marketing team for awareness. '
                                   '^MN'}]
        self.assertEqual(actual, expected)


if __name__ == '__main__':
    unittest.main()
