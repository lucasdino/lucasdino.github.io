export const mapLocations = {
    "MidwayLHS": {
        parent: false,
        drawMarker: false,
        markerLocation: [21, -140.4],
        center: [21, -140.4],
        parentBlurb: "",
        parentPhoto: "",
    },
    "Headin' Home": {
        parent: true, 
        drawMarker: true,
        zoomLevel: 5,
        markerLocation: [37.75, -122.45],
        center: [37.7, -107],
        parentBlurb: "153 days and 22 flights later...",
        parentPhoto: "",
        locations: [
            { name: "MidwayLHS", mark: false, dashed: true, latLng: [21, -140.4], photo: "", blurb: "" },
            { name: "San Francisco", mark: true, dashed: true, latLng: [37.7636, -122.4779], photo: "", blurb: "After 48 hours of pure travel...one of the better showers in my life.</p><p class='popup-blurb'>Great layover though - I got to see Ian and Mitch and took my first Waymo ride." },
            { name: "Chicago", mark: true, dashed: false, latLng: [41.7890, -87.7414], photo: "", blurb: "The LAST flight - 22 total.</p><p class='popup-blurb'>This was actually a really cool flight. We flew directly over I-80 in Nebraska which I know like the back of my hand - so I got to see the 'ol stompin' grounds from the sky at dusk!" },
            { name: "Delafield", mark: true, dashed: false, latLng: [43.0599, -88.4042], photo: "", blurb: "Around the world in 153 days!!</p><p class='popup-blurb'>Time to rela...just kidding, time to finish grad school applications." }
        ]
    },
    "Family Reunion": {
        parent: true,
        drawMarker: true,
        zoomLevel: 6,
        markerLocation: [43, -88.4],
        center: [41, -95],
        parentBlurb: "Kickin' if off with a family renunion! Left with only a backpack and no return date.",
        parentPhoto: "",
        locations: [
            { name: "Delafield", mark: true, dashed: false, latLng: [43.0599, -88.4042], photo: "/assets/pics/sabbatical/backpack.jpg", blurb: "Pictured is everything I carried with me for the next 5 months.</p><p class='popup-blurb'>Kept it to just the basics but have gear for hiking, the beach, and potential cold weather...so it added up."},
            { name: "St. Louis", mark: true, dashed: false, latLng: [38.6248, -90.1853], photo: "/assets/pics/sabbatical/stlarch.jpg", blurb: "Stayed in St. Louis for one night so I obviously showed the family the best parts (the Arch, WashU, and Sugarfire)."},
            { name: "Innsbrook", mark: true, dashed: false, latLng: [38.7666, -91.0302], photo: "/assets/pics/sabbatical/innsbrookdinos.jpg", blurb: "Congrats to Allie & Liam on the wedding!</p><p class='popup-blurb'>Though the best part was hanging at the lake with my cousins. Dad, Nick and I made sure to take it easy."},
            { name: "Corn", mark: true, dashed: false, latLng: [40.7145, -99.9118], photo: "/assets/pics/sabbatical/nebraskacows.jpg", blurb: "Look you can take a boy out of Nebraska, but you can't take the Nebraska out of a boy."},
            { name: "McCook", mark: true, dashed: true, latLng: [40.2078, -100.5980], photo: "/assets/pics/sabbatical/mccookairport.jpg", blurb: "A literal one-room airport. What better way to kick off a round-the-world trip eh?"},
            { name: "Denver", mark: true, dashed: true, latLng: [39.8564, -104.6784], photo: "", blurb: "Off to Colombia!"},
            { name: "Cartagena", mark: false, dashed: false, latLng: [10.4269, -75.5469], photo: "", blurb: ""}
        ]
    },
    "Colombia": {
        parent: true,
        drawMarker: true,
        zoomLevel: 6,
        markerLocation: [8, -75],
        center: [8, -75],
        parentBlurb: "Tres Aguilas por favor &#x1F60E;",
        parentPhoto: "",
        locations: [
            { name: "McCook", mark: false, dashed: true, latLng: [40.2078, -100.5980], photo: "", blurb: ""},
            { name: "Cartagena", mark: true, dashed: false, latLng: [10.4269, -75.5469], photo: "", blurb: "Look - Colombia is not a country you attempt irresponsibly. Right before we got there, there were several incidents involving tourists... So while we had our fun, we kept things very tame (I got you mom). </p><p class='popup-blurb'>The locals were friendly - really good food (especially seafood / ceviche!) - and a full meal with drinks might cost you $15. A beer? Maybe $1.</p><p class='popup-blurb'>Look, we weren't complaining."},
            { name: "Tierra Bomba", mark: true, dashed: false, latLng: [10.3254, -75.5907], photo: "", blurb: "In pursuit of a beach, we took the sketchiest transit I've ever experienced in my life. Beach secured, lives intact, 7/10 would consider again (I'm sorry mom)."},
            { name: "Cartagena", mark: false, dashed: false, latLng: [10.4269, -75.5469], photo: "", blurb: ""},
            { name: "Rosario Islands", mark: true, dashed: false, latLng: [10.1704, -75.7737], photo: "/assets/pics/sabbatical/phil_and_gude.jpg", blurb: "Took a catamaran out to the Rosario Islands to snorkel. Not a ton of wildlife to report.</p><p class='popup-blurb'>So these islands are fairly remote and minimally developed - when you get near the island, guys in kayaks row out and they essentially have a full bar on the kayak with them. The hustle was impressive!"},
            { name: "Cartagena", mark: false, dashed: true, latLng: [10.4269, -75.5469], photo: "", blurb: ""},
            { name: "Medellin", mark: true, dashed: false, latLng: [6.2087, -75.5704], photo: "/assets/pics/sabbatical/thiswasheinous.jpg", blurb: "I really took advantage of being unemployed didn't I?</p><p class='popup-blurb'>Medellin was my favorite city in Colombia that we went to. On one hand, you have a city on a remarkable upward trajectory with lively culture, some of the best street art I have ever seen, and good night life and restaurants. On the other hand, there is still a significant amount of poverty; this is a popular city for digital nomads but the juxtaposition is something you can't ignore."},
            { name: "Atletico Nacional", mark: true, dashed: false, latLng: [6.2565, -75.5904], photo: "/assets/pics/sabbatical/nacionalstaches.jpg", blurb: ""},
            { name: "Medellin", mark: false, dashed: true, latLng: [6.2087, -75.5704], photo: "", blurb: ""},
            { name: "Bogota", mark: true, dashed: true, latLng: [4.5966, -74.0701], photo: "", blurb: "Quick stopover for one night. Pretty quiet city, lots of abandoned buildings - didn't love it."},
            { name: "Barcelona", mark: false, dashed: false, latLng: [41.4, 2.18], photo: "", blurb: ""},
        ]
    },
    "Barcelona": {
        parent: false,
        drawMarker: true,
        markerLocation: [41.4, 2.18],
        center: [41.4, 2.18],
        parentBlurb: "Oh no! An 8 hour layover in a cool city I've never been to? What a shame.</p><p class='popup-blurb'>Walked all over the city, thrifted a few things for Croatia, and had a beer on the beach. Mustached menace.",
        parentPhoto: "/assets/pics/sabbatical/barcelona.jpg",
    },
    "Croatia": {
        parent: true,
        drawMarker: true,
        zoomLevel: 8,
        markerLocation: [43.7, 15.9],
        center: [43.3, 16.2],
        parentBlurb: "Defected 2023 w/ Lindsay",
        parentPhoto: "",
        locations: [
            { name: "Barcelona", mark: false, dashed: true, latLng: [41.4, 2.18], photo: "", blurb: ""},
            { name: "Dubrovnik", mark: true, dashed: false, latLng: [42.6412, 18.1100], photo: "/assets/pics/sabbatical/dubrovnikcastlecourt.jpg", blurb: "Had 12 hours in Dubrovnik to explore King's Landing.</p><p class='popup-blurb'>This has to be one of the coolest basketball courts I have ever seen."},
            { name: "Ploce", mark: false, dashed: false, latLng: [43.0452, 17.4856], photo: "", blurb: ""},
            { name: "Split", mark: false, dashed: false, latLng: [43.5171, 16.5216], photo: "", blurb: ""},
            { name: "Sibenik", mark: true, dashed: false, latLng: [43.7374, 15.8898], photo: "/assets/pics/sabbatical/lindsaysibenik.jpg", blurb: "Day trip to Sibenik - super cool walking around the old town and castles.</p><p class='popup-blurb'>Lindsay is vegan and has several food allergies, which is like expert difficulty to accomodate in small-town Croatia. I decided to share this diet for the week because 1) cool experience and 2) we'll make sure we both get enough food.</p><p class='popup-blurb'>We found a vegan sushi restaurant (they exist?) in Sibenik - I was at a caloric defecit so this meal really did something special."},
            { name: "Tisno", mark: true, dashed: false, latLng: [43.7990, 15.6415], photo: "/assets/pics/sabbatical/disconinjas.jpg", blurb: "Boom. 7 days of house music at a beach venue in Croatia? Incredible.</p><p class='popup-blurb'>Too many British people though."},
            { name: "Jezera", mark: false, dashed: false, latLng: [43.7850, 15.6414], photo: "", blurb: ""},
            { name: "Kaprije", mark: true, dashed: false, latLng: [43.6884, 15.7090], photo: "/assets/pics/sabbatical/luka.jpg", blurb: "Favorite memory from Croatia.</p><p class='popup-blurb'>We rented an AirBnB from a guy named Marijan. Marijan was the man. He gifted us his home-canned sardines (my one dietary break). So we chatted with him each day and he offered to take us on his boat with his wife (Kate) and son (Luka) - we happily accepted. We spent the afternoon on the boat, played water polo, and went to Kaprije for dinner.</p><p class='popup-blurb'>And look at Luka...made for the sea."},
            { name: "Jezera", mark: false, dashed: false, latLng: [43.7850, 15.6414], photo: "", blurb: ""},
            { name: "Meurter", mark: true, dashed: false, latLng: [43.8222, 15.5918], photo: "/assets/pics/sabbatical/meurter.jpg", blurb: "We walked all the way to Meurter one of the days and it was an insanely cute town. Nothing else to report just a cute town."},
            { name: "Jezera", mark: true, dashed: false, latLng: [43.7850, 15.6414], photo: "/assets/pics/sabbatical/jezerabeaches.jpg", blurb: "We spent a lot of time sketching in and around Tisno this week.</p><p class='popup-blurb'>It was a necessary balance to raving."},
            { name: "Tisno", mark: false, dashed: false, latLng: [43.7990, 15.6415], photo: "", blurb: ""},
            { name: "Sibenik", mark: false, dashed: true, latLng: [43.7374, 15.8898], photo: "", blurb: ""},
            { name: "Stockholm", mark: false, dashed: false, latLng: [59.6492, 17.9356], photo: "", blurb: ""},
        ]
    },
    "Stockholm": {
        parent: false,
        drawMarker: true,
        markerLocation: [59.6492, 17.9356],
        center: [59.6492, 17.9356],
        parentBlurb: "Never passing up an opportunity to rip a cardamom bun.",
        parentPhoto: "",
    },
    "Greece": {
        parent: true,
        drawMarker: true,
        zoomLevel: 7,
        markerLocation: [38, 23.75],
        center: [38.8, 22],
        parentBlurb: "The old country. My favorite leg!",
        parentPhoto: "",
        locations: [
            { name: "Stockholm", mark: false, dashed: true, latLng: [59.6492, 17.9356], photo: "", blurb: ""},
            { name: "Thessaloniki", mark: true, dashed: false, latLng: [40.6381, 22.9399], photo: "", blurb: "Coming off my week of veganism, I kid you not I ate 5 gyros in the span of 48 hours in Thessaloniki.</p><p class='popup-blurb'>So I mainly saw two styles of gyros in Greece - THERE ARE MORE - but I mainly saw two styles. The first we'll call the American: Meat, tomato, onion, mustard, and fries. It's good, but in the same way Five Guys leaves you in a food coma after eating, this does a number on you.</p><p class='popup-blurb'>The second feels much more authentic. Meat, tomato, onion, tzatziki (if you're lucky :) ), and possibly fries. I prefer the non-fries version of this, but MAN these things are what makes me yearn for the old country."},
            { name: "Nea Moudania", mark: false, dashed: false, latLng: [40.2632, 23.2734], photo: "", blurb: ""},
            { name: "Chalkidiki", mark: true, dashed: false, latLng: [40.2270, 23.7652], photo: "/assets/pics/sabbatical/benegesserit.jpg", blurb: "One of the coolest people I met on my trip was Bene.</p><p class='popup-blurb'>I met him at the hostel and we ended up grabbing gyros and chatting until like 2am. He was about to start at a conservatory in Hamburg studying french horn and won a free month of traveling around Europe by train, so he was in a spontaneous mood. I had just rented a car and was going to do a day trip to Chalkidki; he was down to come with.</p><p class='popup-blurb'>So we ended up renting a boat and spent the afternoon overlooking Mt. Athos. I introduced the guy to country music - he actually liked it! Electric."},
            { name: "Athos View", mark: false, dashed: false, latLng: [40.0318, 24.0150], photo: "", blurb: ""},
            { name: "Porto Koufo", mark: false, dashed: false, latLng: [39.9607, 23.9298], photo: "", blurb: ""},
            { name: "Metamorfosi", mark: false, dashed: false, latLng: [40.2276, 23.6332], photo: "", blurb: ""},
            { name: "Nea Moudania", mark: false, dashed: false, latLng: [40.2632, 23.2734], photo: "", blurb: ""},
            { name: "Thessaloniki", mark: false, dashed: false, latLng: [40.6381, 22.9399], photo: "", blurb: ""},
            { name: "Pella", mark: true, dashed: false, latLng: [40.7615, 22.5278], photo: "", blurb: "Pella: The capital of the Kingdom of Macedonia and birthplace of Alexander the Great.</p><p class='popup-blurb'>The most interesting aspect to me was that the Aegean Sea used to come all the way to Pella when the city was built  - which is now ~50km from the shore.</p><p class='popup-blurb'>Also, it was here that I promised myself I will design and build a mosaic floor in my home one day. Mosaics are sick!"},
            { name: "Vergina", mark: false, dashed: false, latLng: [40.4869, 22.3188], photo: "", blurb: ""},
            { name: "Litochoro", mark: true, dashed: false, latLng: [40.0930, 22.5653], photo: "/assets/pics/sabbatical/litochorosquad.jpg", blurb: "I met Danny (Canadian) and Petra (Czech) at the hostel in Litochoro and they were also planning to hike Olympus. So I got to hike with a group for part of it!</p><p class='popup-blurb'>Quick side note: There are these facilities called 'mountain refuges' in Greece in popular hiking areas. These refuges have water, beds, and food (brought up by donkey each day). So for Olympus, you can use these to split the hike into two parts...or just grab a fat plate of spaghetti."},
            { name: "Olympus", mark: true, dashed: false, latLng: [40.0857, 22.3586], photo: "/assets/pics/sabbatical/olympus.jpg", blurb: "OLYMPUS</p><p class='popup-blurb'>I started this hike at ~3k feet and the peak (Mytikas) is 9.5k feet. It's a beast of a hike...when I got to the top, clouds rolled in and you couldn't see anything! Thanks Zeus...really appreciate the warm welcome."},
            { name: "Litochoro", mark: false, dashed: false, latLng: [40.0930, 22.5653], photo: "", blurb: ""},
            { name: "Larissa", mark: false, dashed: false, latLng: [39.6162, 22.4224], photo: "", blurb: ""},
            { name: "Trikala", mark: false, dashed: false, latLng: [39.5357, 21.7728], photo: "", blurb: ""},
            { name: "Meteora", mark: true, dashed: false, latLng: [39.7212, 21.6309], photo: "/assets/pics/sabbatical/meteora.jpg", blurb: "Turns out Danny was planning to go to Meteora as well so I gave him a ride from Litochoro. Insanely cool site - monastaries perched on the rocks.</p><p class='popup-blurb'>This site is one of the most holy sites in Greek Orthodoxy - similar to Mt. Athos (which I got to see earlier that week!)"},
            { name: "Panagia", mark: false, dashed: false, latLng: [39.8031, 21.2867], photo: "", blurb: ""},
            { name: "Ioannina", mark: true, dashed: false, latLng: [39.6690, 20.8576], photo: "", blurb: "Quaint city in the mountains of Greece on a lake. It has an interesting history with a lot of Turkish influence.</p><p class='popup-blurb'>I had an egregious amount of gelato and kataifi during the two days I was here between my big hikes."},
            { name: "Vikos Gorge", mark: true, dashed: false, latLng: [39.9162, 20.7478], photo: "/assets/pics/sabbatical/vikosgorge.jpg", blurb: "One of the most beautiful places I've ever been - hiked to Drakolimni and Beloi Veiwpoint. Did a bit of cliff jumping too.</p><p class='popup-blurb'>This gorge reminded me of Zion National Park...except if Zion was more green with white rock. I would absolutely love to come back here and camp!"},
            { name: "Ioannina", mark: false, dashed: false, latLng: [39.6690, 20.8576], photo: "", blurb: ""},
            { name: "Kozani", mark: false, dashed: false, latLng: [40.2994, 21.7033], photo: "", blurb: ""},
            { name: "Thessaloniki", mark: false, dashed: true, latLng: [40.6381, 22.9399], photo: "", blurb: ""},
            { name: "Corfu", mark: true, dashed: false, latLng: [39.6260, 19.9193], photo: "/assets/pics/sabbatical/corfumoped.jpg", blurb: "Had 5 days to kill so I decided last minute to get a cheap flight to Corfu. I was told the best way to get around the island was to rent a moped - so naturally, I obliged.</p><p class='popup-blurb'>Though I did hit an oil slick and wiped out on the moped and it ran me 200 euros in damages. Ya hate to see it."},
            { name: "Gouvia", mark: false, dashed: false, latLng: [39.6497, 19.8443], photo: "", blurb: ""},
            { name: "Pirgi", mark: false, dashed: false, latLng: [39.7102, 19.8523], photo: "", blurb: ""},
            { name: "Albanian Overlook", mark: false, dashed: false, latLng: [39.7534, 19.9363], photo: "", blurb: ""},
            { name: "Kassiopi", mark: false, dashed: false, latLng: [39.7877, 19.9157], photo: "", blurb: ""},
            { name: "Roda", mark: false, dashed: false, latLng: [39.7862, 19.7898], photo: "", blurb: ""},
            { name: "Canal D'Amour", mark: true, dashed: false, latLng: [39.7945, 19.7008], photo: "/assets/pics/sabbatical/canaldamour.jpg", blurb: "I had a more relaxed time in Corfu. I was itching to start studying and coding again so I spent about half my time doing that and the other half scooting around the island.</p><p class='popup-blurb'>Canal D'Amour is one of the more famous spots in the north part of the island...I found a nice shady outcropping and had one of my favorite sketching sessions :)"},
            { name: "Angelokastro", mark: true, dashed: false, latLng: [39.6786, 19.6886], photo: "/assets/pics/sabbatical/angelokastro.jpg", blurb: "Hell yeah."},
            { name: "Roda", mark: false, dashed: false, latLng: [39.7862, 19.7898], photo: "", blurb: ""},
            { name: "Kassiopi", mark: false, dashed: false, latLng: [39.7877, 19.9157], photo: "", blurb: ""},
            { name: "Albanian Overlook", mark: false, dashed: false, latLng: [39.7534, 19.9363], photo: "", blurb: ""},
            { name: "Pirgi", mark: false, dashed: false, latLng: [39.7102, 19.8523], photo: "", blurb: ""},
            { name: "Gouvia", mark: false, dashed: false, latLng: [39.6497, 19.8443], photo: "", blurb: ""},
            { name: "Corfu", mark: false, dashed: true, latLng: [39.6260, 19.9193], photo: "", blurb: ""},
            { name: "Athens", mark: false, dashed: false, latLng: [37.9719, 23.7244], photo: "", blurb: ""},
            { name: "Corinth", mark: false, dashed: false, latLng: [37.9264, 22.9946], photo: "", blurb: ""},
            { name: "Tripoli", mark: false, dashed: false, latLng: [37.5037, 22.3999], photo: "", blurb: ""},
            { name: "Allagi", mark: false, dashed: false, latLng: [37.2519, 22.0174], photo: "", blurb: ""},
            { name: "Kalamata", mark: true, dashed: false, latLng: [37.0305, 22.1169], photo: "/assets/pics/sabbatical/papou.jpg", blurb: "I love Kalamata. While I was here, my Papou (pictured) and parents visited for a week so I got to spend some time with them. He was born in a village in the mountains near Kalamata - no running water or electricity. He has an incredible story and I'm forever grateful for his sacrifice to immigrate to the US.</p><p class='popup-blurb'>I spent ~1 month here, studying linear algebra and machine learning essentially all day long. When I was mentally drained, I'd go walk to the pier; I also learned how to Zebekiko dance!"},
            { name: "Allagi", mark: false, dashed: false, latLng: [37.2519, 22.0174], photo: "", blurb: ""},
            { name: "Tripoli", mark: false, dashed: false, latLng: [37.5037, 22.3999], photo: "", blurb: ""},
            { name: "Corinth", mark: false, dashed: false, latLng: [37.9264, 22.9946], photo: "", blurb: ""},
            { name: "Gulf of Corinth", mark: false, dashed: false, latLng: [38.1780, 22.2468], photo: "", blurb: ""},
            { name: "Erineos", mark: false, dashed: false, latLng: [38.3257, 21.9515], photo: "", blurb: ""},
            { name: "Rio", mark: false, dashed: false, latLng: [38.3026, 21.7888], photo: "", blurb: ""},
            { name: "Patras", mark: true, dashed: false, latLng: [38.2444, 21.7291], photo: "/assets/pics/sabbatical/giannimariafam.jpg", blurb: "My dad lived in Greece for 3 years when he was in middle school and was really close with this guy Gianni. Well, they reunited after 40 years and I got to be there - Gianni and Maria were amazing to spend the weekend with and my dad and Gianni picked things back up immediately. So I got to see a youthful side of my dad that I don't get to see often - it was quite cute."},
            { name: "Rio", mark: false, dashed: false, latLng: [38.3026, 21.7888], photo: "", blurb: ""},
            { name: "Nafpaktos", mark: false, dashed: false, latLng: [38.3734, 21.7802], photo: "", blurb: ""},
            { name: "Trizonia", mark: false, dashed: false, latLng: [38.3922, 22.0686], photo: "", blurb: ""},
            { name: "Galaxidi", mark: false, dashed: false, latLng: [38.3675, 22.3789], photo: "", blurb: ""},
            { name: "Delphi", mark: true, dashed: false, latLng: [38.4831, 22.4799], photo: "/assets/pics/sabbatical/delphi.jpg", blurb: "Delphi may be my favorite archaeological site I've visited. It is nestled into a valley and the ancient city crawls up the mountainside.</p><p class='popup-blurb'>The views + ruins = τέλειος (perfect)."},
            { name: "Galaxidi", mark: false, dashed: false, latLng: [38.3675, 22.3789], photo: "", blurb: ""},
            { name: "Trizonia", mark: false, dashed: false, latLng: [38.3922, 22.0686], photo: "", blurb: ""},
            { name: "Nafpaktos", mark: false, dashed: false, latLng: [38.3734, 21.7802], photo: "", blurb: ""},
            { name: "Rio", mark: false, dashed: false, latLng: [38.3026, 21.7888], photo: "", blurb: ""},
            { name: "Patras", mark: false, dashed: false, latLng: [38.2444, 21.7291], photo: "", blurb: ""},
            { name: "Rio", mark: false, dashed: false, latLng: [38.3026, 21.7888], photo: "", blurb: ""},
            { name: "Erineos", mark: false, dashed: false, latLng: [38.3257, 21.9515], photo: "", blurb: ""},
            { name: "Gulf of Corinth", mark: false, dashed: false, latLng: [38.1780, 22.2468], photo: "", blurb: ""},
            { name: "Corinth", mark: false, dashed: false, latLng: [37.9264, 22.9946], photo: "", blurb: ""},
            { name: "Tripoli", mark: false, dashed: false, latLng: [37.5037, 22.3999], photo: "", blurb: ""},
            { name: "Allagi", mark: false, dashed: false, latLng: [37.2519, 22.0174], photo: "", blurb: ""},
            { name: "Kalamata", mark: false, dashed: false, latLng: [37.0305, 22.1169], photo: "", blurb: ""},
            { name: "Allagi", mark: false, dashed: false, latLng: [37.2519, 22.0174], photo: "", blurb: ""},
            { name: "Tripoli", mark: false, dashed: false, latLng: [37.5037, 22.3999], photo: "", blurb: ""},
            { name: "Corinth", mark: false, dashed: false, latLng: [37.9264, 22.9946], photo: "", blurb: ""},
            { name: "Athens", mark: true, dashed: true, latLng: [37.9719, 23.7244], photo: "", blurb: "One thing to know about Greeks is they love to protest. And they're like consistent Olympic gold medal contenders in protesting; they know where it hurts.</p><p class='popup-blurb'>Well the day before I was supposed to leave, it came out that the air traffic controllers were planning to strike...the next day. I had to be in Tasmania to start a pet sit and was already cutting it close, so last minute booked a 4-leg trip that left at 11:50pm that night and would get me to Tasmania in time.</p><p class='popup-blurb'>Only redeemable part? My travel insurance covered it. Oh, and I got to experience flying Emirates which is elite."},
            { name: "Jeddah", mark: false, dashed: false, latLng: [21.6636, 39.1725], photo: "", blurb: ""},
        ]
    },
    "Jeddah": {
        parent: false,
        drawMarker: true,
        markerLocation: [21.6636, 39.1725],
        center: [21.6636, 39.1725],
        parentBlurb: "Turns out I skipped customs because the airport employees told me to go straight to my flight. Had security confront me on the plane. Huh, wonder if I'm on a list somewhere now.",
        parentPhoto: "",
    },
    "Dubai": {
        parent: false,
        drawMarker: true,
        markerLocation: [25.2491, 55.3528],
        center: [25.2491, 55.3528],
        parentBlurb: "So dusty I couldn't see the Burj Khalifa. It's cool I guess.",
        parentPhoto: "",
    },
    "Bangkok": {
        parent: false,
        drawMarker: true,
        markerLocation: [13.6937, 100.7507],
        center: [13.6937, 100.7507],
        parentBlurb: "Had just enough time to grab dinner with a coconut water...in a coconut. For like 5 bucks.",
        parentPhoto: "",
    },
    "Australia": {
        parent: true, 
        drawMarker: true,
        zoomLevel: 5,
        markerLocation: [-35, 149],
        center: [-35, 149],
        parentBlurb: "NUUAAAARRR WAY! We actually made it.</p><p class='popup-blurb'>Time to sit some pets.",
        parentPhoto: "",
        locations: [
            { name: "Bangkok", mark: false, dashed: true, latLng: [13.6937, 100.7507], photo: "", blurb: ""},
            { name: "Sydney", mark: true, dashed: true, latLng: [-33.8707, 151.2070], photo: "/assets/pics/sabbatical/kathleensydney.jpg", blurb: "Insane encounter in Sydney. So I was here for a day and a half and did the hike from Coogee to Bondi (highly recommend). On it, I ran into one of my old coworkers from FT Partners. In Australia.</p><p class='popup-blurb'>And they say bankers don't get vacation? Jk she's in HR.</p><p class='popup-blurb'>The Sydney hostel was wild as well. Heard some RIDICULOUS stories from the employees."},
            { name: "Tasmania", mark: true, dashed: true, latLng: [-42.8827, 147.3163], photo: "/assets/pics/sabbatical/dotty.jpg", blurb: "I loved Tasmania. This pet sit was perfect for me to hunker down and study.</p><p class='popup-blurb'>I was here for 37 days and was able to live comfortably frugal ($800 for the entire time including flights + health insurance :)). Dot was a gem; I absolutely miss this dog.</p><p class='popup-blurb'>Hobart is quaint and has really cool architecture (lots of brick, Victorian + Georgian), and Tasmania is also known for the 'cleanest air on Earth'. There were also great hikes right outside the city. Learned to drive on the wrong side of the road and saw tons of paddy melons (mini kangaroos)!"},
            { name: "Brisbane", mark: true, dashed: false, latLng: [-27.4662, 153.0134], photo: "/assets/pics/sabbatical/brisbanehalloween.jpg", blurb: "BRISBANE - I would honestly move here. This was my favorite library to work out of, the city has an incredible river walk and world-class public spaces, it's modern and clean, and they have rock climbing on bluffs in the city.</p><p class='popup-blurb'>Outside of that, the hostel was a great vibe. Pictured are two guys I had a bar-sanctioned twerk off with...look, I'm a competitive guy but I can recognize when I'm outclassed." },
            { name: "Byron Bay", mark: true, dashed: false, latLng: [-28.6401, 153.6268], photo: "/assets/pics/sabbatical/byronbaes.jpg", blurb: "Had a couple days to kill...why not head to Byron Bay and surf?</p><p class='popup-blurb'>Well too bad the waves were trash and it rained for half of the days I was there. Luckily there were some super cool people at the hostel though! S/o James, Amke, Tom, Feiko, and Amelia.</p><p class='popup-blurb'>One of the rainy days I caught a huge urge to cook and made homemade pita and souvlaki for the group. This was one of my favorite hostel moments on the whole trip." },
            { name: "Brisbane", mark: false, dashed: true, latLng: [-27.4662, 153.0134], photo: "", blurb: "" },
            { name: "Melbourne", mark: true, dashed: true, latLng: [-37.8147, 144.9691], photo: "/assets/pics/sabbatical/touchinggrassmelbourne.jpg", blurb: "Spent a day and a half here...GREAT state library to study in and amazing public parks that I read some papers at.</p><p class='popup-blurb'>I made sure to touch some grass to counteract the egregious time I was spending on my laptop." },
            { name: "Canberra", mark: true, dashed: true, latLng: [-35.1594, 149.1183], photo: "/assets/pics/sabbatical/canbears.jpg", blurb: "At this point, I was honestly burnt out.</p><p class='popup-blurb'>I was applying to grad schools and while these dogs look adorable (Taylor on left, Oscar on right), Oscar would tear pillows up and got a nice bite on my arm while I was here.</p><p class='popup-blurb'>Canberra was...nice? It felt like an adult college campus with all the governmental buildings and green spaces. But the WORST part about Canberra were the bush flies. They don't bite but are attracted to sweat, so I'd take the dogs for a walk and you come back covered in 100 flies.</p><p class='popup-blurb'>Also saw loads of kangaroos. I was itching to throw hands with one but they didn't want any of this." },
            { name: "Melbourne", mark: false, dashed: true, latLng: [-37.8147, 144.9691], photo: "", blurb: "" },
            { name: "Singapore", mark: false, dashed: false, latLng: [1.3595, 103.9895], photo: "", blurb: ""},
        ]
    },
    "Singapore": {
        parent: false,
        drawMarker: true,
        markerLocation: [1.3595, 103.9895],
        center: [1.3595, 103.9895],
        parentBlurb: "One of the more interesting naps I've taken (Jewel at 3am).",
        parentPhoto: "",
    },
    "MidwayRHS": {
        parent: false,
        drawMarker: false,
        markerLocation: [21, 140.4],
        center: [21, -140.4],
        parentBlurb: "",
        parentPhoto: "",
    }
}