require('normalize.css/normalize.css');
require('styles/main.scss');

import React from 'react';

class ImageFigure extends React.Component {
    constructor(props){
      super(props);
      this.handleClick.bind(this);
    };

  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }
    else{
      this.props.center();
    }
    
    e.stopPropagation();
    e.preventDefault();
  };
  render(){
    var styleObj ={};
    if(this.props.arrange.pos){
      styleObj=this.props.arrange.pos;
    }
    if(this.props.arrange.rotate){
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((val)=>{
          styleObj[val] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      })
    }

    var imageFigureClassName ="img-figure";
    imageFigureClassName += this.props.arrange.isInverse? ' is-inverse': '';

    return (
    	<figure className={imageFigureClassName} style={styleObj} onClick = {this.handleClick.bind(this)}>
        <img src={this.props.data.imageUrl}
              alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick = {this.handleClick.bind(this)}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
    	</figure>
    );
  }
}

export default ImageFigure;
