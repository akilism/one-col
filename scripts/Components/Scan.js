import { default as React, Component, } from "react";
import _ from "lodash";

var scaler = function(currMin, currMax, otherMin, otherMax) {
  const left = currMax - currMin;
  const right = otherMax - otherMin;

  const scale = right / left;

  const getVal = function(val) {
    // Clamped to 0 --> 1 values.
    // return Math.max(0, Math.min(1, otherMin + (val - currMin) * scale));
    return otherMin + (val - currMin) * scale;
  };

  return getVal;
}

export default class ScanComponent extends Component {
  constructor(props) {
    super(props);
    this.scaler = scaler(this.props.start, this.props.end, 0, 1);
    this.transformations = this.setupTransformations();
    this.hasStoppedUpdating = null;
    this.componentMounted = false;
  }

  setupTransformations(){
    return {};
  }

  isActive() {
    let pct = this.scaler(this.props.measurements.pctScroll);
    return pct > 0 && pct <= 1;
  }

  isScanActive() {
    let pct = this.scaler(this.props.measurements.pctScroll),
        tVals = this.getValues();

    return (this.props.actCard) ? pct > -0.1 && pct <= 1.1 : this.props.shouldUpdate;
  }

  getValues(){
    var output = {},
        adjustedPctScroll = (this.props.measurements) ? this.scaler(this.props.measurements.pctScroll) : -1;

    _(this.transformations).each((t, k) => {
      output[k] = t.run({...this.props, adjustedPctScroll});
    });
    return output;
  }

}

ScanComponent.defaultProps = { start: 0, end: 1, };
