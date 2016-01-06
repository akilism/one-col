import { default as React, Component } from "react";
import _ from "lodash";
import { default as requireAll } from "../lib/requireall";
import { default as clamp } from "../lib/clamp";
import { default as Scan } from "./Scan";

import bg from "../../assets/main-bg.jpg";

const galleryImages0 = requireAll(require.context('../../assets/gallery/00/', true, /.*/));
const galleryImages1 = requireAll(require.context('../../assets/gallery/01/', true, /.*/));
const galleryImages2 = requireAll(require.context('../../assets/gallery/02/', true, /.*/));
const galleryImages3 = requireAll(require.context('../../assets/gallery/03/', true, /.*/));
const galleryImages4 = requireAll(require.context('../../assets/gallery/04/', true, /.*/));
const galleryImages5 = requireAll(require.context('../../assets/gallery/05/', true, /.*/));
const galleryImages6 = requireAll(require.context('../../assets/gallery/06/', true, /.*/));

class FreezyGallery extends Component {
  unfreeze() {
    this.props.unfreezer();
  }

  showGallery() {
    this.props.showGallery();
  }

  componentWillReceiveProps(nextProps) {
    if((nextProps.idx >= nextProps.images.length) && !nextProps.triggered) {
      this.unfreeze();
    }
  }

  render() {
    const {freeze, images, triggered, measurements, id, idx} = this.props,
          activeImage = (idx >= images.length) ? images[0] : images[idx],
          freezyImages = [],
          classModifier = (freeze && !triggered) ? "frozen" : "unfrozen";

          //add a click handler to show gallery when you click on inline image.
    return (
      <div ref="gallery" className={`freezy-gallery ${classModifier}-gallery`} data-scroll={true} data-triggered={triggered} data-id={id}>
        <img src={activeImage} className="freezy-gallery-image" onClick={this.showGallery.bind(this)} />
        <div onClick={this.unfreeze.bind(this)} className="freezy-frozen-images">
          <img src={activeImage} className="freezy-frozen-image" />
        </div>
      </div>
    );
  }
}

class PullQuote extends Component {
  render() {
    return (
      <div className="pull-quote"><span className="markered">{this.props.quote}</span></div>
    );
  }
}

