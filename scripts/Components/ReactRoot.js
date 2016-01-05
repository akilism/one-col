import { default as React, Component } from "react";
import _ from "lodash";
import { default as requireAll } from "../lib/requireall";
import { default as clamp } from "../lib/clamp";
import { default as Scan } from "./Scan";

import bg from "../../assets/main-bg.jpg";

const gallery0 = requireAll(require.context('../../assets/gallery/00/', true, /.*/));
const gallery1 = requireAll(require.context('../../assets/gallery/01/', true, /.*/));
const gallery2 = requireAll(require.context('../../assets/gallery/02/', true, /.*/));
const gallery3 = requireAll(require.context('../../assets/gallery/03/', true, /.*/));
const gallery4 = requireAll(require.context('../../assets/gallery/04/', true, /.*/));
const gallery5 = requireAll(require.context('../../assets/gallery/05/', true, /.*/));
const gallery6 = requireAll(require.context('../../assets/gallery/06/', true, /.*/));

class FreezyGallery extends Scan {
  render() {
    const {freeze, images, triggered, measurements, id} = this.props,
          activeImage = images[0],
          freezyImages = [],
          classModifier = (freeze && !triggered) ? "frozen" : "unfrozen";

    return (
      <div ref="gallery" className={`freezy-gallery ${classModifier}-gallery`} data-scroll={true} data-triggered={triggered} data-id={id}>
        <img src={activeImage} className="freezy-gallery-image" />
        <div className="freezy-frozen-images">
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
        scrollTriggerPos: viewportHeight * 0.55,
        viewportWidth,
        viewportTop: 0,
        contentHeight: 0,
        pctScroll: 0 } });
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.Root = this;
    const galleryElements = _.reduce(this.refs, (acc, elem, key) => {
      if(elem instanceof FreezyGallery) { acc[key] = { freeze: false, triggered: false }; }
      return acc;
    }, {});
    // console.log(galleryElements);
    const { measurements } = this.calculateMeasurements();
    this.setState({galleryElements, measurements});
  }

  _handleScroll(ev) {
    const {measurements} = this.calculateMeasurements(),
        pctScroll = measurements.pctScroll,
        scrollBuddies = document.querySelectorAll("[data-scroll=true]"),
        active = _.filter(scrollBuddies, (sb) => {
          const dist = window.pageYOffset - (sb.offsetTop - this.state.measurements.scrollTriggerPos);
          return dist > 0 && dist < 150;
        });


    if(active.length > 0) {
      console.log(active[0].attributes["data-id"].value);
      this.setState({measurements, freeze: true});
    } else {
      this.setState({measurements, freeze: false});
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

  render() {
    // <FreezyGallery images={gallery1} freeze={this.state.freeze} measurements={this.state.measurements} triggered={false} />
    return (
      <div ref="root" className="react-root" style={{ backgroundImage: `url(${bg})`, width: "100vw" }}>
        <div ref="title" className="title-card">
          <h1 className="headline">Guerrillas in the Mist: Seven Days in Rebel-Held Territory in Colombia</h1>
          <div className="byline">By Juan Camilo Maldonado Tovar</div>
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
          <FreezyGallery ref="gallery0" images={gallery0} freeze={this.state.freeze} measurements={this.state.measurements} triggered={false} id="gallery0" />
          <p className="article-copy">"Where are you coming from?" one of them shouted. We had apparently passed into FARC territory at some unknown point. "Don't you know that it's forbidden to pass through here after 18,00?"</p>
          <p className="article-copy">We explained that we'd come from Bogotá to make a documentary, although we did not tell them that we had permission from a FARC commander to be there. We weren't sure if this FARC battalion was friendly with the commander who had given us permission to visit.</p>
          <p className="article-copy">"Which way did you come from?" one of the guerrillas asked.</p>
          <p className="article-copy">"Bogotá, Girardot, Neiva..." our fixer answered.</p>
          <p className="article-copy">"That's it?"</p>
          <p className="article-copy">"And through an Army checkpoint up there..."</p>
          <p className="article-copy">Then there was silence. He was testing us. If we hadn't admitted that we had talked with the military, we would have been in trouble.</p>
          <p className="article-copy">"Leave then," he said. "You can't stay here. You will get shot, bombed. Go back and remember that you can't travel through here at night."</p>
          <PullQuote quote="Civilians run community meetings and participate in government, but everyone in the region knows that the guerrillas have the last word." />
          <p className="article-copy">We turned around. After a short drive, we passed through another Army checkpoint in San Vicente del Caguán. In a tent nearby, a small light bulb illuminated the faces of 32 members of the FARC depicted on a wanted poster issued by the government. At the top of the spread was a picture of El Paisa, who has a $5 million bounty on his head. REPORT AND GET THE MONEY, the sign said. WE'LL GET THE PEACE WE ALL WANT.</p>
          <p className="article-copy">We hadn't come to Llanos del Yarí just to meet Colombia's most important guerrilla fighters—we'd also come because, after two years of dialogues in Havana, Cuba, the FARC and the administration of President Juan Manuel Santos were entering the final stage of a historic peace process. On July 20, 2015, FARC leaders had announced a unilateral ceasefire. This had been tried four times since the dialogues started, and each time it failed. In April 2015, in fact, a previous ceasefire had unraveled after four months, when FARC fighters stormed an Army platoon while troops were sleeping, killing 11 soldiers. A month later, government troops retaliated and killed 26 guerrillas. Would this time be different? We wanted to find out.</p>
          <p className="article-copy">We slept that night in a primitive hotel a few blocks away from the Army checkpoint. The next morning, in the daylight, we drove on along a muddy and winding road toward Llanos de Yarí and the FARC.</p>
          <PullQuote quote={`I asked Laura if she thought peace was possible in Colombia. "Yes," she answered without any trace of doubt. "Because the Bible tells me so."`} />
        </div>
      </div>
    );
  }
}
