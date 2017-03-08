(function (window) {
	'use strict';

	const buttonParams = {
		cssSels: {
			Main: {
			},
			mods: {
				active: 'dd__item_active'
			}
		}
	};

	// const dropDowns = [
	// 	$('.dd-one'),
	// 	$('.dd-two'),
	// 	$('.dd-three')
	// ];

	// Не важно, сколько их на странице находится
	const dropDowns = $('.js-dd');

	// dropDowns.forEach((val, ind) => {
	$.each(dropDowns, (key, val) => {
		let view = window.ru.mail.cpf.modules.Dropdown(buttonParams, null, $(val));
		view.on('itemClick', (event) => {
			// js madskillz
			let el = document.getElementsByClassName('js-console-el')[0];
			(el || {}).innerText = event.name;
			// $('.js-console-el').html(event.name);
		});
		console.log(view);
	});

})(window);