export default class ReactRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measurements: {
        viewportTop: 0,
        viewportHeight: 0,
        pctScroll: 0,
        contentHeight: 0,
        scrollTriggerPos: 0
      },
      galleryElements: {}
    }

    this.handleScroll = _.throttle(this._handleScroll, 16);
  }

  componentWillMount() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    this.setState({
      measurements: {
        viewportHeight,
        scrollTriggerPos: viewportHeight * 0.15,
        viewportWidth,
        viewportTop: 0,
        contentHeight: 0,
        pctScroll: 0 } });
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.Root = this;

    const galleryElements = _.reduce(this.refs, (acc, elem, key) => {
      if(elem instanceof FreezyGallery) { acc[key] = { freeze: false, triggered: false, idx: 0 }; }
      return acc;
    }, {});

    const { measurements } = this.calculateMeasurements();
    this.setState({galleryElements, measurements});
  }

  handleFrozenScroll() {
    window.scrollTo(0, this.state.measurements.viewportTop);
    if(this.state.frozenCount % 24 === 0) {
      let {activeElem, galleryElements} = this.state,
          idx = galleryElements[activeElem].idx;
      galleryElements[activeElem].idx = idx + 1;
      this.setState({galleryElements, frozenCount: this.state.frozenCount + 1});
    } else {
      this.setState({frozenCount: this.state.frozenCount + 1});
    }
  }

  handleUnFrozenScroll() {
    const {measurements} = this.calculateMeasurements(),
      pctScroll = measurements.pctScroll,
      scrollBuddies = document.querySelectorAll("[data-scroll=true]"),
      active = _.filter(scrollBuddies, (sb) => {
        const dist = window.pageYOffset - (sb.offsetTop - this.state.measurements.scrollTriggerPos);
        return dist > 0 && dist < 150;
      });
    if(active.length > 0) {
      const key = active[0].attributes["data-id"].value,
            gallery = this.state.galleryElements[key];
      let galleryElements = this.state.galleryElements;
      if(!galleryElements[key].triggered) {
        galleryElements[key].freeze = true;
        galleryElements[key].start = pctScroll;
        this.setState({measurements, freeze: true, galleryElements, activeElem: key, frozenCount: 1});
        return;
      }
    }
    this.setState({measurements, freeze: false});
  }

  _handleScroll(ev) {
    if(this.state.freeze) {
      return this.handleFrozenScroll();
    } else {
      return this.handleUnFrozenScroll();
    }
  }

  calculateMeasurements() {
    const viewportTop = window.pageYOffset;
    const {measurements} = this.state;
    const {viewportHeight} = measurements;
    const contentHeight = (measurements.contentHeight === 0) ? this.refs.article.clientHeight : measurements.contentHeight;
    const pctScroll = clamp(viewportTop / (contentHeight - viewportHeight), 0, 1);
    return { measurements: {
      ...measurements,
      contentHeight,
      viewportTop,
      pctScroll }};
  }

  unfreeze(galleryKey) {
    let galleryElements = this.state.galleryElements;
    galleryElements[galleryKey].freeze = false;
    galleryElements[galleryKey].triggered = true;
    this.setState({freeze: false, galleryElements});
  }

  showGallery(galleryKey) {
    let galleryElements = this.state.galleryElements;
    galleryElements[galleryKey].idx = 0;
    galleryElements[galleryKey].freeze = true;
    galleryElements[galleryKey].triggered = false;
    this.setState({freeze: true, activeElem: galleryKey, frozenCount: 1, galleryElements});
  }

  render() {
    // <FreezyGallery images={gallery1} freeze={this.state.freeze} measurements={this.state.measurements} triggered={false} />
    const gallery0 = this.state.galleryElements["gallery0"] || {freeze: false, triggered: false, idx: 0},
          gallery1 = this.state.galleryElements["gallery1"] || {freeze: false, triggered: false, idx: 0},
          gallery2 = this.state.galleryElements["gallery2"] || {freeze: false, triggered: false, idx: 0},
          gallery3 = this.state.galleryElements["gallery3"] || {freeze: false, triggered: false, idx: 0};

    return (
      <div ref="root" className="react-root" style={{ backgroundImage: `url(${bg})`, width: "100vw" }}>
        <div ref="title" className="title-card">
          <h1 className="headline">Guerrillas in the Mist: Seven Days in Rebel-Held Territory in Colombia</h1>
          <div className="byline">By Juan Camilo Maldonado Tovar</div>
          <div className="byline">Photos by Carlos Villalón</div>
          <div className="date">December 3, 2015</div>
        </div>
        <div ref="article" className="article">
          <p className="article-copy">A comandante had told us someone would pick us up in front of the pool hall, but we arrived two hours late. Now we didn't know if they were still coming. We waited through the afternoon and night and, after crashing in a cheap hotel, through the next morning, too. That's when a woman wearing a black cap and a too-tight blue shirt with a small green parakeet on her shoulder pulled up on her motorcycle in front of the tienda where we'd been told to stay put. She eyed us suspiciously and left without saying a word.</p>
          <p className="article-copy">We watched her—and farmers and shopkeepers and everyone else—for a signal, any signal, that they had come for us. That was the agreement we'd made with the Revolutionary Armed Forces of Colombia, or FARC, the country's oldest communist guerrilla organization. The group has been waging war against the federal government since 1964, in a conflict that has caused at least 218,000 deaths. If we showed up in this tiny village, on the outskirts of a huge swath of FARC-controlled territory called Llanos del Yarí, they had promised to take us deep into the bowels of their jungle hideout.</p>
          <p className="article-copy">The day prior, we'd set out on our journey from Bogotá, the country's capital. The route is one of rolling hills haloed by mist, and snakes and howler monkeys seemingly hide in every tree and valley. The FARC, which has about 8,000 members today, has managed to control the territory for more than three decades. Farther along, the journey toward the FARC's headquarters starts to feel like a trip through Colombia's history. Ramshackle villages tell the story of the abysmal inequality between the country's center and its forgotten periphery. A two-lane highway gradually transforms into a muddy and solitary road. The farther you are from Bogotá, the poorer the infrastructure becomes. Toward the end of the journey, just before you reach FARC territory, guerrilla graffiti vandalizing government buildings begins to appear.</p>
          <p className="article-copy">"Did you get here unarmed?" asked a wide-eyed young National Army soldier. He was manning a Brigada Móvil checkpoint, located on the peak of a mountain in the Andes just before the roads slope down into Caquetá. Here, many National Army checkpoints dot the periphery of FARC's territory— this, after all, is the front line of the civil war. When the soldier saw that we were just carrying tripods and cameras in our truck, he relaxed—somewhat.</p>
          <p className="article-copy">"You should go back," he said. "If you keep going you'll find El Paisa, a guerrilla commander. Have you heard about him? He's a bloodthirsty man, and he's against all of the peace negotiations. Please, you really shouldn't go that way."</p>
          <p className="article-copy">Eventually he let us pass, and two hours later, the night had already fallen upon us as we continued driving. Then the lights of our truck suddenly illuminated a man in the middle of the road, the muzzle of his rifle pointed directly at us.</p>
          <p className="article-copy">"Turn off the lights and get out of the truck!" he screamed. The man was a young guerrilla dressed in civilian clothes. He was flanked by two more armed men.</p>
          <FreezyGallery ref="gallery0" unfreezer={this.unfreeze.bind(this, "gallery0")} showGallery={this.showGallery.bind(this, "gallery0")} idx={gallery0.idx} images={galleryImages0} freeze={gallery0.freeze} measurements={this.state.measurements} triggered={gallery0.triggered} id="gallery0" />
          <p className="article-copy">"Where are you coming from?" one of them shouted. We had apparently passed into FARC territory at some unknown point. "Don't you know that it's forbidden to pass through here after 18,00?"</p>
          <p className="article-copy">We explained that we'd come from Bogotá to make a documentary, although we did not tell them that we had permission from a FARC commander to be there. We weren't sure if this FARC battalion was friendly with the commander who had given us permission to visit.</p>
          <p className="article-copy">"Which way did you come from?" one of the guerrillas asked.<br/>
            "Bogotá, Girardot, Neiva..." our fixer answered.<br/>
            "That's it?"<br/>
            "And through an Army checkpoint up there..."</p>
          <p className="article-copy">Then there was silence. He was testing us. If we hadn't admitted that we had talked with the military, we would have been in trouble.</p>
          <p className="article-copy">"Leave then," he said. "You can't stay here. You will get shot, bombed. Go back and remember that you can't travel through here at night."</p>
          <PullQuote quote="Civilians run community meetings and participate in government, but everyone in the region knows that the guerrillas have the last word." />
          <p className="article-copy">We turned around. After a short drive, we passed through another Army checkpoint in San Vicente del Caguán. In a tent nearby, a small light bulb illuminated the faces of 32 members of the FARC depicted on a wanted poster issued by the government. At the top of the spread was a picture of El Paisa, who has a $5 million bounty on his head. REPORT AND GET THE MONEY, the sign said. WE'LL GET THE PEACE WE ALL WANT.</p>
          <p className="article-copy">We hadn't come to Llanos del Yarí just to meet Colombia's most important guerrilla fighters—we'd also come because, after two years of dialogues in Havana, Cuba, the FARC and the administration of President Juan Manuel Santos were entering the final stage of a historic peace process. On July 20, 2015, FARC leaders had announced a unilateral ceasefire. This had been tried four times since the dialogues started, and each time it failed. In April 2015, in fact, a previous ceasefire had unraveled after four months, when FARC fighters stormed an Army platoon while troops were sleeping, killing 11 soldiers. A month later, government troops retaliated and killed 26 guerrillas. Would this time be different? We wanted to find out.</p>
          <p className="article-copy">We slept that night in a primitive hotel a few blocks away from the Army checkpoint. The next morning, in the daylight, we drove on along a muddy and winding road toward Llanos de Yarí and the FARC.</p>
          <FreezyGallery ref="gallery1" unfreezer={this.unfreeze.bind(this, "gallery1")} showGallery={this.showGallery.bind(this, "gallery1")} idx={gallery1.idx} images={galleryImages1} freeze={gallery1.freeze} measurements={this.state.measurements} triggered={gallery1.triggered} id="gallery1" />
          <p className="article-copy">There we were, still waiting in front of the pool hall. The surrounding village was a shoddy little dump of a dozen huts—a vegetable stand, a school, a beer shop. A FARC commander had promised to pick us up, but still no one had come, except some farmers and the random woman with the bird on her shoulder.</p>
          <p className="article-copy">Finally, after more than 24 hours of standing sentry in front of that pool hall, and just as we were about to give up, a man in civilian clothes got off a motorcycle and called to us. He had a stern grimace on his face and told us to follow him. He guided us through the Yarí plains and then led us to a few solitary houses at the base of the hills. As I scanned a crowd of some FARC militiamen gathered in front of one of the houses, I noticed a familiar face—the woman with the green parakeet. Seeing her made me realize that FARC members had been there, watching over us, the whole time.</p>
          <p className="article-copy">She waved and smiled. Then, quietly, she led us to a big house in a deep valley. In front of the red wooden hacienda were at least 20 men, many wearing fatigues, some holding automatic rifles. They were members of Frente 63's Combatientes del Yarí, the eastern front of the FARC. From a pole on one side of the house flew the group's flag—two rifles crossed in front of Colombia's national colors: yellow, blue, and red. On the other side was a white flag signifying their commitment to the unilateral ceasefire.</p>
          <FreezyGallery ref="gallery2" unfreezer={this.unfreeze.bind(this, "gallery2")} showGallery={this.showGallery.bind(this, "gallery2")} idx={gallery2.idx} images={galleryImages2} freeze={gallery2.freeze} measurements={this.state.measurements} triggered={gallery2.triggered} id="gallery2" />
          <p className="article-copy">A chubby and friendly-looking woman walked in our direction from the property's entrance and greeted us warmly. She wore a green uniform and combat boots. Everything happened so quickly. It wasn't clear at what moment we had stopped being among civilians and joined the guerrillas. We were now, without a doubt, standing in the heart of FARC territory.</p>
          <p className="article-copy">The friendly guerrilla woman got on her motorbike and guided our truck through hidden roads that ran behind the pastures, through forking paths, and little by little, three hours later, she brought us deep into a desolate savanna with no fences or livestock or houses or roads. All around us were jungle corridors and mazy paths that led to the Putumayo River and up into the mountains, virginal and immense. At the end of each of these paths were more guerrillas, waiting to see what would come next: peace or more war.</p>
          <p className="article-copy">The date was July 21—just one day after the FARC began its sixth unilateral ceasefire since the peace talks began in 2012. In Havana, the Castro administration and Norway had served as a mediators between the FARC and the Colombian government. As part of the negotiations, the FARC had made pledges of peace multiple times—but each time, they'd done so without actually agreeing to stop fighting. In past negotiations, during the 1980s and early 2000s, the FARC had exploited truces to strengthen their military positions. This time, the government wasn't willing to let this happen. Thus the rules were clear: While the two sides talked about peace, they continued to fight.</p>
          <p className="article-copy">Because the National Army continued to attack the FARC's campsites while they negotiated, the guerrillas directed us to stay in the home of a peasant family, who were unlikely to be targets of government violence. It was there, in a wooden shack with no energy and no running water—but with a DirecTV satellite—that we spent the next few days.</p>
          <PullQuote quote={`I asked Laura if she thought peace was possible in Colombia. "Yes," she answered without any trace of doubt. "Because the Bible tells me so."`} />
          <p className="article-copy">Following the orders of the FARC, Granny Laura, a wizened peasant woman, welcomed us to her house. She was hunched and fragile, and she walked slowly. When she spoke, her voice broke so much that it seemed as if it were going to completely disappear with her next words. She shared the home with her husband, Cruz, and their son and daughter, daughter-in-law, and three grandchildren. While we spoke, the kids chased one another around the house with homemade, wooden toy rifles.</p>
          <p className="article-copy">The children weren't attending school this year because, their mother explained, the nearest school didn't have any teachers. The family couldn't afford to send the kids to the next-closest school—a public boarding school run by the Catholic Church—so the kids were helping their grandmother with work on the hacienda and, in their spare time, pretending to be guerrilla fighters.</p>
          <p className="article-copy">Laura was ill. She had diabetes and suffered from chronic dizziness and nausea, but she didn't have regular access to a doctor. Traveling to San Vicente de Caguán's hospital would cost her about $100, which is half her monthly earnings. Instead, Laura got her medication from a bus that drove by her home every two weeks. Sometimes she had to let the bus pass by because she didn't have enough money to pay.</p>
          <p className="article-copy">Like most farmers in the region, Laura and her family lived under the FARC's rule and followed their laws. "It's better this way—whoever kills or steals, they have to [answer to the FARC]," another farmer had told me. "Of course we need to pay them a tax. Every sale, every livestock head has its price," he explained. As in the rest of the country, local juntas composed of civilians deal with everyday problems and solutions for the community—housing, public services, making demands of local officials. The taxes had made life more difficult for poor peasants, but the ones I spoke with believed the FARC's laws were as fair as the federal government's. Civilians ran the community meetings, locals told me, giving people an opportunity to participate in government— though everyone in the region knows that the guerrillas have the last word.</p>
          <FreezyGallery ref="gallery3" unfreezer={this.unfreeze.bind(this, "gallery3")} showGallery={this.showGallery.bind(this, "gallery3")} idx={gallery3.idx} images={galleryImages3} freeze={gallery3.freeze} measurements={this.state.measurements} triggered={gallery3.triggered} id="gallery3" />
          <p className="article-copy">Chepe, a large, shy man, was in the company of 30 guerrillas when I met him for an interview. We were at a FARC camp that had been temporarily constructed out of rough-hewn tree trunks and huge green leaves, a few miles away from Granny Laura's house. Even though he spoke quietly, I could detect in his accent that he had grown up in a wealthy family in Bogotá. Chepe had been born in the jungle of Caquetá, but he was raised in Colombia's capital from a young age. He went to the Colegio Claretiano primary school and then Colegio San Viator, an upper-middle-class high school. He was called Jorge Suárez then, sharing a surname with the FARC commander Víctor Julio Suárez Rojas—his father. The elder Suárez died on September 22, 2010, after seven tons of government explosives fell on his guerrilla camp.</p>
          <p className="article-copy">"The comrades wanted me to study in the city and then to come back here to help with the revolution," he told me. "When I was in ninth grade, the government started to apply pressure, and the paramilitaries were looking to make us disappear. So I studied up to ninth grade and then came back here with my dad. I spent eleven years with him.</p>
          <p className="article-copy">"I wonder about my friends from back then," he said. "What would they think if they knew that I'm here? They are probably doctors, politicians, engineers. I didn't have the chance to go to university, but I studied the revolution."</p>
          <p className="article-copy">His father was a famous man—or, rather, an infamous man. Also known as Mono Jojoy and Jorge Briceño, he led the FARC's Eastern Bloc, which kidnapped dozens of people in the 1990s and early 2000s. For more than a decade, kidnapping rich people for ransom was one of the FARC's key sources of income. Many people died in captivity during those years. What would have happened if any of Chepe's schoolmates ended up as secuestrados, kidnapping victims?</p>
          <p className="article-copy">Chepe said he always knew that at school what he was studying was his classmates—"my enemies, the sons of the bourgeoisie." He knew that he needed to fight for the "common good. Their ideals weren't an influence on us," he said. "We were already formed as individuals."</p>
          <p className="article-copy">Across from Chepe, sitting on beach chairs, the guerrilla fighters listened to their comandante. Chepe opened his laptop and started the meeting that all guerrilla units conduct at the beginning of their daily routines. They sang "The Internationale" (a classic revolutionary song that's almost as old as Karl Marx), and then Chepe read "Al Filo de la Navaja," an opinion column written in Havana by comandante Carlos Antonio Lozada. The text commented on the previous six months, a period in which the guerrillas had declared a ceasefire that was broken when a military patrol entered their territory. For Lozada, a member of the FARC delegation in Havana, it was important that the National Army reduce the intensity of its attacks in order to make the ceasefire more than just talk.</p>
        </div>
      </div>
    );
  }
}
