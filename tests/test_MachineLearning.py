import unittest


class TestMachineLearning(unittest.TestCase):
    def test_sentiment(self):
        from tunga.machine_learning.sentiment_analysis import bert_sentiment
        res = bert_sentiment("çok iyi bir yorum yapacağım")
        self.assertIsNotNone(res)

    def test_product_sentiment(self):
        from tunga.machine_learning.sentiment_analysis import product_sentiment
        res = product_sentiment.get_sentiment("harika bir araba")
        print(res)
        self.assertTrue(True)

    def test_keyword_extraction(self):
        from tunga.machine_learning.keyword_extraction import rake
        actual = rake.extract_keywords("yemeğin tadı mükemmeldi ama fiyatlar çok yüksek")
        self.assertIsNotNone(actual)
        expected = "yemeğin tadı mükemmeldi ; fiyatlar ; yüksek"
        self.assertEqual(expected, actual)

    def test_topic_modelling(self):
        from tunga.machine_learning.topic_modelling import topic_modeller
        res = topic_modeller(["test", "topic", "mopic"])
        self.assertIsNotNone(res)

    def test_summarization(self):
        from tunga.machine_learning.summarization.summarizer import summarize
        from nltk.tokenize import word_tokenize, sent_tokenize
        text = "Olayın intikal şekli ve zamanı, tarafsız tanık K3’nin iş yerinde gördüğü sanığın babacan bir tavırla hareket ettiğine dair ifadesi ortadadır. Diğer tanık beyanları, CD içeriği ile tüm dosya kapsamı nazara alındığında sanığın aynı yerde birlikte çalıştığı mağdurenin vücuduna dokunması şeklindeki eyleminin cinsel amaçla gerçekleştirildiği hususunun şüphede kaldığı ve mevcut haliyle cezalandırılmasına yeter başkaca delil bulunmadığı anlaşıldığından, müsnet suçtan beraatı yerine yazılı şekilde mahkumiyetine karar verilmesi kanuna aykırıdır. Sanık avukatının temyiz itirazları bu itibarla yerinde görüldüğünden, hükmün bozulmasına oy çokluğu ile karar verildi.Ceza yargılamasının esas amacı maddi gerçeğin ortaya çıkarılmasıdır. Bu bakımdan hakim davayı muhakeme kuralları gereğince huzurunda görecek, olayı ilk günkü haline götürecek bu konuda yüz yüzelik ilkeleri gereğince sanık ile mağduru dinleyecek ve gözlemleyecek, elde ettiği delillerle vicdani kanaati ile hüküm kuracaktır. Delil tüm davalarda hükme ulaştıracak kurucu unsurdur. Bu bakımdan en hassas suçlar cinsel istismar ve cinsel saldırı suçlarıdır. Bu suçlarda mağdur ile sanık arasında geçen eylem genellikle yapısı gereği tanık olmadan ve bariz delil bırakılmadan işlenen suçlardır. Bu açıdan Yargıtayca davanın temelini oluşturan delillerden en önemlileri, mağdur beyanı, doktor raporları, psikolojik inceleme evrakları, sanık ve mağdurun bulundukları çevre, aralarındaki yakınlık ve husumet incelemeleri olarak kabul edilmiştir. Öte yandan tanıdık kişiler (akraba, komşu, öğretmen, iş arkadaşı, amir v.b) tarafından gerçekleştirilen cinsel istismar ve saldırı vakalarında mağdurların bu kişilerle olan geçmiş ilişkileri, yakınlık düzeyleri olay öncesi ilişkilenme biçimleri ve daha sonra mağdur ile aynı çevrede kalmaya devam etmeleri sebebiyle ivedi biçimde şikayette bulunmamaları mağdurun aleyhine yorumlanmamalıdır.Çünkü bu kişiler hakkında yasal müracaatta bulunma konusunda tereddüt yaşadıkları ve yabancı failler konusunda gösterdikleri kararlılıkları kimi zaman gösteremedikleri bilinen bir gerçeklik olarak kabul edilmiştir. Sanığın bir kamu kurumu şubesinde müdür, katılanın da aynı şubede memur olarak çalıştıkları, o sebeple sürekli bir araya geldikleri, katılanın iddiasına göre sanığın zaman zaman 'Maşallah, çok güzelsin, fıstık gibisin' şeklinde kendisine laf attığı, olayın olduğu gün iş yeri kapısında karşılaştıkları sırada sanığın katılanın kalçasını ellediği ve katılanın karşı çıkması üzerine sanığın 'Sen benim kızım gibisin' diyerek olayı geçiştirmeye çalıştığı ancak bu olay sonrası katılanın ağlamaya başladığı ve olayı diğer arkadaşlarına anlattığı ortadadır. Son olayın oluş şeklinin dinlenen tanıklara mağdur tarafından hemen aktarıldığı, tanıklar K6, K5 ve K4 tarafından benzer şekilde doğrulandığı gibi o sırada şifre almak için şubede bulunduğu anlaşılan tanık K3'ın da olayı doğruladığı anlaşılmakla katılanın sanığı suçlaması için aralarında başkaca geçmişe dayalı bir husumetin bulunmaması da dikkate alındığında, sanığın olay günü katılana yönelik sarkıntılık suretiyle cinsel saldırı suçunu işlediği sabit olduğundan mahkeme kararının onanması gerektiği düşüncesiyle sayın çoğunluğun görüşüne iştirak edilmemiştir."
        actual = summarize(word_tokenize(text), sent_tokenize(text))
        expected = ['Bu bakımdan en hassas suçlar cinsel istismar ve cinsel saldırı suçlarıdır. '
                    'Delil tüm davalarda hükme ulaştıracak kurucu unsurdur.']
        self.assertEqual(actual, expected)


if __name__ == '__main__':
    unittest.main()
