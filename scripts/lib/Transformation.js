import _ from "underscore";

export default class Transformation {
  constructor(start, end, fn, opts = {}) {
    this._trans = fn;
    this._getFrame = opts.getFrame || function(props){return props["adjustedPctScroll"]};
    this._pre = opts.pre;
    this._post = opts.post;
    this._start = start;
    this._end = end;
  }

  setPre(pre){
    this._pre = pre;
    return this;
  }

  setPost(post){
    this._post = post;
    return this;
  }

  isActive(data) {
    return !this.isBefore(data) && !this.isAfter(data);
  }

  isBefore(data) {
    return this._getFrame(data) < this._start;
  }

  isAfter(data) {
    return this._getFrame(data) >= this._end;
  }

  run(data){
    var frame = this._getFrame(data);

    if(!_.isNumber(frame)) {
      throw "No frame can be determined for transformation";
    }

    let delta = this._end - this._start,
        clampedPct = (frame - this._start) / delta;

    if(this.isBefore(data)){
      return this._pre;
    } else if(this.isAfter(data)){
      return this._post;
    } else if (this.isActive(data)){
      return this._trans(clampedPct);
    }
  }

  abut(next_end, fn, opts = {}) {
    let previousTransformation = this,
        abutTransformation = new Transformation(previousTransformation._start, next_end, fn, opts);

    abutTransformation._getFrame = previousTransformation._getFrame;
    abutTransformation._pre = previousTransformation._pre;

    abutTransformation.run = (data) => {
      var frame = abutTransformation._getFrame(data);

      if(!_.isNumber(frame)) {
        throw "No frame can be determined for transformation.";
      }

      let delta = abutTransformation._end - previousTransformation._end,
          clampedPct = (frame - previousTransformation._end) / delta;

      if(abutTransformation.isBefore(data)){
        return abutTransformation._pre;
      } else if(abutTransformation.isAfter(data)){
        return abutTransformation._post;
      } else if(previousTransformation.isAfter(data)){
        return abutTransformation._trans(clampedPct);
      } else {
        return previousTransformation.run(data);
      }

    }

    return abutTransformation;
  }
}

