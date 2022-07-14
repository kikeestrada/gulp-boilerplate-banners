
import {gsap} from 'gsap';
export const gsapComponent = () => {

	// SET

	gsap.set('#logo', {
		backgroundColor: 'red',
	});

	// TO

	gsap.to('#logo', {
		duration: 2,
		x: 300,
		backgroundColor: 'green',
		borderRadius: '20%',
		border: '5px solid blue',
		ease: 'linear'
	});

	// OBJECT

	// let object = { value: 100 };
	// gsap.to(object, {
	//     duration: 2,
	//     value: 1000,
	//     onStart: () => { console.log('start', object.value); },
	//     onUpdate: () => { console.log(object.value) },
	//     onComplete: () => { console.log('end', object.value); }
	// });

	// FROM

	// gsap.from('#logo', {
	//     duration: 2,
	//     backgroundColor: 'pink',
	//     opacity: 0
	// });

	// STAGGER

	// let tween = gsap.from('.circle', {
	//     duration: .3,
	//     y: -200, //'random(-500,500)',
	//     scale: 0,
	//     stagger: 0.5,
	//     delay: 2 // it's better to use timeline
	// });

	// CONTROLS

	// document.querySelector('.play').onclick = () => tween.play();
	// document.querySelector('.pause').onclick = () => tween.pause();
	// document.querySelector('.reverse').onclick = () => tween.reverse();
	// document.querySelector('.slow').onclick = () => tween.timeScale(.2);

	// TIMELINE 

	// let tl = gsap.timeline({ repeat: 1, yoyo: true });
	// tl.from('#logo', {
	//     duration: 2,
	//     rotate: 360
	// });

	// LABEL 

	//tl.addLabel('label1', "+=1");

	// tl.from('.circle', {
	//     duration: .2,
	//     scale: 0,
	//     stagger: .5
	// }, '+=1');

	// REPEAT (-1 infinite | yoyo)
	
};
