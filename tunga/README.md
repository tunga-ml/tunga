# Tunga Kütüphane Kullanımı

## Kurulum
Tunga'nın sahip olduğu tüm özellikler tek bir python kütüphanesinde toplanmış ve PyPI'da kullanıma sunulmuştur. Web uygulaması kullanmadan özelliklere erişmek için bu kütüphaneyi kullanabilirsiniz. Kütüphaneyi aşağıdaki komutu çalıştırarak kurabilrsiniz.
```bash
CFLAGS="-Wno-narrowing" pip3 install tunga
```

## Kullanım

Tunga kütüphanesi kendi içerisinde 4 temel alt modüle sahiptir. Bu modüllerin kullanım detayları aşağıdaki gibidir. Kullanım hakkında daha fazla bilgi için birim testlerini inceleyebilirsiniz.

### Veri Temizleme Modülü

```python
>>> from tunga.preprocessing import normalization

>>> normalization.correct_typo("şen büyüyünce doktoy mı olçan")
'sen büyüyünce doktor mı olacaksın'

>>> normalization.lemmatization("Bizler aslında yolcuyuz bu dünyada")
'biz aslında yolcu bu dünya'

>>> normalization.stem("Gül senin tenin ben de güller içinde kafesteyim")
'Gül sen ten ben de gül iç kafes'

>>> normalization.syllable("Gözümde nursun başımda tacım muhtacım")
'Gö züm de nur sun ba şım da ta cım muh ta cım'

>>> normalization.remove_stopwords("Bu ve bunun gibi projeler desteklenirse Türkiye 5 yıl içerisinde insansız hava araçları kategorisinde dünyada bir numara olur")
'projeler desteklenirse Türkiye 5 yıl içerisinde insansız hava araçları kategorisinde dünyada numara'

>>> normalization.remove_digits("Yıldız Teknik Üniversitesi 100 yıl önce eğitim hayatına başlamıştır.")
'Yıldız Teknik Üniversitesi yıl önce eğitim hayatına başlamıştır.'

>>> normalization.remove_punctuations("Kim bu gözlerindeki yabancı? Yaralar beni yüreğimden. Hani sen olacaktın yalancı!")
'Kim bu gözlerindeki yabancı Yaralar beni yüreğimden Hani sen olacaktın yalancı'

>>> normalization.remove_hashtag("Sevdiklerimle gün batışını izliyorum #kankalarla #haftasonu #myfriends")
'Sevdiklerimle gün batışını izliyorum'

>>> normalization.remove_mentions("Dostumla güzel bir gün @btahtaci")
'Dostumla güzel bir gün'

>>> normalization.remove_html_tags("<html><body>Heştiemel gövdesine koydular beni.</body></html>")
'Heştiemel gövdesine koydular beni.'

>>> normalization.remove_email("Bana mail atmak istersen burak@burak.com adresine yaz")
'Bana mail atmak istersen  adresine yaz'

>>> normalization.remove_url("Tunga diye mükemmel bir doğal dil işleme ürünü var daha önce hiç duymadıysan hemen http://tunga.ml adresine bir göz at")
'Tunga diye mükemmel bir doğal dil işleme ürünü var daha önce hiç duymadıysan hemen  adresine bir göz at'


```

### Makine Öğrenmesi Modülleri

#### Duygu Durum Analizi
```python
from tunga.machine_learning.sentiment_analysis import bert_sentiment

>>> bert_sentiment.get_sentiment("mükemmel bir ürün çok hoşuma gitti")
('positive', 0.9904009699821472)
>>> 

```

#### Konu Modelleme

#### Anahtar Kelime Tespiti

#### Varlık Adı Tanımlama

