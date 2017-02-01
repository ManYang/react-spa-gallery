require('normalize.css/normalize.css');
require('styles/main.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import ImageFigure from './ImageFigure';
import ControllerUnit from  './ControllerUnit';
import imageData from '../json/imageArr.json';

function getImageInfo(imageArr){
	let arr=[];
	for(var i=0;i<imageArr.length;i++){
		var singleImg = imageArr[i];
		singleImg.imageUrl = require('../images/' + imageArr[i].fileName);
		arr.push(singleImg);
	}
	return arr;
}

function getRange(min,max){
	return Math.floor(Math.random()*(max-min) + min);
}

function rotate30(){
	return Math.random()>0.5? Math.ceil(Math.random()*30): -Math.ceil(Math.random()*30);
}

var imageDatas = getImageInfo(imageData);

class Gallery extends React.Component {
  constructor(props){
	super(props);

	this.state = {
		imgsArrangeArr:[
			// {
			// 	pos:{
			// 		left:0,
			// 		top:0
			// 	},
			// 	rotate:0,
			//  isInverse: false, //false front, turn background
			//  isCenter:false
			// }
		]
	};
	this.Constant={
			centerPos:{
				left:0,
				right:0
			},
			hPosRange:{
				leftSecX:[0,0],
				rightSecX:[0,0],
				y:[0,0]
			},
			vPosRange:{
				x:[0,0],
				topY:[0,0]
			}
	};		
  };

  inverse(index){
	return function(){
		var imgsArrangeArr = this.state.imgsArrangeArr;
		imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
		this.setState({
			imgsArrangeArr:imgsArrangeArr
		})
	}.bind(this);
  };

  center(index){
  	return function(){
  		this.rearrange(index);
  	}.bind(this);
  };
	
  rearrange(centerIndex){
	var imgsArrangeArr = this.state.imgsArrangeArr,
		Constant = this.Constant,
		centerPos = Constant.centerPos,
		hPosRange = Constant.hPosRange,
		vPosRange = Constant.vPosRange,
		hPosRangeLeftSecX = hPosRange.leftSecX,
		hPosRangeRightSecX = hPosRange.rightSecX,
		hPosRangeY = hPosRange.y,
		vPosRangeTopY = vPosRange.topY,
		vPosRangeX = vPosRange.x,

		imgsArrangeTopArr = [],
		topImgNum = Math.floor(Math.random()*2),
		//get one or none
		topImgSpliceIndex =0,
		imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
		//center pic
		imgsArrangeCenterArr[0] ={
			pos:centerPos,
			rotate:0,
			isCenter:true
		} ;

		topImgSpliceIndex = Math.ceil(Math.random(imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		//layout arrange for top block
		imgsArrangeTopArr.forEach((value,index)=>{
			imgsArrangeTopArr[index] = {
				pos:{
					top:getRange(vPosRangeTopY[0], vPosRangeTopY[1]),
					left:getRange(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: rotate30(),
				isCenter:false
			}
		})

		//layout arrange for right and left block
		for(var i=0,j=imgsArrangeArr.length, k=j/2;i<j;i++){
			var hPosRangeLORX = null;
			//first part in left, rest in right
			if(i<k){
				hPosRangeLORX = hPosRangeLeftSecX;
			}
			else{
				hPosRangeLORX = hPosRangeRightSecX;
			}

			imgsArrangeArr[i] = {
				pos:{
					top: getRange(hPosRange.y[0], hPosRange.y[1]),
					left: getRange(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate:rotate30(),
				isCenter:false
			}
		}

		if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		}
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
  };

  componentDidMount(){
	var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
		stageW=stageDOM.scrollWidth,
		stageH=stageDOM.scrollHeight,
		halfStageW=Math.floor(stageW/2),
		halfStageH=Math.floor(stageH/2);

	var imgFigureDOM = 	ReactDOM.findDOMNode(this.refs.imgFigure0),
		imgW = imgFigureDOM.scrollWidth,
		imgH = imgFigureDOM.scrollHeight,
		halfImgW = Math.floor(imgW / 2),
		halfImgH = Math.floor(imgH / 2);

	this.Constant.centerPos ={ 
		left : halfStageW - halfImgW,
		top : halfStageH - halfImgH
	}	

	this.Constant.hPosRange.leftSecX[0] = -halfImgW;
	this.Constant.hPosRange.leftSecX[1] = halfStageW-halfImgW*3;
	this.Constant.hPosRange.rightSecX[0] = halfStageW+halfImgW;
	this.Constant.hPosRange.rightSecX[1] =stageW -halfImgW;
	this.Constant.hPosRange.y[0] = -halfImgH;
	this.Constant.hPosRange.y[1] =stageH -halfImgH;

	this.Constant.vPosRange.topY[0] = -halfImgH;
	this.Constant.vPosRange.topY[1] = halfStageH-halfImgH*3;
	this.Constant.vPosRange.x[0] = halfStageW - imgW;
	this.Constant.vPosRange.x[1] = halfStageW;

	this.rearrange(0);

  };
  render() {
	var controllerUnits=[],
		imageFigures=[];

	imageDatas.forEach((value, index) =>{
		if(!this.state.imgsArrangeArr[index]){
			this.state.imgsArrangeArr[index] = {
				pos:{
					left:0,
					top:0
				},
				rotate: 0,
				isInverse: false,
				isCenter: false
			}
		}
	  imageFigures.push(
		<ImageFigure 
			data = {value} 
			ref={'imgFigure'+index} 
			key = {index} 
			arrange={this.state.imgsArrangeArr[index]}
			inverse ={this.inverse(index).bind(this)}
			center ={this.center(index).bind(this)}
		/>);

	  controllerUnits.push(
	  	<ControllerUnit 
	  		key = {index} 
			arrange ={this.state.imgsArrangeArr[index]}
			inverse ={this.inverse(index).bind(this)}
			center ={this.center(index).bind(this)}			
	  	/>);
	});

	return (
		<section className="stage" ref="stage">
			<section className="img">
				{imageFigures}
			</section>
			<nav className="controller-nav">
				{controllerUnits}
			</nav>
		</section>
	);
  }
};

Gallery.defaultProps = {
};

export default Gallery;
