require('normalize.css/normalize.css');
require('styles/main.scss');

import React from 'react';

class ControllerUnit extends React.Component{
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
    	var controllerUnitClassName = "controller-unit";
    	if(this.props.arrange.isCenter){
    		controllerUnitClassName+= " is-center";
    		if(this.props.arrange.isInverse){
    			controllerUnitClassName += " is-inverse";

    		}
    	}

    	return (
    			<span className={controllerUnitClassName} onClick = {this.handleClick.bind(this)}></span>
    		)
    }
}

export default ControllerUnit;