#### Metin Özetleme
```python
from tunga.machine_learning.summarization.summarizer import summarize
from nltk.tokenize import word_tokenize, sent_tokenize

text = "Olayın intikal şekli ve zamanı, tarafsız tanık K3’nin iş yerinde gördüğü sanığın babacan bir tavırla hareket ettiğine dair ifadesi ortadadır. Diğer tanık beyanları, CD içeriği ile tüm dosya kapsamı nazara alındığında sanığın aynı yerde birlikte çalıştığı mağdurenin vücuduna dokunması şeklindeki eyleminin cinsel amaçla gerçekleştirildiği hususunun şüphede kaldığı ve mevcut haliyle cezalandırılmasına yeter başkaca delil bulunmadığı anlaşıldığından, müsnet suçtan beraatı yerine yazılı şekilde mahkumiyetine karar verilmesi kanuna aykırıdır. Sanık avukatının temyiz itirazları bu itibarla yerinde görüldüğünden, hükmün bozulmasına oy çokluğu ile karar verildi.Ceza yargılamasının esas amacı maddi gerçeğin ortaya çıkarılmasıdır. Bu bakımdan hakim davayı muhakeme kuralları gereğince huzurunda görecek, olayı ilk günkü haline götürecek bu konuda yüz yüzelik ilkeleri gereğince sanık ile mağduru dinleyecek ve gözlemleyecek, elde ettiği delillerle vicdani kanaati ile hüküm kuracaktır. Delil tüm davalarda hükme ulaştıracak kurucu unsurdur. Bu bakımdan en hassas suçlar cinsel istismar ve cinsel saldırı suçlarıdır. Bu suçlarda mağdur ile sanık arasında geçen eylem genellikle yapısı gereği tanık olmadan ve bariz delil bırakılmadan işlenen suçlardır. Bu açıdan Yargıtayca davanın temelini oluşturan delillerden en önemlileri, mağdur beyanı, doktor raporları, psikolojik inceleme evrakları, sanık ve mağdurun bulundukları çevre, aralarındaki yakınlık ve husumet incelemeleri olarak kabul edilmiştir. Öte yandan tanıdık kişiler (akraba, komşu, öğretmen, iş arkadaşı, amir v.b) tarafından gerçekleştirilen cinsel istismar ve saldırı vakalarında mağdurların bu kişilerle olan geçmiş ilişkileri, yakınlık düzeyleri olay öncesi ilişkilenme biçimleri ve daha sonra mağdur ile aynı çevrede kalmaya devam etmeleri sebebiyle ivedi biçimde şikayette bulunmamaları mağdurun aleyhine yorumlanmamalıdır.Çünkü bu kişiler hakkında yasal müracaatta bulunma konusunda tereddüt yaşadıkları ve yabancı failler konusunda gösterdikleri kararlılıkları kimi zaman gösteremedikleri bilinen bir gerçeklik olarak kabul edilmiştir. Sanığın bir kamu kurumu şubesinde müdür, katılanın da aynı şubede memur olarak çalıştıkları, o sebeple sürekli bir araya geldikleri, katılanın iddiasına göre sanığın zaman zaman 'Maşallah, çok güzelsin, fıstık gibisin' şeklinde kendisine laf attığı, olayın olduğu gün iş yeri kapısında karşılaştıkları sırada sanığın katılanın kalçasını ellediği ve katılanın karşı çıkması üzerine sanığın 'Sen benim kızım gibisin' diyerek olayı geçiştirmeye çalıştığı ancak bu olay sonrası katılanın ağlamaya başladığı ve olayı diğer arkadaşlarına anlattığı ortadadır. Son olayın oluş şeklinin dinlenen tanıklara mağdur tarafından hemen aktarıldığı, tanıklar K6, K5 ve K4 tarafından benzer şekilde doğrulandığı gibi o sırada şifre almak için şubede bulunduğu anlaşılan tanık K3'ın da olayı doğruladığı anlaşılmakla katılanın sanığı suçlaması için aralarında başkaca geçmişe dayalı bir husumetin bulunmaması da dikkate alındığında, sanığın olay günü katılana yönelik sarkıntılık suretiyle cinsel saldırı suçunu işlediği sabit olduğundan mahkeme kararının onanması gerektiği düşüncesiyle sayın çoğunluğun görüşüne iştirak edilmemiştir."
>>>  summarize(word_tokenize(text),sent_tokenize(text))
(['Bu bakımdan en hassas suçlar cinsel istismar ve cinsel saldırı suçlarıdır. '
    'Delil tüm davalarda hükme ulaştıracak kurucu unsurdur.'])
>>> 
```
#### Türkçe-İngilizce Çeviri

### Veri Erişim Modülü

```python
from tunga.retrieval import Twitter

API_KEY = "<YOUR_TWITTER_API_KEY>"
API_SECRET = "<YOUR_TWITTER_API_SECRET>"
ACCESS_TOKEN = "<YOUR_TWITTER_ACCESS_TOKEN>"
TOKEN_SECRET = "<YOUR_TWITTER_TOKEN_SECRET>"
USERNAME = ""
HASHTAG = ""

tweets_uname = Twitter.read_tweets_from_user(API_KEY, API_SECRET, ACCESS_TOKEN, TOKEN_SECRET, USERNAME, 200)

tweets_hashtag = Twitter.read_tweets_from_hashtag(API_KEY, API_SECRET, ACCESS_TOKEN, TOKEN_SECRET, HASHTAG, 200)

```