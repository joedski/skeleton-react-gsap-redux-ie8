// Note: This has both the base component and its redux-connected version in the same file.
// Eventually, you may find you need to put these into two separate for composability reasons.
// See this part of the Redux tutorial for more. http://redux.js.org/docs/basics/UsageWithReact.html



//// Example small component which has a single prop.
// Note how there are no references here to dispatch, nor to the actions module.

import React, { PropTypes } from 'react';
import ReactGSAPTransitionGroup from 'react-addons-gsap-transition-group';
import TweenMax from 'gsap';

function tweenEnterFactory({ target, options }) {
	let distance = 15;

	return TweenMax.fromTo( target, 0.3, {
		y: `-=${ distance }`,
		opacity: 0
	}, {
		y: `+=${ distance }`,
		opacity: 1
	});
}

function tweenLeaveFactory({ target, options }) {
	let distance = 15;

	return TweenMax.fromTo( target, 0.3, {
		y: `+=0`,
		opacity: 0
	}, {
		y: `+=${ distance }`,
		opacity: 1
	});
}

const Count = ( props ) => (
	<ReactGSAPTransitionGroup
		component="div" className="current-count" style={{
			position: 'relative',
			overflow: 'hidden',
			height: '30px',
			width: '30px',
		}}
		tweenEnter={ tweenEnterFactory }
		tweenLeave={ tweenLeaveFactory }
		>
		<div key={ `c${props.count}` }
			style={{
				position: 'absolute',
				top: '0',
				left: '0',
				width: '100%',
				height: '100%',
				fontSize: '2em'
			}}
			>{ props.count }</div>
	</ReactGSAPTransitionGroup>
);

// It's good practice to define the prop types your component needs.
// If you misuse one, React can (more) immediately tell you.

Count.propTypes = {
	count: PropTypes.number.isRequired,
};

const CountControls = ( props ) => (
	<div className="count-controls">
		<button onClick={ props.onDecrement }>Decrement</button>
		<button onClick={ props.onIncrement }>Increment</button>
	</div>
);

CountControls.propTypes = {
	onIncrement: PropTypes.func.isRequired,
	onDecrement: PropTypes.func.isRequired,
}

const Counter = ( props ) => (
	<div className="counter">
		<Count count={ props.count }/>
		<CountControls onIncrement={ props.onIncrement } onDecrement={ props.onDecrement }/>
	</div>
);

Counter.propTypes = {
	count: PropTypes.number.isRequired,
	onIncrement: PropTypes.func.isRequired,
	onDecrement: PropTypes.func.isRequired,
};



//// Redux-connected Container Component.
// Note how no nodes are created here at all, this merely wraps a given component for specific use
// at a specific point in the app UI.
// Note also how here we actually have the actions.

import { connect } from 'react-redux';
import * as actions from '../actions';
// import Counter from './counter';

function mapStateToProps( state ) {
	return {
		count: state.count
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		onIncrement: () => dispatch( actions.increment() ),
		onDecrement: () => dispatch( actions.decrement() )
	};
}

const CurrentCount = connect( mapStateToProps, mapDispatchToProps )( Counter );

export default CurrentCount;
