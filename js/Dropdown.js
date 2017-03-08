(function (window) {
	'use strict';

	const $ = window.jQuery;

	const defaultOptions = {
		cssSels: {
			Main: {
				ddContainer: '.dd',
				list: '.dd__list'
			},
			mods: {
				active: 'dd__item_active',
				disabled: 'dd__item_disabled'
			},
			dropButton: '.dd__button',
			listItem: '.dd__item',
		}
	};

	// Получаем конструктор вьюшки дропдауна
	let Dropdown = window.ru.mail.cpf.Basic.getView({
		_Handlers: {
			dom: {
				'click:dropButton' (event) {
					this.toggleDropdown();
				},
				'click:listItem' (event) {
					const el = event.currentTarget,
						id = el.getAttribute('id'),
						name = el.innerText;

					if (!el.getAttribute('disabled')) {
						console.log('listItem clicked with name "%s"', name);
						this.toggleDropdown();
						this.toggleDropdownElement(el);
						// триггерим событие только если элемент активен
						if (this.getInnerState(id)) {
							this._trigger('itemClick', { name });
						}
					}
				}
			}
		},
		/**
		 * Инициализация вьюшки
		 */
		_Init () {
			// регистрируем новый тип событий
			this._addEventTypes(['itemClick']);

			// переменные для хранения состояний дропдауна и элементов списка
			this.state = false;
			this.innerState = [];

			// пронумеруем элементы списка для возможности идентификации
			// при актуализации состояния
			$.each(this._elems.parent.find(this._opts.cssSels.listItem), (key, val) => {
				val.setAttribute('id', key);
				this.innerState[key] = false;
			});
			this.bindEvents();
		},
		/**
		 * Устанавливает новое состояние активности дропдауна
		 * @param {boolean} newState Новое состояние
		 */
		changeState (newState) {
			this.state = newState;
		},
		/**
		 * Устанавливает новое состояние элементу списка
		 * @param {boolean} newState Новое состояние
		 * @param {string} id Порядковый номер элемента списка
		 */
		changeInnerState (newState, id) {
			this.innerState[id] = newState;
		},
		/**
		 * Возвращает состояние дропдауна
		 * @returns {boolean}
		 */
		getState () {
			return this.state;
		},
		/**
		 * Возвращает состояние элемента списка
		 * @param {string} id Порядковый номер элемента списка
		 * @returns {boolean}
		 */
		getInnerState (id) {
			return this.innerState[id];
		},
		/**
		 * Меняет состояние дропдауна на противоположное,
		 * навешивает/снимает модификатор активности
		 */
		toggleDropdown () {
			this.changeState(!this.getState());
			let $el = this._elems.ddContainer;
			const expandedMod = 'dd_expanded';

			if (this.getState()) {
				$el.addClass(expandedMod);
			} else {
				$el.removeClass(expandedMod);
			}
		},
		/**
		 * Меняет состояние элемента списка на противоположное,
		 * навешивает/снимает модификатор активности
		 * @param {object} el Элемент списка
		 */
		toggleDropdownElement (el) {
			const id = el.getAttribute('id');
			let state = this.getInnerState(id);
			this.changeInnerState(!state, id);

			const activeMod = this._opts.cssSels.mods.active;
			if (this.getInnerState(id)) {
				$(el).addClass(activeMod);
			} else {
				$(el).removeClass(activeMod);
			}
		},
		/**
		 * Возвращает актуальное состояние инстанса дропдауна
		 * @returns {object}
		 */
		getInstanceState () {
			return {
				dropDownOpened: this.state,
				dropDownItemsActive: this.innerState
			}
		},
		/**
		 * Подписка на события
		 */
		bindEvents () {
			// Клик на зону вне списка закрывает дропдаун
			// проверяется принадлежность элемента, на который кликнули
			// к соответствующей вьюшке
			document.addEventListener('click', (event) => {
				let contains = this._elems.parent.get(0).contains(event.target);
				if (!contains) {
					this.changeState(false);
					let $el = this._elems.ddContainer;
					$el.removeClass('dd_expanded');
				}
			}, false);
		}

	}, defaultOptions, null, 'Dropdown');

	// Публикуем ссылку на конструктор
	window.getNameSpace('ru.mail.cpf.modules').Dropdown = Dropdown;

})(window);
