const durationFirstMin = 2
const durationFirstMax = 4
const durationSecondMax = 6
const durationThirdMax = 8

const firstOrbits = document.querySelectorAll('.orbit-first')
const secondOrbits = document.querySelectorAll('.orbit-second')
const thirdOrbits = document.querySelectorAll('.orbit-third')

firstOrbits.forEach((orbit) => {
	gsap.to(orbit, {
		rotation: 360, 
		duration: durationFirstMin + Math.random()*(durationFirstMax - durationFirstMin), 
		repeat: -1,
		transformOrigin: '50% 50%',
		ease: 'none'
	})
})

secondOrbits.forEach((orbit) => {
	gsap.to(orbit, {
		rotation: 360, 
		duration: durationFirstMax + Math.random()*(durationSecondMax - durationFirstMax), 
		repeat: -1,
		transformOrigin: '50% 50%',
		ease: 'none'
	})
})

thirdOrbits.forEach((orbit) => {
	gsap.to(orbit, {
		rotation: 360, 
		duration: durationSecondMax + Math.random()*(durationThirdMax - durationSecondMax), 
		repeat: -1,
		transformOrigin: '50% 50%',
		ease: 'none'
	})
})